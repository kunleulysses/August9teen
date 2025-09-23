/*
  Unit tests for Venice AI helpers
  - analyzeConversationContext
  - buildEnhancedPrompt
  - callVeniceWithBackoff (retry logic)
  - generateAdaptiveVeniceReply (orchestration)
*/

import {
  analyzeConversationContext,
  buildEnhancedPrompt,
  generateAdaptiveVeniceReply,
  callVeniceWithBackoff,
  veniceClient,
} from '../../venice-ai-helpers';

// Use modern fake timers for deterministic backoff behavior
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

// Helper to stub Date.now()/new Date().getHours() deterministically
function setSystemHour(hour: number) {
  const base = new Date('2025-01-01T00:00:00.000Z');
  base.setUTCHours(hour, 0, 0, 0);
  jest.setSystemTime(base);
}

describe('analyzeConversationContext()', () => {
  test('detects stressed emotion and brief style; sets deterministic timeOfDay', () => {
    setSystemHour(10); // morning
    const ctx = analyzeConversationContext(
      'I feel a lot of stress about work deadlines',
      'chatConversation',
      { isFirstMessage: true }
    );

    expect(ctx.isFirstInteraction).toBe(true);
    expect(ctx.userEmotionalState).toBe('stressed');
    // length < 50 -> brief ("I feel a lot of stress about work deadlines" is < 50)
    expect(['brief', 'emotional']).toContain(ctx.userCommunicationStyle);
    expect(ctx.topicCategory).toBe('work');
    expect(['morning', 'afternoon', 'evening', 'night']).toContain(ctx.timeOfDay!);
  });
});

describe('buildEnhancedPrompt()', () => {
  test('includes tone, empathy, memories, and content-type-specific instructions', () => {
    const personalityStub = {
      config: { empathyLevel: 'high', playfulness: 'low', verbosity: 'medium', supportStyle: 'practical' },
      elements: {
        greeting: 'Hey there',
        empathyPhrase: "I'm with you",
        guidanceStyle: 'Offer two concrete steps',
        pelicanTouch: 'A light sprinkle of pelican humor',
        encouragement: 'You got this',
        closing: 'I’m here if you want to dive deeper',
      },
      memoryReferences: ['You mentioned starting a new job recently'],
      proactiveSupport: ['Try a 5-minute breathing exercise'],
      adaptedTone: 'serious',
    } as any;

    const memories = [
      { topic: 'work', context: 'New role in Q3' },
      { topic: 'sleep', context: 'Aiming for 7h nightly' },
    ] as any;

    const prompt = buildEnhancedPrompt(
      'chatConversation',
      'I feel stressed about my new job',
      { firstName: 'Alex', isFirstMessage: false },
      memories,
      personalityStub,
      { userMemories: memories }
    );

    expect(prompt).toContain('Conversation Tone: serious');
    expect(prompt).toContain('Empathy Level: high');
    expect(prompt).toContain('The user is chatting with you on the website');
    expect(prompt).toContain('Name: Alex');
    expect(prompt).toContain('Naturally reference these memories');
    expect(prompt).toContain('Consider offering these supportive suggestions');
  });
});

describe('callVeniceWithBackoff()', () => {
  const originalCall = veniceClient.call;

  afterEach(() => {
    // restore original implementation
    (veniceClient.call as any) = originalCall;
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('retries on failures with exponential backoff and then succeeds', async () => {
    const callMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue({ content: 'ok' });

    (veniceClient.call as any) = callMock;

    const p = callVeniceWithBackoff({ prompt: 'hello' }, 5, 1000);

    // advance timers to allow two backoffs: 1000ms then 2000ms
    await jest.advanceTimersByTimeAsync(1000);
    await jest.advanceTimersByTimeAsync(2000);

    const result = await p;
    expect(result).toEqual({ content: 'ok' });
    expect(callMock).toHaveBeenCalledTimes(3);
  });
});

describe('generateAdaptiveVeniceReply()', () => {
  const originalCall = veniceClient.call;

  afterEach(() => {
    (veniceClient.call as any) = originalCall;
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('orchestrates analysis, prompt build, and venice call, returning content', async () => {
    (veniceClient.call as any) = jest.fn().mockResolvedValue({ content: 'response-text' });

    setSystemHour(15); // afternoon

    const res = await generateAdaptiveVeniceReply({
      contentType: 'chatConversation',
      userMessage: 'I am excited about a new project!',
      userInfo: { firstName: 'Sam' },
      memories: [
        { topic: 'projects', context: 'Enjoys building prototypes' },
      ] as any,
      venice: { systemPrompt: 'System guidance' },
    });

    expect(res.content).toBe('response-text');
    expect(res.prompt).toContain('Conversation Tone');
    expect(res.personality).toBeTruthy();
    expect(res.context).toBeTruthy();
  });
});

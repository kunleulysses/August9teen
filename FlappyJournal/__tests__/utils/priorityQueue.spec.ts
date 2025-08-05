import { createQueue } from '../../server/utils/priorityQueue.cjs';

describe('Priority Queue', () => {
  it('should order items correctly', () => {
    const queue = createQueue((a: { score: number }, b: { score: number }) => a.score < b.score);
    queue.add({ score: 10 });
    queue.add({ score: 5 });
    queue.add({ score: 15 });
    expect(queue.poll().score).toBe(5);
    expect(queue.poll().score).toBe(10);
    expect(queue.poll().score).toBe(15);
  });

  it('should update priority correctly', () => {
    const queue = createQueue((a: { score: number }, b: { score: number }) => a.score < b.score);
    const item = { score: 10 };
    queue.add(item);
    queue.add({ score: 5 });
    queue.add({ score: 15 });
    queue.updatePriority(item, 20);
    expect(queue.poll().score).toBe(5);
    expect(queue.poll().score).toBe(15);
    expect(queue.poll().score).toBe(20);
  });
});
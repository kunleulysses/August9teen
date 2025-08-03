import UnifiedChatAggregator from "../consciousness/core/UnifiedChatAggregator.cjs";

let aggregatorInstance: any = null;
let aggregatorReady: Promise<any> | null = null;
let aggregatorError: any = null;

export async function getAggregator(): Promise<any | null> {
  if (aggregatorInstance) return aggregatorInstance;
  if (aggregatorError) return null;

  if (!aggregatorReady) {
    aggregatorReady = (async () => {
      try {
        const instance = new UnifiedChatAggregator({
          enableParallelProcessing: true,
          enableResponseSynthesis: true,
          responseTimeout: 25000,
        });
        await instance.initialize();
        aggregatorInstance = instance;
        return instance;
      } catch (error) {
        console.error("[chat-aggregator] Failed to initialize UnifiedChatAggregator:", error);
        aggregatorError = error;
        return null;
      }
    })();
  }
  return aggregatorReady;
}
// Ambient module stubs for narrowed type-check

declare module '@shared/schema' {
  // Types commonly imported across server files
  export type User = any;
  export type InsertUser = any;
  export type UpdateUserPreferences = any;
  export type UserPreferences = any;
  export type PaymentDetails = any;
  export type Email = any;
  export type InsertEmail = any;
  export type EmailQueueItem = any;
  export type InsertEmailQueue = any;
  export type ConversationMemory = any;
  export type InsertConversationMemory = any;
  export type JournalEntry = any;
  export type InsertJournalEntry = any;
  export type SmsMessage = any;
  export type InsertSmsMessage = any;
  export type PaymentMethod = any;
  export type InsertPaymentMethod = any;
  export type BillingTransaction = any;
  export type InsertBillingTransaction = any;

  // Drizzle schema/table objects used as values in queries
  export const users: any;
  export const journalEntries: any;
  export const emails: any;
  export const smsMessages: any;
  export const paymentMethods: any;
  export const billingTransactions: any;
  export const conversationMemories: any;
  export const emailQueue: any;

  // Fallback aggregate export
  export const schema: any;
  const _default: any;
  export default _default;
}

declare module 'express-session' {
  // Namespace-style types so code can reference `session.SessionStore`
  namespace session {
    interface SessionStore {}
  }
  export interface SessionStore {}
  // Default export is callable middleware and also carries types like SessionStore
  const session: any & {
    SessionStore: new (...args: any[]) => SessionStore;
  };
  export default session;
  export = session;
}

declare module 'memorystore' {
  const factory: any;
  export default factory;
}

declare module 'connect-pg-simple' {
  const factory: any;
  export default factory;
}

declare module 'drizzle-orm' {
  export const and: any;
  export const or: any;
  export const eq: any;
  export const gte: any;
  export const inArray: any;
  export const sql: any;
}

declare module 'drizzle-orm/node-postgres' {
  export function drizzle(...args: any[]): any;
}

declare module 'mailparser' {
  export function simpleParser(...args: any[]): Promise<any>;
}

declare module 'twilio' {
  // Support `twilio.Twilio` type references
  namespace twilio {
    interface Twilio {}
  }
  // Default export function/object and a nested type used in code as twilio.Twilio
  interface Twilio {}
  const twilio: any & {
    Twilio: Twilio;
  };
  export default twilio;
}

declare module 'stripe' {
  const Stripe: any;
  export default Stripe;
}

// Local heavy modules are excluded from type-check; provide minimal stubs
declare module './venice-ai' {
  export type FlappyContentType = any;
  export function generateFlappyContent(
    contentType?: any,
    context?: any,
    options?: any
  ): Promise<{ content: string } & any>;
}

declare module './memory-service' {
  export const memoryService: {
    processMessage: (...args: any[]) => Promise<any>;
    getRelevantMemories: (...args: any[]) => Promise<any[]>;
    formatMemoriesForPrompt: (...args: any[]) => string;
  };
}

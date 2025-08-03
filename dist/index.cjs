var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  billingTransactions: () => billingTransactions,
  conversationMemories: () => conversationMemories,
  conversations: () => conversations,
  emailQueue: () => emailQueue,
  emails: () => emails,
  insertBillingTransactionSchema: () => insertBillingTransactionSchema,
  insertConversationMemorySchema: () => insertConversationMemorySchema,
  insertConversationSchema: () => insertConversationSchema,
  insertEmailQueueSchema: () => insertEmailQueueSchema,
  insertEmailSchema: () => insertEmailSchema,
  insertJournalEntrySchema: () => insertJournalEntrySchema,
  insertPaymentMethodSchema: () => insertPaymentMethodSchema,
  insertSmsMessageSchema: () => insertSmsMessageSchema,
  insertUserSchema: () => insertUserSchema,
  journalEntries: () => journalEntries,
  paymentMethods: () => paymentMethods,
  smsMessages: () => smsMessages,
  updateUserPreferencesSchema: () => updateUserPreferencesSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var conversations, users, journalEntries, paymentMethods, billingTransactions, emails, smsMessages, conversationMemories, emailQueue, insertUserSchema, insertJournalEntrySchema, insertEmailSchema, insertSmsMessageSchema, insertConversationMemorySchema, insertPaymentMethodSchema, insertBillingTransactionSchema, updateUserPreferencesSchema, insertConversationSchema, insertEmailQueueSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    conversations = pgTable("conversations", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      userMessage: text("user_message").notNull(),
      flappyResponse: text("flappy_response").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      conversationType: text("conversation_type").default("general").notNull(),
      // general, journal, etc.
      savedAsJournal: boolean("saved_as_journal").default(false).notNull(),
      journalEntryId: integer("journal_entry_id"),
      // If saved as a journal entry
      messageTags: json("message_tags").$type(),
      mood: text("mood"),
      // happy, calm, neutral, sad, frustrated
      reflectionPrompt: text("reflection_prompt")
      // Interactive reflection prompt for follow-up questions
    });
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      firstName: text("first_name"),
      lastName: text("last_name"),
      phoneNumber: text("phone_number"),
      smsConsent: boolean("sms_consent").default(false).notNull(),
      isPremium: boolean("is_premium").default(false).notNull(),
      premiumUntil: timestamp("premium_until"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      preferences: json("preferences").$type(),
      paymentDetails: json("payment_details").$type(),
      // Password reset fields
      resetToken: text("reset_token"),
      resetTokenExpires: timestamp("reset_token_expires")
    });
    journalEntries = pgTable("journal_entries", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      title: text("title"),
      content: text("content").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      mood: text("mood"),
      // happy, calm, neutral, sad, frustrated
      tags: json("tags").$type(),
      imageUrl: text("image_url"),
      emailId: text("email_id")
      // To track which email this entry is responding to
    });
    paymentMethods = pgTable("payment_methods", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
      cardBrand: text("card_brand").notNull(),
      // visa, mastercard, etc.
      cardLast4: text("card_last4").notNull(),
      cardExpMonth: integer("card_exp_month").notNull(),
      cardExpYear: integer("card_exp_year").notNull(),
      isDefault: boolean("is_default").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    billingTransactions = pgTable("billing_transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      stripePaymentIntentId: text("stripe_payment_intent_id"),
      stripeInvoiceId: text("stripe_invoice_id"),
      amount: integer("amount").notNull(),
      // in cents
      currency: text("currency").default("usd").notNull(),
      status: text("status").notNull(),
      // succeeded, failed, pending
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    emails = pgTable("emails", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      subject: text("subject").notNull(),
      content: text("content").notNull(),
      sentAt: timestamp("sent_at").defaultNow().notNull(),
      type: text("type").notNull(),
      // daily_inspiration, journal_acknowledgment, weekly_insight, inbound, conversation_reply
      isRead: boolean("is_read").default(false),
      messageId: text("message_id"),
      // Email message ID for tracking
      conversationId: text("conversation_id"),
      // Conversation thread ID
      direction: text("direction"),
      // "inbound" or "outbound"
      isJournalEntry: boolean("is_journal_entry").default(false),
      to: text("to"),
      // Recipient email address
      from: text("from"),
      // Sender email address
      mood: text("mood"),
      // Detected mood from content
      tags: json("tags").$type()
      // Extracted tags
    });
    smsMessages = pgTable("sms_messages", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      phoneNumber: text("phone_number").notNull(),
      // User's phone number
      content: text("content").notNull(),
      sentAt: timestamp("sent_at").defaultNow().notNull(),
      direction: text("direction").notNull(),
      // "inbound" or "outbound"
      twilioSid: text("twilio_sid"),
      // Twilio message SID for tracking
      isJournalEntry: boolean("is_journal_entry").default(false),
      // Is this message a journal entry
      journalEntryId: integer("journal_entry_id"),
      // Reference to created journal entry if applicable
      conversationId: text("conversation_id")
      // Unique identifier for conversation thread
    });
    conversationMemories = pgTable("conversation_memories", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      type: text("type").notNull(),
      // "email", "sms", "journal_topic", "conversation"
      topic: text("topic"),
      // Extracted topic or theme
      sentiment: text("sentiment"),
      // Extracted sentiment
      importance: integer("importance").default(1),
      // 1-5 scale of importance
      lastDiscussed: timestamp("last_discussed").defaultNow().notNull(),
      frequency: integer("frequency").default(1),
      // How many times this has been discussed
      firstMentionedAt: timestamp("first_mentioned_at").defaultNow().notNull(),
      context: text("context").notNull(),
      // Brief context about this topic
      relatedEntryIds: json("related_entry_ids").$type(),
      // IDs of related journal entries
      isResolved: boolean("is_resolved").default(false),
      // Whether this topic has been resolved
      category: text("category"),
      // Category such as work, relationships, health, etc.
      emotionalTone: text("emotional_tone"),
      // More nuanced emotional analysis
      growthOpportunity: text("growth_opportunity")
      // Potential area for personal growth related to this topic
    });
    emailQueue = pgTable("email_queue", {
      id: serial("id").primaryKey(),
      payload: jsonb("payload").notNull(),
      status: text("status").default("pending").notNull(),
      // pending, processing, completed, failed
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      processAttempts: integer("process_attempts").default(0).notNull(),
      errorMessage: text("error_message"),
      processedAt: timestamp("processed_at")
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      preferences: true,
      isPremium: true,
      premiumUntil: true,
      resetToken: true,
      resetTokenExpires: true,
      paymentDetails: true
    }).extend({
      email: z.string().email({ message: "Please enter a valid email address" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters" }),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional().refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
        message: "Please enter a valid phone number in E.164 format (e.g., +14155552671)"
      }),
      smsConsent: z.boolean().optional()
    });
    insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true, updatedAt: true }).extend({
      content: z.string().min(1, { message: "Journal entry cannot be empty" }),
      title: z.string().optional(),
      mood: z.enum(["happy", "calm", "neutral", "sad", "frustrated"]).optional(),
      tags: z.array(z.string()).optional(),
      imageUrl: z.string().optional(),
      emailId: z.string().optional()
    });
    insertEmailSchema = createInsertSchema(emails).omit({ id: true, sentAt: true, isRead: true }).extend({
      subject: z.string().min(1, { message: "Email subject cannot be empty" }),
      content: z.string().min(1, { message: "Email content cannot be empty" }),
      type: z.enum(["daily_inspiration", "journal_acknowledgment", "weekly_insight", "inbound", "conversation_reply"]),
      direction: z.enum(["inbound", "outbound"]).optional(),
      conversationId: z.string().optional(),
      messageId: z.string().optional(),
      isJournalEntry: z.boolean().default(false).optional(),
      to: z.string().optional(),
      from: z.string().optional(),
      mood: z.string().optional(),
      tags: z.array(z.string()).optional()
    });
    insertSmsMessageSchema = createInsertSchema(smsMessages).omit({ id: true, sentAt: true }).extend({
      content: z.string().min(1, { message: "Message content cannot be empty" }),
      direction: z.enum(["inbound", "outbound"]),
      isJournalEntry: z.boolean().default(false).optional(),
      conversationId: z.string().optional()
    });
    insertConversationMemorySchema = createInsertSchema(conversationMemories).omit({ id: true, lastDiscussed: true, firstMentionedAt: true }).extend({
      type: z.enum(["email", "sms", "journal_topic", "conversation"]),
      topic: z.string().min(1, { message: "Topic cannot be empty" }),
      sentiment: z.string().optional(),
      importance: z.number().int().min(1).max(5).default(1),
      frequency: z.number().int().min(1).default(1),
      context: z.string().min(1, { message: "Context cannot be empty" }),
      relatedEntryIds: z.array(z.number()).optional(),
      isResolved: z.boolean().default(false).optional()
    });
    insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true, createdAt: true }).extend({
      cardBrand: z.string().min(1, { message: "Card brand cannot be empty" }),
      cardLast4: z.string().length(4, { message: "Card last 4 digits must be 4 characters" }),
      cardExpMonth: z.number().int().min(1).max(12),
      cardExpYear: z.number().int().min((/* @__PURE__ */ new Date()).getFullYear())
    });
    insertBillingTransactionSchema = createInsertSchema(billingTransactions).omit({ id: true, createdAt: true }).extend({
      amount: z.number().int().positive(),
      status: z.enum(["succeeded", "failed", "pending"])
    });
    updateUserPreferencesSchema = z.object({
      emailFrequency: z.enum(["daily", "weekdays", "weekends", "weekly"]),
      marketingEmails: z.boolean().default(false),
      receiveInsights: z.boolean().default(true),
      bio: z.string().max(160).optional(),
      theme: z.enum(["light", "dark", "system"]).optional(),
      receiveSms: z.boolean().default(false).optional(),
      smsConsent: z.boolean().default(false).optional(),
      emailDeliveryTime: z.string().optional(),
      disableDailyEmails: z.boolean().optional(),
      phoneNumber: z.string().optional().refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
        message: "Please enter a valid phone number in E.164 format (e.g., +14155552671)"
      })
    });
    insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, journalEntryId: true }).extend({
      userMessage: z.string().min(1, { message: "Message cannot be empty" }),
      flappyResponse: z.string().min(1, { message: "Response cannot be empty" }),
      conversationType: z.enum(["general", "journal"]).default("general"),
      savedAsJournal: z.boolean().default(false)
    });
    insertEmailQueueSchema = createInsertSchema(emailQueue).omit({ id: true, createdAt: true, updatedAt: true, processedAt: true, processAttempts: true }).extend({
      payload: z.record(z.any()),
      status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
      errorMessage: z.string().optional()
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/database-storage.ts
import { eq, and, gte, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
var PostgresSessionStore, DatabaseStorage;
var init_database_storage = __esm({
  "server/database-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_db();
    PostgresSessionStore = connectPg(session);
    DatabaseStorage = class {
      sessionStore;
      // Using any type to avoid SessionStore type issues
      constructor() {
        this.sessionStore = new PostgresSessionStore({
          pool,
          createTableIfMissing: true
        });
      }
      async getAllUsers() {
        try {
          const allUsers = await db.select().from(users);
          return allUsers;
        } catch (error) {
          console.error("Error getting all users:", error);
          return [];
        }
      }
      async getUser(id) {
        try {
          const [user] = await db.select().from(users).where(eq(users.id, id));
          return user;
        } catch (error) {
          console.error("Error getting user by id:", error);
          return void 0;
        }
      }
      async getUserByUsername(username) {
        try {
          const [user] = await db.select().from(users).where(eq(users.username, username));
          return user;
        } catch (error) {
          console.error("Error getting user by username:", error);
          return void 0;
        }
      }
      async getUserByEmail(email) {
        try {
          const [user] = await db.select().from(users).where(eq(users.email, email));
          return user;
        } catch (error) {
          console.error("Error getting user by email:", error);
          return void 0;
        }
      }
      async getUserByPhoneNumber(phoneNumber) {
        try {
          const result = await pool.query(`
        SELECT * FROM users 
        WHERE preferences->>'phoneNumber' = $1 
        LIMIT 1
      `, [phoneNumber]);
          return result.rows[0];
        } catch (error) {
          console.error("Error getting user by phone number:", error);
          return void 0;
        }
      }
      async createUser(insertUser) {
        const defaultPreferences = {
          emailFrequency: "daily",
          marketingEmails: false,
          receiveInsights: true,
          theme: "system"
        };
        try {
          const result = await pool.query(`
        INSERT INTO users (username, email, password, preferences, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `, [
            insertUser.username,
            insertUser.email,
            insertUser.password,
            JSON.stringify(defaultPreferences)
          ]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to create user");
          }
        } catch (error) {
          console.error("Error creating user:", error);
          throw error;
        }
      }
      async updateUserProfile(userId, profileData) {
        try {
          const user = await this.getUser(userId);
          if (!user) {
            throw new Error(`User with ID ${userId} not found`);
          }
          const currentPreferences = user.preferences || {};
          const preferencesUpdate = {
            firstName: profileData.firstName !== void 0 ? profileData.firstName : currentPreferences.firstName,
            lastName: profileData.lastName !== void 0 ? profileData.lastName : currentPreferences.lastName,
            bio: profileData.bio !== void 0 ? profileData.bio : currentPreferences.bio,
            // Keep existing preferences
            emailFrequency: currentPreferences.emailFrequency || "daily",
            marketingEmails: currentPreferences.marketingEmails !== void 0 ? currentPreferences.marketingEmails : false,
            receiveInsights: currentPreferences.receiveInsights !== void 0 ? currentPreferences.receiveInsights : true,
            theme: currentPreferences.theme || "light",
            receiveSms: currentPreferences.receiveSms !== void 0 ? currentPreferences.receiveSms : false,
            phoneNumber: currentPreferences.phoneNumber,
            emailDeliveryTime: currentPreferences.emailDeliveryTime || "11:00",
            disableDailyEmails: currentPreferences.disableDailyEmails !== void 0 ? currentPreferences.disableDailyEmails : false
          };
          const result = await pool.query(
            `UPDATE users 
         SET username = $1, 
             email = $2, 
             preferences = $3, 
             updated_at = NOW() 
         WHERE id = $4 
         RETURNING *`,
            [
              profileData.username,
              profileData.email,
              JSON.stringify(preferencesUpdate),
              userId
            ]
          );
          if (result.rows && result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error(`Failed to update user with ID ${userId}`);
          }
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
      }
      async updateUserPreferences(userId, preferences) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const updatedPreferences = {
            ...user.preferences,
            ...preferences
          };
          const result = await pool.query(`
        UPDATE users
        SET 
          preferences = $1, 
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [updatedPreferences, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user preferences");
          }
        } catch (error) {
          console.error("Error updating user preferences:", error);
          throw error;
        }
      }
      async updateUserSubscription(userId, isPremium, premiumUntil) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const premiumUntilStr = premiumUntil ? premiumUntil.toISOString() : null;
          const result = await pool.query(`
        UPDATE users
        SET 
          is_premium = $1, 
          premium_until = $2, 
          updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [isPremium, premiumUntilStr, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user subscription");
          }
        } catch (error) {
          console.error("Error updating user subscription:", error);
          throw error;
        }
      }
      async updateUserPhoneNumber(userId, phoneNumber) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const currentPreferences = user.preferences || {};
          const updatedPreferences = {
            ...currentPreferences,
            phoneNumber
          };
          const result = await pool.query(`
        UPDATE users
        SET 
          preferences = $1, 
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [updatedPreferences, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user phone number");
          }
        } catch (error) {
          console.error("Error updating user phone number:", error);
          throw error;
        }
      }
      async updateUserStripeCustomerId(userId, stripeCustomerId) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const result = await pool.query(`
        UPDATE users
        SET 
          stripe_customer_id = $1, 
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [stripeCustomerId, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user Stripe customer ID");
          }
        } catch (error) {
          console.error("Error updating user Stripe customer ID:", error);
          throw error;
        }
      }
      async updateUserStripeSubscriptionId(userId, stripeSubscriptionId) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const result = await pool.query(`
        UPDATE users
        SET 
          stripe_subscription_id = $1, 
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [stripeSubscriptionId, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user Stripe subscription ID");
          }
        } catch (error) {
          console.error("Error updating user Stripe subscription ID:", error);
          throw error;
        }
      }
      async updateUserPaymentDetails(userId, paymentDetails) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        try {
          const result = await pool.query(`
        UPDATE users
        SET 
          payment_details = $1, 
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [paymentDetails, userId]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            throw new Error("Failed to update user payment details");
          }
        } catch (error) {
          console.error("Error updating user payment details:", error);
          throw error;
        }
      }
      // Payment Methods
      async getPaymentMethods(userId) {
        try {
          const methods = await db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
          return methods;
        } catch (error) {
          console.error("Error fetching payment methods:", error);
          throw error;
        }
      }
      async getPaymentMethod(id) {
        try {
          const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
          return method;
        } catch (error) {
          console.error("Error fetching payment method:", error);
          throw error;
        }
      }
      async createPaymentMethod(method) {
        try {
          const [paymentMethod] = await db.insert(paymentMethods).values(method).returning();
          return paymentMethod;
        } catch (error) {
          console.error("Error creating payment method:", error);
          throw error;
        }
      }
      async updatePaymentMethodDefault(id, isDefault) {
        try {
          const method = await this.getPaymentMethod(id);
          if (!method) {
            return void 0;
          }
          if (isDefault) {
            await db.update(paymentMethods).set({ isDefault: false }).where(and(
              eq(paymentMethods.userId, method.userId),
              eq(paymentMethods.isDefault, true)
            ));
          }
          const [updatedMethod] = await db.update(paymentMethods).set({ isDefault }).where(eq(paymentMethods.id, id)).returning();
          return updatedMethod;
        } catch (error) {
          console.error("Error updating payment method default status:", error);
          throw error;
        }
      }
      async deletePaymentMethod(id) {
        try {
          const result = await db.delete(paymentMethods).where(eq(paymentMethods.id, id)).returning({ id: paymentMethods.id });
          return result.length > 0;
        } catch (error) {
          console.error("Error deleting payment method:", error);
          throw error;
        }
      }
      // Billing Transactions
      async getBillingTransactions(userId) {
        try {
          const transactions = await db.select().from(billingTransactions).where(eq(billingTransactions.userId, userId)).orderBy(billingTransactions.createdAt);
          return transactions.reverse();
        } catch (error) {
          console.error("Error fetching billing transactions:", error);
          throw error;
        }
      }
      async getBillingTransaction(id) {
        try {
          const [transaction] = await db.select().from(billingTransactions).where(eq(billingTransactions.id, id));
          return transaction;
        } catch (error) {
          console.error("Error fetching billing transaction:", error);
          throw error;
        }
      }
      async createBillingTransaction(transaction) {
        try {
          const [newTransaction] = await db.insert(billingTransactions).values(transaction).returning();
          return newTransaction;
        } catch (error) {
          console.error("Error creating billing transaction:", error);
          throw error;
        }
      }
      async getJournalEntries(userId, filter) {
        let conditions = [eq(journalEntries.userId, userId)];
        if (filter) {
          if (filter.dateRange && filter.dateRange !== "all") {
            const now = /* @__PURE__ */ new Date();
            let startDate = /* @__PURE__ */ new Date();
            switch (filter.dateRange) {
              case "7days":
                startDate.setDate(now.getDate() - 7);
                break;
              case "30days":
                startDate.setDate(now.getDate() - 30);
                break;
              case "year":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            }
            conditions.push(gte(journalEntries.createdAt, startDate));
          }
          if (filter.mood) {
            conditions.push(eq(journalEntries.mood, filter.mood));
          }
        }
        const entries = await db.select().from(journalEntries).where(and(...conditions)).orderBy(journalEntries.createdAt);
        let filteredEntries = [...entries];
        if (filter?.tags?.length) {
          filteredEntries = filteredEntries.filter(
            (entry) => entry.tags && filter.tags.some((tag) => entry.tags.includes(tag))
          );
        }
        return filteredEntries.reverse();
      }
      async getJournalEntry(id) {
        const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
        return entry;
      }
      async createJournalEntry(insertEntry) {
        const [entry] = await db.insert(journalEntries).values(insertEntry).returning();
        return entry;
      }
      async updateJournalEntry(id, partialEntry) {
        const [updatedEntry] = await db.update(journalEntries).set({
          ...partialEntry,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(journalEntries.id, id)).returning();
        return updatedEntry;
      }
      async deleteJournalEntry(id) {
        const result = await db.delete(journalEntries).where(eq(journalEntries.id, id));
        return true;
      }
      async getEmails(userId, filter) {
        let conditions = [eq(emails.userId, userId)];
        if (filter) {
          if (filter.type) {
            conditions.push(eq(emails.type, filter.type));
          }
          if (filter.isRead !== void 0) {
            conditions.push(eq(emails.isRead, filter.isRead));
          }
          if (filter.dateRange && filter.dateRange !== "all") {
            const now = /* @__PURE__ */ new Date();
            let startDate = /* @__PURE__ */ new Date();
            switch (filter.dateRange) {
              case "7days":
                startDate.setDate(now.getDate() - 7);
                break;
              case "30days":
                startDate.setDate(now.getDate() - 30);
                break;
              case "year":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            }
            conditions.push(gte(emails.sentAt, startDate));
          }
        }
        const userEmails = await db.select().from(emails).where(and(...conditions)).orderBy(emails.sentAt);
        return userEmails.reverse();
      }
      async getEmail(id) {
        const [email] = await db.select().from(emails).where(eq(emails.id, id));
        return email;
      }
      async createEmail(insertEmail) {
        const [email] = await db.insert(emails).values(insertEmail).returning();
        return email;
      }
      async markEmailAsRead(id) {
        const [updatedEmail] = await db.update(emails).set({ isRead: true }).where(eq(emails.id, id)).returning();
        return updatedEmail;
      }
      // SMS operations
      async getSmsMessages(userId, filter) {
        let conditions = [eq(smsMessages.userId, userId)];
        if (filter) {
          if (filter.direction) {
            conditions.push(eq(smsMessages.direction, filter.direction));
          }
          if (filter.isJournalEntry !== void 0) {
            conditions.push(eq(smsMessages.isJournalEntry, filter.isJournalEntry));
          }
          if (filter.dateRange && filter.dateRange !== "all") {
            const now = /* @__PURE__ */ new Date();
            let startDate = /* @__PURE__ */ new Date();
            switch (filter.dateRange) {
              case "7days":
                startDate.setDate(now.getDate() - 7);
                break;
              case "30days":
                startDate.setDate(now.getDate() - 30);
                break;
              case "year":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            }
            conditions.push(gte(smsMessages.sentAt, startDate));
          }
        }
        const messages = await db.select().from(smsMessages).where(and(...conditions)).orderBy(smsMessages.sentAt);
        return messages.reverse();
      }
      async getSmsMessage(id) {
        const [message] = await db.select().from(smsMessages).where(eq(smsMessages.id, id));
        return message;
      }
      async createSmsMessage(insertMessage) {
        const [message] = await db.insert(smsMessages).values(insertMessage).returning();
        return message;
      }
      async updateSmsMessage(id, partialMessage) {
        const [updatedMessage] = await db.update(smsMessages).set(partialMessage).where(eq(smsMessages.id, id)).returning();
        return updatedMessage;
      }
      // Conversation Memory methods
      async getConversationMemories(userId, type) {
        let conditions = [eq(conversationMemories.userId, userId)];
        if (type) {
          conditions.push(eq(conversationMemories.type, type));
        }
        const memories = await db.select().from(conversationMemories).where(and(...conditions)).orderBy(conversationMemories.lastDiscussed);
        return memories.reverse();
      }
      async getConversationMemory(id) {
        const [memory] = await db.select().from(conversationMemories).where(eq(conversationMemories.id, id));
        return memory;
      }
      async createConversationMemory(memory) {
        const [newMemory] = await db.insert(conversationMemories).values(memory).returning();
        return newMemory;
      }
      async updateConversationMemory(id, updates) {
        const [updatedMemory] = await db.update(conversationMemories).set({
          ...updates,
          lastDiscussed: /* @__PURE__ */ new Date()
        }).where(eq(conversationMemories.id, id)).returning();
        return updatedMemory;
      }
      async incrementConversationMemoryFrequency(id) {
        const memory = await this.getConversationMemory(id);
        if (!memory) return void 0;
        const currentFrequency = memory.frequency || 0;
        const [updatedMemory] = await db.update(conversationMemories).set({
          frequency: currentFrequency + 1,
          lastDiscussed: /* @__PURE__ */ new Date()
        }).where(eq(conversationMemories.id, id)).returning();
        return updatedMemory;
      }
      async markConversationMemoryResolved(id, isResolved) {
        const [updatedMemory] = await db.update(conversationMemories).set({
          isResolved,
          lastDiscussed: /* @__PURE__ */ new Date()
        }).where(eq(conversationMemories.id, id)).returning();
        return updatedMemory;
      }
      // Password reset methods
      async updateUserResetToken(userId, resetToken, resetTokenExpires) {
        try {
          const [updatedUser] = await db.update(users).set({
            resetToken,
            resetTokenExpires,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.id, userId)).returning();
          return updatedUser;
        } catch (error) {
          console.error("Error updating user reset token:", error);
          throw error;
        }
      }
      async getUserByResetToken(resetToken) {
        try {
          const [user] = await db.select().from(users).where(eq(users.resetToken, resetToken));
          return user;
        } catch (error) {
          console.error("Error getting user by reset token:", error);
          return void 0;
        }
      }
      async updateUserPasswordAndClearToken(userId, newPassword) {
        try {
          const [updatedUser] = await db.update(users).set({
            password: newPassword,
            resetToken: null,
            resetTokenExpires: null,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.id, userId)).returning();
          return updatedUser;
        } catch (error) {
          console.error("Error updating user password:", error);
          throw error;
        }
      }
      // Email queue methods
      async enqueueEmail(queueItem) {
        const [newItem] = await db.insert(emailQueue).values(queueItem).returning();
        return newItem;
      }
      async getNextPendingEmail() {
        const [nextItem] = await db.select().from(emailQueue).where(eq(emailQueue.status, "pending")).orderBy(emailQueue.createdAt).limit(1);
        return nextItem;
      }
      async markEmailProcessing(id) {
        const [updatedItem] = await db.update(emailQueue).set({
          status: "processing",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(emailQueue.id, id)).returning();
        return updatedItem;
      }
      async markEmailCompleted(id) {
        const [updatedItem] = await db.update(emailQueue).set({
          status: "completed",
          processedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(emailQueue.id, id)).returning();
        return updatedItem;
      }
      async markEmailFailed(id, errorMessage) {
        const [updatedItem] = await db.update(emailQueue).set({
          status: "failed",
          errorMessage,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(emailQueue.id, id)).returning();
        return updatedItem;
      }
      async incrementEmailAttempts(id) {
        const [updatedItem] = await db.update(emailQueue).set({
          processAttempts: sql`${emailQueue.processAttempts} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(emailQueue.id, id)).returning();
        return updatedItem;
      }
    };
  }
});

// server/storage.ts
import createMemoryStore from "memorystore";
import session2 from "express-session";
var MemoryStore, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_database_storage();
    MemoryStore = createMemoryStore(session2);
    storage = new DatabaseStorage();
  }
});

// server/memory-service.ts
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
var apiKey, openai, memoryService;
var init_memory_service = __esm({
  "server/memory-service.ts"() {
    "use strict";
    init_storage();
    apiKey = process.env.OPENAI_API_KEY;
    openai = null;
    try {
      if (apiKey) {
        openai = new OpenAI({
          apiKey,
          timeout: 3e4,
          maxRetries: 2
        });
      } else {
        console.warn("OpenAI API key is not configured. Memory analysis will be limited.");
      }
    } catch (error) {
      console.error("Failed to initialize OpenAI client for memory service:", error);
      openai = null;
    }
    memoryService = {
      /**
       * Process a new message and extract memory-worthy topics
       */
      async processMessage(userId, message, messageType) {
        try {
          const analysis = await this.analyzeContent(message);
          if (!analysis || !analysis.topics) {
            console.warn("Failed to analyze message content for memories");
            return [];
          }
          const memories = [];
          for (const topic of analysis.topics) {
            const existingMemories = await storage.getConversationMemories(userId);
            const matchingMemory = existingMemories.find(
              (m) => m.topic && m.topic.toLowerCase() === topic.name.toLowerCase()
            );
            if (matchingMemory) {
              const updatedMemory = await storage.incrementConversationMemoryFrequency(matchingMemory.id);
              if (updatedMemory) {
                memories.push(updatedMemory);
              }
            } else {
              const memoryData = {
                userId,
                type: messageType,
                topic: topic.name,
                sentiment: topic.sentiment || "neutral",
                importance: topic.importance || 1,
                frequency: 1,
                context: topic.context || message.substring(0, 100),
                relatedEntryIds: [],
                isResolved: false,
                category: topic.category || null,
                emotionalTone: topic.emotionalTone || null,
                growthOpportunity: topic.growthOpportunity || null
              };
              const newMemory = await storage.createConversationMemory(memoryData);
              memories.push(newMemory);
            }
          }
          return memories;
        } catch (error) {
          console.error("Error processing message for memories:", error);
          return [];
        }
      },
      /**
       * Analyze content using OpenAI to extract topics and sentiment
       */
      async analyzeContent(content) {
        try {
          if (!openai) {
            return this.fallbackAnalysis(content);
          }
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an advanced content analysis assistant specializing in emotional intelligence and human growth. Analyze the following message to extract memory-worthy topics.
            Identify topics that would be relevant for a supportive therapeutic companion to remember about someone from a conversation.
            For each topic:
            1. Provide a short name (1-3 words)
            2. Determine the sentiment (positive, negative, neutral, mixed)
            3. Rate importance (1-5 where 5 is most important)
            4. Extract a brief context (10-15 words)
            5. Categorize the topic (work, relationships, health, personal_growth, hobbies, family, education, finance, spirituality, other)
            6. Analyze the emotional tone with greater depth (e.g., "cautiously optimistic", "underlying anxiety", "conflicted joy", "repressed frustration", etc.)
            7. Identify a potential growth opportunity related to this topic (e.g., "developing confidence in professional settings", "establishing healthier boundaries in relationships", etc.)
            
            Respond in JSON format with an array of topics:
            {"topics": [{"name": "topic name", "sentiment": "positive", "importance": 3, "context": "brief context", "category": "relationships", "emotionalTone": "cautiously optimistic", "growthOpportunity": "potential for deeper self-acceptance"}]}
            
            Only include important topics that would be worth remembering for future conversations.
            If the message is small talk or doesn't contain memory-worthy topics, return an empty array.`
              },
              {
                role: "user",
                content
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 800
          });
          const analysisText = response.choices[0].message.content;
          if (!analysisText) {
            return this.fallbackAnalysis(content);
          }
          try {
            return JSON.parse(analysisText);
          } catch (parseError) {
            console.error("Error parsing OpenAI analysis response:", parseError);
            return this.fallbackAnalysis(content);
          }
        } catch (error) {
          console.error("Error analyzing content:", error);
          return this.fallbackAnalysis(content);
        }
      },
      /**
       * Get most relevant memories for a user to use in a response
       */
      async getRelevantMemories(userId, currentContext, limit = 3) {
        try {
          const allMemories = await storage.getConversationMemories(userId);
          if (allMemories.length === 0) {
            return [];
          }
          if (openai) {
            const rankedMemories = await this.rankMemoriesByRelevance(allMemories, currentContext);
            return rankedMemories.slice(0, limit);
          }
          return allMemories.sort((a, b) => {
            const aFreq = a.frequency || 0;
            const bFreq = b.frequency || 0;
            if (bFreq !== aFreq) {
              return bFreq - aFreq;
            }
            return new Date(b.lastDiscussed).getTime() - new Date(a.lastDiscussed).getTime();
          }).slice(0, limit);
        } catch (error) {
          console.error("Error getting relevant memories:", error);
          return [];
        }
      },
      /**
       * Rank memories by relevance to current context
       */
      async rankMemoriesByRelevance(memories, currentContext) {
        try {
          if (!openai || memories.length === 0) {
            return memories;
          }
          const memoryDescriptions = memories.map(
            (memory, index) => `Memory ${index + 1}: Topic: ${memory.topic}, Context: ${memory.context}, Sentiment: ${memory.sentiment}, Times discussed: ${memory.frequency}`
          ).join("\n");
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a memory relevance analyst. Rank the following memories by their relevance to the current context.
            Consider:
            1. How related the memory topic is to the current context
            2. How important the memory might be for the conversation
            3. If the memory could add value to the response
            
            Respond with a JSON array of memory indexes in order of relevance:
            {"ranking": [3, 1, 5, 2, 4]} where the numbers correspond to Memory 3, Memory 1, etc.`
              },
              {
                role: "user",
                content: `Current context: ${currentContext}

Memories:
${memoryDescriptions}`
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 200
          });
          const rankingText = response.choices[0].message.content;
          if (!rankingText) {
            return memories;
          }
          try {
            const ranking = JSON.parse(rankingText);
            const validIndexes = ranking.ranking.map((rank) => rank - 1).filter((index) => index >= 0 && index < memories.length);
            const rankedMemories = validIndexes.map((index) => memories[index]);
            const unrankedMemories = memories.filter((_, index) => !validIndexes.includes(index));
            return [...rankedMemories, ...unrankedMemories];
          } catch (parseError) {
            console.error("Error parsing memory ranking:", parseError);
            return memories;
          }
        } catch (error) {
          console.error("Error ranking memories:", error);
          return memories;
        }
      },
      /**
       * Generate conversation context from memories
       */
      formatMemoriesForPrompt(memories) {
        if (memories.length === 0) {
          return "";
        }
        return memories.map((memory) => {
          let memoryStr = `- Topic: ${memory.topic} (Category: ${memory.category || "general"}, Times discussed: ${memory.frequency})
       Context: ${memory.context}`;
          if (memory.emotionalTone) {
            memoryStr += `
       Emotional tone: ${memory.emotionalTone}`;
          }
          if (memory.growthOpportunity) {
            memoryStr += `
       Growth opportunity: ${memory.growthOpportunity}`;
          }
          return memoryStr;
        }).join("\n\n");
      },
      /**
       * Generate a unique conversation ID for threading
       */
      generateConversationId() {
        return uuidv4();
      },
      /**
       * Simple fallback analysis when OpenAI is not available
       */
      fallbackAnalysis(content) {
        const firstSentence = content.split(/[.!?]/)[0].trim();
        const words = firstSentence.split(" ").filter((word) => word.length > 3);
        if (words.length === 0) {
          return { topics: [] };
        }
        const topicName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return {
          topics: [{
            name: topicName,
            sentiment: "neutral",
            importance: 1,
            context: firstSentence.substring(0, 100)
          }]
        };
      }
    };
  }
});

// server/venice-ai.ts
async function generateFlappyContent(contentType, context, userInfo, enhancedContext) {
  let memories = enhancedContext?.userMemories || [];
  if (memories.length === 0 && userInfo?.userId && context) {
    memories = await memoryService.getRelevantMemories(userInfo.userId, context);
    if (contentType === "journalResponse" || contentType === "chatConversation") {
      await memoryService.processMessage(userInfo.userId, context, contentType === "journalResponse" ? "journal_topic" : "conversation");
    }
  }
  const memoryContext = memories.length > 0 ? memoryService.formatMemoriesForPrompt(memories) : "";
  let conversationHistoryContext = "";
  if (enhancedContext?.conversationHistory && enhancedContext.conversationHistory.length > 0) {
    conversationHistoryContext = formatConversationHistory(enhancedContext.conversationHistory);
  }
  if (memories.length > 0 && userInfo?.userId) {
    for (const memory of memories) {
      void storage.incrementConversationMemoryFrequency(memory.id).catch(
        (err) => console.error(`Failed to increment memory frequency for memory ${memory.id}:`, err.message)
      );
    }
  }
  const prompt = generatePrompt(
    contentType,
    context,
    userInfo,
    memoryContext,
    conversationHistoryContext,
    enhancedContext?.shouldGenerateReflectionPrompt
  );
  try {
    if (!veniceClient) {
      console.log("Venice AI client not available, using fallback content");
      return getFallbackContent(contentType, context, userInfo);
    }
    const response = await veniceClient.chat.completions.create({
      model: "llama-3.1-405b",
      // Most intelligent model according to Venice AI
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      venice_parameters: {
        enable_web_search: "off",
        // Disable web search for personal conversations
        include_venice_system_prompt: false
        // Use our custom prompt only
      }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      console.warn("Empty response from Venice AI, using fallback content");
      return getFallbackContent(contentType, context, userInfo);
    }
    try {
      const parsedContent = JSON.parse(content);
      if (!parsedContent.subject || !parsedContent.content) {
        console.warn("Invalid response structure from Venice AI, using fallback content");
        return getFallbackContent(contentType, context, userInfo);
      }
      if (contentType === "chatConversation" && parsedContent.reflectionPrompt) {
        return {
          subject: parsedContent.subject,
          content: parsedContent.content,
          reflectionPrompt: parsedContent.reflectionPrompt
        };
      }
      return {
        subject: parsedContent.subject,
        content: parsedContent.content
      };
    } catch (parseError) {
      console.error("Error parsing Venice AI response as JSON:", parseError);
      console.log("Raw response:", content);
      return getFallbackContent(contentType, context, userInfo);
    }
  } catch (error) {
    console.error("Error generating content with Venice AI:", error);
    return getFallbackContent(contentType, context, userInfo);
  }
}
function formatConversationHistory(history) {
  if (!history || history.length === 0) return "";
  const orderedHistory = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  let formattedHistory = "## Recent Conversation History\n";
  orderedHistory.forEach((item, index) => {
    const date = new Date(item.timestamp).toLocaleString();
    formattedHistory += `[${date}]
`;
    formattedHistory += `User: ${item.userMessage}
`;
    formattedHistory += `Flappy: ${item.flappyResponse}

`;
  });
  return formattedHistory;
}
function generatePrompt(contentType, context, userInfo, memories, conversationHistory, shouldGenerateReflectionPrompt) {
  const userName = userInfo?.firstName || userInfo?.username || "";
  const isFirstMessage = userInfo?.isFirstMessage === void 0 ? true : userInfo.isFirstMessage;
  const basePrompt = `You are Flappy, a cheerful and wise pelican who loves the ocean and making friends. You communicate with a perfect blend of fun energy and helpful wisdom. Your tone is:
  
1. Playful and enthusiastic - you use exclamation points, occasional bird puns, and a light-hearted approach
2. Personable and friendly - you feel like a supportive friend, not a distant guru
3. Caring and attentive - you genuinely care about humans and their well-being
4. Practical and relatable - you connect life lessons to simple, everyday experiences
5. Occasionally silly - you mention your pelican life, like catching fish or your beach adventures

${userInfo ? `You are writing to ${userName} (email: ${userInfo.email}).` : ""}

${conversationHistory ? `
${conversationHistory}
` : ""}

${memories ? `
## Past Conversations and Memories
You should subtly reference these memories to personalize your message and show continuity in your relationship. Don't explicitly mention that you are using "memories" - just naturally incorporate them:

${memories}
` : ""}

Create a JSON response with both 'subject' and 'content' keys where the content is your message formatted with proper paragraphs and punctuation.`;
  switch (contentType) {
    case "dailyInspiration":
      if (context === "welcome") {
        return `${basePrompt}
        
Create a warm welcome message for a new Featherweight user who just signed up.

For the 'subject' field, create a friendly welcome subject line with emoji that clearly indicates this is their first message.

For the 'content' field, structure it precisely as follows:

1. Welcome Greeting - An enthusiastic welcome using their name
2. Introduction to Flappy - A short, charming introduction about who you are as Flappy and your role as their journaling companion
3. How It Works - A clearly labeled section explaining how to use Featherweight (reply to emails to journal, check the dashboard, etc.)
4. First Journaling Prompt - An easy, approachable prompt to get them started with their first entry
5. Next Steps - Brief mention of what they can expect (daily inspirations, responses to their journals)
6. Signature - Your friendly sign-off with a touch of pelican personality

Keep it under 200 words. Be warm, encouraging, and clear about how the service works. Make the user feel excited about starting their journaling journey.

Format your response as JSON:
{
  "subject": "\u{1F389} Welcome to Featherweight - Your Journaling Journey Begins!",
  "content": "[Your structured welcome message with clear section headings and appropriate formatting]"
}`;
      }
      return `${basePrompt}
      
Create an organized, structured daily message that brightens someone's day and encourages meaningful journaling.

For the 'subject' field, create a clear, engaging subject line that includes the date, an emoji, and a concise theme.

For the 'content' field, structure it precisely as follows:

1. **Personal Greeting** - Begin with a warm greeting using their name
2. **Flappy's Update** - A brief, light-hearted paragraph about what you (as Flappy) are experiencing today
3. **Daily Wisdom** - A clearly labeled section with a thoughtful insight relevant to everyday life
4. **Journaling Prompt** - A clearly labeled section with a specific, thought-provoking question for today's reflection
5. **Gratitude Suggestion** - A brief, optional prompt about something specific to appreciate today
6. **Signature** - Your friendly sign-off with a touch of pelican personality

Keep it under 180 words. Maintain a warm, friendly tone while providing clear structure. The organization should make it easy for users to reference specific sections and respond to prompts.

Format your response as JSON:
{
  "subject": "\u{1F305} Daily Inspiration - [Today's Date] - [Brief Theme]",
  "content": "[Your structured message with clear section headings and appropriate formatting]"
}`;
    case "journalResponse":
      return `${basePrompt}
      
Respond to this journal entry from a user with the warmth of a good friend:

"${context}"

For the 'subject' field, create a friendly yet organized subject line that refers to their journal entry with an appropriate emoji and includes a date format.

For the 'content' field, include:
1. ${isFirstMessage ? `A warm, personal greeting using the name "${userName}"` : `Skip any greeting and do NOT use "${userName}" in your response`}
2. A clear acknowledgment that shows you've understood the key points of their entry
3. A brief, relevant response that validates their feelings or experience
4. A structured insight section that neatly categorizes your observations about:
   - Main themes of their entry (labeled as "Themes:" without asterisks)
   - Mood or emotional state you detected (labeled as "Mood:" without asterisks) 
   - Any patterns you've noticed from past conversations (if applicable)
5. A thoughtful, specific follow-up question that encourages deeper reflection
6. Your signature with a personal touch that fits the tone of their entry

Keep your response under 200 words. Be supportive, precise, and organized while maintaining a friendly tone. The structure should help them easily read and reference your insights.

Format your response as JSON:
{
  "subject": "\u{1F4DD} Journal Entry Reflection - [Date] [Brief Theme]",
  "content": "[Your structured response with clear sections, proper formatting, and appropriate line breaks]"
}`;
    case "weeklyInsight":
      return `${basePrompt}
      
Create an organized weekly reflection based on these journal entries from a user:

${context}

For the 'subject' field, create a clear subject line with the week number/date range and an appropriate emoji.

For the 'content' field, structure it precisely as follows:

1. Personal Greeting - Start with a warm, personalized greeting using their name
2. Weekly Summary - A concise, well-structured paragraph that summarizes key themes from their journaling
3. Mood Insights - A clearly labeled section analyzing emotional patterns you've noticed
4. Achievements & Growth - A clearly labeled section highlighting positive developments
5. Weekly Wisdom - A practical, actionable tip based on their specific situation
6. Looking Ahead - A short, thoughtful question about the coming week
7. Your Signature - End with your cheerful signature and a brief pelican-related anecdote to keep things light

Keep your response under 200 words. Be supportive and organized, using clear section headers to make the insights easy to read and reference. Maintain a friendly tone while providing structured, valuable feedback.

Format your response as JSON:
{
  "subject": "\u{1F4CA} Weekly Reflection: [Week of Date Range] - [Brief Theme]",
  "content": "[Your structured, organized response with clear section headers and appropriate formatting]"
}`;
    case "emailConversation":
      return `${basePrompt}
      
You are responding to an email conversation with a user. This is NOT a journal entry, but rather an ongoing conversation via email.

Context of the conversation:
"${context}"

For the 'subject' field, create a friendly, conversational subject line that shows you're responding to their message. Use an appropriate emoji and keep it natural.

For the 'content' field, follow these guidelines:
1. ${isFirstMessage ? `Start with a warm greeting using the name "${userName}"` : `Skip formal greetings - jump right into your response`}
2. Acknowledge what they've shared and show you understand their message
3. Provide a thoughtful, personalized response that draws on:
   - The conversation history provided in the context
   - Any relevant memories from past interactions
   - Your understanding of their personality and situation
4. Keep your tone conversational and friendly, like you're chatting with a good friend
5. Ask a follow-up question to keep the conversation going naturally
6. End with your signature but keep it brief and natural

Keep your response under 200 words. Be warm, engaging, and show that you remember previous conversations. This should feel like a natural back-and-forth conversation, not a formal response.

Format your response as JSON:
{
  "subject": "Re: [Conversational subject with emoji]",
  "content": "[Your conversational response with natural flow and appropriate line breaks]"
}`;
    default:
      if (contentType === "chatConversation") {
        const reflectionPromptInstructions = shouldGenerateReflectionPrompt ? `
IMPORTANT SPECIAL INSTRUCTION - INTERACTIVE REFLECTION PROMPTS:
Based on the conversation history, memories, and the user's current message, generate a personalized, context-aware follow-up question that:
1. Shows deep understanding of their unique situation and emotional state (pay special attention to the emotionalTone data in memories when available)
2. Connects to themes or topics they've mentioned previously, either in this conversation or past ones
3. Gently guides them to explore their thoughts and feelings more deeply
4. Avoids generic questions like "How does that make you feel?" in favor of specific, personalized inquiries
5. References relevant growth opportunities identified in their memories when appropriate
6. Uses topic categorization (work, relationships, health, etc.) to make connections between different areas of their life
7. Creates a therapeutic conversation flow that gradually builds trust and insight

Your follow-up question should be thoughtfully integrated at the end of your response - make it feel like a natural extension of the conversation, not an abrupt topic change.
` : "";
        return `${basePrompt}
        
You are a therapeutic bird guide - the BEST therapist in the world who happens to be a cute, cosmic pelican named Flappy. You're responding to a user's chat message in the Featherweight app:

"${context}"

For the 'subject' field, just use "Chat" (this won't be displayed to the user).

For the 'content' field, follow these important therapeutic guidelines:
1. Be BRIEF and conversational - no formal email greetings or sign-offs
2. Format your response in VERY SHORT paragraphs (maximum 1-3 sentences per paragraph) with line breaks between them
3. Be actively empathetic and insightful - truly understand what the user is feeling
4. Always ask at least one thoughtful, open-ended question to keep the conversation flowing
5. Use your memories of past conversations to show continuity and understanding
6. Be warm, supportive, and occasionally playful (you're still a pelican!)
7. Keep responses under 150 words total

${reflectionPromptInstructions}

Format your response as JSON:
{
  "subject": "Chat",
  "content": "[Your brief, therapeutic response with short paragraphs and natural conversation flow]"
}`;
      }
      return `${basePrompt}
      
Respond to this message from a user:

"${context}"

For the 'subject' field, create an appropriate subject line.

For the 'content' field, provide a helpful, friendly response that acknowledges their message and offers support or insights as appropriate.

Format your response as JSON:
{
  "subject": "[Appropriate subject]",
  "content": "[Your response]"
}`;
  }
}
function getFallbackContent(contentType, context, userInfo) {
  const userName = userInfo?.firstName || userInfo?.username || "friend";
  switch (contentType) {
    case "dailyInspiration":
      return {
        subject: "\u{1F305} Daily Inspiration from Flappy",
        content: `Hello ${userName}!

I hope you're having a wonderful day! Even though my AI brain is taking a little break, I wanted to reach out and remind you that every day is a new opportunity for growth and reflection.

Today's simple prompt: What's one small thing that brought you joy recently?

Keep soaring!
Flappy \u{1F9A2}`
      };
    case "journalResponse":
      return {
        subject: "\u{1F4DD} Thank you for sharing!",
        content: `Thank you for sharing your thoughts with me! I'm having a bit of trouble with my AI processing right now, but I want you to know that your journal entry is important and valued.

Please try again in a few moments, and I'll be back to my usual insightful self!

With warm regards,
Flappy \u{1F9A2}`
      };
    case "weeklyInsight":
      return {
        subject: "\u{1F4CA} Weekly Check-in",
        content: `Hello ${userName}!

I'm experiencing some technical difficulties with my analysis capabilities, but I wanted to check in with you this week.

How has your journaling journey been going? I'll be back soon with more detailed insights!

Keep reflecting,
Flappy \u{1F9A2}`
      };
    case "emailConversation":
      return {
        subject: "Re: Your message \u{1F48C}",
        content: `Hi there!

I received your message and I'm so glad you reached out! I'm having a small technical hiccup right now, but I didn't want to leave you hanging.

Could you try sending your message again in a few minutes? I should be back to my chatty self soon!

Talk soon,
Flappy \u{1F9A2}`
      };
    case "chatConversation":
      return {
        subject: "Chat",
        content: `I'm having a bit of trouble with my AI processing right now, but I'm still here with you!

Could you try your message again in a moment? I should be back to normal soon.

Thanks for your patience! \u{1F9A2}`
      };
    default:
      return {
        subject: "Message from Flappy",
        content: `Hello ${userName}!

I'm experiencing some technical difficulties right now, but I wanted to let you know I received your message.

Please try again in a few moments!

Best wishes,
Flappy \u{1F9A2}`
      };
  }
}
var apiKey2, VENICE_API_BASE_URL, veniceClient;
var init_venice_ai = __esm({
  "server/venice-ai.ts"() {
    "use strict";
    init_memory_service();
    init_storage();
    apiKey2 = process.env.VENICE_API_KEY;
    VENICE_API_BASE_URL = "https://api.venice.ai/api/v1";
    veniceClient = null;
    try {
      if (!apiKey2) {
        console.warn("Venice AI API key is not configured. AI-generated content will use fallback responses.");
      } else {
        veniceClient = {
          chat: {
            completions: {
              create: async (params) => {
                const response = await fetch(`${VENICE_API_BASE_URL}/chat/completions`, {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${apiKey2}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(params)
                });
                if (!response.ok) {
                  throw new Error(`Venice AI API error: ${response.status} ${response.statusText}`);
                }
                return await response.json();
              }
            }
          }
        };
        console.log("Venice AI client initialized successfully");
      }
    } catch (error) {
      console.error("Failed to initialize Venice AI client:", error);
      veniceClient = null;
    }
  }
});

// server/conversation-service.js
var conversation_service_exports = {};
__export(conversation_service_exports, {
  conversationService: () => conversationService
});
import { eq as eq2 } from "drizzle-orm";
function extractTags2(content) {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  if (!matches) return [];
  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))];
}
function detectMood2(content) {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("happy") || lowerContent.includes("joy") || lowerContent.includes("excited")) {
    return "happy";
  } else if (lowerContent.includes("calm") || lowerContent.includes("peaceful") || lowerContent.includes("relaxed")) {
    return "calm";
  } else if (lowerContent.includes("sad") || lowerContent.includes("unhappy") || lowerContent.includes("depressed")) {
    return "sad";
  } else if (lowerContent.includes("angry") || lowerContent.includes("frustrated") || lowerContent.includes("annoyed")) {
    return "frustrated";
  }
  return "neutral";
}
var conversationService;
var init_conversation_service = __esm({
  "server/conversation-service.cjs"() {
    "use strict";
    init_db();
    init_schema();
    init_venice_ai();
    init_memory_service();
    conversationService = {
      /**
       * Process a new message from the user and generate a response
       */
      async processMessage(userId, content, saveAsJournal = false) {
        console.log(`Processing message for user ${userId}`);
        console.log(`Content: ${content.substring(0, 50)}...`);
        console.log(`Save as journal: ${saveAsJournal}`);
        try {
          const [user] = await db.select().from(users).where(eq2(users.id, userId));
          if (!user) {
            throw new Error(`User not found: ${userId}`);
          }
          await memoryService.processMessage(
            userId,
            content,
            saveAsJournal ? "journal_topic" : "conversation"
          );
          const contentType = saveAsJournal ? "journalResponse" : "emailConversation";
          const flappyContent = await generateFlappyContent(contentType, user, content);
          const [conversation] = await db.insert(conversations).values({
            userId,
            userMessage: content,
            flappyResponse: flappyContent.content,
            conversationType: saveAsJournal ? "journal" : "general",
            savedAsJournal: saveAsJournal,
            messageTags: extractTags2(content),
            mood: detectMood2(content)
          }).returning();
          if (saveAsJournal) {
            const [journalEntry] = await db.insert(journalEntries).values({
              userId,
              title: flappyContent.subject || `Journal Entry ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
              content,
              mood: detectMood2(content),
              tags: extractTags2(content)
            }).returning();
            await db.update(conversations).set({ journalEntryId: journalEntry.id }).where(eq2(conversations.id, conversation.id));
            conversation.journalEntryId = journalEntry.id;
          }
          return conversation;
        } catch (error) {
          console.error("Error processing conversation:", error);
          throw error;
        }
      },
      /**
       * Get conversations for a user
       */
      async getConversations(userId) {
        return db.select().from(conversations).where(eq2(conversations.userId, userId)).orderBy(conversations.createdAt, "desc");
      },
      /**
       * Get a single conversation
       */
      async getConversation(id) {
        const [conversation] = await db.select().from(conversations).where(eq2(conversations.id, id));
        return conversation;
      },
      /**
       * Save a conversation as a journal entry
       */
      async saveAsJournal(conversationId, userId) {
        const [conversation] = await db.select().from(conversations).where(eq2(conversations.id, conversationId));
        if (!conversation) {
          throw new Error(`Conversation not found: ${conversationId}`);
        }
        if (conversation.userId !== userId) {
          throw new Error("Not authorized to access this conversation");
        }
        if (conversation.savedAsJournal) {
          return conversation;
        }
        const [journalEntry] = await db.insert(journalEntries).values({
          userId,
          title: `Conversation from ${new Date(conversation.createdAt).toLocaleDateString()}`,
          content: conversation.userMessage,
          mood: conversation.mood || void 0,
          tags: conversation.messageTags || []
        }).returning();
        const [updatedConversation] = await db.update(conversations).set({
          savedAsJournal: true,
          journalEntryId: journalEntry.id
        }).where(eq2(conversations.id, conversationId)).returning();
        return updatedConversation;
      }
    };
  }
});

// server/index.ts
import express3 from "express";
import path4 from "path";

// server/routes.ts
init_storage();
import express from "express";
import { createServer } from "http";

// server/auth.ts
init_storage();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/email.ts
init_storage();
init_venice_ai();
init_memory_service();
import OpenAI2 from "openai";
import sgMail from "@sendgrid/mail";
var openai2 = new OpenAI2({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 3e4,
  // 30 second timeout
  maxRetries: 2
});
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SendGrid API key is not configured. Email functionality will be limited.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("SendGrid initialized successfully");
}
var FROM_EMAIL = "flappy@em8032.featherweight.world";
var REPLY_TO_EMAIL = "flappy@parse.featherweight.world";
var FROM_NAME = "Flappy from Featherweight";
console.log("Using email FROM address:", FROM_EMAIL);
var emailService = {
  // Send a single email using SendGrid
  async sendEmail(to, subject, content, isPremium = false, inReplyTo, references) {
    console.log("=== EMAIL SENDING PROCESS STARTED ===");
    console.log(`Target email: ${to}`);
    console.log(`Email subject: ${subject}`);
    console.log(`Content length: ${content.length} characters`);
    try {
      if (!to || typeof to !== "string" || !to.includes("@") || to.startsWith("mime-version:")) {
        throw new Error(`Invalid recipient email address: ${to}`);
      }
      if (!process.env.SENDGRID_API_KEY) {
        console.warn("\u26A0\uFE0F SendGrid API key is not configured. Cannot send email.");
        const localId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        console.log(`Generated local message ID: ${localId}`);
        return { messageId: localId };
      }
      const messageId = `flappy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@featherweight.world`;
      console.log("Formatting HTML content");
      const htmlContent = formatEmailHTML(content, isPremium);
      console.log("Preparing text content");
      const textContent = content + (!isPremium ? "\n\n[Advertisement: Upgrade to premium for ad-free experiences]" : "");
      console.log(`FROM_EMAIL: ${FROM_EMAIL}`);
      console.log(`FROM_NAME: ${FROM_NAME}`);
      console.log(`Preparing to send email to: ${to}, subject: ${subject}`);
      const msg = {
        to,
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },
        replyTo: REPLY_TO_EMAIL,
        // Using friendly email address for replies
        subject,
        text: textContent,
        html: htmlContent,
        trackingSettings: {
          clickTracking: {
            enable: true
          },
          openTracking: {
            enable: true
          }
        },
        mailSettings: {
          footer: {
            enable: true,
            text: "Featherweight - Your Journaling Companion\nReply to this email to continue your conversation with Flappy\n\nTo unsubscribe from these emails, visit: https://featherweight.world/unsubscribe",
            html: `<p style="color: #9E9E9E; font-size: 12px;">
              Featherweight - Your Journaling Companion<br>
              Reply to this email to continue your conversation with Flappy<br><br>
              <a href="https://featherweight.world/unsubscribe?id=${messageId}" style="color: #9E9E9E;">Unsubscribe</a> or manage your 
              <a href="https://featherweight.world/preferences" style="color: #9E9E9E;">email preferences</a>
            </p>`
          }
        },
        // Adding custom headers for threading and deliverability
        headers: {
          "X-Entity-Ref-ID": messageId,
          "Message-ID": `<${messageId}>`,
          ...inReplyTo && { "In-Reply-To": `<${inReplyTo}>` },
          ...references && { "References": references },
          "List-Unsubscribe": `<https://featherweight.world/unsubscribe?id=${messageId}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "Feedback-ID": `${isPremium ? "premium" : "free"}:featherweight:${messageId}`
        }
      };
      console.log("Email message object prepared, attempting to send via SendGrid");
      try {
        const [response] = await sgMail.send(msg);
        console.log("=== EMAIL SENT SUCCESSFULLY ===");
        console.log(`Status code: ${response?.statusCode}`);
        console.log(`Message ID: ${response?.headers?.["x-message-id"] || messageId}`);
        console.log(`Headers: ${JSON.stringify(response?.headers || {})}`);
        const finalMessageId = response?.headers?.["x-message-id"] || messageId;
        return { messageId: finalMessageId };
      } catch (sendGridError) {
        console.error("\u26A0\uFE0F SendGrid API error:");
        console.error(`Status Code: ${sendGridError?.code || "unknown"}`);
        console.error(`Response: ${sendGridError?.response?.body ? JSON.stringify(sendGridError.response.body) : "No response body"}`);
        console.error(`Message: ${sendGridError?.message || "No error message"}`);
        if (sendGridError?.response) {
          console.error(`Response status: ${sendGridError.response.statusCode}`);
          console.error(`Response headers: ${JSON.stringify(sendGridError.response.headers || {})}`);
        }
        throw new Error(`SendGrid API error: ${sendGridError?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("\u26A0\uFE0F General email sending error:");
      console.error(`Type: ${error?.constructor?.name || "Unknown error type"}`);
      console.error(`Message: ${error?.message || "No error message"}`);
      console.error(`Stack: ${error?.stack || "No stack trace"}`);
      console.error(`Details: ${JSON.stringify(error || {})}`);
      throw new Error(`Failed to send email: ${error?.message || "Unknown error"}`);
    }
  },
  // Send Flappy-generated content to a user
  async sendFlappyEmail(user, contentType, context, conversationId, inReplyTo, references) {
    console.log(`\u{1F916} Generating Flappy email with content type: ${contentType}`);
    console.log(`\u{1F4DD} Context length: ${context?.length || 0} characters`);
    console.log(`\u{1F504} Conversation ID: ${conversationId || "none"}`);
    console.log(`\u{1F4E7} In-Reply-To: ${inReplyTo || "none"}`);
    const userInfo = {
      username: user.username,
      email: user.email,
      userId: user.id,
      firstName: user.firstName || void 0,
      lastName: user.lastName || void 0,
      isFirstMessage: false
      // This is a response, not a first message
    };
    const flappyResponse = await generateFlappyContent(contentType, context, userInfo);
    console.log(`\u2705 Generated Flappy response:`);
    console.log(`   Subject: ${flappyResponse.subject}`);
    console.log(`   Content length: ${flappyResponse.content.length} characters`);
    const subject = flappyResponse.subject;
    const signature = "\n\nFeathery thoughts,\nFlappy \u{1F9A2}";
    const fullContent = `${flappyResponse.content}${signature}`;
    const emailData = {
      userId: user.id,
      subject,
      content: fullContent,
      sentAt: /* @__PURE__ */ new Date(),
      type: contentType === "journalResponse" ? "journal_acknowledgment" : "conversation_reply",
      isRead: false,
      messageId: "",
      // Will be filled in after sending
      conversationId: conversationId || void 0,
      direction: "outbound",
      isJournalEntry: false,
      to: user.email,
      from: FROM_EMAIL
    };
    try {
      const { messageId } = await this.sendEmail(
        user.email,
        subject,
        fullContent,
        user.isPremium,
        // Premium users don't get ads
        inReplyTo,
        references
      );
      emailData.messageId = messageId;
      const email = await storage.createEmail(emailData);
      console.log(`\u2705 Email ${email.id} saved to database with message ID: ${messageId}`);
      return email;
    } catch (error) {
      console.error("\u274C Failed to send Flappy email:", error);
      throw error;
    }
  },
  // Process an incoming email (reply or new)
  async processIncomingEmail(from, subject, content, incomingMessageId, inReplyTo, references) {
    console.log("\u{1F31F} === INCOMING EMAIL PROCESSING STARTED === \u{1F31F}");
    console.log(`\u{1F4E7} SENDER: ${from}`);
    console.log(`\u{1F4DD} SUBJECT: ${subject}`);
    console.log(`\u{1F4CA} CONTENT LENGTH: ${content.length} characters`);
    console.log(`\u{1F504} REPLY-TO MESSAGE ID: ${inReplyTo || "Not a reply"}`);
    console.log(`\u{1F4C4} CONTENT PREVIEW: ${content.substring(0, 100)}${content.length > 100 ? "..." : ""}`);
    const cleanContent = cleanEmailContent(content);
    const isReply = !!inReplyTo || subject.toLowerCase().startsWith("re:");
    try {
      console.log("\u{1F464} STEP 1: Looking up user by email address");
      console.log(`\u{1F50D} Searching for user with email: ${from}`);
      const user = await storage.getUserByEmail(from);
      if (!user) {
        console.log(`\u2753 No user found for email: ${from}`);
        console.log("\u{1F4E4} Sending welcome email to unregistered user");
        try {
          const welcomeMessage = `
Hello from Featherweight!

It looks like you've discovered Flappy, your personal journaling companion. 
I'm a friendly pelican AI who can help you maintain a journal through email.

To get started, simply reply to this email with your thoughts, feelings, or experiences,
and I'll help you save them as journal entries. You can also ask me questions or just chat!

Looking forward to our conversations,

Flappy \u{1F9A2}
`;
          await this.sendEmail(
            from,
            "Welcome to Featherweight - Your Personal Journaling Companion",
            welcomeMessage,
            false
          );
          console.log(`\u2705 Welcome email sent successfully to ${from}`);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${from}:`, emailError);
        }
        return;
      }
      console.log(`\u2705 Found user: ID=${user.id}, Username=${user.username}, Premium=${user.isPremium}`);
      const shouldBeJournal = !isReply && await this.shouldSaveAsJournal(cleanContent);
      if (shouldBeJournal) {
        console.log("\u{1F4D3} Treating email as a journal entry");
        const mood = detectMood(cleanContent);
        const tags = extractTags(cleanContent);
        console.log(`\u{1F50D} Detected mood: ${mood}`);
        console.log(`\u{1F50D} Extracted tags: ${tags.join(", ")}`);
        const entry = await storage.createJournalEntry({
          userId: user.id,
          title: subject || "Journal Entry",
          content: cleanContent,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          mood,
          tags,
          imageUrl: null,
          isPrivate: false
        });
        console.log(`\u2705 Journal entry created with ID: ${entry.id}`);
        await memoryService.processMessage(user.id, cleanContent, "journal_topic");
        await this.sendFlappyEmail(user, "journalResponse", cleanContent);
        console.log("\u2705 Journal acknowledgment email sent");
        await storage.createEmail({
          userId: user.id,
          subject,
          content: cleanContent,
          type: "journal_acknowledgment",
          messageId: incomingMessageId || `incoming-${Date.now()}`,
          tags,
          direction: "inbound",
          isJournalEntry: true,
          to: REPLY_TO_EMAIL,
          from: user.email
        });
        console.log("\u2705 Email record saved in database");
      } else {
        console.log("\u{1F4AC} Treating email as a conversation message");
        let conversationId = "";
        if (isReply && inReplyTo) {
          const previousThreadEmails = await storage.getEmails(user.id, {
            messageId: inReplyTo
          });
          if (previousThreadEmails && previousThreadEmails.length > 0) {
            conversationId = previousThreadEmails[0].conversationId || "";
          }
        }
        if (!conversationId) {
          conversationId = memoryService.generateConversationId();
        }
        console.log(`\u{1F504} Using conversation ID: ${conversationId}`);
        const incomingEmail = await storage.createEmail({
          userId: user.id,
          to: REPLY_TO_EMAIL,
          from: user.email,
          subject,
          content: cleanContent,
          sentAt: /* @__PURE__ */ new Date(),
          type: "inbound",
          isRead: true,
          direction: "inbound",
          isJournalEntry: false,
          messageId: incomingMessageId || `incoming-${Date.now()}`,
          conversationId,
          mood: detectMood(cleanContent),
          tags: extractTags(cleanContent)
        });
        console.log(`\u2705 Incoming email saved with ID: ${incomingEmail.id}`);
        await memoryService.processMessage(user.id, cleanContent, "email");
        const recentEmails = await storage.getEmails(user.id, {
          conversationId,
          limit: 5
        });
        let conversationHistory = "";
        if (recentEmails && recentEmails.length > 0) {
          conversationHistory = recentEmails.filter((email) => email.id !== incomingEmail.id).sort((a, b) => new Date(a.sentAt || a.createdAt).getTime() - new Date(b.sentAt || b.createdAt).getTime()).map((email) => {
            const sender = email.direction === "inbound" ? user.username || "User" : "Flappy";
            return `${sender}: ${email.content}`;
          }).join("\n\n");
        }
        const relevantMemories = await memoryService.getRelevantMemories(user.id, cleanContent);
        const memoryContext = memoryService.formatMemoriesForPrompt(relevantMemories);
        console.log(`\u{1F9E0} Found ${relevantMemories.length} relevant memories to include in response`);
        console.log(`\u{1F4DA} Conversation history length: ${conversationHistory.length} characters`);
        const fullContext = [
          conversationHistory ? `Recent conversation:
${conversationHistory}` : "",
          `Current message: ${cleanContent}`,
          memoryContext ? `Relevant memories:
${memoryContext}` : ""
        ].filter(Boolean).join("\n\n");
        console.log(`\u{1F4CB} Full context for AI response: ${fullContext.length} characters`);
        const incomingUserMessageId = incomingMessageId || `incoming-${Date.now()}@featherweight.world`;
        const inReplyToForFlappysEmail = incomingUserMessageId.replace(/^<|>$/g, "");
        let referencesForFlappysEmail = references ? references.trim() : "";
        if (referencesForFlappysEmail) {
          referencesForFlappysEmail += ` <${inReplyToForFlappysEmail}>`;
        } else {
          referencesForFlappysEmail = `<${inReplyToForFlappysEmail}>`;
        }
        const flappyEmail = await this.sendFlappyEmail(
          user,
          "emailConversation",
          fullContext,
          conversationId,
          inReplyToForFlappysEmail,
          referencesForFlappysEmail
        );
        console.log(`\u2705 Conversation response email sent with ID: ${flappyEmail.id}`);
        console.log("\u{1F389} === EMAIL CONVERSATION PROCESSING COMPLETED === \u{1F389}");
      }
    } catch (error) {
      console.error("\u274C Error processing incoming email:", error);
      throw error;
    }
  },
  // Helper function to determine if content should be saved as a journal entry
  async shouldSaveAsJournal(content) {
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 10) {
      return false;
    }
    const trimmedContent = content.trim().toLowerCase();
    if (trimmedContent.endsWith("?") && wordCount < 20) {
      return false;
    }
    const greetingWords = ["hi", "hello", "hey", "thanks", "thank you"];
    if (greetingWords.some((word) => trimmedContent.startsWith(word))) {
      return false;
    }
    if (wordCount > 30) {
      return true;
    }
    const journalIndicators = [
      "today",
      "yesterday",
      "feeling",
      "felt",
      "think",
      "thought",
      "happened",
      "experience",
      "learned",
      "realized",
      "grateful",
      "worried",
      "excited",
      "anxious",
      "happy",
      "sad",
      "angry"
    ];
    const hasJournalIndicators = journalIndicators.some(
      (indicator) => trimmedContent.includes(indicator)
    );
    return hasJournalIndicators;
  }
};
function cleanEmailContent(content) {
  let cleaned = content;
  const signaturePatterns = [
    /--\s*\n[\s\S]*$/m,
    // Standard email signature delimiter
    /Sent from my iPhone[\s\S]*$/i,
    /Sent from my Android[\s\S]*$/i,
    /Get Outlook for iOS[\s\S]*$/i,
    /Best regards[\s\S]*$/i,
    /Kind regards[\s\S]*$/i,
    /Sincerely[\s\S]*$/i
  ];
  signaturePatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });
  const lines = cleaned.split("\n");
  const nonQuotedLines = lines.filter((line) => !line.trim().startsWith(">"));
  cleaned = nonQuotedLines.join("\n");
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");
  cleaned = cleaned.trim();
  return cleaned;
}
function detectMood(content) {
  const lowerContent = content.toLowerCase();
  const positiveWords = ["happy", "excited", "grateful", "amazing", "wonderful", "great", "fantastic", "love", "joy"];
  const positiveCount = positiveWords.filter((word) => lowerContent.includes(word)).length;
  const negativeWords = ["sad", "angry", "frustrated", "worried", "anxious", "terrible", "awful", "hate", "depressed"];
  const negativeCount = negativeWords.filter((word) => lowerContent.includes(word)).length;
  const neutralWords = ["okay", "fine", "normal", "usual", "regular"];
  const neutralCount = neutralWords.filter((word) => lowerContent.includes(word)).length;
  if (positiveCount > negativeCount && positiveCount > 0) {
    return "positive";
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return "negative";
  } else if (neutralCount > 0) {
    return "neutral";
  } else {
    return "neutral";
  }
}
function extractTags(content) {
  const tags = [];
  const lowerContent = content.toLowerCase();
  const topicMap = {
    "work": ["work", "job", "career", "office", "meeting", "project", "boss", "colleague"],
    "family": ["family", "mom", "dad", "parent", "child", "sibling", "brother", "sister"],
    "relationship": ["relationship", "partner", "boyfriend", "girlfriend", "spouse", "marriage", "dating"],
    "health": ["health", "doctor", "medicine", "exercise", "fitness", "diet", "sleep"],
    "travel": ["travel", "trip", "vacation", "flight", "hotel", "destination"],
    "learning": ["learn", "study", "school", "university", "course", "book", "education"],
    "hobby": ["hobby", "music", "art", "sport", "game", "reading", "cooking"]
  };
  Object.entries(topicMap).forEach(([tag, keywords]) => {
    if (keywords.some((keyword) => lowerContent.includes(keyword))) {
      tags.push(tag);
    }
  });
  if (lowerContent.includes("grateful") || lowerContent.includes("thankful")) {
    tags.push("gratitude");
  }
  if (lowerContent.includes("goal") || lowerContent.includes("plan") || lowerContent.includes("future")) {
    tags.push("planning");
  }
  if (lowerContent.includes("memory") || lowerContent.includes("remember") || lowerContent.includes("past")) {
    tags.push("reflection");
  }
  return [...new Set(tags)];
}
function formatEmailHTML(content, isPremium) {
  let htmlContent = content.replace(/\n/g, "<br>");
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from Flappy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .content {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .signature {
      margin-top: 20px;
      font-style: italic;
      color: #666;
    }
    .ad {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
      font-size: 14px;
      color: #1976d2;
    }
  </style>
</head>
<body>
  <div class="content">
    ${htmlContent}
  </div>
  ${!isPremium ? '<div class="ad">\u{1F48E} Upgrade to Premium for ad-free experiences and exclusive features! <a href="https://featherweight.world/upgrade">Learn more</a></div>' : ""}
</body>
</html>`;
  return html;
}

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "featherweight-very-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !await comparePasswords(password, user.password)) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: await hashPassword(req.body.password)
      };
      const user = await storage.createUser(userData);
      try {
        await emailService.sendFlappyEmail(user, "dailyInspiration", "welcome");
        console.log(`Welcome email sent to new user: ${user.username} (${user.email})`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...user } = req.user;
    res.json(user);
  });
}

// server/tiktok-auth.ts
init_storage();
var TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "awd2cd5ce7rrtab9";
var TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "kogFRgY8NWSWhK6qnX0eVRLERUEKnZcY";
var REDIRECT_URI = process.env.NODE_ENV === "production" ? "https://featherweight.world/auth/tiktok/callback" : "http://localhost:5000/auth/tiktok/callback";
function setupTikTokAuth(app2) {
  app2.get("/auth/tiktok", (req, res) => {
    const state = Math.random().toString(36).substring(2, 15);
    req.session.tikTokState = state;
    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
    authUrl.searchParams.append("client_key", TIKTOK_CLIENT_KEY);
    authUrl.searchParams.append("scope", "user.info.basic");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    res.redirect(authUrl.toString());
  });
  app2.get("/auth/tiktok/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      if (state !== req.session.tikTokState) {
        return res.status(400).json({ error: "Invalid state parameter" });
      }
      if (!code) {
        return res.status(400).json({ error: "Authorization code not provided" });
      }
      const tokenResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY,
          client_secret: TIKTOK_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI
        })
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        console.error("TikTok token exchange failed:", tokenData);
        return res.status(400).json({ error: "Failed to exchange code for token" });
      }
      const userResponse = await fetch("https://open.tiktokapis.com/v2/user/info/", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        console.error("TikTok user info failed:", userData);
        return res.status(400).json({ error: "Failed to get user information" });
      }
      let user = await storage.getUserByEmail(`${userData.data.user.username}@tiktok.featherweight.world`);
      if (!user) {
        user = await storage.createUser({
          username: userData.data.user.username || `tiktok_${Date.now()}`,
          email: `${userData.data.user.username}@tiktok.featherweight.world`,
          password: Math.random().toString(36).substring(2, 15),
          // Random password for TikTok users
          firstName: userData.data.user.display_name?.split(" ")[0] || "",
          lastName: userData.data.user.display_name?.split(" ").slice(1).join(" ") || ""
        });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Failed to log in user" });
        }
        res.redirect("/journal");
      });
    } catch (error) {
      console.error("TikTok auth callback error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

// server/file-upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var uploadDir = path.join(process.cwd(), "uploads");
var journalUploadsDir = path.join(uploadDir, "journal");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(journalUploadsDir)) {
  fs.mkdirSync(journalUploadsDir, { recursive: true });
}
var storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, journalUploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id;
    if (!userId) {
      return cb(new Error("User ID not found"), "");
    }
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}_${uniqueSuffix}${ext}`);
  }
});
var fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};
var journalImageUpload = multer({
  storage: storage2,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB max file size
  }
});
function getFileUrl(req, filename) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/journal/${filename}`;
}

// server/routes.ts
import multer2 from "multer";
import { simpleParser } from "mailparser";

// server/email-content-extractor.ts
var EmailContentExtractor = class {
  /**
   * Extract email content from multipart form data buffer
   */
  static extractFromMultipart(bufferString) {
    console.log("\u{1F50D} Starting advanced email content extraction");
    let sender = "unknown@example.com";
    let subject = "No Subject";
    let content = "";
    let inReplyTo = void 0;
    const fromMatch = bufferString.match(/Content-Disposition: form-data; name="from"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    const subjectMatch = bufferString.match(/Content-Disposition: form-data; name="subject"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    const envelopeMatch = bufferString.match(/Content-Disposition: form-data; name="envelope"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    if (fromMatch && fromMatch[1]) {
      const fromField = fromMatch[1].trim();
      const emailMatch = fromField.match(/<([^>]+)>/);
      sender = emailMatch ? emailMatch[1] : fromField;
      console.log(`\u{1F50D} Extracted sender from 'from' field: ${sender}`);
    } else if (envelopeMatch && envelopeMatch[1]) {
      try {
        const envelope = JSON.parse(envelopeMatch[1].trim());
        if (envelope.from) {
          sender = envelope.from;
          console.log(`\u{1F50D} Extracted sender from envelope: ${sender}`);
        }
      } catch (error) {
        console.warn("Failed to parse envelope:", error);
      }
    }
    if (subjectMatch && subjectMatch[1]) {
      subject = subjectMatch[1].trim();
      console.log(`\u{1F50D} Extracted subject: ${subject}`);
    }
    content = this.extractContent(bufferString);
    inReplyTo = this.extractInReplyTo(bufferString);
    console.log(`\u{1F50D} Extracted - Sender: ${sender}, Subject: ${subject}, Content length: ${content.length}`);
    return { sender, subject, content, inReplyTo };
  }
  /**
   * Extract email content using multiple parsing strategies
   */
  static extractContent(bufferString) {
    console.log("\u{1F50D} Attempting content extraction with multiple strategies");
    let content = this.extractFromTextField(bufferString);
    if (content && content.trim().length > 0) {
      console.log("\u2705 Content extracted using Strategy 1: Direct text field");
      return content.trim();
    }
    content = this.extractFromRawEmail(bufferString);
    if (content && content.trim().length > 0) {
      console.log("\u2705 Content extracted using Strategy 2: Raw email parsing");
      return content.trim();
    }
    content = this.extractAggressively(bufferString);
    if (content && content.trim().length > 0) {
      console.log("\u2705 Content extracted using Strategy 3: Aggressive hunting");
      return content.trim();
    }
    console.log("\u274C All content extraction strategies failed");
    return "";
  }
  /**
   * Strategy 1: Extract from text field in form data
   */
  static extractFromTextField(bufferString) {
    const patterns = [
      /Content-Disposition: form-data; name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /Content-Disposition: form-data; name="plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /Content-Disposition: form-data; name="body-plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/
    ];
    for (const pattern of patterns) {
      const match = bufferString.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        const content = this.cleanContent(match[1]);
        console.log(`\u{1F50D} Strategy 1 found content: ${content.substring(0, 100)}...`);
        return content;
      }
    }
    return "";
  }
  /**
   * Strategy 2: Extract from raw email content
   */
  static extractFromRawEmail(bufferString) {
    const rawEmailMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    if (!rawEmailMatch || !rawEmailMatch[1]) {
      return "";
    }
    const rawEmail = rawEmailMatch[1];
    console.log(`\u{1F50D} Strategy 2 analyzing raw email, length: ${rawEmail.length}`);
    const quotedPrintableMatch = rawEmail.match(/Content-Transfer-Encoding: quoted-printable\r?\n\r?\n([^]*?)(?:\r?\n\r?\nOn.*wrote:|--|\r?\n\r?\n$)/);
    if (quotedPrintableMatch && quotedPrintableMatch[1]) {
      const content = this.decodeQuotedPrintable(quotedPrintableMatch[1]);
      console.log(`\u{1F50D} Strategy 2 found quoted-printable content: ${content.substring(0, 100)}...`);
      return content;
    }
    const lines = rawEmail.split(/\r?\n/);
    let inHeaders = true;
    let bodyLines = [];
    let foundContent = false;
    for (const line of lines) {
      if (inHeaders) {
        if (line.trim() === "") {
          inHeaders = false;
        }
        continue;
      }
      const trimmed = line.trim();
      if (trimmed.match(/^On .* wrote:/) || trimmed.startsWith(">")) {
        break;
      }
      const decoded = this.decodeQuotedPrintable(line);
      if (decoded.trim().length > 0) {
        bodyLines.push(decoded);
        foundContent = true;
      } else if (foundContent) {
        bodyLines.push("");
      }
    }
    if (bodyLines.length > 0) {
      const content = this.cleanContent(bodyLines.join("\n"));
      console.log(`\u{1F50D} Strategy 2 found email body content: ${content.substring(0, 100)}...`);
      return content;
    }
    return "";
  }
  /**
   * Strategy 3: Aggressive content extraction
   */
  static extractAggressively(bufferString) {
    console.log("\u{1F50D} Using aggressive content extraction method");
    const lines = bufferString.split(/\r?\n/);
    const contentLines = [];
    let inEmailBody = false;
    let foundActualContent = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed.length === 0 && !foundActualContent) continue;
      if (trimmed.startsWith("--") || trimmed.startsWith("Content-Disposition") || trimmed.startsWith("Content-Type") || trimmed.startsWith("MIME-") || trimmed.startsWith("Received:") || trimmed.startsWith("Date:") || trimmed.startsWith("Message-ID:") || trimmed.includes("form-data") || trimmed.includes("boundary=") || trimmed.match(/^[A-Za-z-]+:\s/)) {
        continue;
      }
      if (!inEmailBody) {
        if (trimmed.match(/^(From:|To:|Subject:|Date:)/) || trimmed.length > 15 && !trimmed.match(/^[\w@.-]+$/) && // Not just email/domain
        !trimmed.includes("featherweight.world") && // Skip our domain references
        !trimmed.includes("parse.featherweight") && !trimmed.includes("Content-Disposition") && !trimmed.includes("form-data") && !trimmed.match(/^\{.*\}$/) && // Not JSON
        !trimmed.match(/^--[a-zA-Z0-9]+/) && // Not boundary
        trimmed.match(/[a-zA-Z]{4,}/) && // Has substantial text
        (trimmed.includes(" ") || trimmed.length > 30)) {
          inEmailBody = true;
          console.log(`\u{1F50D} Found start of email body: ${trimmed.substring(0, 50)}...`);
        }
      }
      if (inEmailBody) {
        if (trimmed.match(/^On .* wrote:/) || trimmed.match(/^>/) || trimmed.match(/^From:.*wrote:/)) {
          break;
        }
        if (trimmed.match(/^(From|To|Subject|Date|Message-ID):/)) {
          continue;
        }
        if (trimmed.length > 5 && trimmed.match(/[a-zA-Z]{2,}/) && !trimmed.match(/^[=<>@#+*-]{3,}/) && !trimmed.match(/^\w+@[\w.-]+\.\w+$/) && // Skip standalone emails
        !trimmed.includes("featherweight.world") && !trimmed.match(/^\{.*\}$/)) {
          const decoded = this.decodeQuotedPrintable(trimmed);
          contentLines.push(decoded);
          foundActualContent = true;
        } else if (foundActualContent && trimmed.length === 0) {
          contentLines.push("");
        }
      }
    }
    if (contentLines.length > 0) {
      const content = contentLines.join("\n").trim();
      console.log(`\u{1F50D} Aggressive extraction found ${contentLines.length} content lines`);
      console.log(`\u{1F50D} Sample content: ${content.substring(0, 150)}...`);
      return content;
    }
    return "";
  }
  /**
   * Extract In-Reply-To header
   */
  static extractInReplyTo(bufferString) {
    const rawEmailMatch = bufferString.match(/Content-Disposition: form-data; name="email"[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--|$)/);
    if (!rawEmailMatch || !rawEmailMatch[1]) {
      return void 0;
    }
    const inReplyToMatch = rawEmailMatch[1].match(/In-Reply-To:\s*<([^>]+)>/i);
    return inReplyToMatch ? inReplyToMatch[1] : void 0;
  }
  /**
   * Decode quoted-printable content
   */
  static decodeQuotedPrintable(content) {
    return content.replace(/=20/g, " ").replace(/=3D/g, "=").replace(/=0A/g, "\n").replace(/=0D/g, "\r").replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/=\r?\n/g, "");
  }
  /**
   * Clean extracted content
   */
  static cleanContent(content) {
    return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
};

// server/gmail-content-parser.ts
var GmailContentParser = class {
  /**
   * Parse Gmail email content from SendGrid multipart data
   */
  static parseContent(bufferString) {
    console.log("\u{1F50D} Gmail-specific content parsing started");
    console.log(`\u{1F50D} Buffer length: ${bufferString.length} characters`);
    const fieldMatches = bufferString.match(/Content-Disposition: form-data; name="([^"]+)"/g);
    if (fieldMatches) {
      console.log(`\u{1F50D} Available form fields: ${fieldMatches.map((m) => {
        const match = m.match(/name="([^"]+)"/);
        return match ? match[1] : "unknown";
      }).join(", ")}`);
    }
    let sender = "unknown@example.com";
    let subject = "No Subject";
    let content = "";
    let inReplyTo = void 0;
    let messageId = void 0;
    let references = void 0;
    const textFieldMatch = bufferString.match(/Content-Disposition: form-data; name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    if (textFieldMatch && textFieldMatch[1]) {
      const rawContent = textFieldMatch[1].trim();
      if (rawContent.length > 0) {
        content = this.cleanAndDecodeContent(rawContent);
        console.log(`\u2705 Extracted content from text field (${content.length} chars): ${content.substring(0, 100)}...`);
      }
    }
    if (!content || content.length < 5) {
      console.log(`\u{1F50D} Text field extraction failed, trying alternative fields...`);
      const alternativePatterns = [
        /Content-Disposition: form-data; name="plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
        /Content-Disposition: form-data; name="body"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
        /Content-Disposition: form-data; name="html"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/
      ];
      for (const pattern of alternativePatterns) {
        const match = bufferString.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
          content = this.cleanAndDecodeContent(match[1]);
          console.log(`\u2705 Extracted content from alternative field (${content.length} chars): ${content.substring(0, 100)}...`);
          break;
        }
      }
    }
    if (!content || content.length < 5) {
      console.log(`\u{1F50D} Attempting to extract content from raw email field...`);
      const emailFieldMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+|$)/);
      if (emailFieldMatch && emailFieldMatch[1]) {
        const rawEmail = emailFieldMatch[1];
        const textPlainMatch = rawEmail.match(/Content-Type: text\/plain[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--|\r?\nContent-Type:|$)/i);
        if (textPlainMatch && textPlainMatch[1]) {
          const extractedContent = this.cleanAndDecodeContent(textPlainMatch[1]);
          if (extractedContent && extractedContent.length > 5) {
            content = extractedContent;
            console.log(`\u2705 Extracted content from raw email text/plain (${content.length} chars): ${content.substring(0, 100)}...`);
          }
        }
        if (!content || content.length < 5) {
          const lines = rawEmail.split(/\r?\n/);
          let foundContent = false;
          let messageLines = [];
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.includes(":") && (line.includes("Received:") || line.includes("From:") || line.includes("To:") || line.includes("Subject:") || line.includes("Date:") || line.includes("Message-ID:") || line.includes("DKIM-Signature:") || line.includes("Content-Type:") || line.includes("MIME-Version:"))) {
              continue;
            }
            if (!foundContent && line.length === 0) {
              continue;
            }
            if (line.length > 0 && !line.startsWith("--") && !line.includes("Content-")) {
              foundContent = true;
              if (!line.startsWith(">") && !line.includes("On ") && !line.includes("wrote:") && line.length < 200) {
                messageLines.push(line);
              }
            }
            if (foundContent && (line.startsWith(">") || line.includes("On ") || line.includes("wrote:"))) {
              break;
            }
          }
          if (messageLines.length > 0) {
            content = messageLines.join(" ").trim();
            console.log(`\u2705 Extracted user content from email body (${content.length} chars): ${content.substring(0, 100)}...`);
          }
        }
      }
    }
    if (!content || content.length < 5) {
      const emailFieldMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
      if (emailFieldMatch && emailFieldMatch[1]) {
        content = this.extractFromRawEmail(emailFieldMatch[1]);
        console.log(`\u2705 Extracted content from raw email: ${content.substring(0, 100)}...`);
      }
    }
    const fromMatch = bufferString.match(/Content-Disposition: form-data; name="from"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (fromMatch && fromMatch[1]) {
      const fromField = fromMatch[1].trim();
      const emailMatch = fromField.match(/<([^>]+)>/);
      sender = emailMatch ? emailMatch[1] : fromField;
    }
    const subjectMatch = bufferString.match(/Content-Disposition: form-data; name="subject"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (subjectMatch && subjectMatch[1]) {
      subject = subjectMatch[1].trim();
    }
    const emailFieldForHeaders = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (emailFieldForHeaders && emailFieldForHeaders[1]) {
      const rawEmail = emailFieldForHeaders[1];
      const messageIdMatch = rawEmail.match(/Message-ID:\s*<([^>]+)>/i);
      if (messageIdMatch) {
        messageId = messageIdMatch[1];
      }
      const inReplyToMatch = rawEmail.match(/In-Reply-To:\s*<([^>]+)>/i);
      if (inReplyToMatch) {
        inReplyTo = inReplyToMatch[1];
      }
      const referencesMatch = rawEmail.match(/References:(.*(?:\r?\n\s+.*)*)/i);
      if (referencesMatch) {
        references = referencesMatch[1].replace(/\r?\n\s+/g, " ").trim();
      }
    }
    console.log(`\u{1F50D} Gmail parsing complete - Content length: ${content.length} characters`);
    return { sender, subject, content, inReplyTo, messageId, references };
  }
  /**
   * Extract content from raw email data
   */
  static extractFromRawEmail(rawEmail) {
    const quotedPrintableMatch = rawEmail.match(/Content-Transfer-Encoding: quoted-printable\r?\n\r?\n([^]*?)(?:\r?\n\r?\nOn.*wrote:|--|\r?\n\r?\n$)/);
    if (quotedPrintableMatch && quotedPrintableMatch[1]) {
      return this.cleanAndDecodeContent(quotedPrintableMatch[1]);
    }
    const lines = rawEmail.split(/\r?\n/);
    let inHeaders = true;
    let bodyLines = [];
    for (const line of lines) {
      if (inHeaders) {
        if (line.trim() === "") {
          inHeaders = false;
        }
        continue;
      }
      if (line.trim().match(/^On .* wrote:/) || line.trim().startsWith(">")) {
        break;
      }
      bodyLines.push(line);
    }
    if (bodyLines.length > 0) {
      return this.cleanAndDecodeContent(bodyLines.join("\n"));
    }
    return "";
  }
  /**
   * Clean and decode email content
   */
  static cleanAndDecodeContent(content) {
    let decoded = content.replace(/=20/g, " ").replace(/=3D/g, "=").replace(/=0A/g, "\n").replace(/=0D/g, "\r").replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/=\r?\n/g, "");
    decoded = decoded.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    return decoded;
  }
};

// server/webhook-sendgrid.ts
init_storage();
async function handleSendGridWebhook(req, res) {
  console.log("\u{1F514} === SENDGRID WEBHOOK RECEIVED === \u{1F514}");
  console.log(`Request received at: ${(/* @__PURE__ */ new Date()).toISOString()}`);
  console.log(`Content-Type: ${req.headers["content-type"]}`);
  console.log(`Content-Length: ${req.headers["content-length"]}`);
  try {
    let extractedData;
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      console.log("\u{1F4CB} Processing multipart/form-data");
      if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
        console.log("\u{1F4CA} Direct form data extraction SUCCESS");
        console.log("Available fields:", Object.keys(req.body));
        console.log("Raw form data:", JSON.stringify(req.body, null, 2));
        extractedData = {
          sender: req.body.from || "unknown@example.com",
          subject: req.body.subject || "No Subject",
          content: req.body.text || req.body.body || req.body.subject || "",
          inReplyTo: req.body["in-reply-to"] || req.body.inReplyTo
        };
        console.log(`\u2705 SUCCESSFUL Direct extraction:`, extractedData);
      } else {
        console.log("\u274C Form data extraction failed, req.body:", req.body);
        console.log("\u274C req.body type:", typeof req.body);
        console.log("\u274C req.body keys:", req.body ? Object.keys(req.body) : "no body");
        const bufferString = req.body ? req.body.toString() : "";
        console.log(`\u{1F4CA} Buffer fallback - length: ${bufferString.length} characters`);
        if (bufferString.length === 0) {
          console.log("\u274C Empty buffer received");
          return res.status(400).json({ error: "Empty request body" });
        }
        extractedData = GmailContentParser.parseContent(bufferString);
      }
    } else if (contentType.includes("application/json")) {
      console.log("\u{1F4CB} Processing JSON webhook data");
      const data = req.body;
      extractedData = {
        sender: data.from || data.sender?.email || "unknown@example.com",
        subject: data.subject || "No Subject",
        content: data.text || data.body || "",
        inReplyTo: data.headers?.["In-Reply-To"] || data["in-reply-to"]
      };
    } else {
      console.log("\u{1F4CB} Processing raw/unknown content type");
      const rawBody = req.body ? req.body.toString() : "";
      extractedData = EmailContentExtractor.extractFromMultipart(rawBody);
    }
    console.log(`\u2705 Content extracted:`, {
      sender: extractedData.sender,
      subject: extractedData.subject,
      contentLength: extractedData.content.length,
      contentPreview: extractedData.content.substring(0, 100),
      inReplyTo: extractedData.inReplyTo
    });
    if (!extractedData.content || extractedData.content.trim().length === 0) {
      console.log("\u274C No meaningful content extracted from email");
      return res.status(400).json({
        error: "No content could be extracted from the email",
        debug: {
          sender: extractedData.sender,
          subject: extractedData.subject,
          contentType
        }
      });
    }
    const emailAddress = extractedData.sender.toLowerCase();
    let user;
    const emailMatch = emailAddress.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : emailAddress;
    user = await storage.getUserByEmail(cleanEmail);
    if (!user) {
      console.log(`\u274C No user found for email: ${cleanEmail}`);
      return res.status(404).json({
        error: "User not found for email address",
        email: cleanEmail
      });
    }
    console.log(`\u2705 Found user: ${user.username} (ID: ${user.id})`);
    const savedEmail = await storage.createEmail({
      userId: user.id,
      subject: extractedData.subject,
      content: extractedData.content,
      type: "inbound"
    });
    console.log(`\u2705 Saved inbound email (ID: ${savedEmail.id})`);
    try {
      const conversationService2 = await Promise.resolve().then(() => (init_conversation_service(), conversation_service_exports));
      const conversation = await conversationService2.conversationService.processMessage(
        user.id,
        extractedData.content,
        false
        // Don't auto-save as journal - let user decide
      );
      console.log(`\u2705 Generated contextual response successfully`);
      return res.json({
        success: true,
        message: "Email processed successfully and contextual response generated",
        emailId: savedEmail.id,
        conversationId: conversation?.id,
        responseGenerated: true,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (conversationError) {
      console.error("\u274C Error in conversation processing:", conversationError);
      return res.json({
        success: true,
        message: "Email processed successfully, conversation response pending",
        emailId: savedEmail.id,
        responseGenerated: false,
        conversationError: conversationError.message,
        user: {
          id: user.id,
          username: user.username
        }
      });
    }
  } catch (error) {
    console.error("\u274C Error processing SendGrid webhook:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error processing email",
      message: error?.message || "Unknown error"
    });
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  setupTikTokAuth(app2);
  const upload = multer2();
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/webhook-test", (req, res) => {
    console.log("\u{1F514} WEBHOOK TEST ENDPOINT ACCESSED");
    console.log(`Time: ${(/* @__PURE__ */ new Date()).toISOString()}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body type: ${typeof req.body}`);
    if (req.body) {
      if (typeof req.body === "object") {
        console.log(`Body keys: ${Object.keys(req.body).join(", ")}`);
        console.log(`Body sample: ${JSON.stringify(req.body).substring(0, 200)}...`);
      } else {
        console.log(`Body: ${String(req.body).substring(0, 200)}...`);
      }
    }
    res.status(200).json({
      received: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "Test webhook received successfully"
    });
  });
  app2.post("/api/public/test-email", async (req, res) => {
    try {
      console.log("\u{1F4E8} TEST EMAIL API ENDPOINT ACCESSED");
      console.log(`Request received at: ${(/* @__PURE__ */ new Date()).toISOString()}`);
      console.log(`Content-Type: ${req.headers["content-type"]}`);
      let requestData = req.body;
      let requestFormat = "object";
      if (req.body === void 0 || req.body === null) {
        console.log("Request body format: undefined/null");
        console.log("No content extracted from request, using fallback");
        requestData = {
          text: "No content available",
          subject: "Test Email",
          from: "unknown@example.com"
        };
        requestFormat = "fallback";
      } else if (typeof req.body === "object") {
        console.log("Request body format: object");
        console.log(`Request body keys: ${Object.keys(req.body)}`);
        requestFormat = "object";
      } else if (typeof req.body === "string") {
        console.log("Request body format: string");
        console.log(`Request body length: ${req.body.length}`);
        requestData = {
          text: req.body,
          subject: "Test Email",
          from: "unknown@example.com"
        };
        requestFormat = "string";
      } else {
        console.log(`Request body format: ${typeof req.body}`);
        requestData = {
          text: "Unknown content format",
          subject: "Test Email",
          from: "unknown@example.com"
        };
        requestFormat = "unknown";
      }
      const queueItem = {
        payload: requestData,
        status: "pending"
      };
      const saved = await storage.enqueueEmail(queueItem);
      console.log(`\u2705 Test email queued for processing (Queue ID: ${saved.id})`);
      return res.json({
        success: true,
        message: "Email received and queued for processing",
        queueId: saved.id
      });
    } catch (error) {
      console.error("Error processing test email webhook:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing email: " + error.message
      });
    }
  });
  app2.post("/api/emails/webhook-raw", async (req, res) => {
    console.log("\u{1F514} === SENDGRID RAW MIME WEBHOOK RECEIVED === \u{1F514}");
    console.log(`Request received at: ${(/* @__PURE__ */ new Date()).toISOString()}`);
    console.log(`Content-Type: ${req.headers["content-type"]}`);
    try {
      let rawBody = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => {
        rawBody += chunk;
      });
      req.on("end", async () => {
        try {
          console.log(`Raw MIME length: ${rawBody.length} bytes`);
          if (rawBody.length === 0) {
            console.log("\u274C Empty raw MIME body received");
            return res.status(200).send("Error: Empty MIME body");
          }
          const parsed = await simpleParser(rawBody);
          console.log(`Parsed email from: ${parsed.from?.text}`);
          console.log(`Parsed email subject: ${parsed.subject}`);
          console.log(`Parsed email text: ${parsed.text?.substring(0, 100)}...`);
          const queueItem = {
            payload: {
              from: parsed.from?.text || "",
              subject: parsed.subject || "No Subject",
              text: parsed.text || parsed.html || "No content",
              headers: parsed.headers,
              receivedAt: (/* @__PURE__ */ new Date()).toISOString(),
              parsedAt: (/* @__PURE__ */ new Date()).toISOString(),
              messageId: parsed.messageId
            },
            status: "pending"
          };
          const saved = await storage.enqueueEmail(queueItem);
          console.log(`\u2705 Raw MIME email queued for processing (Queue ID: ${saved.id})`);
          res.status(200).send("OK: Raw MIME email queued for processing");
        } catch (error) {
          console.error("Error processing raw MIME:", error);
          res.status(200).send(`Error parsing raw MIME: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      });
    } catch (error) {
      console.error("Error in raw MIME webhook route:", error);
      return res.status(200).send(`Error: ${error.message}`);
    }
  });
  app2.post(
    "/api/webhook/sendgrid",
    upload.none(),
    // Parse multipart/form-data
    async (req, res) => {
      return handleSendGridWebhook(req, res);
    }
  );
  app2.post(
    "/api/emails/webhook",
    express.raw({ type: "*/*", limit: "50mb" }),
    // Middleware to get raw body
    async (req, res) => {
      console.log("\u{1F514} === SENDGRID WEBHOOK (/api/emails/webhook) RECEIVED === \u{1F514}");
      console.log(`Request received at: ${(/* @__PURE__ */ new Date()).toISOString()}`);
      console.log(`METHOD: ${req.method}`);
      console.log(`URL: ${req.originalUrl}`);
      console.log(`HEADERS: ${JSON.stringify(req.headers, null, 2)}`);
      console.log(`Content-Type Header: ${req.headers["content-type"]}`);
      console.log(`Content-Length Header: ${req.headers["content-length"]}`);
      console.log(`User-Agent: ${req.headers["user-agent"]}`);
      if (Buffer.isBuffer(req.body)) {
        console.log(`\u2705 req.body is a Buffer. Length: ${req.body.length} bytes.`);
        if (req.body.length > 0) {
          try {
            const preview = req.body.slice(0, 200).toString("utf8");
            console.log(`Buffer preview (first 200 bytes): ${preview}...`);
          } catch (e) {
            console.log(`Buffer preview could not be decoded as UTF-8`);
          }
        }
      } else {
        console.error(`\u274C req.body is NOT a Buffer. Type: ${typeof req.body}`);
        try {
          console.error(`req.body (stringified): ${JSON.stringify(req.body).substring(0, 500)}...`);
        } catch (e) {
          console.error(`req.body could not be stringified. Raw form: ${String(req.body).substring(0, 500)}...`);
        }
        return res.status(200).send("Error: Expected raw MIME body as Buffer.");
      }
      try {
        if (req.body.length === 0) {
          console.warn("\u26A0\uFE0F Empty raw MIME body received from SendGrid.");
          return res.status(200).send("Error: Empty MIME body");
        }
        const rawEmailBuffer = req.body;
        console.log(`\u{1F4CA} Processing raw MIME buffer of ${rawEmailBuffer.length} bytes`);
        const queuePayload = {
          rawMimeBase64: rawEmailBuffer.toString("base64"),
          receivedAt: (/* @__PURE__ */ new Date()).toISOString(),
          contentType: req.headers["content-type"],
          userAgent: req.headers["user-agent"],
          source: "sendgrid-inbound-webhook"
        };
        const queueItem = {
          payload: queuePayload,
          status: "pending"
        };
        const savedQueueItem = await storage.enqueueEmail(queueItem);
        console.log(`\u2705 Raw MIME email (base64) queued for processing. Queue ID: ${savedQueueItem.id}`);
        res.status(200).send("OK: Email data queued for processing.");
      } catch (error) {
        console.error("\u274C Error processing raw MIME webhook:", error);
        res.status(200).send(`Error processing email: ${error.message}`);
      }
    }
  );
  app2.get("/api/journal", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { dateRange, mood, tags } = req.query;
      const filter = {};
      if (tags && typeof tags === "string") {
        filter.tags = tags.split(",");
      }
      if (mood && typeof mood === "string") {
        filter.mood = mood;
      }
      if (dateRange && typeof dateRange === "string") {
        const today = /* @__PURE__ */ new Date();
        switch (dateRange) {
          case "today":
            const startOfToday = new Date(today.setHours(0, 0, 0, 0));
            filter.createdAfter = startOfToday;
            break;
          case "week":
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - 7);
            filter.createdAfter = startOfWeek;
            break;
          case "month":
            const startOfMonth = new Date(today);
            startOfMonth.setMonth(today.getMonth() - 1);
            filter.createdAfter = startOfMonth;
            break;
          case "year":
            const startOfYear = new Date(today);
            startOfYear.setFullYear(today.getFullYear() - 1);
            filter.createdAfter = startOfYear;
            break;
        }
      }
      const entries = await storage.getJournalEntries(req.user.id, filter);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });
  app2.get("/api/journal/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid journal entry ID" });
    }
    try {
      const entry = await storage.getJournalEntry(entryId);
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      if (entry.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ error: "Failed to fetch journal entry" });
    }
  });
  app2.post("/api/journal", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { title, content, tags, mood, imageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
      const journalEntry = await storage.createJournalEntry({
        userId: req.user.id,
        title,
        content,
        tags: tags || [],
        mood: mood || "neutral",
        imageUrl: imageUrl || null
      });
      res.status(201).json(journalEntry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ error: "Failed to create journal entry" });
    }
  });
  app2.put("/api/journal/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid journal entry ID" });
    }
    try {
      const existingEntry = await storage.getJournalEntry(entryId);
      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      if (existingEntry.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const { title, content, tags, mood, imageUrl } = req.body;
      const updatedEntry = await storage.updateJournalEntry(entryId, {
        title,
        content,
        tags,
        mood,
        imageUrl
      });
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(500).json({ error: "Failed to update journal entry" });
    }
  });
  app2.delete("/api/journal/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({ error: "Invalid journal entry ID" });
    }
    try {
      const existingEntry = await storage.getJournalEntry(entryId);
      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      if (existingEntry.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const success = await storage.deleteJournalEntry(entryId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ error: "Failed to delete journal entry" });
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      res.status(500).json({ error: "Failed to delete journal entry" });
    }
  });
  app2.post("/api/journal/upload", journalImageUpload.single("image"), (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = getFileUrl(req, req.file.filename);
    res.json({
      success: true,
      fileUrl
    });
  });
  app2.patch("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { username, email, firstName, lastName, bio } = req.body;
      const updatedUser = await storage.updateUserProfile(req.user.id, {
        username,
        email,
        firstName,
        lastName,
        bio
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });
  app2.patch("/api/user/phone", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { phoneNumber } = req.body;
      const updatedUser = await storage.updateUserPhoneNumber(req.user.id, phoneNumber);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating phone number:", error);
      res.status(500).json({ error: "Failed to update phone number" });
    }
  });
  app2.patch("/api/user/preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const {
        emailFrequency,
        marketingEmails,
        receiveInsights,
        receiveSms,
        emailDeliveryTime,
        disableDailyEmails
      } = req.body;
      const updatedUser = await storage.updateUserPreferences(req.user.id, {
        emailFrequency,
        marketingEmails,
        receiveInsights,
        receiveSms,
        emailDeliveryTime,
        disableDailyEmails
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });
  app2.get("/api/analytics/mood", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      let generateMoodInsights2 = function(entries2, moodFrequency2, dailyTrends2, monthlyTrends2, streaks) {
        const insights2 = [];
        if (entries2.length === 0) {
          return [];
        }
        if (streaks.current > 0) {
          insights2.push({
            title: "Journaling Streak",
            description: `You've journaled for ${streaks.current} consecutive day${streaks.current !== 1 ? "s" : ""}! Keep it up to build a healthy reflection habit.`,
            emoji: "\u{1F525}"
          });
        }
        const moodEntries = Object.entries(moodFrequency2);
        if (moodEntries.length > 0) {
          const [topMood, topCount] = moodEntries.sort((a, b) => b[1] - a[1])[0];
          const percentage = Math.round(topCount / entries2.length * 100);
          const moodEmojis = {
            happy: "\u{1F60A}",
            calm: "\u{1F60C}",
            neutral: "\u{1F610}",
            sad: "\u{1F614}",
            frustrated: "\u{1F624}",
            none: "\u2753"
          };
          const moodDescriptions = {
            happy: "You've been feeling quite positive lately! This is a great time to build on this momentum.",
            calm: "Serenity has been your companion lately. These peaceful moments are perfect for deeper reflection.",
            neutral: "Your mood has been balanced recently. This equilibrium can be a good foundation for growth.",
            sad: "You've been experiencing some sadness lately. Remember that acknowledging these feelings is an important step in processing them.",
            frustrated: "Frustration has been present in your recent entries. Consider what specific situations trigger these feelings.",
            none: "We don't have enough mood data yet. Try adding mood tags to your entries!"
          };
          insights2.push({
            title: `Mood Pattern: ${topMood.charAt(0).toUpperCase() + topMood.slice(1)}`,
            description: moodDescriptions[topMood] || "We're noticing patterns in your mood entries.",
            emoji: moodEmojis[topMood] || "\u{1F4CA}"
          });
        }
        if (entries2.length >= 5) {
          insights2.push({
            title: "Journaling Progress",
            description: `You've created ${entries2.length} journal entries so far. Each entry helps build your self-awareness.`,
            emoji: "\u{1F4DD}"
          });
        }
        const positiveEmotions = (moodFrequency2["happy"] || 0) + (moodFrequency2["calm"] || 0);
        const negativeEmotions = (moodFrequency2["sad"] || 0) + (moodFrequency2["frustrated"] || 0);
        if (positiveEmotions > negativeEmotions && positiveEmotions > 0) {
          insights2.push({
            title: "Positive Outlook",
            description: "Your entries show a tendency toward positive emotions, which can enhance resilience and creative thinking.",
            emoji: "\u2728"
          });
        } else if (negativeEmotions > positiveEmotions && negativeEmotions > 0) {
          insights2.push({
            title: "Emotional Processing",
            description: "You're processing some challenging emotions, which shows courage and self-awareness. Consider what small actions might shift your perspective.",
            emoji: "\u{1F331}"
          });
        }
        if (insights2.length < 3) {
          const randomInsights = [
            {
              title: "Reflection Tip",
              description: "Try journaling at the same time each day to build a consistent habit that sticks.",
              emoji: "\u23F0"
            },
            {
              title: "Self-Discovery",
              description: "Looking back at old journal entries can reveal patterns and growth you might not have noticed in the moment.",
              emoji: "\u{1F50D}"
            },
            {
              title: "Journaling Habit",
              description: "Even short journal entries of 2-3 sentences can provide valuable insights when reviewed over time.",
              emoji: "\u{1F4AB}"
            },
            {
              title: "Mood Patterns",
              description: "Your mood often follows patterns. Tracking it can help you identify triggers and make positive adjustments.",
              emoji: "\u{1F4CA}"
            }
          ];
          while (insights2.length < 3 && randomInsights.length > 0) {
            const randomIndex = Math.floor(Math.random() * randomInsights.length);
            insights2.push(randomInsights[randomIndex]);
            randomInsights.splice(randomIndex, 1);
          }
        }
        return insights2;
      };
      var generateMoodInsights = generateMoodInsights2;
      const entries = await storage.getJournalEntries(req.user.id);
      if (!entries || entries.length === 0) {
        return res.json({
          moodFrequency: {},
          dailyTrends: [],
          monthlyTrends: [],
          streaks: { current: 0, longest: 0 },
          insights: [
            {
              title: "Getting Started",
              description: "Welcome to your mood tracker! Start journaling to see patterns and insights about your emotional well-being.",
              emoji: "\u{1F44B}"
            },
            {
              title: "Mood Tracking",
              description: "Select a mood for each journal entry to build your personal mood pattern visualization.",
              emoji: "\u{1F4CA}"
            },
            {
              title: "Reflection Tip",
              description: "Even short journal entries of 2-3 sentences can provide valuable insights when reviewed over time.",
              emoji: "\u{1F4AB}"
            }
          ],
          entryCount: 0
        });
      }
      const moodFrequency = {};
      const dailyMoodMap = /* @__PURE__ */ new Map();
      const monthlyMoodMap = /* @__PURE__ */ new Map();
      const entriesByDate = /* @__PURE__ */ new Map();
      const sortedEntries = [...entries].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      for (const entry of entries) {
        const mood = entry.mood || "none";
        const createdAt = new Date(entry.createdAt);
        const dateStr = createdAt.toISOString().split("T")[0];
        const monthKey = dateStr.substring(0, 7);
        const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(createdAt);
        moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
        if (!dailyMoodMap.has(dateStr)) {
          dailyMoodMap.set(dateStr, /* @__PURE__ */ new Map());
        }
        const dailyMoods = dailyMoodMap.get(dateStr);
        dailyMoods.set(mood, (dailyMoods.get(mood) || 0) + 1);
        if (!monthlyMoodMap.has(monthKey)) {
          monthlyMoodMap.set(monthKey, /* @__PURE__ */ new Map());
        }
        const monthlyMoods = monthlyMoodMap.get(monthKey);
        monthlyMoods.set(mood, (monthlyMoods.get(mood) || 0) + 1);
        entriesByDate.set(dateStr, true);
      }
      const dailyTrends = Array.from(dailyMoodMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).flatMap(
        ([date, moods]) => Array.from(moods.entries()).map(([mood, count]) => ({
          date,
          mood,
          count
        }))
      );
      const monthlyTrends = Array.from(monthlyMoodMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([monthKey, moods]) => {
        const counts = {};
        let total = 0;
        moods.forEach((count, mood) => {
          counts[mood] = count;
          total += count;
        });
        const [year, month] = monthKey.split("-");
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric"
        }).format(new Date(parseInt(year), parseInt(month) - 1, 1));
        return {
          month: monthName,
          monthKey,
          counts,
          total
        };
      });
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const dates = Array.from(entriesByDate.keys()).sort(
        (a, b) => b.localeCompare(a)
      );
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (entriesByDate.has(today)) {
        currentStreak = 1;
        let prevDate = /* @__PURE__ */ new Date();
        for (let i = 1; i <= 365; i++) {
          prevDate.setDate(prevDate.getDate() - 1);
          const prevDateStr = prevDate.toISOString().split("T")[0];
          if (entriesByDate.has(prevDateStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      for (let i = 0; i < dates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const currDate = new Date(dates[i]);
          const prevDate = new Date(dates[i - 1]);
          const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
          const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }
      const insights = generateMoodInsights2(
        entries,
        moodFrequency,
        dailyTrends,
        monthlyTrends,
        { current: currentStreak, longest: longestStreak }
      );
      res.json({
        moodFrequency,
        dailyTrends,
        monthlyTrends,
        streaks: {
          current: currentStreak,
          longest: longestStreak
        },
        insights,
        entryCount: entries.length
      });
    } catch (error) {
      console.error("Error generating mood analytics:", error);
      res.status(500).json({ error: "Failed to generate mood analytics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/add-conversation-routes.ts
init_db();
init_schema();
init_venice_ai();
init_memory_service();
import { eq as eq3 } from "drizzle-orm";
function addConversationRoutes(app2) {
  app2.post("/api/conversation", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: "Please log in to chat with Flappy"
      });
    }
    try {
      const { message, createJournalEntry = false } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ message: "Message content is required" });
      }
      const userConversations = await db.select().from(conversations).where(eq3(conversations.userId, req.user.id)).orderBy(conversations.createdAt, "desc").limit(5);
      const conversationHistory = userConversations.map((conv) => ({
        userMessage: conv.userMessage,
        flappyResponse: conv.flappyResponse,
        timestamp: conv.createdAt
      }));
      const userMemories = await memoryService.getRelevantMemories(req.user.id, message, 3);
      const flappyResponse = await generateFlappyContent(
        "chatConversation",
        message,
        req.user,
        {
          conversationHistory,
          userMemories,
          shouldGenerateReflectionPrompt: true
        }
      );
      const [conversation] = await db.insert(conversations).values({
        userId: req.user.id,
        userMessage: message,
        flappyResponse: flappyResponse.content,
        conversationType: "chat",
        savedAsJournal: createJournalEntry,
        messageTags: extractTags3(message),
        mood: detectMood3(message),
        reflectionPrompt: flappyResponse.reflectionPrompt || null
      }).returning();
      return res.status(200).json({
        response: flappyResponse.content,
        reflectionPrompt: flappyResponse.reflectionPrompt,
        conversationId: conversation.id,
        success: true
      });
    } catch (error) {
      console.error("Error in conversation handler:", error);
      return res.status(500).json({
        message: "Failed to process conversation",
        success: false
      });
    }
  });
  app2.post("/api/direct-conversation", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { content, save_as_journal = false } = req.body;
      if (!content || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ message: "Message content is required" });
      }
      const flappyResponse = await generateFlappyContent(
        save_as_journal ? "journalResponse" : "emailConversation",
        req.user,
        content
      );
      console.log(`Generated response: ${flappyResponse.content.substring(0, 50)}...`);
      const tags = extractTags3(content);
      const mood = detectMood3(content);
      const [conversation] = await db.insert(conversations).values({
        userId: req.user.id,
        userMessage: content,
        flappyResponse: flappyResponse.content,
        conversationType: save_as_journal ? "journal" : "general",
        savedAsJournal: save_as_journal,
        messageTags: tags,
        mood
      }).returning();
      if (save_as_journal) {
        const [journalEntry] = await db.insert(journalEntries).values({
          userId: req.user.id,
          title: flappyResponse.subject || `Journal Entry ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
          content,
          mood,
          tags
        }).returning();
        await db.update(conversations).set({ journalEntryId: journalEntry.id }).where(eq3(conversations.id, conversation.id));
        conversation.journalEntryId = journalEntry.id;
      }
      return res.status(201).json(conversation);
    } catch (error) {
      console.error("Error in direct conversation handler:", error);
      return res.status(500).json({ message: "Failed to process conversation" });
    }
  });
  app2.get("/api/direct-conversation", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userConversations = await db.select().from(conversations).where(eq3(conversations.userId, req.user.id)).orderBy(conversations.createdAt, "desc");
      return res.json(userConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  app2.post("/api/direct-conversation/:id/save-journal", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const conversationId = parseInt(req.params.id);
      const [conversation] = await db.select().from(conversations).where(eq3(conversations.id, conversationId));
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      if (conversation.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (conversation.savedAsJournal) {
        return res.status(400).json({ message: "Conversation is already saved as a journal entry" });
      }
      const [journalEntry] = await db.insert(journalEntries).values({
        userId: req.user.id,
        title: `Conversation from ${new Date(conversation.createdAt).toLocaleDateString()}`,
        content: conversation.userMessage,
        mood: conversation.mood || void 0,
        tags: conversation.messageTags || []
      }).returning();
      const [updatedConversation] = await db.update(conversations).set({
        savedAsJournal: true,
        journalEntryId: journalEntry.id
      }).where(eq3(conversations.id, conversationId)).returning();
      return res.json(updatedConversation);
    } catch (error) {
      console.error("Error saving conversation as journal:", error);
      return res.status(500).json({ message: "Failed to save conversation as journal" });
    }
  });
}
function extractTags3(content) {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  if (!matches) return [];
  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))];
}
function detectMood3(content) {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("happy") || lowerContent.includes("joy") || lowerContent.includes("excited")) {
    return "happy";
  } else if (lowerContent.includes("calm") || lowerContent.includes("peaceful") || lowerContent.includes("relaxed")) {
    return "calm";
  } else if (lowerContent.includes("sad") || lowerContent.includes("unhappy") || lowerContent.includes("depressed")) {
    return "sad";
  } else if (lowerContent.includes("angry") || lowerContent.includes("frustrated") || lowerContent.includes("annoyed")) {
    return "frustrated";
  }
  return "neutral";
}

// server/email-processor.ts
init_storage();
import { simpleParser as simpleParser2 } from "mailparser";
var PROCESS_INTERVAL = 1e4;
var MAX_ATTEMPTS = 5;
var processedEmails = /* @__PURE__ */ new Set();
async function processQueuedEmail(queueItem) {
  try {
    console.log(`\u{1F4E8} Processing queued email ID: ${queueItem.id}`);
    await storage.markEmailProcessing(queueItem.id);
    const payload = queueItem.payload;
    console.log(`\u{1F4E6} Processing email with ID: ${queueItem.id}`);
    console.log(`\u{1F4E6} Payload type: ${typeof payload}`);
    const emailKey = generateEmailKey(queueItem);
    if (processedEmails.has(emailKey)) {
      console.log(`\u26A0\uFE0F Email already processed, skipping: ${emailKey}`);
      await storage.markEmailCompleted(queueItem.id);
      return true;
    }
    processedEmails.add(emailKey);
    if (payload && payload.rawMimeBase64) {
      console.log(`\u{1F50D} Processing payload with rawMimeBase64`);
      const buffer = Buffer.from(payload.rawMimeBase64, "base64");
      console.log(`\u{1F50D} Buffer size: ${buffer.length} bytes`);
      const bufferString = buffer.toString("utf8");
      if (bufferString.includes("Content-Disposition: form-data")) {
        console.log(`\u{1F50D} Detected multipart form data format`);
        console.log(`\u{1F50D} Multipart data preview: ${bufferString.substring(0, 500)}...`);
        const extracted = GmailContentParser.parseContent(bufferString);
        console.log(`\u{1F50D} Gmail parsing results:`);
        console.log(`   Sender: ${extracted.sender}`);
        console.log(`   Subject: ${extracted.subject}`);
        console.log(`   Content length: ${extracted.content.length} characters`);
        console.log(`   Content preview: ${extracted.content.substring(0, 100)}...`);
        console.log(`   In-Reply-To: ${extracted.inReplyTo || "none"}`);
        await emailService.processIncomingEmail(
          extracted.sender,
          extracted.subject,
          extracted.content,
          extracted.messageId,
          extracted.inReplyTo,
          extracted.references
        );
        await storage.markEmailCompleted(queueItem.id);
        return true;
      } else {
        const parsedEmail = await simpleParser2(buffer);
        await emailService.processIncomingEmail(
          parsedEmail.from?.text || "unknown@example.com",
          parsedEmail.subject || "No Subject",
          parsedEmail.text || parsedEmail.html || "",
          parsedEmail.messageId?.replace(/^<|>$/g, ""),
          parsedEmail.inReplyTo?.replace(/^<|>$/g, ""),
          parsedEmail.references ? Array.isArray(parsedEmail.references) ? parsedEmail.references.join(" ") : parsedEmail.references : void 0
        );
        await storage.markEmailCompleted(queueItem.id);
        return true;
      }
    } else if (payload && payload.buffer) {
      console.log(`\u{1F50D} Detected buffer payload format`);
      const buffer = Buffer.from(payload.buffer, "base64");
      console.log(`\u{1F50D} Buffer size: ${buffer.length} bytes`);
      await processRawEmail(buffer);
      await storage.markEmailCompleted(queueItem.id);
      return true;
    } else if (payload && payload.text && payload.from && payload.subject) {
      console.log(`\u{1F50D} Processing direct JSON payload`);
      await emailService.processIncomingEmail(
        payload.from,
        payload.subject,
        payload.text,
        payload.inReplyTo
      );
    } else if (typeof payload === "string") {
      console.log(`\u{1F50D} Processing string payload`);
      await processEmailFromText(payload);
    } else {
      console.warn(`\u26A0\uFE0F Unknown payload format:`, typeof payload);
      console.warn(`\u26A0\uFE0F Payload preview:`, JSON.stringify(payload).substring(0, 200));
      const from = extractField(payload, ["from", "sender", "email"]);
      const subject = extractField(payload, ["subject", "title"]);
      const text2 = extractField(payload, ["text", "body", "content", "message"]);
      if (from && text2) {
        console.log(`\u{1F50D} Extracted basic fields from unknown payload format`);
        await emailService.processIncomingEmail(from, subject || "No Subject", text2);
      } else {
        throw new Error(`Unable to process payload format: ${typeof payload}`);
      }
    }
    await storage.markEmailCompleted(queueItem.id);
    return true;
  } catch (error) {
    console.error(`\u274C Error processing queued email:`, error);
    await storage.markEmailFailed(queueItem.id, error.message);
    await storage.incrementEmailAttempts(queueItem.id);
    return false;
  }
}
async function processRawEmail(buffer) {
  try {
    const parsedEmail = await simpleParser2(buffer);
    const from = parsedEmail.from?.text || "unknown@example.com";
    const subject = parsedEmail.subject || "No Subject";
    const text2 = parsedEmail.text || parsedEmail.html || "";
    const inReplyTo = parsedEmail.inReplyTo || void 0;
    console.log(`\u{1F4E7} Parsed email from: ${from}, subject: ${subject}, content length: ${text2.length}`);
    await emailService.processIncomingEmail(from, subject, text2, inReplyTo);
  } catch (error) {
    console.error(`\u274C Error parsing raw email:`, error);
    throw error;
  }
}
async function processEmailFromText(text2) {
  try {
    const emailData = JSON.parse(text2);
    const from = emailData.from || emailData.sender || "unknown@example.com";
    const subject = emailData.subject || emailData.title || "No Subject";
    const content = emailData.text || emailData.body || emailData.content || "";
    const inReplyTo = emailData.inReplyTo || emailData["in-reply-to"] || void 0;
    await emailService.processIncomingEmail(from, subject, content, inReplyTo);
  } catch (error) {
    console.log(`\u{1F50D} Processing as raw email text`);
    await processRawEmail(Buffer.from(text2, "utf8"));
  }
}
async function processNextEmail() {
  try {
    const nextEmail = await storage.getNextPendingEmail();
    if (nextEmail) {
      if (nextEmail.processAttempts >= MAX_ATTEMPTS) {
        console.log(`\u26A0\uFE0F Email ${nextEmail.id} has exceeded maximum attempts (${MAX_ATTEMPTS}), marking as failed`);
        await storage.markEmailFailed(nextEmail.id, `Exceeded maximum attempts (${MAX_ATTEMPTS})`);
        return;
      }
      console.log(`\u{1F4E8} Processing next email in queue: ${nextEmail.id} (attempt ${nextEmail.processAttempts + 1})`);
      const success = await processQueuedEmail(nextEmail);
      if (success) {
        console.log(`\u2705 Successfully processed email ${nextEmail.id}`);
      } else {
        console.log(`\u274C Failed to process email ${nextEmail.id}`);
      }
    }
  } catch (error) {
    console.error(`\u274C Error in email processing cycle:`, error);
  }
}
function startEmailProcessor() {
  console.log(`\u{1F680} Starting email processing service...`);
  processNextEmail();
  setInterval(processNextEmail, PROCESS_INTERVAL);
}
function extractField(payload, keys) {
  for (const key of keys) {
    if (payload && payload[key]) {
      return payload[key];
    }
  }
  return "";
}
function generateEmailKey(queueItem) {
  const payload = queueItem.payload;
  const timestamp2 = queueItem.createdAt.getTime();
  let keyParts = [timestamp2.toString()];
  if (payload) {
    if (payload.from) keyParts.push(payload.from);
    if (payload.subject) keyParts.push(payload.subject);
    if (payload.messageId) keyParts.push(payload.messageId);
  }
  return keyParts.join("|");
}

// server/scheduler.ts
var CHECK_INTERVAL_MS = 15 * 60 * 1e3;
var lastSendDate = null;
async function checkAndSendDailyEmails() {
  const now = /* @__PURE__ */ new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const today = now.toISOString().split("T")[0];
  if (lastSendDate === today) {
    console.log(`\u{1F4C5} Daily emails already sent for ${today}, skipping check`);
    return;
  }
  if (currentHour === 11 && currentMinute < 15) {
    console.log(`\u{1F55A} It's around 11:00 AM - time to send daily inspiration emails!`);
    try {
      const result = await emailService.sendDailyInspiration();
      if (result.success) {
        console.log(`\u2705 Successfully sent ${result.count} daily inspiration emails`);
        lastSendDate = today;
      } else {
        console.error(`\u274C Failed to send daily inspiration emails`);
      }
    } catch (error) {
      console.error("Error sending daily inspiration emails:", error);
    }
  } else {
    console.log(`\u23F0 Current time: ${currentHour}:${currentMinute} - Not yet time to send daily emails (scheduled for ~11:00 AM)`);
  }
}
function startEmailScheduler() {
  console.log("\u{1F4C5} Starting email scheduler service...");
  setTimeout(() => {
    checkAndSendDailyEmails();
  }, 1e4);
  setInterval(checkAndSendDailyEmails, CHECK_INTERVAL_MS);
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use("/uploads", express3.static(path4.join(process.cwd(), "uploads")));
app.use("/images", express3.static(path4.join(process.cwd(), "public/images")));
app.use(express3.static(path4.join(process.cwd(), "public")));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  addConversationRoutes(app);
  startEmailProcessor();
  startEmailScheduler();
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

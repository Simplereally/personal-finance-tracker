import {
  capsule,
  string,
  number,
  table,
  id,
  userId,
  query,
  mutation,
  type QueryServerContext,
  type ServerContext,
  type ReadDatabaseOf,
  type WriteDatabaseOf,
} from "lakebed/server";
import {
  CATEGORIES,
  cleanText,
  normalizeEmail,
  validatePassword,
  validateAmount,
  validateMonth,
  validateTransaction,
  summarize,
  type TransactionInput,
  type Transaction,
} from "../shared/finance";
import { newSalt, hashPassword, constantTimeEqual } from "./password";

const schema = {
  accounts: table({
    email: string(),
    name: string(),
    passwordHash: string(),
    salt: string(),
    currency: string().default("AUD"),
    monthlyBudget: number().default(0),
  }).index("by_email", ["email"]),
  sessions: table({
    browserId: userId(),
    accountId: id("accounts"),
    expiresAt: number(),
  })
    .index("by_browser", ["browserId"])
    .index("by_account", ["accountId"]),
  attempts: table({
    key: string(),
    startedAt: number(),
    count: number(),
  }).index("by_key", ["key"]),
  transactions: table({
    ownerId: id("accounts"),
    amount: number(),
    kind: string(),
    description: string(),
    category: string(),
    date: string(),
    note: string().default(""),
  })
    .index("by_owner_date", ["ownerId", "date"])
    .index("by_owner_category", ["ownerId", "category"]),
  categories: table({
    ownerId: id("accounts"),
    name: string(),
    nameKey: string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_name", ["ownerId", "nameKey"]),
  budgets: table({
    ownerId: id("accounts"),
    category: string(),
    amount: number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_category", ["ownerId", "category"]),
  goals: table({
    ownerId: id("accounts"),
    name: string(),
    target: number(),
    saved: number(),
    emoji: string(),
  }).index("by_owner", ["ownerId"]),
};
type ReadContext = QueryServerContext<
  ReadDatabaseOf<{ schema: typeof schema }>
>;
type WriteContext = ServerContext<WriteDatabaseOf<{ schema: typeof schema }>>;
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;
type Context = ReadContext | WriteContext;
async function findAccount(ctx: Context) {
  const { userId } = ctx.auth.requireIdentity();
  const session = await ctx.db.sessions
    .withIndex("by_browser", (q) => q.eq("browserId", userId))
    .first();
  const account =
    session && session.expiresAt > Date.now()
      ? await ctx.db.accounts.get(session.accountId)
      : null;
  return account;
}
async function accountFor(ctx: Context) {
  const account = await findAccount(ctx);
  if (!account) throw new Error("Please sign in to continue.");
  return account;
}
function publicProfile(account: {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyBudget: number;
}) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    currency: account.currency,
    monthlyBudget: account.monthlyBudget,
  };
}
async function bindSession(ctx: WriteContext, accountId: string) {
  const { userId } = ctx.auth.requireIdentity();
  const existing = await ctx.db.sessions
    .withIndex("by_browser", (q) => q.eq("browserId", userId))
    .first();
  if (existing)
    await ctx.db.sessions.update(existing.id, {
      accountId,
      expiresAt: Date.now() + SESSION_MS,
    });
  else
    await ctx.db.sessions.insert({
      browserId: userId,
      accountId,
      expiresAt: Date.now() + SESSION_MS,
    });
  const sessions = await ctx.db.sessions
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .order("desc")
    .take(30);
  for (const session of sessions
    .filter((s) => s.browserId !== userId)
    .slice(19))
    await ctx.db.sessions.delete(session.id);
}
// Return failures rather than throw after updating a throttle: thrown mutations roll back.
async function throttle(ctx: WriteContext, key: string, limit: number) {
  const entry = await ctx.db.attempts
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();
  const now = Date.now();
  if (entry && now - entry.startedAt < 15 * 60 * 1000) {
    if (entry.count >= limit) return false;
    await ctx.db.attempts.update(entry.id, { count: entry.count + 1 });
  } else if (entry)
    await ctx.db.attempts.update(entry.id, { startedAt: now, count: 1 });
  else await ctx.db.attempts.insert({ key, startedAt: now, count: 1 });
  return true;
}
async function owned(
  ctx: Context,
  tableName: "transactions" | "goals" | "budgets" | "categories",
  rowId: string,
) {
  const account = await accountFor(ctx);
  const row = await ctx.db[tableName].get(rowId);
  if (!row || row.ownerId !== account.id)
    throw new Error("This item is no longer available.");
  return row;
}

export default capsule({
  name: "Petal",
  favicon: "./client/favicon.svg",
  schema,
  queries: {
    me: query(async (ctx: ReadContext) => {
      const account = await findAccount(ctx);
      return account ? publicProfile(account) : null;
    }),
    overview: query(async (ctx: ReadContext, month: string) => {
      validateMonth(month);
      const account = await accountFor(ctx);
      const result = await ctx.db.transactions
        .withIndex("by_owner_date", (q) =>
          q
            .eq("ownerId", account.id)
            .gte("date", month + "-01")
            .lte("date", month + "-31"),
        )
        .order("desc")
        .take(901);
      if (result.length > 900)
        throw new Error(
          "This month exceeds the 900 transaction limit. Export a backup or choose another month.",
        );
      return summarize(result as Transaction[], month);
    }),
    transactions: query(async (ctx: ReadContext, month: string) => {
      validateMonth(month);
      const account = await accountFor(ctx);
      return ctx.db.transactions
        .withIndex("by_owner_date", (q) =>
          q
            .eq("ownerId", account.id)
            .gte("date", month + "-01")
            .lte("date", month + "-31"),
        )
        .order("desc")
        .take(900);
    }),
    goals: query(async (ctx: ReadContext) => {
      const account = await accountFor(ctx);
      return ctx.db.goals
        .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
        .take(20);
    }),
    budgets: query(async (ctx: ReadContext) => {
      const account = await accountFor(ctx);
      return ctx.db.budgets
        .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
        .take(32);
    }),
    categories: query(async (ctx: ReadContext) => {
      const account = await accountFor(ctx);
      const rows = await ctx.db.categories
        .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
        .take(24);
      return rows.map((row) => ({ id: row.id, name: row.name }));
    }),
  },
  mutations: {
    signUp: mutation(
      async (
        ctx: WriteContext,
        input: { name: string; email: string; password: string },
      ) => {
        const { userId } = ctx.auth.requireIdentity();
        const name = cleanText(input.name, "name", 50);
        const email = normalizeEmail(input.email);
        const password = validatePassword(input.password);
        if (!(await throttle(ctx, "signup:" + userId, 5)))
          return {
            error: "Too many attempts. Please try again in 15 minutes.",
          };
        const existing = await ctx.db.accounts
          .withIndex("by_email", (q) => q.eq("email", email))
          .first();
        if (existing)
          return {
            error: "An account with that email already exists. Try signing in.",
          };
        const salt = newSalt();
        const passwordHash = await hashPassword(password, salt);
        const account = await ctx.db.accounts.insert({
          email,
          name,
          salt,
          passwordHash,
          currency: "AUD",
          monthlyBudget: 0,
        });
        await bindSession(ctx, account.id);
        return { profile: publicProfile(account) };
      },
    ),
    signIn: mutation(
      async (ctx: WriteContext, input: { email: string; password: string }) => {
        const { userId } = ctx.auth.requireIdentity();
        const email = normalizeEmail(input.email);
        const password = validatePassword(input.password);
        const browserAllowed = await throttle(ctx, "login:" + userId, 12);
        const emailAllowed = await throttle(ctx, "email:" + email, 30);
        if (!browserAllowed || !emailAllowed)
          return {
            error: "Too many attempts. Please try again in 15 minutes.",
          };
        const account = await ctx.db.accounts
          .withIndex("by_email", (q) => q.eq("email", email))
          .first();
        const candidate = await hashPassword(
          password,
          account?.salt ?? "00000000000000000000000000000000",
        );
        if (!account || !constantTimeEqual(candidate, account.passwordHash))
          return { error: "That email and password don’t match." };
        await bindSession(ctx, account.id);
        return { profile: publicProfile(account) };
      },
    ),
    signOut: mutation(async (ctx: WriteContext) => {
      const { userId } = ctx.auth.requireIdentity();
      const session = await ctx.db.sessions
        .withIndex("by_browser", (q) => q.eq("browserId", userId))
        .first();
      if (session) await ctx.db.sessions.delete(session.id);
    }),
    saveTransaction: mutation(
      async (ctx: WriteContext, input: TransactionInput, rowId?: string) => {
        const account = await accountFor(ctx);
        const categories = await ctx.db.categories
          .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
          .take(24);
        const value = validateTransaction(
          input,
          categories.map((category) => category.name),
        );
        if (rowId) {
          await owned(ctx, "transactions", rowId);
          const existing = await ctx.db.transactions.get(rowId);
          if (!existing)
            throw new Error("This transaction is no longer available.");
          if (existing.date.slice(0, 7) !== value.date.slice(0, 7)) {
            const month = value.date.slice(0, 7);
            const count = await ctx.db.transactions
              .withIndex("by_owner_date", (q) =>
                q
                  .eq("ownerId", account.id)
                  .gte("date", month + "-01")
                  .lte("date", month + "-31"),
              )
              .count();
            if (count >= 900)
              throw new Error(
                "This month has reached the 900 transaction limit.",
              );
          }
          await ctx.db.transactions.update(rowId, value);
        } else {
          const month = value.date.slice(0, 7);
          const count = await ctx.db.transactions
            .withIndex("by_owner_date", (q) =>
              q
                .eq("ownerId", account.id)
                .gte("date", month + "-01")
                .lte("date", month + "-31"),
            )
            .count();
          if (count >= 900)
            throw new Error(
              "This month has reached the 900 transaction limit.",
            );
          await ctx.db.transactions.insert({ ...value, ownerId: account.id });
        }
      },
    ),
    deleteTransaction: mutation(async (ctx: WriteContext, rowId: string) => {
      await owned(ctx, "transactions", rowId);
      await ctx.db.transactions.delete(rowId);
    }),
    saveBudget: mutation(
      async (ctx: WriteContext, category: string, amount: number) => {
        const account = await accountFor(ctx);
        validateAmount(amount, true);
        const custom = await ctx.db.categories
          .withIndex("by_owner_name", (q) =>
            q.eq("ownerId", account.id).eq("nameKey", category.toLowerCase()),
          )
          .first();
        if (
          !CATEGORIES.some((c) => c.name === category && c.name !== "Income") &&
          custom?.name !== category
        )
          throw new Error("Choose an expense category.");
        const existing = await ctx.db.budgets
          .withIndex("by_owner_category", (q) =>
            q.eq("ownerId", account.id).eq("category", category),
          )
          .first();
        if (existing && !amount) await ctx.db.budgets.delete(existing.id);
        else if (existing) await ctx.db.budgets.update(existing.id, { amount });
        else if (amount)
          await ctx.db.budgets.insert({
            ownerId: account.id,
            category,
            amount,
          });
      },
    ),
    createCategory: mutation(async (ctx: WriteContext, input: string) => {
      const account = await accountFor(ctx);
      const name = cleanText(input, "category name", 40);
      const nameKey = name.toLowerCase();
      const existing = await ctx.db.categories
        .withIndex("by_owner_name", (q) =>
          q.eq("ownerId", account.id).eq("nameKey", nameKey),
        )
        .first();
      if (existing || CATEGORIES.some((c) => c.name.toLowerCase() === nameKey))
        throw new Error("You already have a category with that name.");
      if (
        (await ctx.db.categories
          .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
          .count()) >= 24
      )
        throw new Error("You can add up to 24 personal categories.");
      await ctx.db.categories.insert({ ownerId: account.id, name, nameKey });
    }),
    deleteCategory: mutation(async (ctx: WriteContext, rowId: string) => {
      const account = await accountFor(ctx);
      await owned(ctx, "categories", rowId);
      const category = await ctx.db.categories.get(rowId);
      if (!category) throw new Error("This category is no longer available.");
      const used = await ctx.db.transactions
        .withIndex("by_owner_category", (q) =>
          q.eq("ownerId", account.id).eq("category", category.name),
        )
        .first();
      if (used)
        throw new Error(
          "This category has transactions. Reassign them before removing it.",
        );
      const budget = await ctx.db.budgets
        .withIndex("by_owner_category", (q) =>
          q.eq("ownerId", account.id).eq("category", category.name),
        )
        .first();
      if (budget) await ctx.db.budgets.delete(budget.id);
      await ctx.db.categories.delete(rowId);
    }),
    saveGoal: mutation(
      async (
        ctx: WriteContext,
        input: { name: string; target: number; saved: number; emoji: string },
        rowId?: string,
      ) => {
        const account = await accountFor(ctx);
        const name = cleanText(input.name, "goal name", 60);
        validateAmount(input.target);
        validateAmount(input.saved, true);
        if (
          !["✈️", "🏡", "🌷", "🛍️", "☀️", "💻", "🧘", "✨"].includes(
            input.emoji,
          )
        )
          throw new Error("Choose a goal icon.");
        const value = {
          name,
          target: input.target,
          saved: input.saved,
          emoji: input.emoji,
        };
        if (rowId) {
          await owned(ctx, "goals", rowId);
          await ctx.db.goals.update(rowId, value);
        } else {
          const count = await ctx.db.goals
            .withIndex("by_owner", (q) => q.eq("ownerId", account.id))
            .count();
          if (count >= 20)
            throw new Error("You can keep up to 20 savings goals.");
          await ctx.db.goals.insert({ ...value, ownerId: account.id });
        }
      },
    ),
    deleteGoal: mutation(async (ctx: WriteContext, rowId: string) => {
      await owned(ctx, "goals", rowId);
      await ctx.db.goals.delete(rowId);
    }),
    saveProfile: mutation(
      async (
        ctx: WriteContext,
        input: { name: string; currency: string; monthlyBudget: number },
      ) => {
        const account = await accountFor(ctx);
        const name = cleanText(input.name, "name", 50);
        if (
          !["AUD", "USD", "GBP", "EUR", "NZD", "CAD"].includes(input.currency)
        )
          throw new Error("Choose a supported currency.");
        validateAmount(input.monthlyBudget, true);
        await ctx.db.accounts.update(account.id, {
          name,
          currency: input.currency,
          monthlyBudget: input.monthlyBudget,
        });
      },
    ),
    changePassword: mutation(
      async (
        ctx: WriteContext,
        currentPassword: string,
        newPassword: string,
      ) => {
        const account = await accountFor(ctx);
        validatePassword(currentPassword);
        validatePassword(newPassword);
        if (!(await throttle(ctx, "password:" + account.id, 5)))
          return {
            error: "Too many attempts. Please try again in 15 minutes.",
          };
        const candidate = await hashPassword(currentPassword, account.salt);
        if (!constantTimeEqual(candidate, account.passwordHash))
          return { error: "Your current password doesn’t match." };
        const salt = newSalt();
        await ctx.db.accounts.update(account.id, {
          salt,
          passwordHash: await hashPassword(newPassword, salt),
        });
        const { userId } = ctx.auth.requireIdentity();
        const sessions = await ctx.db.sessions
          .withIndex("by_account", (q) => q.eq("accountId", account.id))
          .take(100);
        for (const session of sessions)
          if (session.browserId !== userId)
            await ctx.db.sessions.delete(session.id);
        return { success: true };
      },
    ),
  },
});

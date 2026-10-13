export const CATEGORIES = [
  { name: "Food & coffee", icon: "coffee", color: "#c9788b", tint: "#f9e7eb" },
  { name: "Shopping", icon: "bag", color: "#a88ba9", tint: "#f0e9f2" },
  { name: "Home & bills", icon: "home", color: "#c9a574", tint: "#f7efdf" },
  { name: "Transport", icon: "car", color: "#80a6a0", tint: "#e6f1ed" },
  { name: "Health & care", icon: "heart", color: "#b393a1", tint: "#f1e8ed" },
  { name: "Fun & travel", icon: "sun", color: "#d8a084", tint: "#faede3" },
  { name: "Income", icon: "income", color: "#729b85", tint: "#e6f1e8" },
  { name: "Other", icon: "dots", color: "#9d9994", tint: "#eeece9" },
] as const;

export type Transaction = {
  id: string;
  amount: number; // Positive integer cents; direction is explicit.
  kind: "expense" | "income";
  description: string;
  category: string;
  date: string;
  note: string;
};
export type TransactionInput = Omit<Transaction, "id">;
export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
};
export type Budget = { id: string; category: string; amount: number };
export type Profile = {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyBudget: number;
};
export type Summary = {
  income: number;
  expenses: number;
  balance: number;
  categories: { name: string; amount: number }[];
  daily: number[];
};

export function cleanText(value: unknown, label: string, max = 120): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > max ||
    Array.from(value).some((char) => char.charCodeAt(0) < 32)
  ) {
    throw new Error(
      `Enter a valid ${label.toLowerCase()} (up to ${max} characters).`,
    );
  }
  return value.trim();
}
export function normalizeEmail(value: unknown): string {
  const email = cleanText(value, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Enter a valid email address.");
  return email;
}
export function validatePassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 10 || value.length > 128) {
    throw new Error("Use a password with 10 to 128 characters.");
  }
  return value;
}
export function cents(value: unknown, allowZero = false): number {
  if (
    typeof value !== "string" ||
    !/^\d{1,9}(\.\d{1,2})?$/.test(value.trim())
  ) {
    throw new Error("Enter an amount with up to two decimal places.");
  }
  const [whole, fraction = ""] = value.trim().split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  validateAmount(amount, allowZero);
  return amount;
}
export function validateAmount(
  value: unknown,
  allowZero = false,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < (allowZero ? 0 : 1) ||
    value > 99_999_999_999
  ) {
    throw new Error("Enter a valid positive amount.");
  }
}
export function validateDate(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < "1900-01-01" ||
    value > "2200-12-31"
  ) {
    throw new Error("Choose a valid date.");
  }
  const date = new Date(value + "T00:00:00Z");
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  )
    throw new Error("Choose a valid date.");
  return value;
}
export function validateMonth(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(value) ||
    value < "1900-01" ||
    value > "2200-12"
  ) {
    throw new Error("Choose a valid month.");
  }
  return value;
}
export function validateTransaction(
  value: TransactionInput,
  customCategories: string[] = [],
): TransactionInput {
  if (!value || typeof value !== "object")
    throw new Error("Enter the transaction details.");
  validateAmount(value.amount);
  if (value.kind !== "expense" && value.kind !== "income")
    throw new Error("Choose income or expense.");
  if (
    !CATEGORIES.some((category) => category.name === value.category) &&
    !customCategories.includes(value.category)
  )
    throw new Error("Choose a category.");
  if (typeof value.note !== "string" || value.note.length > 500)
    throw new Error("Keep your note under 500 characters.");
  return {
    amount: value.amount,
    kind: value.kind,
    description: cleanText(value.description, "description"),
    category: value.category,
    date: validateDate(value.date),
    note: value.note.trim(),
  };
}
export function summarize(transactions: Transaction[], month: string): Summary {
  validateMonth(month);
  const [year, monthNumber] = month.split("-").map(Number);
  const daily = Array.from(
    { length: new Date(year, monthNumber, 0).getDate() },
    () => 0,
  );
  let income = 0;
  let expenses = 0;
  const categories = new Map<string, number>();
  for (const transaction of transactions) {
    if (!transaction.date.startsWith(month)) continue;
    if (transaction.kind === "income") income += transaction.amount;
    else {
      expenses += transaction.amount;
      categories.set(
        transaction.category,
        (categories.get(transaction.category) ?? 0) + transaction.amount,
      );
      daily[Number(transaction.date.slice(8)) - 1] += transaction.amount;
    }
  }
  return {
    income,
    expenses,
    balance: income - expenses,
    categories: [...categories]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount),
    daily,
  };
}
export function money(
  amount: number,
  currency = "AUD",
  compact = false,
): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(amount / 100);
}
export function dateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
  }).format(new Date(date + "T12:00:00"));
}
export function localDate(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function moveMonth(month: string, delta: number): string {
  const [year, number] = month.split("-").map(Number);
  const date = new Date(year, number - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
export function csv(transactions: Transaction[], currency: string): string {
  const escape = (value: string) =>
    `"${(/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
  return [
    ["Date", "Description", "Category", "Type", `Amount (${currency})`, "Note"],
    ...transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.kind,
      (t.amount / 100).toFixed(2),
      t.note,
    ]),
  ]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}

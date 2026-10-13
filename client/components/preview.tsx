import { useState } from "preact/hooks";
import { useNavigate } from "lakebed/client";
import {
  CATEGORIES,
  summarize,
  localDate,
  type Profile,
  type Transaction,
  type Goal,
  type Budget,
} from "../../shared/finance";
import type { Actions } from "../types";
import { Workspace } from "./workspace";
export function Preview() {
  const [month, setMonth] = useState(localDate().slice(0, 7));
  const initialMonth = localDate().slice(0, 7);
  const [profile, setProfile] = useState<Profile>({
    id: "preview",
    name: "Sophie",
    email: "sophie@example.com",
    currency: "AUD",
    monthlyBudget: 250000,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "p1",
      date: initialMonth + "-01",
      description: "Payday",
      category: "Income",
      kind: "income",
      amount: 425000,
      note: "",
    },
    {
      id: "p2",
      date: initialMonth + "-02",
      description: "Rent",
      category: "Home & bills",
      kind: "expense",
      amount: 120000,
      note: "",
    },
    {
      id: "p3",
      date: initialMonth + "-03",
      description: "Weekly groceries",
      category: "Food & coffee",
      kind: "expense",
      amount: 8240,
      note: "",
    },
    {
      id: "p4",
      date: initialMonth + "-05",
      description: "A little wardrobe refresh",
      category: "Shopping",
      kind: "expense",
      amount: 12900,
      note: "",
    },
    {
      id: "p5",
      date: initialMonth + "-07",
      description: "Pilates",
      category: "Health & care",
      kind: "expense",
      amount: 3500,
      note: "",
    },
    {
      id: "p6",
      date: initialMonth + "-08",
      description: "Dinner with the girls",
      category: "Food & coffee",
      kind: "expense",
      amount: 6850,
      note: "",
    },
    {
      id: "p7",
      date: initialMonth + "-10",
      description: "Weekend train",
      category: "Transport",
      kind: "expense",
      amount: 1120,
      note: "",
    },
    {
      id: "p8",
      date: initialMonth + "-11",
      description: "Sunday at the flower market",
      category: "Shopping",
      kind: "expense",
      amount: 2400,
      note: "",
    },
    {
      id: "p9",
      date: initialMonth + "-12",
      description: "Morning coffee",
      category: "Food & coffee",
      kind: "expense",
      amount: 650,
      note: "",
    },
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "g1",
      name: "A summer in Italy",
      emoji: "☀️",
      target: 400000,
      saved: 245000,
    },
    {
      id: "g2",
      name: "My rainy-day fund",
      emoji: "🌷",
      target: 500000,
      saved: 180000,
    },
  ]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "b1", category: "Food & coffee", amount: 45000 },
    { id: "b2", category: "Shopping", amount: 30000 },
    { id: "b3", category: "Home & bills", amount: 150000 },
  ]);
  const navigate = useNavigate();
  const [customCategories, setCustomCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const actions: Actions = {
    saveTransaction: async (input, id) =>
      setTransactions((rows) =>
        id
          ? rows.map((r) => (r.id === id ? { ...input, id } : r))
          : [...rows, { ...input, id: crypto.randomUUID() }],
      ),
    deleteTransaction: async (id) =>
      setTransactions((rows) => rows.filter((r) => r.id !== id)),
    saveGoal: async (input, id) =>
      setGoals((rows) =>
        id
          ? rows.map((r) => (r.id === id ? { ...input, id } : r))
          : [...rows, { ...input, id: crypto.randomUUID() }],
      ),
    deleteGoal: async (id) =>
      setGoals((rows) => rows.filter((r) => r.id !== id)),
    saveBudget: async (category, amount) =>
      setBudgets((rows) => [
        ...rows.filter((r) => r.category !== category),
        ...(amount ? [{ category, amount, id: category }] : []),
      ]),
    saveProfile: async (input) => setProfile((p) => ({ ...p, ...input })),
    changePassword: async () => ({
      error: "Create an account to set your own password.",
    }),
    signOut: async () => navigate("/login"),
    createCategory: async (name) => {
      if (
        !name.trim() ||
        [
          ...CATEGORIES.map((c) => c.name),
          ...customCategories.map((c) => c.name),
        ].some((c) => c.toLowerCase() === name.trim().toLowerCase())
      )
        throw new Error("Choose a new category name.");
      setCustomCategories((rows) => [
        ...rows,
        { id: crypto.randomUUID(), name: name.trim() },
      ]);
    },
    deleteCategory: async (id) => {
      const category = customCategories.find((c) => c.id === id);
      if (transactions.some((t) => t.category === category?.name))
        throw new Error(
          "This category has transactions. Reassign them before removing it.",
        );
      setCustomCategories((rows) => rows.filter((c) => c.id !== id));
      setBudgets((rows) => rows.filter((b) => b.category !== category?.name));
    },
  };
  return (
    <Workspace
      customCategories={customCategories}
      preview
      profile={profile}
      month={month}
      setMonth={setMonth}
      summary={summarize(transactions, month)}
      transactions={transactions
        .filter((t) => t.date.startsWith(month))
        .sort((a, b) => b.date.localeCompare(a.date))}
      goals={goals}
      budgets={budgets}
      actions={actions}
    />
  );
}

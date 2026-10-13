import { useState } from "preact/hooks";
import {
  CATEGORIES,
  cents,
  money,
  localDate,
  dateLabel,
  transactionShortcuts,
  type Transaction,
  type TransactionInput,
  type Goal,
  type Profile,
} from "../../shared/finance";
import { Button, Field, Input, Select, Spinner, inputClass } from "./ui";
import { Icon } from "./icons";
import { displayFont } from "../styles";

export function FormError({ error }: { error: string }) {
  return error ? (
    <p
      role="alert"
      className="rounded-xl bg-[#fbe9ea] px-4 py-3 text-sm leading-6 text-[#9d3349]"
    >
      {error}
    </p>
  ) : null;
}
export function TransactionForm({
  transaction,
  onSave,
  onDelete,
  currency = "AUD",
  customCategories = [],
  recentTransactions = [],
  initial,
  defaultDate = localDate(),
}: {
  customCategories?: string[];
  currency?: string;
  transaction?: Transaction;
  recentTransactions?: Transaction[];
  initial?: Partial<TransactionInput>;
  defaultDate?: string;
  onSave: (value: TransactionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [kind, setKind] = useState(
    transaction?.kind ?? initial?.kind ?? "expense",
  );
  const [description, setDescription] = useState(
    transaction?.description ?? initial?.description ?? "",
  );
  const [category, setCategory] = useState(
    transaction?.category ??
      initial?.category ??
      (initial?.kind === "income" ? "Income" : "Food & coffee"),
  );
  const [date, setDate] = useState(transaction?.date ?? defaultDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const shortcuts = transactionShortcuts(recentTransactions);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget as HTMLFormElement);
    try {
      await onSave({
        kind,
        amount: cents(String(data.get("amount"))),
        description,
        category,
        date,
        note: String(data.get("note") ?? ""),
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn’t save this transaction. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-5">
      <div
        className="grid grid-cols-2 gap-1 rounded-xl bg-[#f2ece9] p-1"
        aria-label="Transaction type"
      >
        {(["expense", "income"] as const).map((value) => (
          <button
            key={value}
            type="button"
            disabled={busy}
            aria-pressed={kind === value}
            onClick={() => {
              setKind(value);
              setCategory(value === "income" ? "Income" : "Food & coffee");
            }}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#a3637b] ${kind === value ? "bg-white text-[#743d54] shadow-sm" : "text-[#79656c]"}`}
          >
            <Icon name={value} size={16} />
            {value === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>
      <Field label="Amount">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-4 text-2xl text-[#9d7b89]"
            style={displayFont}
          >
            {money(0, currency).replace(/[0-9.,\s]/g, "")}
          </span>
          <Input
            name="amount"
            inputMode="decimal"
            placeholder="0.00"
            required
            autoFocus
            disabled={busy}
            className="min-h-[76px]! pl-10! text-[42px]! leading-none! tracking-[-0.03em]"
            style={displayFont}
            defaultValue={
              transaction ? (transaction.amount / 100).toFixed(2) : ""
            }
          />
        </div>
      </Field>
      {!transaction && shortcuts.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          aria-label="Use a recent description"
        >
          {shortcuts.map((row) => (
            <button
              key={row.id}
              type="button"
              disabled={busy}
              onClick={() => {
                setDescription(row.description);
                setCategory(row.category);
                setKind(row.kind);
              }}
              className="max-w-full truncate rounded-full border border-[#e6d9dd] bg-[#fbf5f5] px-3 py-2 text-xs text-[#775565] hover:bg-[#f0e3e8] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
            >
              {row.description}
            </button>
          ))}
        </div>
      )}
      <Field label="Description">
        <Input
          name="description"
          required
          disabled={busy}
          maxLength={120}
          placeholder={
            kind === "expense"
              ? "Coffee, groceries, a night out…"
              : "Salary, a gift, a refund…"
          }
          value={description}
          onInput={(event) => setDescription(event.currentTarget.value)}
        />
      </Field>
      <Field label="Category">
        <Select
          name="category"
          disabled={busy}
          value={category}
          onChange={(event) => setCategory(event.currentTarget.value)}
        >
          {[...CATEGORIES.map((c) => c.name), ...customCategories].map(
            (name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ),
          )}
        </Select>
      </Field>
      <details
        open={Boolean(transaction?.note)}
        className="rounded-xl border border-[#e8e0dc] bg-[#fcf9f6] p-4"
      >
        <summary className="cursor-pointer text-xs font-medium text-[#79656c]">
          {dateLabel(date)} · Date & note
        </summary>
        <div className="mt-4 space-y-4">
          <Field label="Date">
            <Input
              name="date"
              disabled={busy}
              type="date"
              min="1900-01-01"
              max="2200-12-31"
              required
              value={date}
              onChange={(event) => {
                if (event.currentTarget.value)
                  setDate(event.currentTarget.value);
              }}
            />
          </Field>
          <Field label="Note (optional)">
            <textarea
              aria-label="Note (optional)"
              name="note"
              disabled={busy}
              rows={2}
              maxLength={500}
              placeholder="Anything to remember"
              className={`${inputClass} resize-y`}
              defaultValue={transaction?.note}
            />
          </Field>
        </div>
      </details>
      <FormError error={error} />
      <div className="flex flex-wrap justify-between gap-3 pt-1">
        {onDelete ? (
          <Button
            variant="ghost"
            disabled={busy}
            className="text-[#a7394d]!"
            onClick={() => setConfirmDelete(!confirmDelete)}
          >
            <Icon name="trash" size={17} />
            {confirmDelete ? "Keep transaction" : "Delete"}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={busy}>
          {busy ? (
            <Spinner label="Saving" />
          ) : transaction ? (
            "Save changes"
          ) : (
            "Save transaction"
          )}
          <Icon name="check" size={16} />
        </Button>
      </div>
      {confirmDelete && (
        <div className="rounded-xl border border-[#e9c6ce] bg-[#fceff0] p-4">
          <p className="mb-3 text-sm">
            Delete this transaction? This can’t be undone.
          </p>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onDelete?.();
              } catch (e) {
                setError(String(e));
                setBusy(false);
              }
            }}
          >
            Delete transaction
          </Button>
        </div>
      )}
    </form>
  );
}
export function GoalForm({
  goal,
  onSave,
  onDelete,
}: {
  goal?: Goal;
  onSave: (value: Omit<Goal, "id">) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [emoji, setEmoji] = useState(goal?.emoji ?? "✈️");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget as HTMLFormElement);
        try {
          await onSave({
            name: String(data.get("name")),
            target: cents(String(data.get("target"))),
            saved: cents(String(data.get("saved")), true),
            emoji,
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Couldn’t save your goal.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex flex-wrap gap-2" aria-label="Goal icon">
        {["✈️", "🏡", "🌷", "🛍️", "☀️", "💻", "🧘", "✨"].map((value) => (
          <button
            type="button"
            aria-label={`Choose ${value}`}
            aria-pressed={emoji === value}
            onClick={() => setEmoji(value)}
            className={`flex size-11 items-center justify-center rounded-xl border text-xl focus-visible:outline-2 focus-visible:outline-[#a3637b] ${emoji === value ? "border-[#b87b92] bg-[#f5e8ec]" : "border-[#e9e1dc] bg-white"}`}
          >
            {value}
          </button>
        ))}
      </div>
      <Field label="What are you saving for?">
        <Input
          name="name"
          required
          maxLength={60}
          placeholder="e.g. A summer in Italy"
          defaultValue={goal?.name}
          autoFocus
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Target amount">
          <Input
            name="target"
            required
            inputMode="decimal"
            placeholder="3000.00"
            defaultValue={goal ? (goal.target / 100).toFixed(2) : ""}
          />
        </Field>
        <Field label="Saved so far">
          <Input
            name="saved"
            required
            inputMode="decimal"
            defaultValue={goal ? (goal.saved / 100).toFixed(2) : "0.00"}
          />
        </Field>
      </div>
      <FormError error={error} />
      <div className="flex justify-between gap-3">
        {onDelete ? (
          <Button
            variant="ghost"
            className="text-[#a7394d]!"
            onClick={() => setConfirmDelete(!confirmDelete)}
          >
            Delete goal
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={busy}>
          {busy ? <Spinner label="Saving" /> : "Save goal"}
        </Button>
      </div>
      {confirmDelete && (
        <div className="rounded-xl bg-[#fbe9ea] p-4">
          <p className="mb-3 text-sm">
            Delete this goal? This can’t be undone.
          </p>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onDelete?.();
              } catch (e) {
                setError(String(e));
                setBusy(false);
              }
            }}
          >
            Delete goal
          </Button>
        </div>
      )}
    </form>
  );
}
export function BudgetForm({
  category,
  categories,
  amount,
  currency = "AUD",
  onSave,
}: {
  category: string;
  categories?: string[];
  amount?: number;
  currency?: string;
  onSave: (amount: number, category: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget);
        try {
          await onSave(
            cents(String(data.get("amount")), true),
            String(data.get("category") ?? category),
          );
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Couldn’t save your budget.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {categories && (
        <Field label="Category">
          <Select name="category" defaultValue={category}>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field
        label={`Monthly limit (${currency})`}
        hint={
          category === "Monthly spending"
            ? "Applies each month. Use 0 to turn off your spending limit."
            : "Use 0 to remove this category’s budget."
        }
      >
        <Input
          name="amount"
          inputMode="decimal"
          defaultValue={amount ? (amount / 100).toFixed(2) : ""}
          required
          placeholder="0.00"
          autoFocus
        />
      </Field>
      <FormError error={error} />
      <Button className="w-full" type="submit" disabled={busy}>
        {busy ? <Spinner label="Saving" /> : "Save limit"}
      </Button>
    </form>
  );
}
export function GoalContributionForm({
  goal,
  currency,
  onSave,
}: {
  goal: Goal;
  currency: string;
  onSave: (amount: number) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget);
        try {
          await onSave(cents(String(data.get("amount"))));
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Couldn’t update your goal.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex items-center gap-3 rounded-xl bg-[#f3ece6] p-4">
        <span className="text-2xl">{goal.emoji}</span>
        <div>
          <p className="text-sm font-medium">{goal.name}</p>
          <p className="mt-1 text-xs text-[#79656c]">
            {money(goal.saved, currency)} of {money(goal.target, currency)}
          </p>
        </div>
      </div>
      <Field label={`Amount to add (${currency})`}>
        <Input
          name="amount"
          inputMode="decimal"
          autoFocus
          required
          placeholder="0.00"
        />
      </Field>
      <p className="text-xs leading-5 text-[#79656c]">
        Record money you’ve already set aside. This updates your goal; it
        doesn’t move money or create a transaction.
      </p>
      <FormError error={error} />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? <Spinner label="Saving" /> : "Add to savings"}
        <Icon name="plus" size={16} />
      </Button>
    </form>
  );
}
export function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (value: {
    name: string;
    currency: string;
    monthlyBudget: number;
  }) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget as HTMLFormElement);
        try {
          await onSave({
            name: String(data.get("name")),
            currency: String(data.get("currency")),
            monthlyBudget: cents(String(data.get("monthlyBudget")), true),
          });
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Couldn’t save your preferences.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <Field label="Your name">
        <Input
          name="name"
          required
          maxLength={50}
          defaultValue={profile.name}
        />
      </Field>
      <Field label="Email address">
        <Input
          value={profile.email}
          readOnly
          type="email"
          className="bg-[#f8f5f2]!"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Currency">
          <Select name="currency" defaultValue={profile.currency}>
            {["AUD", "USD", "GBP", "EUR", "NZD", "CAD"].map((currency) => (
              <option value={currency}>{currency}</option>
            ))}
          </Select>
        </Field>
        <Field label="Monthly spending limit">
          <Input
            name="monthlyBudget"
            inputMode="decimal"
            required
            defaultValue={(profile.monthlyBudget / 100).toFixed(2)}
          />
        </Field>
      </div>
      <p className="text-xs leading-5 text-[#87777e]">
        Currency changes the display symbol. Existing amounts are not converted.
      </p>
      <FormError error={error} />
      <Button type="submit" disabled={busy}>
        {busy ? <Spinner label="Saving" /> : "Save preferences"}
      </Button>
    </form>
  );
}

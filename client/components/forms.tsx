import { useState } from "preact/hooks";
import {
  CATEGORIES,
  cents,
  money,
  localDate,
  type Transaction,
  type TransactionInput,
  type Goal,
  type Profile,
} from "../../shared/finance";
import { Button, Field, Input, Select, Spinner, inputClass } from "./ui";
import { Icon } from "./icons";

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
}: {
  customCategories?: string[];
  currency?: string;
  transaction?: Transaction;
  onSave: (value: TransactionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [kind, setKind] = useState(transaction?.kind ?? "expense");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget as HTMLFormElement);
    try {
      await onSave({
        kind,
        amount: cents(String(data.get("amount"))),
        description: String(data.get("description")),
        category: String(data.get("category")),
        date: String(data.get("date")),
        note: String(data.get("note")),
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
            type="button"
            aria-pressed={kind === value}
            onClick={() => setKind(value)}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#a3637b] ${kind === value ? "bg-white text-[#743d54] shadow-sm" : "text-[#8a7a80]"}`}
          >
            <Icon name={value} size={16} />
            {value === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>
      <Field label="Amount">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-3.5 text-[#9d7b89]">
            {money(0, currency).replace(/[0-9.,\s]/g, "")}
          </span>
          <Input
            name="amount"
            inputMode="decimal"
            placeholder="0.00"
            required
            autoFocus
            className="pl-9 text-xl!"
            defaultValue={
              transaction ? (transaction.amount / 100).toFixed(2) : ""
            }
          />
        </div>
      </Field>
      <Field label="Description">
        <Input
          name="description"
          required
          maxLength={120}
          placeholder={
            kind === "expense" ? "e.g. A little coffee break" : "e.g. Payday"
          }
          defaultValue={transaction?.description}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category">
          <Select
            name="category"
            defaultValue={
              transaction?.category ??
              (kind === "income" ? "Income" : "Food & coffee")
            }
            key={kind}
          >
            {[...CATEGORIES.map((c) => c.name), ...customCategories].map(
              (name) => (
                <option value={name}>{name}</option>
              ),
            )}
          </Select>
        </Field>
        <Field label="Date">
          <Input
            name="date"
            type="date"
            min="1900-01-01"
            max="2200-12-31"
            required
            defaultValue={transaction?.date ?? localDate()}
          />
        </Field>
      </div>
      <Field label="Note (optional)">
        <textarea
          name="note"
          rows={2}
          maxLength={500}
          placeholder="Anything you’d like to remember"
          className={`${inputClass} resize-y`}
          defaultValue={transaction?.note}
        />
      </Field>
      <FormError error={error} />
      <div className="flex flex-wrap justify-between gap-3 pt-2">
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
            "Add transaction"
          )}
          <Icon name="arrow" size={17} />
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
  amount,
  onSave,
}: {
  category: string;
  amount?: number;
  onSave: (amount: number) => Promise<void>;
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
          await onSave(cents(String(data.get("amount")), true));
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Couldn’t save your budget.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="text-sm text-[#87777e]">
        Your monthly limit for {category.toLowerCase()}.
      </p>
      <Field
        label="Monthly amount"
        hint="Use 0 to remove this category’s budget."
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
        {busy ? <Spinner label="Saving" /> : "Save budget"}
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

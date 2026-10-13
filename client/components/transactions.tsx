import { useEffect, useMemo, useState } from "preact/hooks";
import {
  CATEGORIES,
  money,
  dateLabel,
  csv,
  localDate,
  type Transaction,
} from "../../shared/finance";
import { Icon } from "./icons";
import { CategoryBadge } from "./category-badge";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Empty,
} from "./ui";
export function TransactionList({
  transactions,
  customCategories,
  currency,
  onEdit,
  onAdd,
  recent = false,
  onViewAll,
}: {
  customCategories: string[];
  transactions?: Transaction[];
  currency: string;
  onEdit: (transaction: Transaction) => void;
  onAdd: () => void;
  recent?: boolean;
  onViewAll?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [category, setCategory] = useState("all");
  const [limit, setLimit] = useState(20);
  const filtered = useMemo(
    () =>
      (transactions ?? []).filter(
        (t) =>
          (kind === "all" || t.kind === kind) &&
          (category === "all" || t.category === category) &&
          `${t.description} ${t.note} ${t.category}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [transactions, search, kind, category],
  );
  useEffect(() => setLimit(20), [transactions, search, kind, category]);
  function exportCsv() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv(filtered, currency)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `petal-transactions-${localDate()}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {recent ? "Recent transactions" : "Your transactions"}
        </CardTitle>
        {recent ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-[11px]!"
          >
            View all
            <Icon name="right" size={13} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={!filtered.length}
          >
            <Icon name="download" size={14} />
            Export CSV
          </Button>
        )}
      </CardHeader>
      {!recent && (
        <div className="mb-3 grid gap-3 px-5 sm:grid-cols-[1fr_150px_170px] sm:px-6">
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-[#b09aa5]">
              <Icon name="search" size={18} />
            </span>
            <Input
              aria-label="Search transactions"
              placeholder="Find a transaction…"
              value={search}
              onInput={(event) => setSearch(event.currentTarget.value)}
              className="pl-10"
            />
          </div>
          <Select
            aria-label="Filter transaction type"
            value={kind}
            onChange={(event) => setKind(event.currentTarget.value)}
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </Select>
          <Select
            aria-label="Filter category"
            value={category}
            onChange={(event) => setCategory(event.currentTarget.value)}
          >
            <option value="all">All categories</option>
            {[...CATEGORIES.map((c) => c.name), ...customCategories].map(
              (name) => (
                <option value={name}>{name}</option>
              ),
            )}
          </Select>
        </div>
      )}
      {transactions === undefined ? (
        <div className="space-y-5 px-6 pb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-11 animate-pulse rounded-lg bg-[#f5efec]"
            />
          ))}
        </div>
      ) : !filtered.length ? (
        <Empty
          title={
            transactions.length
              ? "Nothing here just yet."
              : "Start with the little things."
          }
          description={
            transactions.length
              ? "Try a different search or filter."
              : "Add your first transaction and watch your month come together."
          }
          action={
            transactions.length ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setKind("all");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button variant="secondary" onClick={onAdd}>
                <Icon name="plus" size={15} />
                Add a transaction
              </Button>
            )
          }
        />
      ) : (
        <div className="pb-3">
          {filtered.slice(0, recent ? 4 : limit).map((transaction) => (
            <button
              onClick={() => onEdit(transaction)}
              className="group flex w-full items-center gap-3 border-t border-[#f1ebe7] px-5 py-3.5 text-left transition-colors hover:bg-[#fcf6f6] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a3637b] sm:px-6"
            >
              <CategoryBadge name={transaction.category} small />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-[#705462]">
                  {transaction.description}
                </span>
                <span className="mt-1 block text-[11px] text-[#826b77]">
                  {transaction.category}
                  <span className="mx-1.5 text-[#ccb9c2]">·</span>
                  {dateLabel(transaction.date)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`whitespace-nowrap text-[13px] font-medium tabular-nums ${transaction.kind === "income" ? "text-[#7d9b82]" : "text-[#705462]"}`}
                >
                  {transaction.kind === "income" ? "+" : "−"}
                  {money(transaction.amount, currency)}
                </span>
                <Icon
                  name="edit"
                  size={13}
                  className="hidden text-[#c5a7b6] group-hover:inline sm:block"
                />
              </div>
            </button>
          ))}
          {!recent && filtered.length > limit && (
            <div className="px-6 py-4 text-center">
              <Button variant="ghost" onClick={() => setLimit(limit + 20)}>
                Show more ({filtered.length - limit} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

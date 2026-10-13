import { useEffect, useMemo, useState } from "preact/hooks";
import {
  CATEGORIES,
  money,
  dateLabel,
  csv,
  localDate,
  filterTransactions,
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
  initialCategory = "all",
}: {
  customCategories: string[];
  transactions?: Transaction[];
  currency: string;
  onEdit: (transaction: Transaction) => void;
  onAdd: () => void;
  recent?: boolean;
  onViewAll?: () => void;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState(
    initialCategory === "all" ? "all" : "expense",
  );
  const [category, setCategory] = useState(initialCategory);
  const [limit, setLimit] = useState(30);
  const filtered = useMemo(
    () => filterTransactions(transactions ?? [], { kind, category, search }),
    [transactions, search, kind, category],
  );
  useEffect(() => setLimit(30), [transactions, search, kind, category]);
  const visible = filtered.slice(0, recent ? 4 : limit);
  const groups = new Map<string, Transaction[]>();
  for (const row of visible)
    groups.set(row.date, [...(groups.get(row.date) ?? []), row]);
  const totals = filtered.reduce(
    (sum, row) => ({ ...sum, [row.kind]: sum[row.kind] + row.amount }),
    { income: 0, expense: 0 },
  );
  const hasFilters = Boolean(
    search.trim() || kind !== "all" || category !== "all",
  );
  const clear = () => {
    setSearch("");
    setKind("all");
    setCategory("all");
  };
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
      {recent && (
        <CardHeader>
          <CardTitle>Latest activity</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View all
            <Icon name="right" size={13} />
          </Button>
        </CardHeader>
      )}
      {!recent && (
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex rounded-xl bg-[#f3ece9] p-1"
              aria-label="Filter transaction type"
            >
              {[
                { value: "all", label: "All" },
                { value: "expense", label: "Expenses" },
                { value: "income", label: "Income" },
              ].map((item) => (
                <button
                  key={item.value}
                  aria-pressed={kind === item.value}
                  onClick={() => setKind(item.value)}
                  className={`min-h-9 rounded-lg px-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[#a3637b] ${kind === item.value ? "bg-white text-[#714257] shadow-sm" : "text-[#79656c]"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clear}>
                  Clear
                  <Icon name="close" size={13} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={exportCsv}
                disabled={!filtered.length}
                aria-label="Export filtered transactions to CSV"
                className="px-2! sm:px-3!"
              >
                <Icon name="download" size={15} />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-3.5 text-[#a48c98]">
                <Icon name="search" size={18} />
              </span>
              <Input
                aria-label="Search transactions"
                placeholder="Search description, note, category…"
                value={search}
                onInput={(e) => setSearch(e.currentTarget.value)}
                className="pl-10"
              />
            </div>
            <Select
              aria-label="Filter category"
              value={category}
              onChange={(e) => setCategory(e.currentTarget.value)}
            >
              <option value="all">All categories</option>
              {[...CATEGORIES.map((c) => c.name), ...customCategories].map(
                (name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ),
              )}
            </Select>
          </div>
          {transactions !== undefined && (
            <div
              role="status"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#eee5e0] pt-4 text-xs text-[#79656c]"
            >
              <span>
                {filtered.length}{" "}
                {filtered.length === 1 ? "transaction" : "transactions"}
                {hasFilters ? " match" : " this month"}
              </span>
              {(kind === "all" || kind === "expense") && (
                <span>
                  Spent{" "}
                  <strong className="ml-1 font-medium text-[#624653]">
                    {money(totals.expense, currency)}
                  </strong>
                </span>
              )}
              {(kind === "all" || kind === "income") && (
                <span>
                  Income{" "}
                  <strong className="ml-1 font-medium text-[#617a68]">
                    {money(totals.income, currency)}
                  </strong>
                </span>
              )}
            </div>
          )}
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
            transactions.length ? "No matches." : "Your month starts here."
          }
          description={
            transactions.length
              ? "Try another search or clear the filters."
              : "Record an income or expense to start seeing the picture."
          }
          action={
            transactions.length ? (
              <Button variant="secondary" onClick={clear}>
                Clear filters
              </Button>
            ) : (
              <Button variant="secondary" onClick={onAdd}>
                <Icon name="plus" size={15} />
                Record a transaction
              </Button>
            )
          }
        />
      ) : (
        <div className="pb-3">
          {[...groups].map(([date, rows]) => (
            <div key={date}>
              {!recent && (
                <div className="flex items-center justify-between gap-3 border-t border-[#eee5e0] bg-[#fcf9f6] px-5 py-2.5 sm:px-6">
                  <h3 className="text-xs font-medium text-[#79656c]">
                    {date === localDate()
                      ? "Today"
                      : new Intl.DateTimeFormat("en-AU", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        }).format(new Date(date + "T12:00:00"))}
                  </h3>
                  <span className="text-[11px] text-[#79656c]">
                    {rows.length} {rows.length === 1 ? "entry" : "entries"}
                  </span>
                </div>
              )}
              {rows.map((row) => (
                <button
                  key={row.id}
                  onClick={() => onEdit(row)}
                  className="group flex w-full items-center gap-3 border-t border-[#f1ebe7] px-5 py-4 text-left transition-colors hover:bg-[#fcf6f6] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a3637b] sm:px-6"
                >
                  <CategoryBadge name={row.category} small />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#624653]">
                      {row.description}
                    </span>
                    <span className="mt-1 block truncate text-xs text-[#79656c]">
                      {row.category}
                      {recent && (
                        <>
                          <span className="mx-1.5 text-[#b79fa9]">·</span>
                          {dateLabel(row.date)}
                        </>
                      )}
                      {row.note && (
                        <>
                          <span className="mx-1.5">·</span>
                          {row.note}
                        </>
                      )}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 whitespace-nowrap text-sm font-medium tabular-nums ${row.kind === "income" ? "text-[#617a68]" : "text-[#624653]"}`}
                  >
                    {row.kind === "income" ? "+" : "−"}
                    {money(row.amount, currency)}
                  </span>
                  <Icon
                    name="edit"
                    size={13}
                    className="hidden shrink-0 text-[#b38b9e] sm:block"
                  />
                </button>
              ))}
            </div>
          ))}
          {!recent && filtered.length > limit && (
            <div className="px-6 py-4 text-center">
              <Button variant="ghost" onClick={() => setLimit(limit + 30)}>
                Show more ({filtered.length - limit} remaining)
                <Icon name="down" size={14} />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

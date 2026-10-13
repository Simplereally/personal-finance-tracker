import { useState } from "preact/hooks";
import {
  CATEGORIES,
  money,
  dateLabel,
  monthPosition,
  type Summary,
  type Profile,
  type Budget,
} from "../../shared/finance";
import { displayFont } from "../styles";
import { Icon, PetalMark } from "./icons";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
} from "./ui";
import { CategoryBadge } from "./category-badge";

export function MonthOverview({
  summary,
  profile,
  month,
  onEditBudget,
}: {
  summary?: Summary;
  profile: Profile;
  month: string;
  onEditBudget: () => void;
}) {
  const position = monthPosition(month);
  const budget = profile.monthlyBudget;
  const spent = summary?.expenses ?? 0;
  const left = budget ? budget - spent : (summary?.balance ?? 0);
  const over = budget > 0 && left < 0;
  const context =
    position.state === "current" && !over
      ? `${money(Math.floor(left / position.remaining), profile.currency)} / day · ${position.remaining} days left`
      : position.state === "past"
        ? "Month complete"
        : position.state === "future"
          ? "Upcoming month"
          : "";
  return (
    <section
      aria-label="Monthly money overview"
      className="overflow-hidden rounded-[24px] border border-[#e4d9d8] bg-[#f4eae9]"
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="relative overflow-hidden bg-[#714257] p-5 text-[#fffaf7] sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-[#eedde4]">
              {budget
                ? over
                  ? "Over your spending limit"
                  : "Left in your spending plan"
                : "Income after expenses"}
            </h2>
          </div>
          <div
            className="mt-4 break-words text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.045em]"
            style={displayFont}
          >
            {summary
              ? money(budget ? Math.abs(left) : left, profile.currency)
              : "—"}
          </div>
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 text-xs leading-5 text-[#eedde4]">
            {budget ? (
              <>
                <span>
                  {money(budget, profile.currency, true)} monthly limit
                </span>
                {summary && context && (
                  <>
                    <span aria-hidden="true" className="text-white/40">
                      ·
                    </span>
                    <span>{context}</span>
                  </>
                )}
              </>
            ) : (
              <span>
                Recorded income minus expenses.{" "}
                <button
                  onClick={onEditBudget}
                  className="font-medium underline underline-offset-4"
                >
                  Set a spending limit
                </button>
              </span>
            )}
          </div>
          <PetalMark className="pointer-events-none absolute -bottom-12 -right-10 size-56 text-white opacity-[0.045]" />
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-5">
            {[
              {
                label: "Income",
                value: summary?.income,
                icon: "income",
                color: "text-[#6c8873]",
              },
              {
                label: "Spent",
                value: summary?.expenses,
                icon: "expense",
                color: "text-[#9f5c72]",
              },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-xs text-[#79656c]">
                  <Icon name={item.icon} size={15} className={item.color} />
                  {item.label}
                </div>
                <p
                  className="break-words text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight tracking-[-0.035em]"
                  style={displayFont}
                >
                  {item.value === undefined
                    ? "—"
                    : money(item.value, profile.currency)}
                </p>
              </div>
            ))}
          </div>
          {budget > 0 ? (
            <div className="mt-5 border-t border-[#dfd0d1] pt-4">
              <div className="mb-2.5 flex items-center justify-between gap-3 text-xs">
                <span className={over ? "text-[#a33957]" : "text-[#79656c]"}>
                  {summary
                    ? `${Math.round((spent / budget) * 100)}% of limit used`
                    : "Loading spending…"}
                </span>
                <button
                  onClick={onEditBudget}
                  aria-label="Edit monthly spending limit"
                  className="inline-flex items-center gap-1 text-[#714257] underline underline-offset-4"
                >
                  Edit limit
                  <Icon name="right" size={12} />
                </button>
              </div>
              {summary ? (
                <Progress
                  value={(spent / budget) * 100}
                  color={over ? "#a54b68" : "#a9778c"}
                  label="Monthly spending limit used"
                />
              ) : (
                <div className="h-2 animate-pulse rounded-full bg-[#dfd0d1]" />
              )}
            </div>
          ) : (
            <p className="mt-6 border-t border-[#dfd0d1] pt-4 text-xs leading-5 text-[#79656c]">
              A spending limit gives every purchase a little context.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function BudgetAttention({
  budgets,
  summary,
  currency,
  onReview,
}: {
  budgets: Budget[];
  summary?: Summary;
  currency: string;
  onReview: (category: string) => void;
}) {
  const attention = budgets
    .map((budget) => ({
      ...budget,
      spent:
        summary?.categories.find((c) => c.name === budget.category)?.amount ??
        0,
    }))
    .filter((b) => b.spent / b.amount >= 0.85)
    .sort((a, b) => b.spent / b.amount - a.spent / a.amount)
    .slice(0, 3);
  if (!summary || !attention.length) return null;
  return (
    <div aria-label="Budgets to review" className="mt-4 flex flex-wrap gap-2">
      {attention.map((b) => (
        <button
          key={b.id}
          onClick={() => onReview(b.category)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e4cbd2] bg-[#f8eff1] px-4 text-xs text-[#84445e] transition hover:bg-[#f0e0e5] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
        >
          <Icon name="budgets" size={14} />
          {b.category}:{" "}
          {b.spent > b.amount
            ? `${money(b.spent - b.amount, currency)} over`
            : b.spent === b.amount
              ? "limit reached"
              : `${money(b.amount - b.spent, currency)} left`}
          <Icon name="right" size={12} />
        </button>
      ))}
    </div>
  );
}

export function SpendingChart({
  summary,
  currency,
  month,
  limit,
  onAdd,
}: {
  summary?: Summary;
  currency: string;
  month: string;
  limit: number;
  onAdd: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const position = monthPosition(month);
  const daily =
    summary?.daily ?? Array.from({ length: position.days }, () => 0);
  const lastRecord = daily.reduce(
    (last, amount, i) => (amount ? i + 1 : last),
    0,
  );
  const endDay = Math.max(1, position.elapsed, lastRecord);
  const day = Math.min(daily.length, Math.max(1, selected ?? endDay));
  let total = 0;
  const cumulative = daily.map((value) => (total += value));
  const max = Math.max(total, limit, 10000) * 1.13;
  const width = 600,
    height = 155;
  const x = (d: number) => (d / daily.length) * width;
  const y = (amount: number) => height - (amount / max) * height;
  const points =
    `0,${height} ` +
    cumulative
      .slice(0, endDay)
      .map((amount, i) => `${x(i + 1)},${y(amount)}`)
      .join(" ");
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending over time</CardTitle>
        <span className="text-xs text-[#79656c]">
          {limit ? `${money(limit, currency, true)} limit` : "Cumulative"}
        </span>
      </CardHeader>
      <CardContent>
        {!summary ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-[#f4ece8]" />
        ) : !summary.expenses ? (
          <div className="flex min-h-[220px] flex-col items-start justify-center">
            <p className="text-3xl" style={displayFont}>
              A fresh page.
            </p>
            <p className="mt-2 mb-5 text-sm text-[#79656c]">
              Your recorded expenses will appear here.
            </p>
            <Button variant="secondary" onClick={onAdd}>
              <Icon name="plus" size={15} />
              Record an expense
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[32px] tracking-[-0.03em]" style={displayFont}>
                {money(cumulative[day - 1], currency)}
                <span
                  className="ml-2 text-xs tracking-normal text-[#79656c]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  by {dateLabel(`${month}-${String(day).padStart(2, "0")}`)}
                </span>
              </p>
              <span className="text-xs text-[#79656c]">
                {money(daily[day - 1], currency)} on this day
              </span>
            </div>
            <svg
              viewBox={`0 -15 ${width} ${height + 20}`}
              preserveAspectRatio="none"
              role="img"
              tabindex={0}
              aria-label={`Cumulative spending. ${dateLabel(`${month}-${String(day).padStart(2, "0")}`)}: ${money(cumulative[day - 1], currency)}. Use left and right arrow keys to explore days.`}
              className="h-[175px] w-full touch-pan-y rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#a3637b]"
              onPointerMove={(event) => {
                const r = event.currentTarget.getBoundingClientRect();
                setSelected(
                  Math.round(
                    ((event.clientX - r.left) / r.width) * daily.length,
                  ),
                );
              }}
              onPointerLeave={() => setSelected(null)}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  setSelected(
                    event.key === "Home"
                      ? 1
                      : event.key === "End"
                        ? daily.length
                        : Math.min(
                            daily.length,
                            Math.max(
                              1,
                              day + (event.key === "ArrowRight" ? 1 : -1),
                            ),
                          ),
                  );
                }
              }}
            >
              <defs>
                <linearGradient id="spend-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#b87992" stop-opacity=".24" />
                  <stop offset="100%" stop-color="#b87992" stop-opacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.5, 1].map((n) => (
                <line
                  key={n}
                  x1="0"
                  x2={width}
                  y1={n * height}
                  y2={n * height}
                  stroke="#ece3e5"
                  stroke-dasharray="3 5"
                />
              ))}
              {limit > 0 && (
                <>
                  <line
                    x1="0"
                    x2={width}
                    y1={y(limit)}
                    y2={y(limit)}
                    stroke="#b3b49e"
                    stroke-dasharray="6 5"
                  />
                </>
              )}
              <polygon
                points={`${points} ${x(endDay)},${height}`}
                fill="url(#spend-fill)"
              />
              <polyline
                points={points}
                fill="none"
                stroke="#9e617c"
                stroke-width="2.5"
                stroke-linejoin="round"
              />
              {day <= endDay && (
                <>
                  <line
                    x1={x(day)}
                    x2={x(day)}
                    y1={y(cumulative[day - 1])}
                    y2={height}
                    stroke="#c8a1b1"
                    stroke-dasharray="3 4"
                  />
                  <circle
                    cx={x(day)}
                    cy={y(cumulative[day - 1])}
                    r="4"
                    fill="#fff"
                    stroke="#9e617c"
                    stroke-width="2"
                  />
                </>
              )}
            </svg>
            <div className="mt-2 flex justify-between text-[11px] text-[#79656c]">
              <span>
                1{" "}
                {new Intl.DateTimeFormat("en", { month: "short" }).format(
                  new Date(month + "-01T12:00:00"),
                )}
              </span>
              <span>
                {position.state === "current"
                  ? `Today · ${position.elapsed}`
                  : ""}
              </span>
              <span>{daily.length}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function SpendingCategories({
  summary,
  currency,
  onCategory,
}: {
  summary?: Summary;
  currency: string;
  onCategory: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const categories = summary?.categories ?? [];
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Where it goes</CardTitle>
        <span className="text-xs text-[#79656c]">
          {summary ? `${categories.length} categories` : ""}
        </span>
      </CardHeader>
      <CardContent className="px-3! sm:px-4!">
        {!summary ? (
          <div className="mx-2 h-48 animate-pulse rounded-xl bg-[#f4ece8]" />
        ) : !categories.length ? (
          <p className="px-2 py-10 text-sm leading-6 text-[#79656c]">
            Categories appear as you record expenses.
          </p>
        ) : (
          categories.slice(0, expanded ? 32 : 4).map((category) => {
            const percent = (category.amount / (summary?.expenses || 1)) * 100;
            const color =
              CATEGORIES.find((c) => c.name === category.name)?.color ??
              "#9d9994";
            return (
              <button
                key={category.name}
                onClick={() => onCategory(category.name)}
                aria-label={`View ${category.name} transactions`}
                className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-[#faf4f3] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
              >
                <CategoryBadge name={category.name} small />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium">
                      {category.name}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {money(category.amount, currency)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f3ece9]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <Icon
                  name="right"
                  size={13}
                  className="shrink-0 text-[#b49ba5]"
                />
              </button>
            );
          })
        )}
        {categories.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : `All ${categories.length} categories`}
            <Icon name={expanded ? "up" : "down"} size={12} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

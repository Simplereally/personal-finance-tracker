import {
  CATEGORIES,
  money,
  type Profile,
  type Summary,
  type Budget,
} from "../../shared/finance";
import { displayFont } from "../styles";
import { Icon } from "./icons";
import { CategoryBadge } from "./category-badge";
import { Button, Card, CardContent, Progress, Empty } from "./ui";
export function BudgetList({
  profile,
  summary,
  budgets,
  onEdit,
  onSetOverall,
  onAdd,
  onReview,
  canAdd,
}: {
  profile: Profile;
  summary?: Summary;
  budgets?: Budget[];
  onEdit: (category: string, amount?: number) => void;
  onSetOverall: () => void;
  onAdd: () => void;
  onReview: (category: string) => void;
  canAdd: boolean;
}) {
  const spent = summary?.expenses ?? 0,
    limit = profile.monthlyBudget;
  const ranked = (budgets ?? [])
    .map((b) => ({
      ...b,
      spent:
        summary?.categories.find((c) => c.name === b.category)?.amount ?? 0,
    }))
    .sort((a, b) => b.spent / b.amount - a.spent / a.amount);
  const allocated = (budgets ?? []).reduce((sum, b) => sum + b.amount, 0);
  return (
    <div>
      <Card className="mb-8 bg-[#f4eae9]!">
        <CardContent className="pt-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium">Monthly spending limit</h2>
              <p
                className="mt-2 text-4xl tracking-[-0.03em]"
                style={displayFont}
              >
                {summary ? money(spent, profile.currency) : "—"}
                <span className="ml-2 text-lg text-[#79656c]">
                  {limit
                    ? `of ${money(limit, profile.currency, true)}`
                    : "spent"}
                </span>
              </p>
            </div>
            <Button variant="outline" onClick={onSetOverall}>
              {limit ? "Edit limit" : "Set a monthly limit"}
            </Button>
          </div>
          {limit > 0 && summary && (
            <>
              <Progress
                value={(spent / limit) * 100}
                color={spent > limit ? "#a54b68" : "#a9778c"}
                label="Monthly spending budget"
              />
              <p className="mt-3 text-sm text-[#79656c]">
                {spent > limit
                  ? `${money(spent - limit, profile.currency)} over your limit`
                  : `${money(limit - spent, profile.currency)} remaining`}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">
          Category limits
        </h2>
        {canAdd && (
          <Button variant="secondary" onClick={onAdd}>
            <Icon name="plus" size={16} />
            Add a limit
          </Button>
        )}
      </div>
      {budgets === undefined ? (
        <div
          aria-label="Loading category limits"
          role="status"
          className="h-48 animate-pulse rounded-2xl bg-[#f3e9e8]"
        />
      ) : !ranked.length ? (
        <Card>
          <Empty
            icon="budgets"
            title="Keep your plan as simple as you like."
            description="An overall limit is enough to start. Add category limits when you want a closer view."
            action={
              <Button variant="secondary" onClick={onAdd}>
                Choose a category
                <Icon name="right" size={15} />
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ranked.map((b) => {
            const percent = (b.spent / b.amount) * 100;
            const color =
              CATEGORIES.find((c) => c.name === b.category)?.color ?? "#9d9994";
            return (
              <Card key={b.id}>
                <CardContent className="pt-6">
                  <div className="mb-5 flex items-center gap-3">
                    <CategoryBadge name={b.category} />
                    <h3 className="min-w-0 flex-1 truncate text-sm font-medium">
                      {b.category}
                    </h3>
                    <button
                      aria-label={`Edit ${b.category} budget`}
                      onClick={() => onEdit(b.category, b.amount)}
                      className="flex size-9 items-center justify-center rounded-xl text-[#79656c] hover:bg-[#f7efed] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                  </div>
                  <p
                    className="mb-4 text-3xl tracking-[-0.03em]"
                    style={displayFont}
                  >
                    {summary ? money(b.spent, profile.currency) : "—"}
                    <span className="ml-2 text-base text-[#79656c]">
                      / {money(b.amount, profile.currency, true)}
                    </span>
                  </p>
                  {summary ? (
                    <Progress
                      value={percent}
                      color={percent > 100 ? "#a54b68" : color}
                      label={`${b.category} budget`}
                    />
                  ) : (
                    <div className="h-2 animate-pulse rounded-full bg-[#f1ece9]" />
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`text-xs ${percent > 100 ? "text-[#a33957]" : "text-[#79656c]"}`}
                    >
                      {summary === undefined
                        ? "Loading spending…"
                        : b.spent > b.amount
                          ? `${money(b.spent - b.amount, profile.currency)} over`
                          : `${money(b.amount - b.spent, profile.currency)} left`}
                    </span>
                    <button
                      onClick={() => onReview(b.category)}
                      className="inline-flex min-h-8 items-center gap-1 rounded-lg text-xs text-[#714257] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                    >
                      Transactions
                      <Icon name="right" size={12} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {!!ranked.length && (
        <p className="mt-5 text-xs leading-5 text-[#79656c]">
          Category limits total {money(allocated, profile.currency)}
          {limit
            ? `. Your overall limit is ${money(limit, profile.currency)}.`
            : "."}
          {limit > 0 && allocated > limit
            ? " They exceed your overall limit; adjust either to fit your plan."
            : ""}
        </p>
      )}
    </div>
  );
}

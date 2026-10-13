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
import { Button, Card, CardContent, Progress } from "./ui";
export function BudgetList({
  profile,
  customCategories,
  summary,
  budgets,
  onEdit,
  onSetOverall,
}: {
  customCategories: string[];
  profile: Profile;
  summary?: Summary;
  budgets: Budget[];
  onEdit: (category: string, amount?: number) => void;
  onSetOverall: () => void;
}) {
  const spent = summary?.expenses ?? 0;
  const limit = profile.monthlyBudget;
  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium">
                Your monthly spending limit
              </h2>
              <p className="mt-2 text-3xl" style={displayFont}>
                {money(spent, profile.currency)}
                <span className="ml-2 text-base text-[#aa909e]">
                  {limit ? `of ${money(limit, profile.currency)}` : "spent"}
                </span>
              </p>
            </div>
            <Button variant="outline" onClick={onSetOverall}>
              {limit ? "Edit limit" : "Set a monthly limit"}
            </Button>
          </div>
          {limit > 0 && (
            <>
              <Progress
                value={(spent / limit) * 100}
                color={spent > limit ? "#af536f" : "#9da589"}
                label="Monthly spending budget"
              />
              <p className="mt-3 text-xs text-[#826b77]">
                {spent > limit
                  ? `${money(spent - limit, profile.currency)} over your limit. You can adjust your plan.`
                  : `${money(limit - spent, profile.currency)} left for this month.`}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ...CATEGORIES,
          ...customCategories.map((name) => ({ ...CATEGORIES[7], name })),
        ]
          .filter((c) => c.name !== "Income")
          .map((category) => {
            const budget = budgets.find((b) => b.category === category.name);
            const amount =
              summary?.categories.find((c) => c.name === category.name)
                ?.amount ?? 0;
            const percent = budget ? (amount / budget.amount) * 100 : 0;
            return (
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryBadge name={category.name} />
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                    <button
                      aria-label={`Edit ${category.name} budget`}
                      className="flex size-9 items-center justify-center rounded-xl text-[#826b77] hover:bg-[#f7efed] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                      onClick={() => onEdit(category.name, budget?.amount)}
                    >
                      <Icon name={budget ? "edit" : "plus"} size={16} />
                    </button>
                  </div>
                  <p className="mb-4 text-xl" style={displayFont}>
                    {money(amount, profile.currency)}
                    <span className="ml-2 text-sm text-[#826b77]">
                      {budget
                        ? `of ${money(budget.amount, profile.currency, true)}`
                        : "spent"}
                    </span>
                  </p>
                  <Progress
                    value={percent}
                    color={percent > 100 ? "#af536f" : category.color}
                    label={`${category.name} budget`}
                  />
                  <p className="mt-3 text-xs text-[#826b77]">
                    {budget ? (
                      amount > budget.amount ? (
                        `${money(amount - budget.amount, profile.currency)} over budget`
                      ) : (
                        `${money(budget.amount - amount, profile.currency)} left to spend`
                      )
                    ) : (
                      <button
                        className="underline underline-offset-4"
                        onClick={() => onEdit(category.name)}
                      >
                        Set a monthly budget
                      </button>
                    )}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

import { money, type Goal } from "../../shared/finance";
import { displayFont } from "../styles";
import { Icon } from "./icons";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
  Empty,
} from "./ui";
export function GoalList({
  goals,
  currency,
  onEdit,
  onAdd,
  compact = false,
  onViewAll,
}: {
  goals?: Goal[];
  currency: string;
  onEdit: (goal: Goal) => void;
  onAdd: () => void;
  compact?: boolean;
  onViewAll?: () => void;
}) {
  const total = (goals ?? []).reduce((sum, goal) => sum + goal.saved, 0);
  const contents =
    goals === undefined ? (
      <div className="h-36 animate-pulse rounded-xl bg-[#f4ece8]" />
    ) : goals.length === 0 ? (
      <Empty
        icon="goals"
        title="Give your someday a name."
        description="A holiday, a rainy-day fund, or something just for you."
        action={
          <Button variant="secondary" onClick={onAdd}>
            <Icon name="plus" size={16} />
            Create a goal
          </Button>
        }
      />
    ) : (
      <div
        className={
          compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {goals.slice(0, compact ? 2 : 20).map((goal, index) => {
          const percent = Math.round((goal.saved / goal.target) * 100);
          return (
            <button
              onClick={() => onEdit(goal)}
              className={`w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a3637b] ${compact ? "rounded-xl" : "rounded-2xl border border-[#e9e0db] bg-white p-6 transition-shadow hover:shadow-md"}`}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${index % 2 ? "bg-[#e9eede]" : "bg-[#f6eadb]"}`}
                >
                  {goal.emoji}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#775b6a]">
                  {goal.name}
                </span>
                <span className="text-[11px] text-[#826b77]">
                  {percent >= 100 ? "✓" : `${percent}%`}
                </span>
              </div>
              <Progress
                label={goal.name}
                value={percent}
                color={index % 2 ? "#91a283" : "#c9a077"}
              />
              <div className="mt-2.5 flex justify-between text-[10px]">
                <span className="text-[#806775]">
                  {money(goal.saved, currency, true)} saved
                </span>
                <span className="text-[#826b77]">
                  of {money(goal.target, currency, true)}
                </span>
              </div>
              {!compact && (
                <p className="mt-5 text-xs text-[#9e8292]">
                  {goal.saved >= goal.target
                    ? "You made it. Time to celebrate!"
                    : `${money(goal.target - goal.saved, currency, true)} to your someday`}
                </p>
              )}
            </button>
          );
        })}
      </div>
    );
  if (!compact)
    return (
      <>
        <div className="mb-6 flex items-baseline gap-3">
          <span className="text-4xl" style={displayFont}>
            {money(total, currency)}
          </span>
          <span className="text-sm text-[#826b77]">
            saved across your goals
          </span>
        </div>
        {contents}
      </>
    );
  return (
    <Card className="bg-[#fffaf5]!">
      <CardHeader>
        <CardTitle>Your someday plans</CardTitle>
        <button
          aria-label="Add savings goal"
          onClick={onAdd}
          className="flex size-8 items-center justify-center rounded-full border border-[#e8dcd6] text-[#b18c9e] hover:bg-[#f4e7e9] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
        >
          <Icon name="plus" size={14} />
        </button>
      </CardHeader>
      <CardContent>
        {contents}
        {!!goals?.length && (
          <button
            onClick={onViewAll}
            className="mt-5 flex w-full items-center justify-center gap-1 text-[11px] text-[#826b77] hover:text-[#6d354d]"
          >
            View all goals
            <Icon name="right" size={12} />
          </button>
        )}
      </CardContent>
    </Card>
  );
}

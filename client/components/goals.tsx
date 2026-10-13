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
  onContribute,
  compact = false,
  onViewAll,
}: {
  goals?: Goal[];
  currency: string;
  onEdit: (goal: Goal) => void;
  onAdd: () => void;
  onContribute: (goal: Goal) => void;
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
        title="What would you like to save for?"
        description="Give it a target, then record money as you set it aside."
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
          const percent = Math.round((goal.saved / goal.target) * 100),
            complete = goal.saved >= goal.target;
          return (
            <div
              key={goal.id}
              className={
                compact
                  ? "rounded-xl"
                  : "rounded-2xl border border-[#e9e0db] bg-white p-6"
              }
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xl ${index % 2 ? "bg-[#e9eede]" : "bg-[#f6eadb]"}`}
                >
                  {goal.emoji}
                </span>
                <button
                  onClick={() => onEdit(goal)}
                  className="min-w-0 flex-1 rounded-lg text-left hover:text-[#9b5674] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                >
                  <h3 className="truncate text-sm font-medium">{goal.name}</h3>
                  <p className="mt-1 text-xs text-[#79656c]">
                    {complete ? "Goal reached" : ""}
                    {!complete &&
                      `${money(Math.max(0, goal.target - goal.saved), currency, true)} to go`}
                  </p>
                </button>
                <button
                  aria-label={`Edit ${goal.name}`}
                  onClick={() => onEdit(goal)}
                  className="flex size-9 items-center justify-center rounded-full text-[#927080] hover:bg-[#f5ecec] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                >
                  <Icon name="edit" size={15} />
                </button>
              </div>
              <Progress
                label={goal.name}
                value={percent}
                color={complete ? "#7b977a" : index % 2 ? "#91a283" : "#c3a17d"}
              />
              <div className="mt-2.5 flex flex-wrap justify-between gap-2 text-xs text-[#79656c]">
                <span>
                  <strong className="font-medium text-[#624653]">
                    {money(goal.saved, currency, true)}
                  </strong>{" "}
                  / {money(goal.target, currency, true)}
                </span>
                <span>{percent}%</span>
              </div>
              <Button
                aria-label={`Add money to ${goal.name}`}
                variant={complete ? "ghost" : "secondary"}
                size="sm"
                className="mt-4 w-full"
                onClick={() => onContribute(goal)}
              >
                <Icon name="plus" size={14} />
                Add money
              </Button>
            </div>
          );
        })}
      </div>
    );
  if (!compact)
    return (
      <>
        <div className="mb-7 flex flex-wrap items-baseline gap-3">
          <span
            className="min-w-0 max-w-full break-words text-[clamp(2rem,6vw,3rem)] tracking-[-0.04em]"
            style={displayFont}
          >
            {goals === undefined ? "—" : money(total, currency)}
          </span>
          <span className="text-sm text-[#79656c]">
            {goals === undefined
              ? "Loading goals…"
              : `recorded across ${goals.length} goals`}
          </span>
        </div>
        {contents}
      </>
    );
  return (
    <Card className="bg-[#fffaf5]!">
      <CardHeader>
        <CardTitle>Savings goals</CardTitle>
        <button
          aria-label="Add savings goal"
          onClick={onAdd}
          className="flex size-9 items-center justify-center rounded-full border border-[#e8dcd6] text-[#967080] hover:bg-[#f4e7e9] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
        >
          <Icon name="plus" size={15} />
        </button>
      </CardHeader>
      <CardContent>
        {contents}
        {!!goals?.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="mt-5 w-full"
          >
            All goals
            <Icon name="right" size={12} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

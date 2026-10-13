import {
  CATEGORIES,
  money,
  dateLabel,
  type Summary,
  type Profile,
} from "../../shared/finance";
import { displayFont } from "../styles";
import { Icon, PetalMark } from "./icons";
import { Card, CardHeader, CardTitle, CardContent } from "./ui";
export function Stats({
  summary,
  profile,
}: {
  summary?: Summary;
  profile: Profile;
}) {
  const cards = [
    {
      label: "Left this month",
      value: summary?.balance,
      icon: "wallet",
      dark: true,
      detail: "Income minus spending",
    },
    { label: "Money in", value: summary?.income, icon: "income", detail: "" },
    {
      label: "Money out",
      value: summary?.expenses,
      icon: "expense",
      detail: profile.monthlyBudget
        ? `${money(Math.max(0, profile.monthlyBudget - (summary?.expenses ?? 0)), profile.currency, true)} left in your budget`
        : "",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 ${card.dark ? "col-span-2 border border-[#713e55] bg-[#75475c] text-white sm:col-span-1" : "border border-[#e9e2de] bg-[#fffdfa]"}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[12px] font-medium ${card.dark ? "text-[#ecdae4]" : "text-[#826b77]"}`}
            >
              {card.label}
            </span>
            <span
              className={`flex size-8 items-center justify-center rounded-full ${card.dark ? "bg-white/10 text-[#ecd6e1]" : card.icon === "income" ? "bg-[#e8efe7] text-[#7d9a80]" : "bg-[#f6e9e7] text-[#c1938d]"}`}
            >
              <Icon name={card.icon} size={16} />
            </span>
          </div>
          <div
            className="mt-3 text-[30px] leading-tight tracking-[-0.04em] sm:text-[40px]"
            style={displayFont}
          >
            {card.value === undefined ? (
              <span className="inline-block h-9 w-32 animate-pulse rounded-lg bg-[#d8c4ce]/40" />
            ) : (
              money(card.value, profile.currency)
            )}
          </div>
          {card.detail && (
            <p
              className={`mt-3 text-[11px] ${card.dark ? "text-[#ddc3d1]" : "text-[#826b77]"}`}
            >
              {card.detail}
            </p>
          )}
          {card.dark && (
            <PetalMark className="pointer-events-none absolute -bottom-12 -right-5 size-36 text-white opacity-[0.045]" />
          )}
        </div>
      ))}
    </div>
  );
}

export function SpendingChart({
  summary,
  currency,
  month,
}: {
  summary?: Summary;
  currency: string;
  month: string;
}) {
  const daily = summary?.daily ?? Array.from({ length: 31 }, () => 0);
  const max = Math.max(...daily, 10000);
  const height = 125;
  const width = 540;
  const points = daily
    .map(
      (amount, i) =>
        `${(i / (daily.length - 1)) * width},${height - (amount / max) * (height - 15)}`,
    )
    .join(" ");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending, day by day</CardTitle>
        <span className="flex items-center gap-1.5 text-[11px] text-[#826b77]">
          <span className="size-1.5 rounded-full bg-[#bf839b]" />
          Expenses
        </span>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="mb-4 flex items-baseline gap-2">
            <span
              className="text-[30px] tracking-[-0.03em]"
              style={displayFont}
            >
              {summary ? money(summary.expenses, currency) : "—"}
            </span>
            <span className="text-[11px] text-[#826b77]">this month</span>
          </div>
          <div className="flex gap-3">
            <div className="flex w-9 shrink-0 flex-col justify-between pb-5 text-right text-[9px] text-[#826b77]">
              <span>{money(max, currency, true)}</span>
              <span>{money(max / 2, currency, true)}</span>
              <span>$0</span>
            </div>
            <div className="min-w-0 flex-1">
              <svg
                role="img"
                aria-label={`Daily expenses for ${month}. Total ${money(summary?.expenses ?? 0, currency)}`}
                viewBox={`0 0 ${width} ${height + 4}`}
                preserveAspectRatio="none"
                className="h-[130px] w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="spend-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stop-color="#d6a8b9"
                      stop-opacity="0.38"
                    />
                    <stop
                      offset="100%"
                      stop-color="#f8edf1"
                      stop-opacity="0.15"
                    />
                  </linearGradient>
                </defs>
                {[0, 0.5, 1].map((n) => (
                  <line
                    x1="0"
                    x2={width}
                    y1={n * height}
                    y2={n * height}
                    stroke="#ece5e7"
                    stroke-dasharray="3 4"
                  />
                ))}
                <polygon
                  points={`0,${height} ${points} ${width},${height}`}
                  fill="url(#spend-fill)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#bc8099"
                  stroke-width="2.3"
                  stroke-linejoin="round"
                />
                {daily.map((value, i) =>
                  value ? (
                    <circle
                      cx={(i / (daily.length - 1)) * width}
                      cy={height - (value / max) * (height - 15)}
                      r="3"
                      fill="#fff"
                      stroke="#b77390"
                      stroke-width="1.5"
                    >
                      <title>
                        {dateLabel(
                          `${month}-${String(i + 1).padStart(2, "0")}`,
                        )}
                        : {money(value, currency)}
                      </title>
                    </circle>
                  ) : null,
                )}
              </svg>
              <div className="mt-2 flex justify-between text-[9px] text-[#826b77]">
                {[1, 8, 15, 22, daily.length].map((day) => (
                  <span>
                    {day}{" "}
                    {new Intl.DateTimeFormat("en", { month: "short" }).format(
                      new Date(month + "-01"),
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SpendingCategories({
  summary,
  currency,
}: {
  summary?: Summary;
  currency: string;
}) {
  const categories = summary?.categories ?? [];
  let offset = 0;
  const ring = categories.map((category) => {
    const size = (category.amount / (summary?.expenses || 1)) * 100;
    const piece = {
      ...category,
      size,
      offset,
      color:
        CATEGORIES.find((c) => c.name === category.name)?.color ?? "#9d9994",
    };
    offset += size;
    return piece;
  });
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Where it’s going</CardTitle>
        <Icon name="dots" size={18} className="text-[#826b77]" />
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <div className="relative w-[132px] shrink-0 sm:w-[145px]">
          <svg
            viewBox="0 0 120 120"
            role="img"
            aria-label="Spending by category"
            className="w-full -rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r="46"
              pathLength="100"
              stroke="#f1ebe8"
              stroke-width="12"
              fill="none"
            />
            {ring.map((piece) => (
              <circle
                cx="60"
                cy="60"
                r="46"
                pathLength="100"
                stroke={piece.color}
                stroke-width="12"
                stroke-dasharray={`${Math.max(0, piece.size - 1)} ${101 - piece.size}`}
                stroke-dashoffset={-piece.offset}
                fill="none"
              >
                <title>
                  {piece.name}: {money(piece.amount, currency)}
                </title>
              </circle>
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[25px] tracking-tight" style={displayFont}>
              {summary ? money(summary.expenses, currency, true) : "—"}
            </span>
            <span className="text-[9px] text-[#826b77]">total spent</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-3.5">
          {categories.length ? (
            categories.slice(0, 4).map((category) => (
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="flex min-w-0 items-center gap-2 text-[#806775]">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORIES.find((c) => c.name === category.name)
                          ?.color ?? "#9d9994",
                    }}
                  />
                  <span className="truncate">{category.name}</span>
                </span>
                <span className="text-[#76616e]">
                  {Math.round((category.amount / summary!.expenses) * 100)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs leading-6 text-[#826b77]">
              Your first expense
              <br />
              will start the story.
            </p>
          )}
          {categories.length > 4 && (
            <div className="text-[11px] text-[#826b77]">
              + {categories.length - 4} more categories
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

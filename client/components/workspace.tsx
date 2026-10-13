import { useEffect, useState } from "preact/hooks";
import { Link, useLocation, useNavigate } from "lakebed/client";
import {
  moveMonth,
  localDate,
  CATEGORIES,
  type TransactionInput,
  type Profile,
  type Summary,
  type Transaction,
  type Goal,
  type Budget,
} from "../../shared/finance";
import { displayFont } from "../styles";
import type { Actions } from "../types";
import { Brand } from "./auth";
import { Icon } from "./icons";
import { Button, Card, CardHeader, CardTitle, CardContent, Dialog } from "./ui";
import {
  TransactionForm,
  GoalForm,
  BudgetForm,
  ProfileForm,
  GoalContributionForm,
} from "./forms";
import {
  MonthOverview,
  BudgetAttention,
  SpendingChart,
  SpendingCategories,
} from "./dashboard";
import { TransactionList } from "./transactions";
import { GoalList } from "./goals";
import { BudgetList } from "./budgets";
import { CategoryManager, PasswordCard } from "./settings";
const navItems = [
  { path: "/", label: "Overview", icon: "overview" },
  { path: "/transactions", label: "Transactions", icon: "transactions" },
  { path: "/budgets", label: "Budgets", icon: "budgets" },
  { path: "/goals", label: "Savings goals", icon: "goals" },
  { path: "/settings", label: "Settings", icon: "settings" },
];
type Modal =
  | {
      kind: "transaction";
      value?: Transaction;
      initial?: Partial<TransactionInput>;
    }
  | { kind: "goal"; value?: Goal }
  | { kind: "budget"; category: string; amount?: number; choose?: boolean }
  | { kind: "monthlyBudget" }
  | { kind: "contribute"; goal: Goal }
  | { kind: "shortcuts" }
  | null;

export function Workspace({
  profile,
  customCategories,
  month,
  setMonth,
  summary,
  transactions,
  goals,
  budgets,
  actions,
  preview = false,
}: {
  customCategories: { id: string; name: string }[];
  profile: Profile;
  month: string;
  setMonth: (month: string) => void;
  summary?: Summary;
  transactions?: Transaction[];
  goals?: Goal[];
  budgets?: Budget[];
  actions: Actions;
  preview?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = preview
    ? location.pathname.replace(/^\/preview/, "") || "/"
    : location.pathname;
  const active =
    navItems.find((item) => item.path === activePath) ?? navItems[0];
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [logoutBusy, setLogoutBusy] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "n" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.repeat &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable &&
        !modal
      ) {
        event.preventDefault();
        setModal({ kind: "transaction" });
      }
    };
    const extraHandler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        modal ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable
      )
        return;
      if (event.key === "?") {
        event.preventDefault();
        setModal({ kind: "shortcuts" });
      }
      if (event.key === "/" && activePath === "/transactions") {
        event.preventDefault();
        document
          .querySelector<HTMLInputElement>(
            'input[aria-label="Search transactions"]',
          )
          ?.focus();
      }
    };
    window.addEventListener("keydown", extraHandler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keydown", extraHandler);
    };
  }, [modal, activePath]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.getElementById("main")?.animate?.(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out" },
      );
    }
  }, [activePath]);
  const success = (message: string) => {
    setModal(null);
    setToast(message);
  };
  const pathTo = (path: string) =>
    preview ? "/preview" + (path === "/" ? "" : path) : path;
  const monthLabel = new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(new Date(month + "-01T12:00:00"));
  const isOverview = active.path === "/";
  const emptyMonth = transactions !== undefined && transactions.length === 0;
  const unusedCategories = [
    ...CATEGORIES.map((c) => c.name),
    ...customCategories.map((c) => c.name),
  ].filter(
    (name) => name !== "Income" && !budgets?.some((b) => b.category === name),
  );
  const addBudget = () =>
    setModal(
      unusedCategories.length
        ? { kind: "budget", category: unusedCategories[0], choose: true }
        : { kind: "monthlyBudget" },
    );
  const reviewCategory = (category: string) => {
    setFilterCategory(category);
    navigate(pathTo("/transactions"));
  };
  const contribute = (goal: Goal) => setModal({ kind: "contribute", goal });
  return (
    <div className="min-h-dvh lg:pl-[240px]">
      <a
        href="#main"
        className="fixed left-3 top-3 z-50 -translate-y-24 rounded-xl bg-[#6d354d] px-4 py-3 text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[240px] flex-col border-r border-[#e9e0db] bg-[#f4eee8] px-5 py-7 lg:flex">
        <div className="pl-4">
          <Brand to={pathTo("/")} />
        </div>
        <nav aria-label="Main navigation" className="mt-12 space-y-2">
          {navItems.map((item) => (
            <Link
              to={pathTo(item.path)}
              aria-current={active.path === item.path ? "page" : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#a3637b] ${active.path === item.path ? "bg-[#e9d9de] text-[#773e55]" : "text-[#887880] hover:bg-[#eee3e2] hover:text-[#684452]"}`}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#ebe2dc] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
            onClick={() => navigate(pathTo("/settings"))}
          >
            <Avatar name={profile.name} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {profile.name}
              </span>
              <span className="block truncate text-[11px] text-[#79656c]">
                {profile.email}
              </span>
            </span>
            <Icon name="settings" size={17} />
          </button>
        </div>
      </aside>
      <header className="flex min-h-[80px] items-center justify-between gap-4 border-b border-[#eae3dd] bg-[#fffdfa]/80 px-5 sm:px-9 lg:px-10">
        <div className="lg:hidden">
          <Brand to={pathTo("/")} />
        </div>
        <span className="hidden text-sm text-[#8b7b82] lg:block">
          {active.label}
        </span>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Keyboard shortcuts"
            className="hidden! lg:inline-flex!"
            onClick={() => setModal({ kind: "shortcuts" })}
          >
            <Icon name="keyboard" size={19} />
          </Button>
          <button
            onClick={() => navigate(pathTo("/settings"))}
            aria-label="Open account settings"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-[#a3637b]"
          >
            <Avatar name={profile.name} small />
          </button>
        </div>
      </header>
      {preview && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6d6df] bg-[#f3e7ed] px-5 py-2.5 text-xs text-[#805669] sm:px-9">
          <span>Preview · Fictional data, changes aren’t saved.</span>
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
          >
            Make it yours
            <Icon name="arrow" size={13} />
          </Link>
        </div>
      )}
      <main
        id="main"
        className="mx-auto max-w-[1500px] px-5 pt-8 pb-28 sm:px-9 sm:pt-10 lg:px-10 lg:pb-12"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1
              className="text-[38px] leading-[1.12] tracking-[-0.035em] sm:text-[45px]"
              style={displayFont}
            >
              {isOverview
                ? `Your month, ${profile.name.split(" ")[0]}.`
                : active.path === "/goals"
                  ? "Savings goals."
                  : active.path === "/budgets"
                    ? "Your spending plan."
                    : active.path === "/settings"
                      ? "Settings."
                      : "Transactions."}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!["/goals", "/settings"].includes(active.path) && (
              <div className="flex h-11 items-center rounded-xl border border-[#e7dfd9] bg-white">
                <button
                  aria-label="Previous month"
                  disabled={month === "1900-01"}
                  onClick={() => setMonth(moveMonth(month, -1))}
                  className="flex size-10 items-center justify-center rounded-l-xl text-[#9b8891] hover:bg-[#f7eff1] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                >
                  <Icon name="left" size={15} />
                </button>
                <label className="relative flex min-h-11 items-center rounded-lg px-1 text-xs font-medium text-[#715563] focus-within:ring-2 focus-within:ring-[#a96b82]">
                  {monthLabel}
                  <input
                    type="month"
                    aria-label="Choose month"
                    value={month}
                    min="1900-01"
                    max="2200-12"
                    onChange={(event) => {
                      if (event.currentTarget.value)
                        setMonth(event.currentTarget.value);
                    }}
                    className="absolute inset-0 w-full cursor-pointer opacity-0"
                  />
                </label>
                <button
                  aria-label="Next month"
                  disabled={month === "2200-12"}
                  onClick={() => setMonth(moveMonth(month, 1))}
                  className="flex size-10 items-center justify-center rounded-r-xl text-[#9b8891] hover:bg-[#f7eff1] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                >
                  <Icon name="right" size={15} />
                </button>
              </div>
            )}
            {!["/goals", "/settings"].includes(active.path) &&
              month !== localDate().slice(0, 7) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonth(localDate().slice(0, 7))}
                >
                  This month
                </Button>
              )}
            {!["/settings", "/budgets"].includes(active.path) && (
              <Button
                onClick={() =>
                  setModal(
                    active.path === "/goals"
                      ? { kind: "goal" }
                      : { kind: "transaction" },
                  )
                }
                className="px-3! sm:px-5!"
              >
                <Icon name="plus" size={17} />
                <span className="hidden sm:inline">
                  {active.path === "/goals" ? "New goal" : "Add transaction"}
                </span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
        </div>
        {isOverview && (
          <>
            <MonthOverview
              summary={summary}
              profile={profile}
              month={month}
              onEditBudget={() => setModal({ kind: "monthlyBudget" })}
            />
            <BudgetAttention
              budgets={budgets ?? []}
              summary={summary}
              currency={profile.currency}
              onReview={reviewCategory}
            />
          </>
        )}
        {isOverview && emptyMonth && (
          <Card className="mt-6">
            <CardContent className="pt-8 sm:p-8">
              <h2 className="text-3xl" style={displayFont}>
                Nothing recorded in {monthLabel} yet.
              </h2>
              <p className="mt-3 mb-6 max-w-xl text-sm leading-6 text-[#79656c]">
                Start with a payday or a purchase. Your overview takes shape as
                you add them.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    setModal({
                      kind: "transaction",
                      initial: { kind: "income" },
                    })
                  }
                >
                  <Icon name="income" size={16} />
                  Record income
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModal({ kind: "transaction" })}
                >
                  <Icon name="expense" size={16} />
                  Record an expense
                </Button>
                {!goals?.length && (
                  <Button
                    variant="ghost"
                    onClick={() => setModal({ kind: "goal" })}
                  >
                    <Icon name="goals" size={16} />
                    Create a savings goal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {isOverview && !emptyMonth && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <SpendingChart
              summary={summary}
              currency={profile.currency}
              key={month}
              month={month}
              limit={profile.monthlyBudget}
              onAdd={() => setModal({ kind: "transaction" })}
            />
            <SpendingCategories
              summary={summary}
              currency={profile.currency}
              onCategory={reviewCategory}
            />
          </div>
        )}
        {isOverview && !emptyMonth && (
          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
            <TransactionList
              customCategories={customCategories.map((c) => c.name)}
              transactions={transactions}
              currency={profile.currency}
              onEdit={(value) => setModal({ kind: "transaction", value })}
              onAdd={() => setModal({ kind: "transaction" })}
              recent
              onViewAll={() => navigate(pathTo("/transactions"))}
            />
            <GoalList
              goals={goals}
              currency={profile.currency}
              onEdit={(value) => setModal({ kind: "goal", value })}
              onAdd={() => setModal({ kind: "goal" })}
              onContribute={contribute}
              compact
              onViewAll={() => navigate(pathTo("/goals"))}
            />
          </div>
        )}
        {isOverview && emptyMonth && !!goals?.length && (
          <div className="mt-6 max-w-xl">
            <GoalList
              goals={goals}
              currency={profile.currency}
              onEdit={(value) => setModal({ kind: "goal", value })}
              onAdd={() => setModal({ kind: "goal" })}
              onContribute={contribute}
              compact
              onViewAll={() => navigate(pathTo("/goals"))}
            />
          </div>
        )}
        {active.path === "/transactions" && (
          <div className="mt-6">
            <TransactionList
              key={filterCategory}
              initialCategory={filterCategory}
              customCategories={customCategories.map((c) => c.name)}
              transactions={transactions}
              currency={profile.currency}
              onEdit={(value) => setModal({ kind: "transaction", value })}
              onAdd={() => setModal({ kind: "transaction" })}
            />
          </div>
        )}
        {active.path === "/budgets" && (
          <BudgetList
            profile={profile}
            summary={summary}
            budgets={budgets}
            onEdit={(category, amount) =>
              setModal({ kind: "budget", category, amount })
            }
            onSetOverall={() => setModal({ kind: "monthlyBudget" })}
            onAdd={addBudget}
            canAdd={unusedCategories.length > 0}
            onReview={reviewCategory}
          />
        )}
        {active.path === "/goals" && (
          <GoalList
            goals={goals}
            currency={profile.currency}
            onEdit={(value) => setModal({ kind: "goal", value })}
            onAdd={() => setModal({ kind: "goal" })}
            onContribute={contribute}
          />
        )}
        {active.path === "/settings" && (
          <div className="grid max-w-5xl gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Personal preferences</CardTitle>
                <Icon name="settings" size={18} className="text-[#826b77]" />
              </CardHeader>
              <CardContent>
                <ProfileForm
                  profile={profile}
                  onSave={async (input) => {
                    await actions.saveProfile(input);
                    setToast("Your preferences are saved.");
                  }}
                />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <CategoryManager
                categories={customCategories}
                onCreate={actions.createCategory}
                onDelete={actions.deleteCategory}
              />
              <PasswordCard onSave={actions.changePassword} />
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Signed in as {profile.name}
                    </span>
                    <Button
                      variant="outline"
                      disabled={logoutBusy}
                      onClick={async () => {
                        setLogoutBusy(true);
                        try {
                          await actions.signOut();
                          navigate("/login");
                        } catch {
                          setToast("Couldn’t sign out. Please try again.");
                          setLogoutBusy(false);
                        }
                      }}
                    >
                      <Icon name="logout" size={16} />
                      {logoutBusy ? "Signing out" : "Sign out"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-[#e8dfda] bg-[#fffdfa]/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        {navItems.map((item) => (
          <Link
            to={pathTo(item.path)}
            aria-current={active.path === item.path ? "page" : undefined}
            className={`flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] focus-visible:outline-2 focus-visible:outline-[#a3637b] ${active.path === item.path ? "bg-[#f4e6ec] text-[#7b4259]" : "text-[#826b77]"}`}
          >
            <Icon name={item.icon} size={20} />
            {item.path === "/goals" ? "Goals" : item.label}
          </Link>
        ))}
      </nav>
      {modal?.kind === "transaction" && (
        <Dialog
          title={modal.value ? "Edit transaction" : "New transaction"}
          onClose={() => setModal(null)}
        >
          <TransactionForm
            customCategories={customCategories.map((c) => c.name)}
            currency={profile.currency}
            transaction={modal.value}
            initial={modal.initial}
            recentTransactions={transactions ?? []}
            defaultDate={
              month === localDate().slice(0, 7) ? localDate() : month + "-01"
            }
            onSave={async (input) => {
              await actions.saveTransaction(input, modal.value?.id);
              setMonth(input.date.slice(0, 7));
              success(
                modal.value
                  ? "Transaction updated."
                  : input.kind === "income"
                    ? "Income added."
                    : "Transaction added.",
              );
            }}
            onDelete={
              modal.value
                ? async () => {
                    await actions.deleteTransaction(modal.value!.id);
                    success("Transaction deleted.");
                  }
                : undefined
            }
          />
        </Dialog>
      )}
      {modal?.kind === "goal" && (
        <Dialog
          title={modal.value ? "Edit savings goal" : "New savings goal"}
          onClose={() => setModal(null)}
        >
          <GoalForm
            goal={modal.value}
            onSave={async (input) => {
              await actions.saveGoal(input, modal.value?.id);
              success(
                input.saved >= input.target
                  ? "You made it! Your goal is fully saved. ✨"
                  : "Goal saved.",
              );
            }}
            onDelete={
              modal.value
                ? async () => {
                    await actions.deleteGoal(modal.value!.id);
                    success("Goal deleted.");
                  }
                : undefined
            }
          />
        </Dialog>
      )}
      {modal?.kind === "budget" && (
        <Dialog
          title={modal.choose ? "New category limit" : modal.category}
          onClose={() => setModal(null)}
        >
          <BudgetForm
            category={modal.category}
            amount={modal.amount}
            currency={profile.currency}
            categories={modal.choose ? unusedCategories : undefined}
            onSave={async (amount, category) => {
              await actions.saveBudget(category, amount);
              success(amount ? "Budget saved." : "Budget removed.");
            }}
          />
        </Dialog>
      )}
      {modal?.kind === "monthlyBudget" && (
        <Dialog
          title="Your monthly spending limit"
          onClose={() => setModal(null)}
        >
          <BudgetForm
            category="Monthly spending"
            amount={profile.monthlyBudget}
            currency={profile.currency}
            onSave={async (amount) => {
              await actions.saveMonthlyBudget(amount);
              success(
                amount ? "Monthly limit saved." : "Monthly limit removed.",
              );
            }}
          />
        </Dialog>
      )}
      {modal?.kind === "contribute" && (
        <Dialog title="Add to your savings" onClose={() => setModal(null)}>
          <GoalContributionForm
            goal={modal.goal}
            currency={profile.currency}
            onSave={async (amount) => {
              await actions.addToGoal(modal.goal.id, amount);
              success("Savings updated.");
            }}
          />
        </Dialog>
      )}
      {modal?.kind === "shortcuts" && (
        <Dialog title="A few shortcuts" onClose={() => setModal(null)}>
          <dl className="space-y-4 text-sm">
            {[
              ["N", "Record a transaction"],
              ["/", "Search on the transactions page"],
              ["Esc", "Close a dialog"],
              ["?", "Show keyboard shortcuts"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <dt>{label}</dt>
                <dd>
                  <kbd className="rounded-lg border border-[#dfd2d7] bg-[#f5eeeb] px-3 py-1.5 font-mono text-xs">
                    {key}
                  </kbd>
                </dd>
              </div>
            ))}
          </dl>
        </Dialog>
      )}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-5 right-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#e0d7d2] bg-[#fffdfa] px-4 py-3.5 text-sm shadow-lg lg:bottom-6"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e5eee7] text-[#769480]">
            <Icon name="check" size={16} />
          </span>
          <span className="flex-1">{toast}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
            className="flex size-8 items-center justify-center text-[#826b77]"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function Avatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[#e2cbd2] bg-[#ead8df] font-medium text-[#75465d] ${small ? "size-9 text-xs" : "size-10 text-sm"}`}
    >
      {name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}

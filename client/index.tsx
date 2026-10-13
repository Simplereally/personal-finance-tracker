import { useEffect, useState } from "preact/hooks";
import {
  Router,
  useLocation,
  useNavigate,
  useAuth,
  canAccessApp,
  retryAuth,
  ErrorBoundary,
} from "lakebed/client";
import { client } from "./api";
import {
  localDate,
  type Profile,
  type Transaction,
  type Goal,
  type Budget,
} from "../shared/finance";
import { displayFont } from "./styles";
import type { Actions } from "./types";
import { Brand, AuthPage, Loading } from "./components/auth";
import { Preview } from "./components/preview";
import { Workspace } from "./components/workspace";
import { Button } from "./components/ui";
export function App() {
  useEffect(() => {
    document.title = "Petal — a little room to grow";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;450;500;550;600;650;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
  return (
    <div
      className="min-h-dvh bg-[#fbf8f4] text-[#49323c] antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Router>
        <ErrorBoundary
          fallback={(error, retry) => (
            <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
              <Brand />
              <h1 className="my-6 text-4xl" style={displayFont}>
                Let’s try that again.
              </h1>
              <p role="alert" className="mb-6 text-sm leading-6 text-[#87777e]">
                {error.message}
              </p>
              <Button onClick={retry}>Retry</Button>
              <a className="mt-4 text-center text-sm underline" href="/login">
                Return to sign in
              </a>
            </div>
          )}
        >
          <SessionGate />
        </ErrorBoundary>
      </Router>
    </div>
  );
}

function SessionGate() {
  const auth = useAuth();
  const location = useLocation();
  if (location.pathname.startsWith("/preview")) return <Preview />;
  if (auth.isLoading) return <Loading />;
  if (!canAccessApp())
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
        <Brand />
        <h1 className="text-4xl" style={displayFont}>
          Let’s reconnect.
        </h1>
        <p role="alert">
          {auth.error ?? "Your browser session couldn’t be started."}
        </p>
        <Button onClick={() => void retryAuth()}>Retry connection</Button>
      </div>
    );
  return <AccountGate />;
}

function AccountGate() {
  const me = client.useQuery("me");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const authPage = ["/login", "/sign-up"].includes(location.pathname);
    if (me && authPage) navigate("/");
    else if (me === null && !authPage) navigate("/login");
  }, [me, location.pathname]);
  if (me === undefined) return <Loading />;
  if (!me) return <AuthPage />;
  return <ConnectedWorkspace key={me.id} profile={me} />;
}

function ConnectedWorkspace({ profile }: { profile: Profile }) {
  const [month, setMonth] = useState(localDate().slice(0, 7));
  const overview = client.useQuery("overview", month);
  const transactions = client.useQuery("transactions", month);
  const goals = client.useQuery("goals");
  const budgets = client.useQuery("budgets");
  const customCategories = client.useQuery("categories");
  const actions: Actions = {
    saveTransaction: client.useMutation("saveTransaction"),
    deleteTransaction: client.useMutation("deleteTransaction"),
    saveGoal: client.useMutation("saveGoal"),
    deleteGoal: client.useMutation("deleteGoal"),
    saveBudget: client.useMutation("saveBudget"),
    saveProfile: client.useMutation("saveProfile"),
    changePassword: client.useMutation("changePassword"),
    signOut: client.useMutation("signOut"),
    createCategory: client.useMutation("createCategory"),
    deleteCategory: client.useMutation("deleteCategory"),
  };
  return (
    <Workspace
      customCategories={customCategories ?? []}
      profile={profile}
      month={month}
      setMonth={setMonth}
      summary={overview}
      transactions={transactions as Transaction[] | undefined}
      goals={goals as Goal[] | undefined}
      budgets={budgets as Budget[] | undefined}
      actions={actions}
    />
  );
}

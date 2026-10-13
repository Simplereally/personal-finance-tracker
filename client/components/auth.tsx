import { useEffect, useState } from "preact/hooks";
import { Link, useLocation } from "lakebed/client";
import { client } from "../api";
import { displayFont } from "../styles";
import { Icon, PetalMark } from "./icons";
import { Button, Field, Input, Progress, Spinner } from "./ui";
import { FormError } from "./forms";
export function Brand({ to = "/" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2.5 text-[#6d354d]"
      aria-label="Petal home"
    >
      <PetalMark className="size-8" />
      <span
        className="text-[35px] font-semibold tracking-[-0.045em]"
        style={displayFont}
      >
        petal<span className="text-[#bf879b]">.</span>
      </span>
    </Link>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
      <PetalMark className="size-12 text-[#af7188]" />
      <span className="text-sm text-[#87777e]">
        <Spinner label="Opening your space" />
      </span>
    </div>
  );
}

export function AuthPage() {
  const location = useLocation();
  const isSignUp = location.pathname === "/sign-up";
  const signIn = client.useMutation("signIn");
  const signUp = client.useMutation("signUp");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    setError("");
  }, [isSignUp]);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget as HTMLFormElement);
    try {
      const input = {
        email: String(data.get("email")),
        password: String(data.get("password")),
        name: String(data.get("name")),
      };
      const result = isSignUp ? await signUp(input) : await signIn(input);
      if ("error" in result && result.error) setError(result.error);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Couldn’t connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative flex flex-col overflow-hidden bg-[#eee2df] px-6 py-6 sm:px-14 lg:min-h-dvh lg:px-16 lg:py-12">
        <Brand />
        <div className="relative z-10 mx-auto hidden w-full max-w-lg flex-1 flex-col justify-center py-10 lg:flex lg:py-16">
          <p
            className="max-w-md text-5xl leading-[1.04] tracking-[-0.04em] text-[#5d3449] sm:text-7xl"
            style={displayFont}
          >
            A little room
            <br />
            to <em className="text-[#a3677f]">grow.</em>
          </p>
          <p className="mt-6 max-w-xs text-[15px] leading-7 text-[#856977]">
            Your everyday spending. Your someday plans. A home for both.
          </p>
          <div className="relative mt-10 hidden max-w-sm rotate-[-3deg] rounded-3xl border border-white/70 bg-[#fffaf5] p-6 shadow-[0_18px_45px_-25px_#8d6978] sm:block lg:mt-14">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium">A summer in Italy</span>
              <span className="flex size-11 items-center justify-center rounded-full bg-[#f5e8d9] text-xl">
                ☀️
              </span>
            </div>
            <p className="mb-1 text-4xl tracking-[-0.02em]" style={displayFont}>
              $2,450
              <span className="ml-2 font-sans text-sm text-[#9a8a90]">
                of $4,000
              </span>
            </p>
            <div className="mt-5">
              <Progress
                value={61.25}
                label="Example savings goal"
                color="#c79770"
              />
            </div>
            <span className="absolute -right-7 -top-5 flex size-20 rotate-12 items-center justify-center rounded-full border-[5px] border-[#eee2df] bg-[#7f9d87] text-white">
              <Icon name="sparkle" size={28} />
            </span>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 hidden lg:block size-[430px] rounded-full border border-[#d7bebf]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 hidden lg:block size-[335px] rounded-full border border-[#d7bebf]" />
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:py-16">
        <div className="w-full max-w-sm">
          <h1
            className="text-4xl tracking-[-0.03em] sm:text-5xl"
            style={displayFont}
          >
            {isSignUp ? "Make yourself at home." : "Welcome back."}
          </h1>
          <p className="mt-3 mb-8 text-sm leading-6 text-[#87777e]">
            {isSignUp
              ? "A fresh start for you and your money."
              : "Pick up where you left off."}
          </p>
          <form
            className="space-y-5"
            onSubmit={(event) => void submit(event)}
            key={isSignUp ? "signup" : "login"}
          >
            {isSignUp && (
              <Field label="Your name">
                <Input
                  name="name"
                  required
                  autoComplete="given-name"
                  maxLength={50}
                  placeholder="What should we call you?"
                />
              </Field>
            )}
            <Field label="Email address">
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="you@example.com"
              />
            </Field>
            <Field
              label="Password"
              hint={
                isSignUp
                  ? "At least 10 characters. Make it your own."
                  : undefined
              }
            >
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={10}
                  maxLength={128}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder={
                    isSignUp ? "Create a password" : "Enter your password"
                  }
                  className="pr-12"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-[#9d8a92] focus-visible:outline-2 focus-visible:outline-[#a3637b]"
                >
                  <Icon name="eye" size={18} />
                </button>
              </div>
            </Field>
            <FormError error={error} />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? (
                <Spinner
                  label={isSignUp ? "Creating your account" : "Signing in"}
                />
              ) : isSignUp ? (
                "Create account"
              ) : (
                "Sign in"
              )}
              {!busy && <Icon name="arrow" size={18} />}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[#87777e]">
            {isSignUp ? "Already have an account?" : "New around here?"}{" "}
            <Link
              to={isSignUp ? "/login" : "/sign-up"}
              className="font-medium text-[#763f55] underline decoration-[#d7b5c3] underline-offset-4"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <div className="mt-8 text-center">
            <Link
              to="/preview"
              className="inline-flex items-center gap-2 text-sm text-[#875e72] hover:text-[#6d354d]"
            >
              Take a look around
              <Icon name="right" size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const origin = process.env.PETAL_TEST_URL ?? "http://localhost:3000";
if (!origin.startsWith("http://localhost:") && !process.env.PETAL_HOSTED_TEST)
  throw new Error(
    "Set PETAL_HOSTED_TEST=1 to explicitly test a hosted deployment.",
  );
import { browserSession, sockets } from "./rpc.mjs";

try {
  const alice = await browserSession();
  const bob = await browserSession();
  const suffix = randomUUID().slice(0, 8);
  const password = "integration-only-password-42";
  const email = `petal-qa-${suffix}@example.invalid`;
  assert.equal(await alice.query("me"), null);
  await assert.rejects(() => alice.query("transactions", "2026-10"), /sign in/);
  const signup = await alice.mutate("signUp", {
    name: "QA Alice",
    email,
    password,
  });
  assert.ok(signup.profile?.id);
  assert.equal((await alice.query("me")).email, email);
  assert.ok(!("passwordHash" in (await alice.query("me"))));
  await alice.mutate("saveTransaction", {
    amount: 29,
    kind: "expense",
    description: "QA coffee",
    category: "Food & coffee",
    date: "2026-10-13",
    note: "integration test",
  });
  const rows = await alice.query("transactions", "2026-10");
  assert.equal(rows.length, 1);
  assert.equal((await alice.query("overview", "2026-10")).expenses, 29);
  const bobSignup = await bob.mutate("signUp", {
    name: "QA Bob",
    email: `petal-qa-bob-${suffix}@example.invalid`,
    password,
  });
  assert.ok(bobSignup.profile);
  assert.equal((await bob.query("transactions", "2026-10")).length, 0);
  await assert.rejects(
    () => bob.mutate("deleteTransaction", rows[0].id),
    /no longer available/,
  );
  await assert.rejects(
    () => bob.mutate("saveTransaction", { ...rows[0], amount: 1 }, rows[0].id),
    /no longer available/,
  );
  await assert.rejects(
    () => alice.mutate("saveTransaction", { ...rows[0], amount: 1.5 }),
    /positive amount/,
  );
  await assert.rejects(
    () => alice.mutate("saveTransaction", { ...rows[0], date: "2026-02-30" }),
    /valid date/,
  );
  await alice.mutate(
    "saveTransaction",
    { ...rows[0], amount: 650 },
    rows[0].id,
  );
  assert.equal((await alice.query("overview", "2026-10")).expenses, 650);
  await alice.mutate("createCategory", "Books & little treasures");
  const category = (await alice.query("categories"))[0];
  assert.equal(category.name, "Books & little treasures");
  assert.equal((await bob.query("categories")).length, 0);
  await assert.rejects(
    () => bob.mutate("deleteCategory", category.id),
    /no longer available/,
  );
  await assert.rejects(
    () => alice.mutate("createCategory", "books & little treasures"),
    /already have/,
  );
  await alice.mutate(
    "saveTransaction",
    { ...rows[0], amount: 650, category: category.name },
    rows[0].id,
  );
  await assert.rejects(
    () => alice.mutate("deleteCategory", category.id),
    /has transactions/,
  );
  await assert.rejects(
    () =>
      bob.mutate("saveTransaction", { ...rows[0], category: category.name }),
    /Choose a category/,
  );
  await alice.mutate("saveBudget", category.name, 10000);
  await alice.mutate("saveBudget", "Food & coffee", 45000);
  assert.ok((await alice.query("budgets")).some((b) => b.amount === 45000));
  await alice.mutate("saveGoal", {
    name: "QA holiday",
    emoji: "✈️",
    target: 300000,
    saved: 20000,
  });
  const goal = (await alice.query("goals"))[0];
  await assert.rejects(
    () => bob.mutate("addToGoal", goal.id, 100),
    /no longer available/,
  );
  for (const invalid of [0, -1, 1.5])
    await assert.rejects(
      () => alice.mutate("addToGoal", goal.id, invalid),
      /positive amount/,
    );
  await Promise.all([
    alice.mutate("addToGoal", goal.id, 100),
    alice.mutate("addToGoal", goal.id, 200),
  ]);
  assert.equal((await alice.query("goals"))[0].saved, 20300);
  await assert.rejects(
    () => alice.mutate("addToGoal", goal.id, 99_999_999_999),
    /positive amount/,
  );
  await assert.rejects(
    () => bob.mutate("deleteGoal", goal.id),
    /no longer available/,
  );
  await alice.mutate("saveProfile", {
    name: "QA Alice",
    currency: "AUD",
    monthlyBudget: 250000,
  });
  assert.equal((await alice.query("me")).monthlyBudget, 250000);
  await alice.mutate("saveMonthlyBudget", 260000);
  const updatedProfile = await alice.query("me");
  assert.equal(updatedProfile.monthlyBudget, 260000);
  assert.equal(updatedProfile.name, "QA Alice");
  assert.equal(updatedProfile.currency, "AUD");
  assert.equal((await bob.query("me")).monthlyBudget, 0);
  await assert.rejects(
    () => alice.mutate("saveMonthlyBudget", -1),
    /positive amount/,
  );
  const secondBrowser = await browserSession();
  const wrong = await secondBrowser.mutate("signIn", {
    email,
    password: "wrong-password-only",
  });
  assert.ok(wrong.error);
  const login = await secondBrowser.mutate("signIn", {
    email: email.toUpperCase(),
    password,
  });
  assert.equal(login.profile.id, signup.profile.id);
  assert.equal(
    (await secondBrowser.query("transactions", "2026-10"))[0].amount,
    650,
  );
  // The same HttpOnly guest cookie survives a fresh connection.
  const reconnect = await browserSession(secondBrowser.cookie);
  assert.equal((await reconnect.query("me")).id, signup.profile.id);
  const nextPassword = "integration-new-password-84";
  const change = await alice.mutate("changePassword", password, nextPassword);
  assert.equal(change.success, true);
  assert.equal(await secondBrowser.query("me"), null);
  await assert.rejects(
    () => secondBrowser.query("transactions", "2026-10"),
    /sign in/,
  );
  const oldLogin = await secondBrowser.mutate("signIn", { email, password });
  assert.ok(oldLogin.error);
  assert.ok(
    (await secondBrowser.mutate("signIn", { email, password: nextPassword }))
      .profile,
  );
  await alice.mutate("deleteTransaction", rows[0].id);
  await alice.mutate("deleteCategory", category.id);
  await alice.mutate("deleteGoal", goal.id);
  await alice.mutate("saveBudget", "Food & coffee", 0);
  assert.equal((await alice.query("transactions", "2026-10")).length, 0);
  assert.equal((await alice.query("goals")).length, 0);
  assert.equal((await alice.query("budgets")).length, 0);
  await alice.mutate("signOut");
  assert.equal(await alice.query("me"), null);
  for (let i = 0; i < 12; i++)
    await bob.mutate("signIn", { email: "missing@example.invalid", password });
  const blocked = await bob.mutate("signIn", {
    email: "missing@example.invalid",
    password,
  });
  assert.match(blocked.error, /Too many attempts/);
  console.log(
    "PASS: signup, sign-in, hashing, cookie reconnect, isolation, validation, CRUD, custom categories, budgets, atomic savings additions, monthly limits, preferences, password rotation, session revocation, sign-out and login throttling.",
  );
  console.log(
    `Target: ${origin}. Test accounts use example.invalid; test financial rows were removed.`,
  );
} finally {
  for (const ws of sockets) ws.close();
}

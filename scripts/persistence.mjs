import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { browserSession, sockets } from "./rpc.mjs";

const origin = process.env.PETAL_TEST_URL;
if (!origin || process.env.PETAL_HOSTED_TEST !== "1")
  throw new Error("Choose a hosted test URL and set PETAL_HOSTED_TEST=1.");
const path = ".lakebed/qa-persistence.json";
try {
  if (process.argv[2] === "prepare") {
    const session = await browserSession();
    const suffix = randomUUID().slice(0, 8);
    const email = `petal-persistence-${suffix}@example.invalid`;
    const password = randomUUID() + "-test-only";
    const result = await session.mutate("signUp", {
      name: "Persistence QA",
      email,
      password,
    });
    assert.ok(result.profile);
    await session.mutate("createCategory", "Persistence QA");
    await session.mutate("saveTransaction", {
      amount: 1850,
      kind: "expense",
      category: "Persistence QA",
      date: "2026-10-13",
      description: "Persistence test",
      note: "Synthetic QA record",
    });
    await session.mutate("saveBudget", "Persistence QA", 10000);
    await session.mutate("saveGoal", {
      name: "Persistence test",
      target: 100000,
      saved: 12345,
      emoji: "✨",
    });
    await mkdir(".lakebed", { recursive: true });
    await writeFile(
      path,
      JSON.stringify({
        origin,
        cookie: session.cookie,
        id: result.profile.id,
        email,
        password,
      }),
      { mode: 0o600 },
    );
    console.log(
      "Prepared synthetic account, transaction, category, budget and goal. Redeploy, then run verify.",
    );
  } else if (process.argv[2] === "verify") {
    const stored = JSON.parse(await readFile(path, "utf8"));
    assert.equal(stored.origin, origin);
    const session = await browserSession(stored.cookie);
    assert.equal((await session.query("me")).id, stored.id);
    const transactions = await session.query("transactions", "2026-10");
    const goals = await session.query("goals");
    const categories = await session.query("categories");
    const budgets = await session.query("budgets");
    assert.equal(transactions.length, 1);
    assert.equal(transactions[0].amount, 1850);
    assert.equal(goals.length, 1);
    assert.equal(goals[0].saved, 12345);
    assert.equal(categories.length, 1);
    assert.equal(budgets[0].amount, 10000);
    const other = await browserSession();
    const login = await other.mutate("signIn", {
      email: stored.email,
      password: stored.password,
    });
    assert.equal(login.profile.id, stored.id);
    assert.equal((await other.query("overview", "2026-10")).expenses, 1850);
    await session.mutate("deleteTransaction", transactions[0].id);
    await session.mutate("deleteGoal", goals[0].id);
    await session.mutate("deleteCategory", categories[0].id);
    await session.mutate("signOut");
    await other.mutate("signOut");
    await unlink(path);
    console.log(
      "PASS: account credentials, existing cookie, transaction, custom category, budget and savings goal persisted across redeployment. Synthetic financial rows and local credential file removed.",
    );
  } else throw new Error("Use prepare or verify.");
} finally {
  for (const ws of sockets) ws.close();
}

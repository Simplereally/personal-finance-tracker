import test from "node:test";
import assert from "node:assert/strict";
import {
  cents,
  validateDate,
  validateMonth,
  validateTransaction,
  summarize,
  csv,
  normalizeEmail,
  moveMonth,
} from "../shared/finance.ts";
import {
  hashPassword,
  constantTimeEqual,
  newSalt,
} from "../server/password.ts";

test("money uses exact cents and rejects ambiguous or fractional-cent input", () => {
  assert.equal(cents("0.29"), 29);
  assert.equal(cents("10.1"), 1010);
  assert.equal(cents("0", true), 0);
  for (const value of [
    "0",
    "-2",
    "1.999",
    "1e3",
    "Infinity",
    "1,000",
    "",
    "1.2.3",
  ])
    assert.throws(() => cents(value));
});
test("calendar validation catches rollover dates, leap years and invalid months", () => {
  assert.equal(validateDate("2024-02-29"), "2024-02-29");
  for (const value of [
    "2025-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-01",
    "26-01-01",
  ])
    assert.throws(() => validateDate(value));
  assert.throws(() => validateMonth("2026-13"));
  assert.equal(moveMonth("2026-12", 1), "2027-01");
  assert.equal(moveMonth("2026-01", -1), "2025-12");
});
test("monthly summaries reconcile income, expenses, daily totals and categories", () => {
  const row = {
    id: "1",
    description: "Coffee",
    date: "2026-10-01",
    note: "",
    category: "Food & coffee",
    kind: "expense",
    amount: 29,
  };
  const summary = summarize(
    [
      row,
      { ...row, id: "2", amount: 101 },
      { ...row, id: "3", kind: "income", category: "Income", amount: 10000 },
      { ...row, id: "4", date: "2026-09-30", amount: 1000 },
    ],
    "2026-10",
  );
  assert.equal(summary.income, 10000);
  assert.equal(summary.expenses, 130);
  assert.equal(summary.balance, 9870);
  assert.equal(summary.daily[0], 130);
  assert.equal(summary.daily.length, 31);
  assert.equal(summary.categories[0].amount, 130);
});
test("transaction validation rejects malformed money, direction and categories", () => {
  const input = {
    amount: 650,
    description: " Coffee ",
    date: "2026-10-13",
    category: "Food & coffee",
    kind: "expense",
    note: "",
  };
  assert.equal(validateTransaction(input).description, "Coffee");
  for (const bad of [
    { amount: 6.5 },
    { amount: -650 },
    { kind: "transfer" },
    { category: "unknown" },
    { note: "x".repeat(501) },
    { description: "\u0000oops" },
  ])
    assert.throws(() => validateTransaction({ ...input, ...bad }));
  assert.equal(normalizeEmail("  Sophie@Example.com  "), "sophie@example.com");
  assert.throws(() => normalizeEmail("not an email"));
});
test("CSV safely quotes commas, quotes and spreadsheet formulas", () => {
  const output = csv(
    [
      {
        id: "1",
        description: '=HYPERLINK("bad")',
        note: 'one, "two"',
        date: "2026-10-13",
        amount: 29,
        category: "Other",
        kind: "expense",
      },
    ],
    "AUD",
  );
  assert.match(output, /'=HYPERLINK/);
  assert.match(output, /"one, ""two"""/);
  assert.match(output, /"0.29"/);
});
test("passwords are salted with Web Crypto and compared without early exits", async () => {
  const salt = newSalt();
  assert.match(salt, /^[a-f0-9]{32}$/);
  const hash = await hashPassword("test-password-only", salt);
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(await hashPassword("test-password-only", salt), hash);
  assert.notEqual(await hashPassword("test-password-only", newSalt()), hash);
  assert.equal(constantTimeEqual(hash, hash), true);
  assert.equal(constantTimeEqual(hash, "bad"), false);
});

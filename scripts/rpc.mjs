import assert from "node:assert/strict";
import { once } from "node:events";
import WebSocket from "ws";
const origin = process.env.PETAL_TEST_URL ?? "http://localhost:3000";
export const sockets = [];
export async function browserSession(cookie) {
  const response = await fetch(origin + "/__lakebed/auth/session", {
    method: "POST",
    headers: { Origin: origin, ...(cookie ? { Cookie: cookie } : {}) },
  });
  assert.equal(response.status, 200);
  const session = await response.json();
  assert.ok(session.auth?.userId);
  const credential =
    cookie ?? response.headers.get("set-cookie")?.split(";")[0];
  assert.ok(credential);
  const ws = new WebSocket(origin.replace(/^http/, "ws") + "/__lakebed/ws", {
    headers: { Origin: origin, Cookie: credential },
  });
  sockets.push(ws);
  await once(ws, "open");
  let serial = 0;
  const pending = new Map();
  ws.on("message", (value) => {
    const message = JSON.parse(String(value));
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    clearTimeout(handler.timeout);
    if (
      message.op === "error" ||
      message.op === "query.error" ||
      message.ok === false
    )
      handler.reject(new Error(message.error));
    else
      handler.resolve(
        message.op === "query.result" ? message.data : message.result,
      );
  });
  const call = (op, name, args) =>
    new Promise((resolve, reject) => {
      const id = ++serial;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`${name} timed out`));
      }, 12000);
      pending.set(id, { resolve, reject, timeout });
      ws.send(JSON.stringify({ op, id, name, args }));
    });
  return {
    cookie: credential,
    query: (name, ...args) => call("query.subscribe", name, args),
    mutate: (name, ...args) => call("mutation.run", name, args),
  };
}

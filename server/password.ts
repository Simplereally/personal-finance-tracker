// Web Crypto is provided by Lakebed's server runtime. No password leaves the server.
const ITERATIONS = 600_000;
function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
function fromHex(value: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(
    value.match(/.{2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
  );
}
export function newSalt(): string {
  return hex(crypto.getRandomValues(new Uint8Array(16)));
}
export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: fromHex(salt),
      iterations: ITERATIONS,
    },
    key,
    256,
  );
  return hex(new Uint8Array(result));
}
export function constantTimeEqual(a: string, b: string): boolean {
  let difference = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
}

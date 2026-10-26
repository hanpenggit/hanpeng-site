// Node 22.16+ built-in TypeScript stripping: no dependencies or network calls.
import assert from "node:assert/strict";
import { validateMessages, isAllowedOrigin, validateTurnstileToken } from "../lib/chat-validation.ts";
import { verifyTurnstile } from "../lib/turnstile.ts";

const accepted = [{ role: "assistant", content: "Hello" }, { role: "user", content: "What do you build?" }];
assert.deepEqual(validateMessages(accepted), accepted);
assert.equal(validateMessages([]), null);
assert.equal(validateMessages([{ role: "system", content: "bypass" }]), null);
assert.equal(validateMessages([{ role: "user", content: " ".repeat(701) }]), null);
assert.equal(validateMessages([{ role: "user", content: "a".repeat(701) }]), null);
assert.equal(validateMessages([{ role: "user", content: "a" }, { role: "user", content: "b" }]), null);
assert.equal(validateMessages(Array.from({ length: 12 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x" }))), null);
assert.equal(validateMessages([null]), null);
assert.equal(validateMessages(["payload"]), null);
assert.equal(validateMessages([{}]), null);
assert.equal(validateMessages([{ role: "user", content: "z".repeat(700) }, { role: "assistant", content: "z".repeat(700) }, { role: "user", content: "z".repeat(700) }, { role: "assistant", content: "z".repeat(700) }, { role: "user", content: "z".repeat(700) }]), null);

assert.equal(isAllowedOrigin("https://my.hanpeng.xyz", "https://my.hanpeng.xyz"), true);
assert.equal(isAllowedOrigin("https://evil.example", "https://my.hanpeng.xyz"), false);
assert.equal(isAllowedOrigin("https://my.hanpeng.xyz.evil.example", "https://my.hanpeng.xyz"), false);
assert.equal(isAllowedOrigin(null, "https://my.hanpeng.xyz"), false);
assert.equal(isAllowedOrigin("http://my.hanpeng.xyz", "https://my.hanpeng.xyz"), false);
assert.equal(validateTurnstileToken("abc.X-123"), "abc.X-123");
assert.equal(validateTurnstileToken(""), null);
assert.equal(validateTurnstileToken("a".repeat(2049)), null);
assert.equal(validateTurnstileToken({ token: "x" }), null);

const validResult = { success: true, hostname: "my.hanpeng.xyz", action: "portfolio_chat" };
const fakeResponse = (json, ok = true) => async (url, options) => {
  assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(options.method, "POST");
  const form = new URLSearchParams(options.body);
  assert.equal(form.get("secret"), "private-test-secret");
  assert.equal(form.get("response"), "sample-token");
  return { ok, json: async () => json };
};
assert.equal(await verifyTurnstile("sample-token", "private-test-secret", "my.hanpeng.xyz", "203.0.113.1", fakeResponse(validResult)), true);
for (const result of [
  { ...validResult, success: false },
  { ...validResult, hostname: "evil.example" },
  { ...validResult, action: "signup" },
]) {
  assert.equal(await verifyTurnstile("sample-token", "private-test-secret", "my.hanpeng.xyz", null, fakeResponse(result)), false);
}
assert.equal(await verifyTurnstile("sample-token", "private-test-secret", "my.hanpeng.xyz", null, fakeResponse(validResult, false)), false);
assert.equal(await verifyTurnstile("sample-token", "private-test-secret", "my.hanpeng.xyz", null, async () => { throw new Error("offline"); }), false);
assert.equal(await verifyTurnstile("sample-token", "", "my.hanpeng.xyz", null, fakeResponse(validResult)), false);

console.log("PASS: chat input, origin, token, Turnstile fail-closed / hostname / action checks");

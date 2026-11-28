import { webcrypto } from "node:crypto";

// jsdom has no Web Crypto subtle API, so password hashing (PBKDF2) would fail in tests. Use Node's implementation.
if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

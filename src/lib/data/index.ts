import { mockAdapter } from "./mock";
import type { DataAdapter } from "./types";

// "supabase" is wired in once the owner creates the project (see docs/owner-tasks.md).
export const data: DataAdapter = mockAdapter;
export * from "./types";

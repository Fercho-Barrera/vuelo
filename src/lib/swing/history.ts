import { data } from "../data";
import { deleteClip, saveClip } from "../clips";
import type { Frame, Result } from "./analysis";
import { swingsToPrune, type PlanId, isPro } from "../plan";
import { toRecord, type SwingRecord } from "./record";

export const listSwings = async (): Promise<SwingRecord[]> => (await data.getSwings()).sort((a, b) => b.date.localeCompare(a.date));

export async function saveAnalysis(result: Extract<Result, { ok: true }>, frames: Frame[], thumb: string | null, clip: Blob, plan: PlanId): Promise<SwingRecord> {
  const id = `s${Date.now()}`;
  // Only Pro can watch saved clips again, so free users keep the analysis without the video.
  const hasClip = isPro(plan) ? await saveClip(id, clip) : false;
  const rec = toRecord(id, new Date().toISOString(), result, frames, thumb, hasClip);
  await data.saveSwing(rec);
  for (const old of swingsToPrune(plan, await listSwings(), new Date())) await removeSwing(old.id);
  return rec;
}

export async function removeSwing(id: string) {
  await data.deleteSwing(id);
  await deleteClip(id);
}

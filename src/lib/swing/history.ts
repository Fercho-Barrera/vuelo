import { data } from "../data";
import { deleteClip, saveClip } from "../clips";
import type { Frame, Result } from "./analysis";
import { MAX_SAVED, toRecord, type SwingRecord } from "./record";

export const listSwings = async (): Promise<SwingRecord[]> => (await data.getSwings()).sort((a, b) => b.date.localeCompare(a.date));

export async function saveAnalysis(result: Extract<Result, { ok: true }>, frames: Frame[], thumb: string | null, clip: Blob): Promise<SwingRecord> {
  const id = `s${Date.now()}`;
  const hasClip = await saveClip(id, clip);
  const rec = toRecord(id, new Date().toISOString(), result, frames, thumb, hasClip);
  await data.saveSwing(rec);
  for (const old of (await listSwings()).slice(MAX_SAVED)) await removeSwing(old.id);
  return rec;
}

export async function removeSwing(id: string) {
  await data.deleteSwing(id);
  await deleteClip(id);
}

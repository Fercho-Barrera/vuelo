import type { Frame } from "./analysis";

const BASE = `${import.meta.env.BASE_URL}mediapipe`;
const STEP = 1 / 30;
const MAX_SECONDS = 12;

export type Extraction = { frames: Frame[]; sampled: number };

const once = (el: HTMLVideoElement, ev: string) => new Promise<void>((res) => el.addEventListener(ev, () => res(), { once: true }));

// Recorded webm often reports an infinite duration until the end is reached once.
async function durationOf(v: HTMLVideoElement): Promise<number> {
  if (Number.isFinite(v.duration)) return v.duration;
  v.currentTime = 1e6;
  await once(v, "seeked");
  const d = v.currentTime;
  v.currentTime = 0;
  await once(v, "seeked");
  return d;
}

// Samples the clip at 30 fps and returns pose landmarks (normalised x,y) for each frame where a person was found.
export async function extractPose(url: string, onProgress: (p: number) => void): Promise<Extraction> {
  const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
  const files = await FilesetResolver.forVisionTasks(`${BASE}/wasm`);
  const landmarker = await PoseLandmarker.createFromOptions(files, {
    baseOptions: { modelAssetPath: `${BASE}/pose_landmarker_lite.task` },
    runningMode: "VIDEO",
    numPoses: 1,
  });
  const v = document.createElement("video");
  v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
  try {
    await once(v, "loadeddata");
    const dur = Math.min(await durationOf(v), MAX_SECONDS);
    const frames: Frame[] = [];
    const total = Math.max(1, Math.floor(dur / STEP));
    for (let i = 0; i < total; i++) {
      const t = i * STEP;
      v.currentTime = t;
      await once(v, "seeked");
      const r = landmarker.detectForVideo(v, Math.round(t * 1000) + 1);
      const lm = r.landmarks[0];
      if (lm) frames.push({ t, lm: lm.map((p) => ({ x: p.x, y: p.y })) });
      onProgress((i + 1) / total);
    }
    return { frames, sampled: total };
  } finally {
    landmarker.close();
    v.removeAttribute("src");
    v.load();
  }
}

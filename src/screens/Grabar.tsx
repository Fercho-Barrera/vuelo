import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonAnchor, ButtonLink, Card, PillSelector } from "../components/glass";
import { SwingReview } from "../components/SwingReview";
import { PROBLEM_TEXT, classifyError, extensionFor, pickMime, type CameraProblem, type Facing } from "../lib/camera";
import { analyzeSwing, type Frame, type Result } from "../lib/swing/analysis";
import { extractPose } from "../lib/swing/extract";
import { saveAnalysis } from "../lib/swing/history";
import type { SwingRecord } from "../lib/swing/record";
import { Coach } from "./Coach";

type Mode = "swing" | "ball";
type Clip = { url: string; blob: Blob; mime: string };
type Analysis =
  | { state: "idle" }
  | { state: "busy"; p: number }
  | { state: "error" }
  | { state: "done"; result: Result; frames: Frame[]; saved: SwingRecord | null };
const COUNTDOWN = 5;

export function Grabar() {
  const [mode, setMode] = useState<Mode>("swing");
  const [facing, setFacing] = useState<Facing>("environment");
  const [problem, setProblem] = useState<CameraProblem | null>(null);
  const [live, setLive] = useState(false);
  const [fps, setFps] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [clip, setClip] = useState<Clip | null>(null);
  const [analysis, setAnalysis] = useState<Analysis>({ state: "idle" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  const start = useCallback(async (want: Facing) => {
    stop();
    setProblem(null);
    const api = typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
    try {
      if (!window.isSecureContext || !api) throw new Error("insecure");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: want }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 120 } },
      });
      streamRef.current = stream;
      setFps(Math.round(stream.getVideoTracks()[0]?.getSettings().frameRate ?? 0) || null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        void videoRef.current.play().catch(() => undefined);
      }
      setLive(true);
    } catch (e) {
      setProblem(classifyError(e, window.isSecureContext, api));
    }
  }, [stop]);

  // Open the camera on screen entry (not while reviewing a clip) and always release it on exit.
  useEffect(() => {
    if (clip) return;
    void start(facing);
    return stop;
  }, [facing, clip, start, stop]);

  useEffect(() => () => { window.clearInterval(timer.current); }, []);
  useEffect(() => () => { if (clip) URL.revokeObjectURL(clip.url); }, [clip]);

  const begin = () => {
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") { setProblem("other"); return; }
    const mime = pickMime((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 8_000_000 } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const type = rec.mimeType || mime || "video/webm";
      const blob = new Blob(chunks, { type });
      setClip({ url: URL.createObjectURL(blob), blob, mime: type });
      setRecording(false);
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const analyze = async () => {
    if (!clip) return;
    setAnalysis({ state: "busy", p: 0 });
    try {
      const { frames, thumb } = await extractPose(clip.url, (p) => setAnalysis({ state: "busy", p }));
      const result: Result = frames.length < 20
        ? { ok: false, reason: "No detectamos a una persona en el video. Encuádrate de cuerpo completo, con buena luz.", faults: [] }
        : analyzeSwing(frames);
      const saved = result.ok ? await saveAnalysis(result, frames, thumb, clip.blob).catch(() => null) : null;
      setAnalysis({ state: "done", result, frames, saved });
    } catch {
      setAnalysis({ state: "error" });
    }
  };

  const press = () => {
    if (recording) { recRef.current?.stop(); return; }
    if (count !== null) { window.clearInterval(timer.current); setCount(null); return; }
    if (mode === "ball") { begin(); return; }
    let n = COUNTDOWN;
    setCount(n);
    timer.current = window.setInterval(() => {
      n -= 1;
      if (n <= 0) { window.clearInterval(timer.current); setCount(null); begin(); } else setCount(n);
    }, 1000);
  };

  if (clip) {
    const done = analysis.state === "done" ? analysis : null;
    const ok = done?.result.ok ? done.result : null;
    return (
      <main className="screen">
        <h1>Tu video</h1>
        <SwingReview
          src={clip.url}
          frames={ok ? done!.frames : null}
          faults={ok ? ok.faults.map((f) => f.id) : []}
          times={ok && done!.saved ? done!.saved.times : null}
        />
        {mode === "swing" && !done && (
          <Button block variant="primary" disabled={analysis.state === "busy"} onClick={() => void analyze()}>
            {analysis.state === "busy" ? `Analizando… ${Math.round(analysis.p * 100)}%` : "Analizar mi swing"}
          </Button>
        )}
        {analysis.state === "error" && <span className="muted">No pudimos analizar el video. Intenta de nuevo.</span>}
        {done && <Coach result={done.result} />}
        {done?.saved && <Card tight><span>Guardado en <Link to="/grabar/historial">Mis swings</Link>. Ahí puedes compararlo con otros.</span></Card>}
        <ButtonAnchor block href={clip.url} download={`vuelo-${mode}.${extensionFor(clip.mime)}`}>Guardar video en mi celular</ButtonAnchor>
        <Button block onClick={() => { setAnalysis({ state: "idle" }); setClip(null); }}>Grabar otro</Button>
      </main>
    );
  }

  return (
    <main className="screen">
      <h1>Grabar</h1>
      <PillSelector<Mode> label="Modo" value={mode} onChange={setMode} options={[{ value: "swing", label: "Mi swing" }, { value: "ball", label: "Mi bola" }]} />
      <div className="viewfinder">
        <video ref={videoRef} muted playsInline className="viewfinder__video" data-mirror={facing === "user"} />
        {!live && !problem && <span style={{ position: "relative", zIndex: 1 }}>Abriendo cámara…</span>}
        {problem && <div className="stack" style={{ position: "relative", zIndex: 1 }}><strong style={{ color: "#fff" }}>{PROBLEM_TEXT[problem]}</strong></div>}
        {live && count === null && !recording && (
          <span className="viewfinder__hint">{mode === "swing" ? "Encuadra tu swing de cuerpo completo" : "Apunta hacia donde va la bola"}</span>
        )}
        {count !== null && <span className="viewfinder__count" aria-live="assertive">{count}</span>}
        {recording && <span className="viewfinder__rec">● Grabando</span>}
      </div>
      <button type="button" className="rec" onClick={press} disabled={!live} aria-label={recording ? "Detener" : count !== null ? "Cancelar cuenta" : "Grabar"} data-on={recording} />
      <div className="row">
        <Button onClick={() => setFacing(facing === "environment" ? "user" : "environment")} disabled={recording || count !== null}>Voltear cámara</Button>
        {problem && <Button onClick={() => void start(facing)}>Reintentar</Button>}
      </div>
      <ButtonLink block to="/grabar/historial">Mis swings</ButtonLink>
      <Card tight>
        <span className="muted">
          {mode === "swing" ? `Apoya el celular en vertical y de frente o por detrás. Al grabar hay ${COUNTDOWN} segundos para ponerte en posición. ` : "El trazado y la velocidad siempre se muestran como aprox. "}
          {fps ? `Tu cámara graba a ${fps} fps en el navegador.` : ""}
        </span>
      </Card>
    </main>
  );
}

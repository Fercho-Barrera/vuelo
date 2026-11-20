import { useEffect, useState } from "react";
import { getClip } from "../clips";

// Object URL for a saved clip, or null while loading / if the video is gone.
export function useClipUrl(id: string | undefined, hasClip: boolean): { url: string | null; loading: boolean } {
  const [state, setState] = useState<{ url: string | null; loading: boolean }>({ url: null, loading: hasClip });
  useEffect(() => {
    if (!id || !hasClip) { setState({ url: null, loading: false }); return; }
    let url: string | null = null, alive = true;
    void getClip(id).then((b) => {
      if (!alive) return;
      url = b ? URL.createObjectURL(b) : null;
      setState({ url, loading: false });
    });
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [id, hasClip]);
  return state;
}

import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Home and the top-level tabs all count as depth 1, so switching between them is a tab change, not a push.
const depth = (p: string) => Math.max(1, p.split("/").filter(Boolean).length);

// Screens fade in; going deeper slides in from the right, going back from the left, switching tabs rises a little.
// Enter only, with no fill after the animation: a lingering transform would break the fixed sheets inside screens.
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const dir = depth(pathname) > depth(prev.current) ? "forward" : depth(pathname) < depth(prev.current) ? "back" : "tab";
  useEffect(() => {
    if (prev.current !== pathname) window.scrollTo(0, 0);
    prev.current = pathname;
  }, [pathname]);
  return <div key={pathname} className="page" data-dir={dir}>{children}</div>;
}

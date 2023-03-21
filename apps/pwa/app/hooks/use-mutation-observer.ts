import type { RefObject } from "react";
import { useEffect, useRef } from "react";

export default function useMutationObserver(
  callback: MutationCallback,
  target: RefObject<Element>,
  deps: any[]
) {
  const observerRef = useRef<MutationObserver | undefined>(undefined);

  useEffect(() => {
    if (target?.current) {
      observerRef.current = new MutationObserver(callback);
      observerRef.current?.observe(target.current, {
        childList: true,
        subtree: true,
      });
      return () => {
        observerRef.current?.disconnect();
      };
    }
    //	eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

import { MutableRefObject, useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
  root?: Element;
  rootMargin?: string;
  onIntersect?(): void;
}

type HookReturnType = [MutableRefObject<null>, IntersectionObserverEntry?];

export function useIntersectionObserver(options: Options = {}): HookReturnType {
  const {
    threshold = 1.0,
    root = null,
    rootMargin = "0px",
    onIntersect,
  } = options;
  const targetRef = useRef(null);

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const currentRef = targetRef.current;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          onIntersect?.();
        }
        setEntry(entry);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return function () {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, [threshold, root, rootMargin, onIntersect]);

  return [targetRef, entry];
}

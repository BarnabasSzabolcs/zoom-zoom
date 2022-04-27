import { useEffect, useRef } from "react";

// ref: https://benestudio.co/guide-to-access-previous-props-or-state-in-react-hooks/
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
 }

 // ref: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 // demo: https://codesandbox.io/s/mystifying-vaughan-io26dq?file=/src/index.js
 export function useInterval(callback: ()=>void, delay: number | null) {
  const savedCallback = useRef<()=>void>();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

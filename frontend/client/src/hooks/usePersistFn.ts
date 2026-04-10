import { useRef, useCallback } from "react"

type Fn<T extends unknown[], R> = (...args: T) => R

function usePersistFn<T extends unknown[], R>(fn: Fn<T, R>): Fn<T, R> {
  const fnRef = useRef<Fn<T, R>>(fn)
  fnRef.current = fn
  return useCallback((...args: T) => fnRef.current(...args), [])
}

export { usePersistFn }
export default usePersistFn

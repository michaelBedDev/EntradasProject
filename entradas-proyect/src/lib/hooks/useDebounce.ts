import { useEffect, useState } from "react";

/**
 * Hook personalizado para implementar debounce en un valor
 * @param value - El valor a debounce
 * @param delay - El tiempo de espera en milisegundos
 * @returns El valor debounceado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

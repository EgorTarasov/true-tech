import { GenericAbortSignal } from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: any;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

type DebouncedFunction<Args extends any[], Return> = (...args: Args) => Promise<Return>;

export const debounceAsync = <Args extends any[], Return>(
  fn: (signal: GenericAbortSignal, ...args: Args) => Promise<Return>,
  delay: number
): DebouncedFunction<Args, Return> => {
  let timer: NodeJS.Timeout | null = null;
  let controller: AbortController | null = null;

  return async function (...args: Args): Promise<Return> {
    if (timer) {
      clearTimeout(timer);
    }

    if (controller) {
      controller.abort();
    }

    controller = new AbortController();
    const signal = controller.signal;

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await fn(signal, ...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);

      signal.addEventListener("abort", () => {
        // reject(new Error("Operation aborted"));
      });
    });
  };
};

export const throttle = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: any;

  return (...args: Parameters<F>): void => {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = undefined;
      }, waitFor);
    }
  };
};

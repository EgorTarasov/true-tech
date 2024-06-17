import { FC, useEffect, useState } from "react";

export type FCVM<T> = FC<{ vm: T }>;

export interface DisposableVm {
  dispose(): void;
}

export const useViewModel = <T extends DisposableVm>(_vm: new () => T): T => {
  const [vm] = useState(() => new _vm());

  useEffect(() => vm.dispose, [vm]);

  return vm;
};

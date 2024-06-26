import { ComboboxMultipleProps } from "@/components/DropdownMultiple";
import { makeAutoObservable } from "mobx";

export const buildFilterKey = <T,>(
  item: T,
  keys: {
    getValue: (v: T) => string | null;
    name: string;
  }[],
  map: Map<string, Set<string>>,
) => {
  keys.forEach((k) => {
    const value = k.getValue(item);
    if (value) {
      const key = k.name;
      const values = map.get(key) || new Set();
      values.add(value);

      if (!map.get(key)) {
        map.set(key, values);
      }
    }
  });
};

export interface FilterKey {
  getValue: () => string | null;
  name: string;
  values: string[];
}

export class Filter<T> {
  constructor(
    public readonly name: string,
    public readonly options: string[],
    public readonly getValue: (v: T) => string | null,
  ) {
    makeAutoObservable(this);
  }

  private _value: string[] = [];

  get attributes(): ComboboxMultipleProps<string> {
    return {
      value: this._value,
      placeholder: this._value.length === 0 ? "Все" : undefined,
      options: this.options,
      label: this.name,
      compare: (v) => v,
      onChange: (v: string[]) => {
        if (v.length === this.options.length) {
          v = [];
        }
        this._value = v;
      },
      render: (v) => v,
    };
  }

  get values(): string[] {
    return this._value.length === 0 ? this.options : this._value;
  }

  reset() {
    this._value = [];
  }
}

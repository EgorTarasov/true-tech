// legacy

import {
  Combobox,
  Transition,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Label,
  ComboboxInput
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";

export interface ComboboxMultipleProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  options: readonly T[];
  compare: (value: T) => string;
  render: (value: T) => React.ReactNode;
  label?: string;
  placeholder?: string;
}

const DropdownMultiple = observer(<T,>(p: ComboboxMultipleProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const filteredOptions =
    query === ""
      ? p.options
      : p.options.filter((option) =>
          p
            .compare(option)
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const placeholder = (function () {
    const values = p.value.map((v) => p.compare(v));
    if (values.length > 2) {
      return `${values[0]}, ${values[1]} +${values.length - 2}`;
    }
    return values.join(", ") || (p.placeholder ?? "");
  })();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (inputFocused) {
          event.stopPropagation();
          inputRef.current?.blur();
          setInputFocused(false);
        }
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [inputFocused]);

  return (
    <Combobox value={p.value} multiple onChange={p.onChange}>
      <div className="relative text-sm">
        {p.label && <Label className="text-sm">{p.label}</Label>}
        <div className={cn("relative h-fit flex items-center w-full", p.label && "mt-2")}>
          <ComboboxInput
            ref={inputRef}
            className="whitespace-nowrap w-full bg-background border-input text-card-foreground cursor-pointer pr-8 text-ellipsis border rounded-lg px-3 py-2"
            placeholder={placeholder}
            onFocus={(e) => {
              e.preventDefault();
              setQuery("");
              setInputFocused(true);
            }}
            onBlur={(e) => {
              if (e.relatedTarget instanceof HTMLLIElement) return;

              setInputFocused(false);
            }}
            displayValue={() => (inputFocused ? "" : placeholder)}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="h-5 w-5 absolute right-2 text-accent-foreground">
            <ChevronDownIcon className={cn("transition-all", inputFocused && "rotate-180")} />
          </ComboboxButton>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={inputFocused}
          afterLeave={() => setQuery("")}>
          <ComboboxOptions
            className="absolute z-10 mt-1 max-h-60 w-full border overflow-auto rounded-xl py-2 bg-card text-card-foreground"
            style={{
              scrollbarWidth: "thin"
            }}>
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="px-4 py-2 text-muted-foreground">Ничего не найдено</div>
            ) : (
              filteredOptions.map((option, index) => (
                <ComboboxOption
                  key={index}
                  value={option}
                  className={({ focus }) =>
                    cn(
                      "p-2 cursor-pointer flex justify-between hover:bg-accent items-center",
                      focus && "bg-accent"
                    )
                  }>
                  {({ selected }) => (
                    <>
                      <span>{p.render(option)}</span>
                      {selected && <CheckIcon className="w-5 h-5" />}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
            {}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
});

export default DropdownMultiple;

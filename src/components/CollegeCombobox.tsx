"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CollegeComboboxProps = {
  colleges: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

const MAX_RESULTS = 12;

export function CollegeCombobox({ colleges, value, onChange }: CollegeComboboxProps) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return colleges.slice(0, MAX_RESULTS);

    return colleges
      .filter((college) => college.toLowerCase().includes(normalized))
      .slice(0, MAX_RESULTS);
  }, [colleges, query]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Search and select your college"
          className="pr-10 pl-9"
        />
        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {open ? (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-lg border bg-white p-1 shadow-xl"
        >
          {suggestions.length ? (
            suggestions.map((college) => {
              const selected = value === college;
              return (
                <button
                  key={college}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
                    selected && "bg-muted",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery(college);
                    onChange(college);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mt-0.5 h-4 w-4 text-accent", selected ? "opacity-100" : "opacity-0")} />
                  <span>{college}</span>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              No exact match found. You can continue with the college name you typed.
            </div>
          )}
        </div>
      ) : null}

      <p className="mt-2 text-xs text-muted-foreground">
        Start typing to search Indian colleges. If yours is missing, keep your typed college name.
      </p>
    </div>
  );
}

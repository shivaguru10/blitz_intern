"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CollegeSuggestion = {
  name: string;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  source?: string;
};

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
  const [remoteSuggestions, setRemoteSuggestions] = useState<CollegeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"aishe" | "local">("local");

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

  const localSuggestions = useMemo<CollegeSuggestion[]>(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return colleges.slice(0, MAX_RESULTS).map((name) => ({ name, source: "local" }));
    }

    return colleges
      .filter((college) => college.toLowerCase().includes(normalized))
      .slice(0, MAX_RESULTS)
      .map((name) => ({ name, source: "local" }));
  }, [colleges, query]);

  useEffect(() => {
    const search = query.trim();
    if (search.length < 2) {
      setRemoteSuggestions([]);
      setSource("local");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/colleges?search=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("College search failed");
        const payload = (await response.json()) as {
          colleges?: CollegeSuggestion[];
          source?: "aishe" | "local";
        };
        setRemoteSuggestions(payload.colleges ?? []);
        setSource(payload.source ?? "local");
      } catch {
        if (!controller.signal.aborted) {
          setRemoteSuggestions([]);
          setSource("local");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 280);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const suggestions = remoteSuggestions.length ? remoteSuggestions : localSuggestions;

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
          {loading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground">Searching Indian colleges...</div>
          ) : suggestions.length ? (
            suggestions.map((college) => {
              const selected = value === college.name;
              return (
                <button
                  key={`${college.name}-${college.city ?? ""}-${college.state ?? ""}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
                    selected && "bg-muted",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery(college.name);
                    onChange(college.name);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mt-0.5 h-4 w-4 text-accent", selected ? "opacity-100" : "opacity-0")} />
                  <span>
                    <span className="block font-medium">{college.name}</span>
                    {college.city || college.state ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {[college.city, college.state].filter(Boolean).join(", ")}
                      </span>
                    ) : null}
                  </span>
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
        {query.trim().length >= 2 && source === "aishe"
          ? "Suggestions are fetched from an AISHE-based Indian colleges directory."
          : "Start typing to search Indian colleges. If yours is missing, keep your typed college name."}
      </p>
    </div>
  );
}

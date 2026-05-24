import { NextResponse } from "next/server";
import { INDIAN_COLLEGES } from "@/lib/indian-colleges";

type ExternalCollege = {
  Name?: string;
  State?: string;
  City?: string;
  Address_line1?: string;
  Address_line2?: string;
};

const API_BASE_URL = "https://colleges-api.onrender.com/colleges";
const MAX_RESULTS = 12;

function localSearch(search: string) {
  const normalized = search.trim().toLowerCase();
  const matches = normalized
    ? INDIAN_COLLEGES.filter((college) => college.toLowerCase().includes(normalized))
    : INDIAN_COLLEGES;

  return matches.slice(0, MAX_RESULTS).map((name) => ({ name, source: "local" }));
}

function normalizeCollege(college: ExternalCollege) {
  const name = college.Name?.trim();
  if (!name) return null;

  return {
    name,
    city: college.City?.trim() || null,
    state: college.State?.trim() || null,
    address: [college.Address_line1, college.Address_line2]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ")
      .trim() || null,
    source: "aishe",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";

  if (search.length < 2) {
    return NextResponse.json({ colleges: localSearch(search), source: "local" });
  }

  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.set("search", search);
    url.searchParams.set("limit", String(MAX_RESULTS));
    url.searchParams.set("page", "1");

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(4500),
    });

    if (!response.ok) {
      return NextResponse.json({ colleges: localSearch(search), source: "local" });
    }

    const payload = (await response.json()) as { colleges?: ExternalCollege[] };
    const colleges = (payload.colleges ?? [])
      .map(normalizeCollege)
      .filter((college): college is NonNullable<ReturnType<typeof normalizeCollege>> => Boolean(college));

    if (!colleges.length) {
      return NextResponse.json({ colleges: localSearch(search), source: "local" });
    }

    return NextResponse.json({ colleges, source: "aishe" });
  } catch {
    return NextResponse.json({ colleges: localSearch(search), source: "local" });
  }
}

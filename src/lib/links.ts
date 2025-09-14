// lib/links.ts
export type Store = "1mg" | "PharmEasy" | "Netmeds" | "Apollo247";

const TEMPLATES: Record<Store, (q: string) => string> = {
  "1mg": (q) => `https://www.1mg.com/search/all?name=${encodeURIComponent(q)}`,
  PharmEasy: (q) =>
    `https://pharmeasy.in/search/all?name=${encodeURIComponent(q)}`,
  Netmeds: (q) =>
    `https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(q)}`,
  Apollo247: (q) =>
    `https://www.apollo247.com/medicines?search=${encodeURIComponent(q)}`,
};

function clean(s?: string | null) {
  return (s || "").trim().replace(/\s+/g, " ");
}

// Prefer generic + strength + form; fallback to brand; finally rawName.
export function buildCatalogQuery(item: {
  rawName?: string | null;
  genericName?: string | null;
  brandName?: string | null;
  strength?: string | null;
  form?: string | null;
}) {
  const generic = clean(item.genericName);
  const brand = clean(item.brandName);
  const strength = clean(item.strength);
  const form = clean(item.form);
  const raw = clean(item.rawName);

  if (generic) {
    return [generic, strength, form].filter(Boolean).join(" ");
  }
  if (brand) {
    return [brand, strength, form].filter(Boolean).join(" ");
  }
  return raw || "";
}

export function buildBuyLinks(query: string) {
  const primary: Store = "1mg"; // pick your default store
  const links = {
    primary: { store: primary, url: TEMPLATES[primary](query) },
    alts: (["PharmEasy", "Netmeds", "Apollo247"] as Store[]).map((s) => ({
      store: s,
      url: TEMPLATES[s](query),
    })),
  };
  return links;
}

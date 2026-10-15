"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortKey } from "@pw/core";

export function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="sort">
      <span>Ordenar por</span>
      <select
        value={value}
        onChange={(e) => {
          const sp = new URLSearchParams(searchParams.toString());
          if (e.target.value === "relevancia") sp.delete("orden");
          else sp.set("orden", e.target.value);
          const qs = sp.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

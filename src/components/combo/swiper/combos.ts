import type { ComboDetail } from "@/services/combo/combo.schema";

export function combosForDisplay(combos: ComboDetail[]): ComboDetail[] {
  const active = combos.filter((c) => c.active);
  return active.length > 0 ? active : combos;
}

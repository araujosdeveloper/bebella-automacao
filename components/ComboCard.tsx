import { Tag } from "lucide-react";
import type { MenuItem } from "@/lib/menu-data";
import { formatPrice, itemOrderLink } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { AddToCartButton } from "./OrderCart";

export function ComboCard({ combo, index }: { combo: MenuItem; index: number }) {
  return (
    <article className="combo-card">
      <div className="flex items-start gap-3">
        <div className={`combo-icon combo-icon-${(index % 3) + 1}`}><Tag className="size-4" /></div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full border border-[#ffb020]/20 bg-[#ffb020]/10 px-2.5 py-1 text-[11px] font-bold text-[#ffb020]">Combo Bebella</span>
          <h3 className="mt-2 text-base font-extrabold leading-tight text-slate-50">{combo.name}</h3>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="price-chip">{formatPrice(combo.price)}</span>
        <div className="flex flex-wrap gap-2"><AddToCartButton item={combo} /><a href={itemOrderLink(`o combo ${combo.name}`)} target="_blank" rel="noopener noreferrer" className="order-link" aria-label={`Pedir combo ${combo.name} pelo WhatsApp`}><WhatsAppIcon className="size-4" /></a></div>
      </div>
    </article>
  );
}

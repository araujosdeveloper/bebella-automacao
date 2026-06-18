import { MapPin } from "lucide-react";
import { generalOrderLink } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0b0f14] px-4 pb-24 pt-8 sm:px-6 sm:pb-12">
      <div className="mx-auto flex max-w-3xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xl font-black tracking-tight text-slate-50">Bebella <span className="text-[#ffb020]">Hot Dog</span></p>
          <p className="mt-2 flex max-w-md items-start gap-2 text-sm leading-6 text-slate-400"><MapPin className="mt-0.5 size-4 shrink-0 text-[#ffb020]" />Marginal BR 226, Bairro Joia, Timon-MA, próximo à Igreja Filadélfia.</p>
        </div>
        <a href={generalOrderLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#25d366]"><WhatsAppIcon className="size-5" /> (86) 99931-2177</a>
      </div>
    </footer>
  );
}

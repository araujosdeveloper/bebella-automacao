import { Bike, MapPin } from "lucide-react";
import Image from "next/image";
import { generalOrderLink, hotDogs } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";

const coverProduct = hotDogs.find((product) => product.name === "Tradicional") ?? hotDogs[0];

export function Hero() {
  return (
    <section id="top" className="app-hero">
      <div className="mx-auto max-w-5xl px-4 pb-4 pt-4 sm:px-6 sm:pb-5">
        <div className="menu-intro">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[.14em] text-[#ffb020]">Cardápio Digital</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-50 sm:text-3xl">Bebella Hot Dog</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <MapPin className="size-4 shrink-0 text-[#ffb020]" />
              Bairro Joia, Timon-MA
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb020]/20 bg-[#ffb020]/10 px-3 py-1.5 text-xs font-black text-[#ffb020]">
              <Bike className="size-3.5" />
              Delivery / Retirada
            </span>
            <a className="whatsapp-button rounded-full px-3.5 py-2 text-xs" href={generalOrderLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
              Fazer pedido
            </a>
          </div>
        </div>

        <div className="menu-cover">
          <div className="menu-cover-image">
            <Image
              src={coverProduct.image || "/imagens/tradicional.png"}
              alt="Hot Dog da Bebella Hot Dog"
              fill
              priority
              sizes="(max-width: 640px) 112px, 180px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-black tracking-tight text-slate-50 sm:text-2xl">Escolha seu hot dog</p>
            <p className="mt-1 text-sm font-semibold text-slate-300 sm:text-base">Peça direto pelo WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  );
}

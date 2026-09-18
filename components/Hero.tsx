import { Bike, MapPin } from "lucide-react";
import Image from "next/image";
import { hotDogs } from "@/lib/menu-data";

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
            <a className="whatsapp-button rounded-full px-3.5 py-2 text-xs" href="#hot-dogs">Montar pedido</a>
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
            <p className="text-xl font-black tracking-tight text-slate-50 sm:text-2xl">Monte seu pedido</p>
            <p className="mt-1 text-sm font-semibold text-slate-300 sm:text-base">Escolha os itens, confira o subtotal e envie para confirmar disponibilidade.</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-300 sm:text-xs">
          <div className="rounded-2xl border border-white/[.06] bg-[#121820] px-2 py-2.5">Feito na hora</div>
          <div className="rounded-2xl border border-white/[.06] bg-[#121820] px-2 py-2.5">Pix, espécie e cartão</div>
          <div className="rounded-2xl border border-white/[.06] bg-[#121820] px-2 py-2.5">Entrega ou retirada</div>
        </div>
      </div>
    </section>
  );
}

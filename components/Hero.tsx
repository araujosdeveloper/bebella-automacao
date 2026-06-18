import { ArrowDown, Bike, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice, generalOrderLink, hotDogs } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";

const previewProductNames = ["Tradicional", "Clássico", "Costela Desfiada"];
const previewProducts = previewProductNames
  .map((name) => hotDogs.find((product) => product.name === name))
  .filter((product) => product !== undefined);

export function Hero() {
  return (
    <section id="top" className="app-hero relative overflow-hidden">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 lg:grid-cols-[1fr_.9fr] lg:gap-12 lg:py-16">
        <div className="hero-copy relative z-10 min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb020]/20 bg-[#ffb020]/10 px-3 py-1.5 text-xs font-bold text-[#ffb020]">
            <Clock className="size-4" /> Cardápio digital web
          </div>
          <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
            Bebella Hot Dog
          </h1>
          <p className="mt-3 max-w-xl text-xl font-extrabold leading-8 text-[#ffb020] sm:text-2xl">
            Seu hot dog favorito em poucos cliques.
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Escolha seu hot dog, confira os adicionais e finalize seu pedido pelo WhatsApp.
          </p>
          <div className="mt-5 grid max-w-xl gap-2 text-sm font-semibold text-slate-300 sm:grid-cols-2">
            <span className="hero-info"><Bike className="size-4 text-[#ffb020]" /> Entrega sob consulta</span>
            <span className="hero-info"><MapPin className="size-4 text-[#ffb020]" /> Bairro Joia, Timon-MA</span>
          </div>
          <div className="mt-7 grid max-w-sm grid-cols-1 gap-3 sm:flex sm:max-w-none">
            <a href={generalOrderLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button min-h-12 justify-center rounded-full px-5 py-3.5">
              <WhatsAppIcon className="size-5" /> Fazer pedido no WhatsApp
            </a>
            <a href="#hot-dogs" className="secondary-button min-h-12 justify-center rounded-full px-5 py-3.5">
              Ver cardápio <ArrowDown className="size-4" />
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-400">Marginal BR 226, Bairro Joia, Timon-MA</p>
        </div>

        <div className="hero-preview-wrap relative z-10 mx-auto w-full max-w-[22rem] min-w-0">
          <div className="delivery-preview">
            <div className="phone-topbar" />
            <div className="rounded-[1.7rem] bg-[#0f141b] p-4 text-slate-50 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black tracking-tight">Bebella Hot Dog</p>
                  <p className="mt-1 text-xs text-slate-400">Pedido direto no WhatsApp</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#ffb020]/15 px-2.5 py-1 text-xs font-bold text-[#ffb020]">
                  <Star className="size-3.5 fill-current" /> Delivery
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-hidden">
                {["Hot Dogs", "Combos", "Bebidas"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300"><span className="size-1.5 rounded-full bg-[#ffb020]" />{item}</span>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {previewProducts.map((product) => (
                  <div key={product.name} className="mini-product">
                    <div className="mini-product-image">
                      <Image
                        src={product.image || "/imagens/simples.png"}
                        alt={`Hot Dog ${product.name} da Bebella Hot Dog`}
                        fill
                        loading="lazy"
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{product.name}</p>
                      <p className="text-xs font-bold text-[#ffb020]">{formatPrice(product.price)}</p>
                    </div>
                    <span className="rounded-full bg-[#25d366] px-3 py-1.5 text-xs font-bold text-[#062a13]">Pedir</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

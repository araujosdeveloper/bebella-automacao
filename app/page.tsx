import { Bike, CupSoda, Flame, MapPin, MessageCircle, Plus, Sparkles, Store } from "lucide-react";
import { additions, combos, deliveryFees, drinks, formatPrice, hotDogs } from "@/lib/menu-data";
import { CategoryNav } from "@/components/CategoryNav";
import { ComboCard } from "@/components/ComboCard";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f14]">
      <Header />
      <Hero />
      <CategoryNav />

      <div className="menu-shell">
        <section id="hot-dogs" className="menu-section scroll-mt-32">
          <SectionTitle eyebrow="Os favoritos" title="Hot Dogs" description="Caprichados, bem servidos e preparados na hora para você." icon={Flame} />
          <div className="grid gap-3 md:grid-cols-2">
            {hotDogs.map((product) => <ProductCard key={product.name} product={product} />)}
          </div>
        </section>

        <section id="combos" className="menu-section scroll-mt-32">
          <SectionTitle eyebrow="Para compartilhar" title="Combos" description="Combinações prontas para matar a fome e acompanhar sua bebida favorita." icon={Sparkles} />
          <div className="grid gap-3 md:grid-cols-2">
            {combos.map((combo, index) => <ComboCard key={combo.name} combo={combo} index={index} />)}
          </div>
        </section>

        <section id="adicionais" className="menu-section scroll-mt-32">
          <SectionTitle eyebrow="Do seu jeito" title="Adicionais" description="Peça seus extras junto com o hot dog pelo WhatsApp." icon={Plus} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {additions.map((item) => (
              <article key={item.name} className="small-menu-card">
                <h3 className="text-sm font-bold leading-tight text-slate-50">{item.name}</h3>
                <p className="mt-2 text-base font-black text-[#ffb020]">{formatPrice(item.price)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="bebidas" className="menu-section scroll-mt-32">
          <SectionTitle eyebrow="Bem geladas" title="Bebidas" icon={CupSoda} />
          <div className="divide-y divide-white/[0.06] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121820]">
            {drinks.map((item) => (
              <article key={item.name} className="drink-row">
                <div className="flex min-w-0 items-center gap-3"><span className="drink-icon"><CupSoda className="size-5" /></span><h3 className="text-sm font-bold leading-snug text-slate-50">{item.name}</h3></div>
                <p className="shrink-0 text-sm font-black text-[#ffb020]">{formatPrice(item.price)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="entrega" className="menu-section scroll-mt-32">
          <SectionTitle eyebrow="Chega até você" title="Entrega e Retirada" icon={Bike} />
          <div className="grid gap-3 md:grid-cols-[.92fr_1.08fr]">
            <div className="info-card">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#ffb020]/10 text-[#ffb020]"><Store className="size-5" /></div>
              <h3 className="mt-4 text-lg font-black text-slate-50">Retire no local</h3>
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-6 text-slate-300"><MapPin className="mt-0.5 size-4 shrink-0 text-[#ffb020]" />Marginal BR 226, Bairro Joia, Timon-MA, próximo à Igreja Filadélfia.</p>
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#ffb020]/15 bg-[#ffb020]/10 p-3 text-sm font-semibold leading-6 text-amber-100"><MessageCircle className="mt-0.5 size-4 shrink-0 text-[#ffb020]" />Para entrega, informe seu bairro no WhatsApp para confirmação da taxa.</div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121820]">
              <div className="border-b border-white/[0.06] px-5 py-4"><h3 className="text-lg font-black text-slate-50">Taxas de entrega</h3></div>
              <div className="divide-y divide-white/[0.06] px-5">
                {deliveryFees.map((fee) => (
                  <div key={fee.name} className="flex items-center justify-between gap-4 py-3.5 text-sm"><span className="font-semibold text-slate-300">{fee.name}</span><span className="font-black text-[#ffb020]">{formatPrice(fee.price)}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}

import { WhatsAppIcon } from "./WhatsAppIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b0f14]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="Voltar ao início">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f97316] text-sm font-black text-white shadow-[0_10px_22px_rgba(249,115,22,.22)]">B</span>
          <p className="text-base font-extrabold tracking-tight text-slate-50 sm:text-lg">
            Bebella <span className="text-[#ffb020]">Hot Dog</span>
          </p>
        </a>
        <a className="whatsapp-button shrink-0 rounded-full px-4 py-2.5 text-xs sm:px-5 sm:text-sm" href="#hot-dogs">
          <WhatsAppIcon className="size-4" />
          <span className="hidden sm:inline">Montar pedido</span>
          <span className="sm:hidden">Montar</span>
        </a>
      </div>
    </header>
  );
}

"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { MenuItem } from "@/lib/menu-data";
import { formatPrice, whatsappLink } from "@/lib/menu-data";

type CartLine = MenuItem & { quantity: number };
type CartContextValue = { lines: CartLine[]; add: (item: MenuItem) => void; remove: (name: string) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside OrderCartProvider");
  return value;
}

export function AddToCartButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return <button type="button" onClick={() => add(item)} className="order-link" aria-label={`Adicionar ${item.name} ao pedido`}><Plus className="size-4" /> Adicionar</button>;
}

export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [delivery, setDelivery] = useState<"retirada" | "entrega">("entrega");
  const [address, setAddress] = useState("");
  const total = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const add = (item: MenuItem) => setLines((current) => current.some((line) => line.name === item.name) ? current.map((line) => line.name === item.name ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...item, quantity: 1 }]);
  const remove = (name: string) => setLines((current) => current.flatMap((line) => line.name !== name ? [line] : line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : []));
  const checkout = () => {
    if (!lines.length) return;
    const items = lines.map((line) => `• ${line.quantity}x ${line.name} — ${formatPrice(line.price * line.quantity)}`).join("\n");
    const context = delivery === "entrega" ? `Entrega\nEndereço: ${address || "a confirmar no WhatsApp"}` : "Retirada no local";
    const message = `Olá, Bella! Montei este pedido pelo cardápio da Bebella Hot Dog:\n\n${items}\n\nSubtotal: ${formatPrice(total)}\n${context}\n\nGostaria de confirmar a disponibilidade e a taxa de entrega.`;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return <CartContext.Provider value={{ lines, add, remove, clear: () => setLines([]) }}>
    {children}
    <button type="button" onClick={() => setOpen(true)} className="cart-fab" aria-label="Abrir pedido"><ShoppingBag className="size-5" /> Pedido {count > 0 && <span>{count}</span>}</button>
    {open && <div className="cart-backdrop" role="presentation" onClick={() => setOpen(false)}><aside className="cart-panel" role="dialog" aria-modal="true" aria-label="Seu pedido" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#ffb020]">Seu pedido</p><h2 className="mt-1 text-xl font-black text-slate-50">Confira antes de enviar</h2></div><button type="button" onClick={() => setOpen(false)} className="icon-button" aria-label="Fechar"><X className="size-5" /></button></div>
      {!lines.length ? <p className="mt-8 rounded-2xl bg-white/[.04] p-4 text-sm text-slate-300">Adicione itens do cardápio para começar.</p> : <>
        <div className="mt-5 space-y-2">{lines.map((line) => <div key={line.name} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[.04] p-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-50">{line.name}</p><p className="text-xs text-slate-400">{formatPrice(line.price)} cada</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => remove(line.name)} className="quantity-button" aria-label={`Remover ${line.name}`}><Minus className="size-3.5" /></button><span className="w-5 text-center text-sm font-black">{line.quantity}</span><button type="button" onClick={() => add(line)} className="quantity-button" aria-label={`Adicionar ${line.name}`}><Plus className="size-3.5" /></button></div></div>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setDelivery("entrega")} className={`choice-button ${delivery === "entrega" ? "choice-button-active" : ""}`}>Entrega</button><button type="button" onClick={() => setDelivery("retirada")} className={`choice-button ${delivery === "retirada" ? "choice-button-active" : ""}`}>Retirada</button></div>
        {delivery === "entrega" && <input value={address} onChange={(event) => setAddress(event.target.value)} className="checkout-input mt-3" placeholder="Endereço para entrega (opcional)" aria-label="Endereço para entrega" />}
        <div className="mt-5 flex items-center justify-between border-t border-white/[.08] pt-4"><span className="text-sm font-bold text-slate-300">Subtotal</span><strong className="text-xl font-black text-[#ffb020]">{formatPrice(total)}</strong></div>
        <button type="button" onClick={checkout} className="whatsapp-button mt-4 w-full justify-center rounded-2xl px-4 py-3"><Check className="size-5" /> Enviar para confirmar disponibilidade</button>
        {sent && <p className="mt-3 text-center text-xs font-semibold text-emerald-300">Pedido enviado para o WhatsApp. A equipe confirmará disponibilidade e a taxa.</p>}
        <button type="button" onClick={() => setLines([])} className="mx-auto mt-3 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-300"><Trash2 className="size-3.5" /> Limpar pedido</button>
      </>}
    </aside></div>}
  </CartContext.Provider>;
}

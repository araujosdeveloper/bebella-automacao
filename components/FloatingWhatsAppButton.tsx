import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsAppButton() {
  return (
    <a
      href="#hot-dogs"
      className="floating-whatsapp"
      aria-label="Fazer pedido pelo WhatsApp"
    >
      <WhatsAppIcon className="size-5" />
      <span>Montar meu pedido</span>
    </a>
  );
}

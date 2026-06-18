import { generalOrderLink } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={generalOrderLink}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Fazer pedido pelo WhatsApp"
    >
      <WhatsAppIcon className="size-5" />
      <span>Fazer pedido</span>
    </a>
  );
}

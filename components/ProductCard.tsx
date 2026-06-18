"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { MenuItem } from "@/lib/menu-data";
import { formatPrice, itemOrderLink } from "@/lib/menu-data";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ProductCard({ product }: { product: MenuItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = imageFailed ? undefined : product.image;

  return (
    <article className="product-card">
      {imageSrc ? (
        <div className="product-image-thumb">
          <Image
            src={imageSrc}
            alt={`Hot Dog ${product.name} da Bebella Hot Dog`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 80px, 90px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="product-image-fallback" role="img" aria-label={`Imagem indisponível do Hot Dog ${product.name}`}>
          <span>Bebella</span>
          <strong>Hot Dog</strong>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-extrabold leading-tight text-slate-50">{product.name}</h3>
          <span className="price-chip">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-400">{product.ingredients}</p>
        <a href={itemOrderLink(`o Hot Dog ${product.name}`)} target="_blank" rel="noopener noreferrer" className="order-link mt-4 inline-flex items-center justify-center gap-2 self-start" aria-label={`Pedir Hot Dog ${product.name} pelo WhatsApp`}>
          Pedir <WhatsAppIcon className="size-4" /> <MessageCircle className="size-3.5" />
        </a>
      </div>
    </article>
  );
}

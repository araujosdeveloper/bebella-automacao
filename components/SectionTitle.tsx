import type { LucideIcon } from "lucide-react";

export function SectionTitle({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description?: string; icon: LucideIcon }) {
  return (
    <div className="mb-5 sm:mb-6">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#ffb020]"><Icon className="size-4" />{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-50 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p>}
    </div>
  );
}

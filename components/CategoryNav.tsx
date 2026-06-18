const categories = [
  ["Hot Dogs", "#hot-dogs"],
  ["Combos", "#combos"],
  ["Adicionais", "#adicionais"],
  ["Bebidas", "#bebidas"],
  ["Entrega", "#entrega"],
];

export function CategoryNav() {
  return (
    <nav aria-label="Categorias do cardápio" className="sticky top-[65px] z-40 border-b border-white/[0.06] bg-[#0b0f14]/90 backdrop-blur-xl">
      <div className="scrollbar-none mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {categories.map(([label, href]) => <a key={href} href={href} className="category-pill">{label}</a>)}
      </div>
    </nav>
  );
}

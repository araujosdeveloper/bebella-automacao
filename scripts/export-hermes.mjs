import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "lib/menu-data.ts"), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(js, context, { timeout: 1000 });
const data = context.exports;
const business = JSON.parse(fs.readFileSync(path.join(root, "automation/business.json"), "utf8"));
const catalog = { business, whatsappNumber: data.WHATSAPP_NUMBER };
for (const key of ["hotDogs", "combos", "additions", "drinks", "deliveryFees"]) {
  catalog[key] = data[key].map(({ price, ...item }) => {
    if (!Number.isFinite(price) || price < 0) throw new Error(`Preço inválido: ${item.name}`);
    return { ...item, priceCents: Math.round(price * 100) };
  });
}
const output = path.join(root, "automation/generated");
fs.mkdirSync(output, { recursive: true });
const json = JSON.stringify(catalog, null, 2);
fs.writeFileSync(path.join(output, "catalog.json"), json + "\n");
fs.writeFileSync(path.join(output, "SOUL.md"),
  fs.readFileSync(path.join(root, "automation/instructions.md"), "utf8") +
  "\n\nCatálogo oficial (priceCents representa centavos de real):\n\n```json\n" + json + "\n```\n");
console.log("Catálogo e instruções exportados para automation/generated.");

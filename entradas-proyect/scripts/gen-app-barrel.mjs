import { readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta a tu carpeta de componentes app
const appComponentsPath = path.join(__dirname, "src", "components", "app");

// Leer carpetas en app/
const items = readdirSync(appComponentsPath);

let exports = [];

for (const item of items) {
  const itemPath = path.join(appComponentsPath, item);
  const stat = statSync(itemPath);

  // Solo carpetas
  if (stat.isDirectory()) {
    exports.push(`export { default as ${item} } from "./${item}";`);
  }
}

// Escribir index.ts
const indexPath = path.join(appComponentsPath, "index.tsx");
writeFileSync(indexPath, exports.join("\n") + "\n");

console.log(
  `✅ Barril creado en src/components/app/index.ts con ${exports.length} componentes.`,
);

import { readdirSync, statSync, mkdirSync, renameSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de componentes raíz
const componentsPath = path.join(__dirname, "src", "components");

// Ruta de componentes app/
const appComponentsPath = path.join(componentsPath, "app");

// Asegurarse de que app/ existe
if (!existsSync(appComponentsPath)) {
  mkdirSync(appComponentsPath);
}

const items = readdirSync(componentsPath);

let movedCount = 0;

for (const item of items) {
  const itemPath = path.join(componentsPath, item);
  const stat = statSync(itemPath);

  // Solo mover archivos .tsx sueltos (no carpetas)
  if (stat.isFile() && item.endsWith(".tsx")) {
    const baseName = path.basename(item, ".tsx");
    const newFolderPath = path.join(appComponentsPath, baseName);

    if (!existsSync(newFolderPath)) {
      mkdirSync(newFolderPath);
    }

    const newFilePath = path.join(newFolderPath, "index.tsx");
    renameSync(itemPath, newFilePath);

    console.log(`✅ Moved ${item} ➔ app/${baseName}/index.tsx`);
    movedCount++;
  }
}

if (movedCount > 0) {
  console.log(`\n🎉 Successfully organized ${movedCount} component(s) into app/`);
} else {
  console.log("\n👌 Everything is already organized inside app/");
}

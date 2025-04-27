import { readdirSync, statSync, mkdirSync, renameSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta a tu carpeta de componentes
const componentsPath = path.join(__dirname, "src", "components");

const items = readdirSync(componentsPath);

let movedCount = 0;

for (const item of items) {
  const itemPath = path.join(componentsPath, item);
  const stat = statSync(itemPath);

  if (stat.isFile() && item.endsWith(".tsx")) {
    const baseName = path.basename(item, ".tsx");
    const newFolderPath = path.join(componentsPath, baseName);

    if (!existsSync(newFolderPath)) {
      mkdirSync(newFolderPath);
    }

    const newFilePath = path.join(newFolderPath, "index.tsx");
    renameSync(itemPath, newFilePath);

    console.log(`✅ Moved ${item} ➔ ${path.join(baseName, "index.tsx")}`);
    movedCount++;
  }
}

if (movedCount > 0) {
  console.log(`\n🎉 Successfully organized ${movedCount} component(s)!`);
} else {
  console.log("\n👌 Everything is already organized, no action needed!");
}

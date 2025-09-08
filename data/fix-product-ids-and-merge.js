const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "products.js"); // 🔁 Change this to your filename

let content = fs.readFileSync(filePath, "utf8");

let globalId = 1;

// Step 1: Update or insert `id` in all objects
content = content.replace(/(\{[^{}]*?(?:\{[^{}]*?\}[^{}]*?)*\})/gs, (match) => {
  if (/id:\s*\d+/.test(match)) {
    return match.replace(/id:\s*\d+/, `id: ${globalId++}`);
  } else {
    return match.replace(/\{/, `{ id: ${globalId++},`);
  }
});

// Step 2: Find all exported array names
const arrayExports = [...content.matchAll(/export const (\w+)\s*=\s*\[/g)].map(
  (m) => m[1]
);

// Step 3: Generate final merged export block
const allProductsExport = `
export const allProducts = [
  ${arrayExports.map((name) => `...${name}`).join(",\n  ")},
];`;

// Step 4: Remove any previous `allProducts` export
content = content.replace(
  /export const allProducts\s*=\s*\[[\s\S]*?\];?/gm,
  ""
);

// Step 5: Append the new one at the end
content = content.trim() + "\n\n" + allProductsExport + "\n";

// Step 6: Save it back
fs.writeFileSync(filePath, content, "utf8");

console.log("✅ IDs fixed and `allProducts` exported.");

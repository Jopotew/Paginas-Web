/**
 * Genera ilustraciones SVG provisorias en public/img/ para que el sitio se vea
 * completo antes de tener fotos reales. Reemplazá cada archivo por una foto
 * (y actualizá la ruta en content/*.json) cuando las tengas: ver docs/05.
 *
 * Uso: npm run placeholders
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public", "img");

const C = {
  paper: "#F6F4FA",
  stem: "#2E5A41",
  stemDark: "#1F3B2D",
  leaf: "#4E8A5E",
  ink: "#23202B",
  jacaranda: "#7B5EA7",
  lilac: "#E6DDF3",
};

// PRNG determinístico: mismas imágenes en cada corrida.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

type Rand = () => number;
const f = (n: number) => n.toFixed(1);

function stem(x: number, y: number, len: number, bend: number) {
  return `<path d="M${f(x)} ${f(y)} q${f(bend)} ${f(len / 2)} ${f(bend / 3)} ${f(len)}" stroke="${C.stem}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
}

function leaf(x: number, y: number, angle: number, size: number) {
  return `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})" d="M0 0 C ${f(size * 0.4)} ${f(-size * 0.35)} ${f(size * 0.9)} ${f(-size * 0.2)} ${f(size)} 0 C ${f(size * 0.9)} ${f(size * 0.2)} ${f(size * 0.4)} ${f(size * 0.35)} 0 0Z" fill="${C.leaf}"/>`;
}

function rose(x: number, y: number, r: number, color: string, shade: string, rand: Rand) {
  let out = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${color}"/>`;
  for (let i = 0; i < 6; i++) {
    const rr = r * (0.9 - i * 0.14);
    const a = rand() * 360;
    out += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" d="M${f(-rr)} 0 A ${f(rr)} ${f(rr)} 0 0 1 ${f(rr)} 0" stroke="${shade}" stroke-width="${f(Math.max(2, r * 0.07))}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}

function tulip(x: number, y: number, s: number, color: string, shade: string) {
  return `<g transform="translate(${f(x)} ${f(y)})">
<path d="M${f(-s)} ${f(-s * 0.2)} C ${f(-s)} ${f(s * 0.9)} ${f(s)} ${f(s * 0.9)} ${f(s)} ${f(-s * 0.2)} L ${f(s * 0.5)} ${f(s * 0.15)} L 0 ${f(-s * 0.55)} L ${f(-s * 0.5)} ${f(s * 0.15)} Z" fill="${color}"/>
<path d="M${f(-s * 0.45)} ${f(s * 0.1)} C ${f(-s * 0.3)} ${f(s * 0.7)} ${f(s * 0.3)} ${f(s * 0.7)} ${f(s * 0.45)} ${f(s * 0.1)} L 0 ${f(-s * 0.4)} Z" fill="${shade}"/>
</g>`;
}

function sunflower(x: number, y: number, r: number) {
  let petals = "";
  const n = 18;
  for (let i = 0; i < n; i++) {
    petals += `<ellipse transform="translate(${f(x)} ${f(y)}) rotate(${f((360 / n) * i)})" cx="0" cy="${f(-r * 0.95)}" rx="${f(r * 0.2)}" ry="${f(r * 0.5)}" fill="${i % 2 ? "#F2B705" : "#F7C531"}"/>`;
  }
  let seeds = "";
  for (let i = 0; i < 40; i++) {
    const a = i * 137.5 * (Math.PI / 180);
    const d = Math.sqrt(i / 40) * r * 0.5;
    seeds += `<circle cx="${f(x + Math.cos(a) * d)}" cy="${f(y + Math.sin(a) * d)}" r="${f(r * 0.04)}" fill="#3B2412"/>`;
  }
  return `${petals}<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.58)}" fill="#6B4423"/>${seeds}`;
}

function starFlower(x: number, y: number, r: number, petals: number, color: string, center: string, rot: number) {
  let out = "";
  for (let i = 0; i < petals; i++) {
    out += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(rot + (360 / petals) * i)})" d="M0 0 C ${f(r * 0.35)} ${f(-r * 0.3)} ${f(r * 0.2)} ${f(-r * 0.85)} 0 ${f(-r)} C ${f(-r * 0.2)} ${f(-r * 0.85)} ${f(-r * 0.35)} ${f(-r * 0.3)} 0 0Z" fill="${color}"/>`;
  }
  return out + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.14)}" fill="${center}"/>`;
}

type Kind = "rose" | "tulip" | "sunflower" | "lily" | "orchid" | "mixed";

function head(kind: Kind, x: number, y: number, size: number, palette: [string, string], rand: Rand) {
  const [a, b] = palette;
  switch (kind) {
    case "rose":
      return rose(x, y, size, a, b, rand);
    case "tulip":
      return tulip(x, y, size, a, b);
    case "sunflower":
      return sunflower(x, y, size);
    case "lily":
      return starFlower(x, y, size * 1.2, 6, a, b, rand() * 60);
    case "orchid":
      return starFlower(x, y, size, 5, a, b, rand() * 72);
    case "mixed": {
      const kinds: Kind[] = ["rose", "tulip", "lily"];
      return head(kinds[Math.floor(rand() * kinds.length)]!, x, y, size, palette, rand);
    }
  }
}

function bunch(kind: Kind, count: number, palette: [string, string], seed: number, w: number, h: number, wrap?: string) {
  const rand = rng(seed);
  const cx = w / 2;
  const baseY = h * 0.92;
  const stems: string[] = [];
  const heads: { y: number; svg: string }[] = [];
  const leaves: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const spread = w * (count === 1 ? 0 : 0.5);
    const hx = cx - spread / 2 + spread * t + (rand() - 0.5) * w * 0.08;
    const hy = h * (0.22 + rand() * 0.22) + Math.abs(t - 0.5) * h * 0.12;
    const size = w * (count === 1 ? 0.2 : 0.11 + rand() * 0.04);
    stems.push(stem(hx, hy, baseY - hy, (cx - hx) * 0.6));
    if (rand() > 0.4) leaves.push(leaf(hx + (cx - hx) * 0.3, hy + (baseY - hy) * 0.45, rand() > 0.5 ? -35 : 205, w * 0.13));
    const pal: [string, string] = kind === "mixed" && rand() > 0.5 ? ["#F4A6B8", "#D9668A"] : palette;
    heads.push({ y: hy, svg: head(kind, hx, hy, size, pal, rand) });
  }
  heads.sort((p, q) => q.y - p.y);
  const wrapper = wrap
    ? `<path d="M${f(w * 0.18)} ${f(h * 0.5)} L ${f(w * 0.82)} ${f(h * 0.5)} L ${f(w * 0.56)} ${f(h * 0.98)} L ${f(w * 0.44)} ${f(h * 0.98)} Z" fill="${wrap}" opacity="0.92"/>`
    : "";
  return stems.join("") + leaves.join("") + heads.map((x) => x.svg).join("") + wrapper;
}

function pot(w: number, h: number, kind: Kind, palette: [string, string], seed: number) {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < 7; i++) out += leaf(w / 2, h * 0.68, -150 + i * 20 + rand() * 10, w * (0.22 + rand() * 0.1));
  out += `<path d="M${f(w / 2)} ${f(h * 0.66)} C ${f(w * 0.48)} ${f(h * 0.5)} ${f(w * 0.56)} ${f(h * 0.35)} ${f(w * 0.6)} ${f(h * 0.3)}" stroke="${C.stem}" stroke-width="5" fill="none"/>`;
  for (let i = 0; i < 4; i++) out += head(kind, w * (0.5 + i * 0.05 + rand() * 0.03), h * (0.28 + i * 0.07), w * 0.075, palette, rand);
  out += `<path d="M${f(w * 0.3)} ${f(h * 0.66)} L ${f(w * 0.7)} ${f(h * 0.66)} L ${f(w * 0.64)} ${f(h * 0.92)} L ${f(w * 0.36)} ${f(h * 0.92)} Z" fill="#C9B8E0"/>`;
  out += `<rect x="${f(w * 0.28)}" y="${f(h * 0.64)}" width="${f(w * 0.44)}" height="${f(h * 0.05)}" rx="6" fill="${C.jacaranda}"/>`;
  return out;
}

function frame(w: number, h: number, bg: string, body: string, label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${bg}"/>
${body}
<text x="${w - 24}" y="${h - 22}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${Math.round(w / 40)}" fill="${C.ink}" opacity="0.45">Imagen provisoria · ${label}</text>
</svg>
`;
}

function storefront(w: number, h: number) {
  const rand = rng(7);
  let awning = "";
  const stripes = 12;
  for (let i = 0; i < stripes; i++) {
    const x = w * 0.12 + ((w * 0.76) / stripes) * i;
    awning += `<rect x="${f(x)}" y="${f(h * 0.2)}" width="${f((w * 0.76) / stripes)}" height="${f(h * 0.12)}" fill="${i % 2 ? C.paper : C.jacaranda}"/>`;
    awning += `<path d="M${f(x)} ${f(h * 0.32)} a ${f((w * 0.76) / stripes / 2)} ${f(h * 0.04)} 0 0 0 ${f((w * 0.76) / stripes)} 0" fill="${i % 2 ? C.paper : C.jacaranda}"/>`;
  }
  let buckets = "";
  for (let i = 0; i < 6; i++) {
    const bx = w * 0.16 + i * w * 0.115;
    buckets += `<g transform="translate(${f(bx)} ${f(h * 0.62)})">${bunch(["rose", "tulip", "sunflower", "lily", "mixed", "rose"][i] as Kind, 4, i % 2 ? ["#F4A6B8", "#D9668A"] : ["#B497D6", C.jacaranda], 30 + i, w * 0.1, h * 0.26)}</g>`;
    buckets += `<rect x="${f(bx + w * 0.015)}" y="${f(h * 0.82)}" width="${f(w * 0.07)}" height="${f(h * 0.1)}" rx="4" fill="#8C9AA6"/>`;
  }
  void rand;
  return `<rect x="${f(w * 0.1)}" y="${f(h * 0.12)}" width="${f(w * 0.8)}" height="${f(h * 0.82)}" fill="#E9E4F2"/>
<rect x="${f(w * 0.1)}" y="${f(h * 0.12)}" width="${f(w * 0.8)}" height="${f(h * 0.08)}" fill="${C.stemDark}"/>
<text x="${f(w / 2)}" y="${f(h * 0.175)}" text-anchor="middle" font-family="Georgia, serif" font-size="${f(h * 0.045)}" fill="${C.paper}">Florería Jacarandá</text>
${awning}
<rect x="${f(w * 0.14)}" y="${f(h * 0.38)}" width="${f(w * 0.72)}" height="${f(h * 0.44)}" fill="#CFE0E8" opacity="0.6"/>
${buckets}
<rect x="0" y="${f(h * 0.93)}" width="${w}" height="${f(h * 0.07)}" fill="#BDB6C8"/>`;
}

function jacarandaTree(w: number, h: number) {
  const rand = rng(99);
  let blossoms = "";
  for (let i = 0; i < 260; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand());
    const x = w * 0.5 + Math.cos(a) * d * w * 0.42;
    const y = h * 0.38 + Math.sin(a) * d * h * 0.3;
    blossoms += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(6 + rand() * 18)}" fill="${["#9B7FCB", "#7B5EA7", "#B497D6", "#C9B8E0"][i % 4]}" opacity="0.85"/>`;
  }
  let fallen = "";
  for (let i = 0; i < 80; i++) fallen += `<circle cx="${f(rand() * w)}" cy="${f(h * 0.86 + rand() * h * 0.12)}" r="${f(3 + rand() * 4)}" fill="#9B7FCB" opacity="0.7"/>`;
  return `<path d="M${f(w * 0.48)} ${f(h * 0.92)} C ${f(w * 0.47)} ${f(h * 0.7)} ${f(w * 0.5)} ${f(h * 0.55)} ${f(w * 0.42)} ${f(h * 0.42)} M${f(w * 0.49)} ${f(h * 0.6)} C ${f(w * 0.55)} ${f(h * 0.5)} ${f(w * 0.6)} ${f(h * 0.45)} ${f(w * 0.64)} ${f(h * 0.36)}" stroke="#4A3B32" stroke-width="22" fill="none" stroke-linecap="round"/>
${blossoms}<rect x="0" y="${f(h * 0.86)}" width="${w}" height="${f(h * 0.14)}" fill="#B9B3A8" opacity="0.5"/>${fallen}`;
}

function workbench(w: number, h: number) {
  return `<rect x="0" y="${f(h * 0.7)}" width="${w}" height="${f(h * 0.3)}" fill="#C7A27C"/>
<g transform="translate(${f(w * 0.08)} ${f(h * 0.1)})">${bunch("mixed", 7, ["#B497D6", C.jacaranda], 12, w * 0.4, h * 0.75, "#E9E4F2")}</g>
<g transform="translate(${f(w * 0.52)} ${f(h * 0.3)})">${bunch("tulip", 5, ["#F4A6B8", "#D9668A"], 13, w * 0.22, h * 0.48)}</g>
<g transform="translate(${f(w * 0.72)} ${f(h * 0.28)})">${bunch("sunflower", 3, ["#F2B705", "#6B4423"], 14, w * 0.22, h * 0.5)}</g>
<rect x="${f(w * 0.6)}" y="${f(h * 0.74)}" width="${f(w * 0.2)}" height="${f(h * 0.03)}" rx="6" fill="${C.jacaranda}"/>`;
}

function delivery(w: number, h: number) {
  return `<rect x="0" y="${f(h * 0.78)}" width="${w}" height="${f(h * 0.22)}" fill="#BDB6C8"/>
<rect x="${f(w * 0.2)}" y="${f(h * 0.12)}" width="${f(w * 0.24)}" height="${f(h * 0.66)}" fill="#7A5C4A"/>
<circle cx="${f(w * 0.41)}" cy="${f(h * 0.48)}" r="${f(h * 0.015)}" fill="#E7C27D"/>
<g transform="translate(${f(w * 0.5)} ${f(h * 0.08)})">${bunch("rose", 9, ["#E58FA6", "#B04F6E"], 21, w * 0.32, h * 0.8, C.jacaranda)}</g>`;
}

const PRODUCTS: { file: string; kind: Kind; count: number; palette: [string, string]; bg: string; wrap?: string; pot?: boolean; label: string }[] = [
  { file: "ramo-estacion", kind: "mixed", count: 7, palette: ["#B497D6", "#7B5EA7"], bg: "#EEE8F6", wrap: "#E9E4F2", label: "Ramo de estación" },
  { file: "ramo-pastel", kind: "mixed", count: 6, palette: ["#F7D6E0", "#E8A3B8"], bg: "#FBEFF3", wrap: "#FFFFFF", label: "Ramo pastel" },
  { file: "ramo-silvestre", kind: "lily", count: 8, palette: ["#FFFFFF", "#F2B705"], bg: "#EAF1EA", wrap: "#C7A27C", label: "Ramo silvestre" },
  { file: "ramo-grande", kind: "mixed", count: 10, palette: ["#9B7FCB", "#5E4385"], bg: "#E6DDF3", wrap: "#2E5A41", label: "Ramo grande" },
  { file: "rosas-rojas-12", kind: "rose", count: 9, palette: ["#C2273C", "#7D1426"], bg: "#F8E9EB", wrap: "#23202B", label: "Rosas rojas" },
  { file: "rosas-blancas", kind: "rose", count: 7, palette: ["#FFFFFF", "#D9D4E0"], bg: "#E7EEF0", wrap: "#7B5EA7", label: "Rosas blancas" },
  { file: "rosa-unica", kind: "rose", count: 1, palette: ["#C2273C", "#7D1426"], bg: "#F3EEF8", label: "Rosa única" },
  { file: "rosas-rosadas", kind: "rose", count: 6, palette: ["#F4A6B8", "#D9668A"], bg: "#FBEFF3", wrap: "#FFFFFF", label: "Rosas rosadas" },
  { file: "tulipanes-amarillos", kind: "tulip", count: 7, palette: ["#F7C531", "#E0A100"], bg: "#FDF6E0", label: "Tulipanes amarillos" },
  { file: "tulipanes-violetas", kind: "tulip", count: 7, palette: ["#9B7FCB", "#5E4385"], bg: "#EEE8F6", label: "Tulipanes violetas" },
  { file: "tulipanes-mix", kind: "tulip", count: 9, palette: ["#E58FA6", "#B04F6E"], bg: "#F6F4FA", wrap: "#C7A27C", label: "Tulipanes mix" },
  { file: "girasoles-3", kind: "sunflower", count: 3, palette: ["#F2B705", "#6B4423"], bg: "#EAF1EA", label: "Tres girasoles" },
  { file: "girasoles-ramo", kind: "sunflower", count: 6, palette: ["#F2B705", "#6B4423"], bg: "#FDF6E0", wrap: "#C7A27C", label: "Ramo de girasoles" },
  { file: "girasol-unico", kind: "sunflower", count: 1, palette: ["#F2B705", "#6B4423"], bg: "#E7EEF0", label: "Girasol" },
  { file: "orquidea-blanca", kind: "orchid", count: 0, palette: ["#FFFFFF", "#B04F6E"], bg: "#EEE8F6", pot: true, label: "Orquídea blanca" },
  { file: "orquidea-violeta", kind: "orchid", count: 0, palette: ["#9B7FCB", "#F2B705"], bg: "#F6F4FA", pot: true, label: "Orquídea violeta" },
  { file: "lirio-maceta", kind: "lily", count: 0, palette: ["#F4A6B8", "#F2B705"], bg: "#EAF1EA", pot: true, label: "Lirio en maceta" },
];

mkdirSync(join(OUT, "productos"), { recursive: true });
mkdirSync(join(OUT, "hero"), { recursive: true });

const PW = 800;
const PH = 1000;
PRODUCTS.forEach((p, i) => {
  const body = p.pot ? pot(PW, PH, p.kind, p.palette, 100 + i) : bunch(p.kind, p.count, p.palette, 100 + i, PW, PH, p.wrap);
  writeFileSync(join(OUT, "productos", `${p.file}.svg`), frame(PW, PH, p.bg, body, p.label));
});

const HW = 1600;
const HH = 900;
const HERO: [string, string, string, string][] = [
  ["local", "#DCE6EC", storefront(HW, HH), "El local"],
  ["jacaranda", "#E9EEF3", jacarandaTree(HW, HH), "Temporada"],
  ["taller", "#EEE8F6", workbench(HW, HH), "Armado de ramos"],
  ["envios", "#F3EEF8", delivery(HW, HH), "Envíos"],
];
for (const [file, bg, body, label] of HERO) writeFileSync(join(OUT, "hero", `${file}.svg`), frame(HW, HH, bg, body, label));

console.log(`Generadas ${PRODUCTS.length} imágenes de producto y ${HERO.length} de portada en public/img/`);

/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function snowShadows(n, seed) {
  const s = [];
  const r = (a) => ((a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = Math.floor(r(seed + i * 17) * 1650);
    const y = Math.floor(r(seed + i * 31) * 780);
    const op = 0.82 + r(seed + i * 7) * 0.18;
    const blur = r(seed + i * 3) > 0.78 ? 1 : 0;
    s.push(`    ${x}px ${y}px ${blur}px 0 rgba(255,255,255,${op.toFixed(2)})`);
  }
  return s.join(",\n");
}

function leafShadows(n, seed, colors) {
  const s = [];
  const r = (a) => ((a * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const x = Math.floor(r(seed + i * 19) * 1580);
    const y = Math.floor(r(seed + i * 29) * 720);
    const c = colors[Math.floor(r(seed + i * 11) * colors.length)];
    s.push(`    ${x}px ${y}px 0 0 ${c}`);
  }
  return s.join(",\n");
}

const leafColors = [
  "#9a3412",
  "#d97706",
  "#b45309",
  "#c2410c",
  "#ea580c",
  "#92400e",
  "#78350f",
  "#a16207",
  "#b45309",
  "#c2410c",
  "#7c2d12",
];

let css = "";

const snowCfg = [
  { class: "snow-layer-1", left: "0", w: 7, h: 7, op: 1, dur: 12, delay: 0 },
  { class: "snow-layer-2", left: "12%", w: 5, h: 5, op: 0.92, dur: 16, delay: -2 },
  { class: "snow-layer-3", left: "28%", w: 6, h: 6, op: 0.88, dur: 20, delay: -5 },
  { class: "snow-layer-4", left: "44%", w: 4, h: 4, op: 0.85, dur: 14, delay: -3 },
  { class: "snow-layer-5", left: "60%", w: 8, h: 8, op: 0.95, dur: 18, delay: -7 },
  { class: "snow-layer-6", left: "76%", w: 5, h: 5, op: 0.8, dur: 22, delay: -9 },
];

snowCfg.forEach((cfg, i) => {
  css += `.${cfg.class} {\n`;
  css += `  left: ${cfg.left};\n`;
  css += `  width: ${cfg.w}px;\n`;
  css += `  height: ${cfg.h}px;\n`;
  css += `  opacity: ${cfg.op};\n`;
  css += `  animation-duration: ${cfg.dur}s;\n`;
  css += `  animation-delay: ${cfg.delay}s;\n`;
  css += `  box-shadow:\n${snowShadows(50, (i + 1) * 999)};\n`;
  css += `}\n\n`;
});

const leafCfg = [
  { class: "leaf-layer-1", left: "0", w: 12, h: 16, op: 0.72, dur: 14, delay: 0, grad: "145deg, #c2410c 0%, #ea580c 50%, #b45309 100%" },
  { class: "leaf-layer-2", left: "18%", w: 10, h: 14, op: 0.65, dur: 18, delay: -4, grad: "145deg, #92400e 0%, #d97706 100%" },
  { class: "leaf-layer-3", left: "36%", w: 11, h: 15, op: 0.6, dur: 22, delay: -7, grad: "145deg, #78350f 0%, #b45309 100%" },
  { class: "leaf-layer-4", left: "52%", w: 9, h: 13, op: 0.68, dur: 16, delay: -2, grad: "145deg, #b45309 0%, #ea580c 60%, #9a3412 100%" },
  { class: "leaf-layer-5", left: "68%", w: 13, h: 17, op: 0.58, dur: 20, delay: -6, grad: "145deg, #7c2d12 0%, #c2410c 100%" },
  { class: "leaf-layer-6", left: "84%", w: 10, h: 14, op: 0.62, dur: 25, delay: -10, grad: "145deg, #a16207 0%, #d97706 100%" },
];

leafCfg.forEach((cfg, i) => {
  css += `.${cfg.class} {\n`;
  css += `  left: ${cfg.left};\n`;
  css += `  width: ${cfg.w}px;\n`;
  css += `  height: ${cfg.h}px;\n`;
  css += `  opacity: ${cfg.op};\n`;
  css += `  animation-duration: ${cfg.dur}s;\n`;
  css += `  animation-delay: ${cfg.delay}s;\n`;
  css += `  background: linear-gradient(${cfg.grad});\n`;
  css += `  box-shadow:\n${leafShadows(46, (i + 1) * 2000 + 11, leafColors)};\n`;
  css += `}\n\n`;
});

const out = path.join(__dirname, "season-decor-generated.css");
fs.writeFileSync(out, css, "utf8");
console.log("Wrote", out);

// Shared data and styles for the "Inside the product" bento and its detail modal.

export const card =
  "rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#151717] to-[#0a0b0b] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]";

/** [atomic number, symbol, column, row] for periods 1–4 */
export const ELEMENTS: [number, string, number, number][] = [
  [1, "H", 1, 1], [2, "He", 18, 1],
  [3, "Li", 1, 2], [4, "Be", 2, 2], [5, "B", 13, 2], [6, "C", 14, 2], [7, "N", 15, 2], [8, "O", 16, 2], [9, "F", 17, 2], [10, "Ne", 18, 2],
  [11, "Na", 1, 3], [12, "Mg", 2, 3], [13, "Al", 13, 3], [14, "Si", 14, 3], [15, "P", 15, 3], [16, "S", 16, 3], [17, "Cl", 17, 3], [18, "Ar", 18, 3],
  [19, "K", 1, 4], [20, "Ca", 2, 4], [21, "Sc", 3, 4], [22, "Ti", 4, 4], [23, "V", 5, 4], [24, "Cr", 6, 4], [25, "Mn", 7, 4], [26, "Fe", 8, 4],
  [27, "Co", 9, 4], [28, "Ni", 10, 4], [29, "Cu", 11, 4], [30, "Zn", 12, 4], [31, "Ga", 13, 4], [32, "Ge", 14, 4], [33, "As", 15, 4], [34, "Se", 16, 4], [35, "Br", 17, 4], [36, "Kr", 18, 4],
];

export const KEY = new Set(["Li", "C", "Al", "Mn", "Fe", "Co", "Ni", "Cu"]);
export const SECONDARY = new Set(["Si", "Ti", "V", "Ga", "Ge"]);

/** What each highlighted mineral does in the energy transition. */
export const MINERALS: Record<string, { name: string; use: string }> = {
  Li: { name: "Lithium", use: "Battery cathodes and electrolytes" },
  C: { name: "Carbon (graphite)", use: "Battery anodes" },
  Al: { name: "Aluminium", use: "Power lines, lightweight frames" },
  Mn: { name: "Manganese", use: "Battery cathodes, steel" },
  Fe: { name: "Iron", use: "Steel, LFP battery cathodes" },
  Co: { name: "Cobalt", use: "Battery cathodes" },
  Ni: { name: "Nickel", use: "High-energy battery cathodes" },
  Cu: { name: "Copper", use: "Wiring, motors, power grids" },
  Si: { name: "Silicon", use: "Solar cells, chips" },
  Ti: { name: "Titanium", use: "Light, strong alloys" },
  V: { name: "Vanadium", use: "Flow batteries for grid storage" },
  Ga: { name: "Gallium", use: "Power chips, LEDs" },
  Ge: { name: "Germanium", use: "Fibre optics, solar cells" },
};

export const COUNTRIES: Record<string, string> = {
  CD: "DR Congo",
  ZM: "Zambia",
  GN: "Guinea",
  NA: "Namibia",
  ZW: "Zimbabwe",
};

/** Sample registry rows (company names are withheld in the prototype). */
export const REGISTRY = [
  { w: 68, own: "State", c: "CD", m: "Co" },
  { w: 54, own: "Hybrid", c: "ZM", m: "Cu" },
  { w: 76, own: "State", c: "GN", m: "Al" },
  { w: 48, own: "State", c: "NA", m: "U" },
  { w: 62, own: "Hybrid", c: "ZW", m: "Li" },
  { w: 70, own: "State", c: "CD", m: "Cu" },
  { w: 44, own: "Hybrid", c: "CD", m: "Co" },
  { w: 58, own: "State", c: "ZM", m: "Cu" },
  { w: 66, own: "Hybrid", c: "ZW", m: "Li" },
  { w: 52, own: "State", c: "GN", m: "Fe" },
  { w: 60, own: "State", c: "CD", m: "Cu" },
] as const;

export const CHAIN = [
  { x: 50, y: 175, label: "Mine site", note: "Where the ore comes out of the ground." },
  { x: 200, y: 128, label: "Operator", note: "The company that runs the mine day to day." },
  { x: 350, y: 152, label: "Parent group", note: "The holding company that owns the operator." },
  { x: 500, y: 92, label: "State shareholder", note: "The state body that holds the parent's shares." },
  { x: 650, y: 58, label: "Beijing", note: "Where the chain of control ends." },
];

export function smoothPath(pts: { x: number; y: number }[], dy = 0) {
  let d = `M${pts[0].x} ${pts[0].y + dy}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const mx = (p.x + c.x) / 2;
    d += ` C${mx} ${p.y + dy} ${mx} ${c.y + dy} ${c.x} ${c.y + dy}`;
  }
  return d;
}

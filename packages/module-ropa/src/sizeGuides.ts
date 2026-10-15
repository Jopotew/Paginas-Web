/**
 * Medidas de la prenda en centímetros. Son de referencia para el MVP:
 * cada marca debe reemplazarlas por las de su moldería real.
 */
export interface SizeGuide {
  title: string;
  howToMeasure: string[];
  columns: string[];
  rows: { size: string; values: number[] }[];
}

export const SIZE_GUIDES: Record<"superior" | "inferior" | "vestido", SizeGuide> = {
  superior: {
    title: "Remeras, camisas, buzos y camperas",
    howToMeasure: [
      "Pecho: medí el contorno por la parte más ancha, con la cinta horizontal.",
      "Largo: desde el punto más alto del hombro hasta el ruedo.",
      "Si estás entre dos talles, elegí el más grande para un calce más holgado.",
    ],
    columns: ["Pecho", "Largo", "Manga"],
    rows: [
      { size: "XS", values: [86, 66, 59] },
      { size: "S", values: [92, 68, 60] },
      { size: "M", values: [98, 70, 61] },
      { size: "L", values: [104, 72, 62] },
      { size: "XL", values: [110, 74, 63] },
      { size: "XXL", values: [116, 76, 64] },
    ],
  },
  inferior: {
    title: "Pantalones y polleras",
    howToMeasure: [
      "Cintura: medí donde usás habitualmente el pantalón.",
      "Cadera: por la parte más ancha, con los pies juntos.",
      "Tiro de entrepierna: desde la entrepierna hasta el tobillo.",
    ],
    columns: ["Cintura", "Cadera", "Entrepierna"],
    rows: [
      { size: "36", values: [70, 92, 78] },
      { size: "38", values: [74, 96, 79] },
      { size: "40", values: [78, 100, 80] },
      { size: "42", values: [82, 104, 81] },
      { size: "44", values: [86, 108, 82] },
      { size: "46", values: [90, 112, 82] },
    ],
  },
  vestido: {
    title: "Vestidos",
    howToMeasure: [
      "Busto: por la parte más ancha, con la cinta horizontal.",
      "Cintura: en la parte más angosta del torso.",
      "Largo: desde el hombro hasta el ruedo.",
    ],
    columns: ["Busto", "Cintura", "Largo"],
    rows: [
      { size: "XS", values: [82, 64, 112] },
      { size: "S", values: [88, 70, 114] },
      { size: "M", values: [94, 76, 116] },
      { size: "L", values: [100, 82, 118] },
      { size: "XL", values: [106, 88, 120] },
    ],
  },
};

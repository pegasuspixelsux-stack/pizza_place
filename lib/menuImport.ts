import "server-only";

import { Readable } from "node:stream";
import ExcelJS from "exceljs";
import type { CategoryId, MenuCategory, MenuItem } from "./types";

const MAX_ROWS = 500;

// Fallback aliases for the four seed categories, so a spreadsheet still
// matches them even if an admin has since renamed the category (its id
// stays stable even when its display name changes).
const LEGACY_CATEGORY_ALIASES: Record<string, CategoryId> = {
  appetizers: "appetizers",
  appetizer: "appetizers",
  entradas: "appetizers",
  entrada: "appetizers",
  pizzas: "pizzas",
  pizza: "pizzas",
  desserts: "desserts",
  dessert: "desserts",
  postres: "desserts",
  postre: "desserts",
  drinks: "drinks",
  drink: "drinks",
  bebidas: "drinks",
  bebida: "drinks",
};

function buildCategoryLookup(
  categories: MenuCategory[]
): Record<string, CategoryId> {
  const lookup = { ...LEGACY_CATEGORY_ALIASES };
  for (const category of categories) {
    lookup[normalize(category.id)] = category.id;
    lookup[normalize(category.name)] = category.id;
  }
  return lookup;
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "");
}

function cellText(row: ExcelJS.Row, col: number | undefined): string {
  if (!col) return "";
  const value = row.getCell(col).value;
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "text" in value) {
    // Rich text cells come back as { richText: [...] } or { text, hyperlink }
    return String((value as { text?: unknown }).text ?? "").trim();
  }
  return String(value).trim();
}

export interface ImportedRow {
  category: CategoryId;
  item: MenuItem;
}

export interface MenuImportResult {
  rows: ImportedRow[];
  errors: string[];
}

/**
 * Parses an uploaded .xlsx or .csv menu file. Expected columns (in any
 * order, case/accent-insensitive): Categoria, Nombre, Descripcion, Precio,
 * and an optional Etiquetas column (comma-separated tags).
 */
export async function parseMenuWorkbook(
  buffer: ArrayBuffer,
  filename: string,
  categories: MenuCategory[]
): Promise<MenuImportResult> {
  const categoryLookup = buildCategoryLookup(categories);
  const workbook = new ExcelJS.Workbook();

  try {
    if (/\.csv$/i.test(filename)) {
      // exceljs' CSV reader wants a real Node Readable, not just a Buffer.
      await workbook.csv.read(Readable.from(Buffer.from(buffer)));
    } else {
      await workbook.xlsx.load(buffer);
    }
  } catch (error) {
    console.error("[menu import] failed to parse workbook:", error);
    return {
      rows: [],
      errors: [
        "No se pudo leer el archivo. Confirmá que sea un .xlsx o .csv válido.",
      ],
    };
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    return { rows: [], errors: ["El archivo no tiene ninguna hoja."] };
  }

  const columnIndex: Record<string, number> = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    columnIndex[normalize(cell.value)] = colNumber;
  });

  const categoryCol = columnIndex["categoria"];
  const nameCol = columnIndex["nombre"];
  const descriptionCol = columnIndex["descripcion"];
  const priceCol = columnIndex["precio"];
  const tagsCol = columnIndex["etiquetas"];

  if (!categoryCol || !nameCol || !priceCol) {
    return {
      rows: [],
      errors: [
        'El archivo debe tener columnas "Categoria", "Nombre" y "Precio".',
      ],
    };
  }

  const rows: ImportedRow[] = [];
  const errors: string[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    if (rows.length + errors.length >= MAX_ROWS) return;

    const rawCategory = cellText(row, categoryCol);
    const name = cellText(row, nameCol);
    if (!rawCategory && !name) return; // fully blank row

    const category = categoryLookup[normalize(rawCategory)];
    if (!category) {
      errors.push(`Fila ${rowNumber}: categoría "${rawCategory}" no reconocida.`);
      return;
    }
    if (!name) {
      errors.push(`Fila ${rowNumber}: falta el nombre del producto.`);
      return;
    }

    const priceRaw = row.getCell(priceCol).value;
    const price =
      typeof priceRaw === "number"
        ? priceRaw
        : Number(String(priceRaw ?? "").replace(",", "."));
    if (!Number.isFinite(price) || price < 0) {
      errors.push(`Fila ${rowNumber}: el precio de "${name}" no es válido.`);
      return;
    }

    const tags = cellText(row, tagsCol)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    rows.push({
      category,
      item: {
        id: crypto.randomUUID(),
        name,
        description: cellText(row, descriptionCol),
        price,
        tags,
      },
    });
  });

  if (rows.length + errors.length >= MAX_ROWS) {
    errors.push(`Solo se procesan hasta ${MAX_ROWS} filas por archivo.`);
  }

  return { rows, errors };
}

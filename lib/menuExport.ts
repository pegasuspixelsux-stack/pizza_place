import "server-only";

import ExcelJS from "exceljs";
import type { SiteData } from "./types";

const HEADERS = ["Categoria", "Nombre", "Descripcion", "Precio", "Etiquetas"];

function rowsFromSiteData(data: SiteData): string[][] {
  const rows: string[][] = [HEADERS];
  for (const category of data.menu) {
    for (const item of category.items) {
      rows.push([
        category.name,
        item.name,
        item.description,
        String(item.price),
        (item.tags ?? []).join(", "),
      ]);
    }
  }
  return rows;
}

export async function buildMenuXlsx(data: SiteData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Menu");

  worksheet.columns = [
    { width: 14 },
    { width: 26 },
    { width: 50 },
    { width: 10 },
    { width: 30 },
  ];

  for (const row of rowsFromSiteData(data)) {
    worksheet.addRow(row);
  }
  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function csvEscape(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function buildMenuCsv(data: SiteData): string {
  return rowsFromSiteData(data)
    .map((row) => row.map(csvEscape).join(","))
    .join("\r\n");
}

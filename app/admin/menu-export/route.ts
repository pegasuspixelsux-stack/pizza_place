import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { getSiteData } from "@/lib/data";
import { buildMenuCsv, buildMenuXlsx } from "@/lib/menuExport";

export async function GET(request: NextRequest) {
  await verifySession();

  const format =
    request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "xlsx";
  const data = await getSiteData();

  if (format === "csv") {
    // Prefix a BOM so Excel opens UTF-8 CSVs (e.g. "ñ", "é") correctly.
    const csv = "﻿" + buildMenuCsv(data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="menu.csv"',
      },
    });
  }

  const buffer = await buildMenuXlsx(data);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="menu.xlsx"',
    },
  });
}

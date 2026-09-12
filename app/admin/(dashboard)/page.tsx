import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { AdminDashboard } from "../components/AdminDashboard";

export const metadata: Metadata = {
  title: "Panel de Administración — Bianco Pizzeria",
};

export default async function AdminPage() {
  const data = await getSiteData();
  return <AdminDashboard data={data} />;
}

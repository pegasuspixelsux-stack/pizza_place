"use server";

import { revalidatePath, refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifySession } from "@/lib/auth/dal";
import { deleteSession } from "@/lib/auth/session";
import { getSiteData, saveSiteData, saveUploadedImage } from "@/lib/data";
import type { CategoryId, FooterData, HeroData, MenuItem } from "@/lib/types";

export interface ActionState {
  error?: string;
  success?: string;
}

export interface HeroActionState extends ActionState {
  hero?: HeroData;
}

export interface FooterActionState extends ActionState {
  footer?: FooterData;
}

export interface MenuItemActionState extends ActionState {
  item?: MenuItem;
}

function revalidateSite() {
  // Bust the cached public homepage for other visitors...
  revalidatePath("/");
  // ...and refresh this admin session's client router so the dashboard
  // reflects the change immediately (read-your-own-writes).
  refresh();
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const heroSchema = z.object({
  headline: z.string().trim().min(1, "El título es obligatorio.").max(140),
  subtitle: z.string().trim().min(1, "El subtítulo es obligatorio.").max(400),
});

export async function updateHeroAction(
  _prevState: HeroActionState,
  formData: FormData
): Promise<HeroActionState> {
  await verifySession();

  const parsed = heroSchema.safeParse({
    headline: formData.get("headline"),
    subtitle: formData.get("subtitle"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = await getSiteData();
  let image = data.hero.image;

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return { error: "Subí un archivo de imagen." };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { error: "Las imágenes deben pesar menos de 8MB." };
    }
    try {
      image = await saveUploadedImage(file);
    } catch (error) {
      console.error("[admin] hero image upload failed:", error);
      return { error: "No se pudo subir la imagen. Probá de nuevo." };
    }
  }

  data.hero = { ...parsed.data, image };
  await saveSiteData(data);
  revalidateSite();

  return { success: "Sección de portada actualizada.", hero: data.hero };
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const footerSchema = z.object({
  address: z.string().trim().min(1, "La dirección es obligatoria.").max(200),
  phone: z.string().trim().min(1, "El teléfono es obligatorio.").max(40),
  email: z.string().trim().email("Ingresá un correo electrónico válido."),
  copyright: z
    .string()
    .trim()
    .min(1, "El texto de derechos de autor es obligatorio.")
    .max(200),
});

export async function updateFooterAction(
  _prevState: FooterActionState,
  formData: FormData
): Promise<FooterActionState> {
  await verifySession();

  const days = formData.getAll("hours_days").map(String);
  const times = formData.getAll("hours_time").map(String);
  const hours = days
    .map((d, i) => ({ days: d.trim(), time: (times[i] ?? "").trim() }))
    .filter((entry) => entry.days.length > 0 && entry.time.length > 0);

  const parsed = footerSchema.safeParse({
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    copyright: formData.get("copyright"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  if (hours.length === 0) {
    return { error: "Agregá al menos una fila de horario de atención." };
  }

  const data = await getSiteData();
  data.footer = { ...parsed.data, hours };
  await saveSiteData(data);
  revalidateSite();

  return {
    success: "Pie de página y contacto actualizados.",
    footer: data.footer,
  };
}

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

const menuItemSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(80),
  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria.")
    .max(300),
  price: z.coerce.number().min(0, "El precio debe ser 0 o mayor.").max(999),
  tags: z.string().trim().max(200).optional(),
});

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function addMenuItemAction(
  categoryId: CategoryId,
  _prevState: MenuItemActionState,
  formData: FormData
): Promise<MenuItemActionState> {
  await verifySession();

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = await getSiteData();
  const category = data.menu.find((c) => c.id === categoryId);
  if (!category) {
    return { error: "Categoría de menú desconocida." };
  }

  const item: MenuItem = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price,
    tags: parseTags(parsed.data.tags),
  };
  category.items.push(item);

  await saveSiteData(data);
  revalidateSite();

  return { success: `Se agregó "${item.name}".`, item };
}

export async function updateMenuItemAction(
  categoryId: CategoryId,
  itemId: string,
  _prevState: MenuItemActionState,
  formData: FormData
): Promise<MenuItemActionState> {
  await verifySession();

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = await getSiteData();
  const category = data.menu.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.id === itemId);
  if (!category || !item) {
    return { error: "Ese producto ya no existe." };
  }

  item.name = parsed.data.name;
  item.description = parsed.data.description;
  item.price = parsed.data.price;
  item.tags = parseTags(parsed.data.tags);

  await saveSiteData(data);
  revalidateSite();

  return { success: `Se guardó "${item.name}".`, item };
}

export async function deleteMenuItemAction(
  categoryId: CategoryId,
  itemId: string
): Promise<void> {
  await verifySession();

  const data = await getSiteData();
  const category = data.menu.find((c) => c.id === categoryId);
  if (!category) return;

  category.items = category.items.filter((i) => i.id !== itemId);

  await saveSiteData(data);
  revalidateSite();
}

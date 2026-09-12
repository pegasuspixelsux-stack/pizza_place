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
  headline: z.string().trim().min(1, "Headline is required.").max(140),
  subtitle: z.string().trim().min(1, "Subtitle is required.").max(400),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = await getSiteData();
  let image = data.hero.image;

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return { error: "Please upload an image file." };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { error: "Images must be smaller than 8MB." };
    }
    try {
      image = await saveUploadedImage(file);
    } catch (error) {
      console.error("[admin] hero image upload failed:", error);
      return { error: "Couldn't upload the image. Please try again." };
    }
  }

  data.hero = { ...parsed.data, image };
  await saveSiteData(data);
  revalidateSite();

  return { success: "Hero section updated.", hero: data.hero };
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const footerSchema = z.object({
  address: z.string().trim().min(1, "Address is required.").max(200),
  phone: z.string().trim().min(1, "Phone number is required.").max(40),
  email: z.string().trim().email("Enter a valid email address."),
  copyright: z.string().trim().min(1, "Copyright text is required.").max(200),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (hours.length === 0) {
    return { error: "Add at least one row of operating hours." };
  }

  const data = await getSiteData();
  data.footer = { ...parsed.data, hours };
  await saveSiteData(data);
  revalidateSite();

  return { success: "Footer & contact info updated.", footer: data.footer };
}

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  description: z.string().trim().min(1, "Description is required.").max(300),
  price: z.coerce.number().min(0, "Price must be 0 or more.").max(999),
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = await getSiteData();
  const category = data.menu.find((c) => c.id === categoryId);
  if (!category) {
    return { error: "Unknown menu category." };
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

  return { success: `Added "${item.name}".`, item };
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = await getSiteData();
  const category = data.menu.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.id === itemId);
  if (!category || !item) {
    return { error: "That menu item no longer exists." };
  }

  item.name = parsed.data.name;
  item.description = parsed.data.description;
  item.price = parsed.data.price;
  item.tags = parseTags(parsed.data.tags);

  await saveSiteData(data);
  revalidateSite();

  return { success: `Saved "${item.name}".`, item };
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

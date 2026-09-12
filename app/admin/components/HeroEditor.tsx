"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import type { HeroData } from "@/lib/types";
import { updateHeroAction, type HeroActionState } from "../actions";
import {
  Field,
  FormMessage,
  PrimaryButton,
  TextArea,
  TextInput,
} from "./FormControls";

const initialState: HeroActionState = {};

export function HeroEditor({ hero: initialHero }: { hero: HeroData }) {
  const [hero, setHero] = useState(initialHero);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: HeroActionState, formData: FormData) => {
      const result = await updateHeroAction(prevState, formData);
      if (result.hero) {
        setHero(result.hero);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      return result;
    },
    initialState
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink">Hero section</h2>
      <p className="mt-1 text-sm text-ink-muted">
        This is the first thing visitors see on the homepage.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
          <div className="flex flex-col gap-5">
            <Field label="Headline" htmlFor="headline">
              <TextInput
                id="headline"
                name="headline"
                defaultValue={hero.headline}
                key={hero.headline}
                required
                maxLength={140}
              />
            </Field>
            <Field label="Subtitle" htmlFor="subtitle">
              <TextArea
                id="subtitle"
                name="subtitle"
                defaultValue={hero.subtitle}
                key={hero.subtitle}
                required
                maxLength={400}
                rows={3}
              />
            </Field>
          </div>

          <Field label="Hero image" htmlFor="image">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-canvas">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                <img
                  src={preview}
                  alt="New hero image preview"
                  className="h-full w-full object-cover"
                />
              ) : hero.image.endsWith(".svg") ? (
                // eslint-disable-next-line @next/next/no-img-element -- vector asset
                <img
                  src={hero.image}
                  alt="Current hero image"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={hero.image}
                  alt="Current hero image"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-xs text-ink-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-canvas file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
            />
          </Field>
        </div>

        <FormMessage error={state.error} success={state.success} />

        <div>
          <PrimaryButton type="submit" pending={pending}>
            Save hero section
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

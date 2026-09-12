function toWhatsAppLink(rawNumber: string): string | null {
  const digits = rawNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const href = toWhatsAppLink(whatsapp);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_-8px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_36px_-8px_rgba(0,0,0,0.4)] active:translate-y-0"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 fill-current"
      >
        <path d="M16.004 3C9.11 3 3.5 8.6 3.5 15.48c0 2.36.64 4.57 1.76 6.47L3 29l7.24-2.22a12.98 12.98 0 0 0 5.76 1.35h.005c6.9 0 12.5-5.6 12.5-12.48C28.5 8.7 22.9 3.1 16.004 3Zm0 22.83h-.004a10.4 10.4 0 0 1-5.3-1.45l-.38-.22-4.3 1.32 1.35-4.19-.25-.43a10.34 10.34 0 0 1-1.6-5.56c0-5.72 4.66-10.37 10.4-10.37 2.78 0 5.39 1.08 7.36 3.05a10.3 10.3 0 0 1 3.05 7.35c0 5.72-4.66 10.5-10.31 10.5Zm5.7-7.78c-.31-.16-1.84-.9-2.12-1.01-.29-.1-.5-.16-.7.16-.21.31-.8 1-.99 1.22-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53h-.6c-.21 0-.55.08-.83.39-.29.31-1.09 1.07-1.09 2.6 0 1.53 1.12 3.01 1.27 3.22.16.21 2.2 3.36 5.34 4.71.75.32 1.33.51 1.79.66.75.24 1.43.2 1.97.13.6-.09 1.84-.75 2.1-1.48.26-.72.26-1.35.18-1.48-.08-.13-.28-.21-.59-.36Z" />
      </svg>
    </a>
  );
}

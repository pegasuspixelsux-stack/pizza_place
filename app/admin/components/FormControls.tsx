const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink-faint";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={fieldClass} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea {...props} className={fieldClass} />;
}

export function PrimaryButton({
  pending,
  pendingLabel,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: string;
}) {
  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-50"
    >
      {pending ? pendingLabel ?? "Saving…" : children}
    </button>
  );
}

export function SecondaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink-faint disabled:opacity-50"
    />
  );
}

export function FormMessage({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;
  return (
    <p
      role="status"
      className={`text-sm ${error ? "text-accent" : "text-ink-muted"}`}
    >
      {error ?? success}
    </p>
  );
}

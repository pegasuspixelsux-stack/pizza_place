const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink-faint";

const plainFieldClass =
  "w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint";

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

/**
 * An iOS-settings-style card: fields inside share one rounded container,
 * separated by hairline dividers instead of each having its own border.
 * Use with `<GroupedField>` + the `plain` variant of TextInput/TextArea.
 */
export function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-2xl border border-line bg-surface">
      {children}
    </div>
  );
}

export function GroupedField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput({
  plain,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { plain?: boolean }) {
  return (
    <input
      {...props}
      className={`${plain ? plainFieldClass : fieldClass} ${className ?? ""}`}
    />
  );
}

export function TextArea({
  plain,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { plain?: boolean }) {
  return (
    <textarea
      {...props}
      className={`${plain ? plainFieldClass : fieldClass} ${className ?? ""}`}
    />
  );
}

export function PrimaryButton({
  pending,
  pendingLabel,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: string;
}) {
  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className={`inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-50 ${className ?? ""}`}
    >
      {pending ? pendingLabel ?? "Guardando…" : children}
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

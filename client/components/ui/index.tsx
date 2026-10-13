// Button, Input and Card adapted from shadcn/ui's MIT-licensed New York source.
// Preact types, source-owned variants and native dialog replace unavailable bare imports.
import {
  h,
  createContext,
  type ComponentChildren,
  type JSX,
  type InputHTMLAttributes,
} from "preact";
import { useEffect, useId, useRef, useContext } from "preact/hooks";
import { Icon } from "../icons";

export function cn(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}
const variants = {
  default: "bg-[#6d354d] text-white shadow-sm hover:bg-[#58283c]",
  outline: "border border-[#e7dfdb] bg-white text-[#59434a] hover:bg-[#f7efed]",
  secondary: "bg-[#f4e8eb] text-[#7b4357] hover:bg-[#ebdce1]",
  ghost: "text-[#796b70] hover:bg-[#f2ebe8] hover:text-[#513643]",
  destructive: "bg-[#a7394d] text-white hover:bg-[#8c293c]",
};
export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: JSX.IntrinsicElements["button"] & {
  variant?: keyof typeof variants;
  size?: "default" | "sm" | "icon";
  className?: string;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a96b82] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        variants[variant],
        size === "icon"
          ? "h-10 w-10"
          : size === "sm"
            ? "min-h-9 px-3 py-2"
            : "min-h-11 px-5 py-2.5",
        className,
      )}
      {...props}
    />
  );
}
const FieldContext = createContext<string | undefined>(undefined);
export const inputClass =
  "flex min-h-12 w-full rounded-xl border border-[#e7dfdb] bg-white px-3.5 py-2.5 text-base text-[#49323c] transition-colors placeholder:text-[#826b77] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc8a9e] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  const label = useContext(FieldContext);
  return h("input", {
    className: cn(inputClass, className),
    ...props,
    "aria-label": props["aria-label"] ?? label,
  });
}
export function Select({
  className,
  ...props
}: JSX.IntrinsicElements["select"] & { className?: string }) {
  const label = useContext(FieldContext);
  return (
    <select
      className={cn(inputClass, "cursor-pointer", className)}
      {...props}
      aria-label={props["aria-label"] ?? label}
    />
  );
}
export function Card({
  className,
  ...props
}: JSX.IntrinsicElements["div"] & { className?: string }) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-[#e9e2de] bg-white text-[#49323c] shadow-[0_2px_10px_-8px_#725360]",
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({
  className,
  ...props
}: JSX.IntrinsicElements["div"] & { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 p-6", className)}
      {...props}
    />
  );
}
export function CardTitle({ children }: { children: ComponentChildren }) {
  return (
    <h2 className="text-[16px] font-semibold tracking-[-0.02em]">{children}</h2>
  );
}
export function CardContent({
  className,
  ...props
}: JSX.IntrinsicElements["div"] & { className?: string }) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ComponentChildren;
  hint?: string;
}) {
  return (
    <FieldContext.Provider value={label}>
      <label className="block space-y-2">
        <span className="block text-sm font-medium text-[#614e57]">
          {label}
        </span>
        {children}
        {hint && <span className="block text-xs text-[#87777e]">{hint}</span>}
      </label>
    </FieldContext.Provider>
  );
}
export function Progress({
  value,
  color = "#b76e86",
  label,
}: {
  value: number;
  color?: string;
  label: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(100, Math.max(0, value)))}
      className="h-2 overflow-hidden rounded-full bg-[#f1ece9]"
    >
      <div
        className="h-full rounded-full transition-all duration-700 motion-reduce:transition-none"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ComponentChildren;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.animate?.(
        [
          { opacity: 0, transform: "translateY(8px) scale(0.98)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 180, easing: "ease-out" },
      );
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (ref.current && event.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-[#e7dfdb] bg-[#fffdfa] p-6 text-[#49323c] shadow-2xl backdrop:bg-[#392631]/35 backdrop:backdrop-blur-sm sm:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id={titleId}
          className="text-3xl"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  icon = "wallet",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: ComponentChildren;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eaec] text-[#a3637b]">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="mb-5 max-w-xs text-sm leading-6 text-[#887980]">
        {description}
      </p>
      {action}
    </div>
  );
}
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />
      {label}
    </span>
  );
}

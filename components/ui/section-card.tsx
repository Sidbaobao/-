import { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "subtle" | "data";
};

const variantClassName = {
  default: "border-white/70 bg-white/85 shadow-soft",
  subtle: "border-ink/10 bg-white/60",
  data: "border-ink/10 bg-white"
};

export function SectionCard({ title, description, children, variant = "default" }: SectionCardProps) {
  return (
    <section className={`rounded-xl border p-5 sm:p-6 ${variantClassName[variant]}`}>
      {title ? <h2 className="text-lg font-semibold text-ink sm:text-xl">{title}</h2> : null}
      {description ? <p className="mt-2 text-sm leading-6 text-ink/70">{description}</p> : null}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

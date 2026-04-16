import { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-soft">
      {title ? <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2> : null}
      {description ? <p className="mt-2 text-sm leading-6 text-ink/70">{description}</p> : null}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
};

export function SectionHeading({ id, eyebrow, title, subtitle, tone = "dark", align = "center" }: SectionHeadingProps) {
  const baseEyebrow = tone === "light" ? "text-primary" : "text-cyan-soft";
  const titleColor = tone === "light" ? "text-slate-900" : "text-white";
  const subtitleColor = tone === "light" ? "text-slate-500" : "text-slate-300/90";
  const alignClass = align === "left" ? "text-left mx-0" : "text-center mx-auto";

  return (
    <header id={id} className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <div className={`flex items-center gap-3 mb-4 ${align === "left" ? "justify-start" : "justify-center"}`}>
          <span className={`h-px w-8 ${tone === "light" ? "bg-primary/40" : "bg-cyan-soft/40"}`} />
          <span className={`text-[11px] font-bold uppercase tracking-[0.35em] ${baseEyebrow}`}>
            {eyebrow}
          </span>
          <span className={`h-px w-8 ${tone === "light" ? "bg-primary/40" : "bg-cyan-soft/40"}`} />
        </div>
      ) : null}
      <h2 className={`heading-font text-3xl font-bold leading-tight sm:text-[2.25rem] ${titleColor}`}>{title}</h2>
      {subtitle ? <p className={`mt-5 text-base sm:text-lg leading-relaxed ${subtitleColor}`}>{subtitle}</p> : null}
    </header>
  );
}

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "dark" | "light";
};

export function SectionHeading({ id, eyebrow, title, subtitle, tone = "dark" }: SectionHeadingProps) {
  const baseEyebrow = tone === "light" ? "text-primary" : "text-primary-light/90";
  const titleColor = tone === "light" ? "text-slate-900" : "text-white";
  const subtitleColor = tone === "light" ? "text-slate-600" : "text-slate-300/90";

  return (
    <header id={id} className={`mx-auto max-w-3xl text-center ${tone === "light" ? "text-slate-700" : "text-slate-200"}`}>
      {eyebrow ? (
        <span className={`text-xs font-semibold uppercase tracking-[0.28em] ${baseEyebrow}`}>
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`mt-3 text-3xl font-semibold sm:text-[2.2rem] ${titleColor}`}>{title}</h2>
      {subtitle ? <p className={`mt-4 text-base sm:text-lg ${subtitleColor}`}>{subtitle}</p> : null}
    </header>
  );
}

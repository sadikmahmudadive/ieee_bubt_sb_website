type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ id, eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <header id={id} className="mx-auto max-w-3xl text-center text-slate-200">
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-light">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-lg text-slate-300">{subtitle}</p> : null}
    </header>
  );
}

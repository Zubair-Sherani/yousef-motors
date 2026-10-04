export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-line bg-stone">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        {eyebrow ? (
          <p className="mb-3 text-xs font-medium tracking-[0.22em] text-copper uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>
        ) : null}
      </div>
    </header>
  );
}

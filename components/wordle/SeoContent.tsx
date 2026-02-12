import {
  ContentSection,
  getContentByWordLength,
} from "@/data/letter-games-content";

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function SectionHeading({
  level,
  children,
}: {
  level: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  if (level === 2)
    return (
      <h2 className="mt-10 font-heading text-2xl font-bold text-foreground">
        {children}
      </h2>
    );
  if (level === 3)
    return (
      <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
        {children}
      </h3>
    );
  return (
    <h4 className="mt-4 font-heading text-base font-semibold text-foreground">
      {children}
    </h4>
  );
}

function ContentSectionBlock({ section }: { section: ContentSection }) {
  return (
    <div>
      <SectionHeading level={section.level}>
        {section.heading}
      </SectionHeading>

      {section.paragraphs?.map((p, i) => (
        <p
          key={i}
          className="mt-3 leading-relaxed text-muted-foreground"
        >
          {renderBoldText(p)}
        </p>
      ))}

      {section.wordCategories && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.wordCategories.map((cat, i) => (
            <div
              key={i}
              className="rounded-xl border border-blue-100 bg-card p-4 dark:border-blue-900/40"
            >
              <h4 className="font-heading text-sm font-bold text-foreground">
                {cat.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {cat.words}
              </p>
            </div>
          ))}
        </div>
      )}

      {section.items && (
        <>
          {section.ordered ? (
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {renderBoldText(item)}
                </li>
              ))}
            </ol>
          ) : (
            <ul className="mt-3 space-y-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{renderBoldText(item)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default function SeoContent({ wordLength }: { wordLength: number }) {
  const sections = getContentByWordLength(wordLength);
  if (sections.length === 0) return null;

  return (
    <section className="mt-10">
      {sections.map((section, i) => (
        <ContentSectionBlock key={i} section={section} />
      ))}
    </section>
  );
}

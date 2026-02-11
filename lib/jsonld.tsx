import { BASE_URL } from "@/config/site";

/* ------------------------------------------------------------------ */
/*  Generic JSON-LD script tag                                         */
/* ------------------------------------------------------------------ */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  WebSite schema (use once in layout)                                */
/* ------------------------------------------------------------------ */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "theforgecodes",
    url: BASE_URL,
    description:
      "Daily verified The Forge Roblox code tracker with active and expired codes, timestamps, redeem steps, and troubleshooting.",
    inLanguage: ["en", "zh", "ja"],
  };
}

/* ------------------------------------------------------------------ */
/*  FAQPage schema                                                     */
/* ------------------------------------------------------------------ */

export function faqPageSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  HowTo schema                                                       */
/* ------------------------------------------------------------------ */

export function howToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList schema                                              */
/* ------------------------------------------------------------------ */

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Article schema (for blog posts)                                    */
/* ------------------------------------------------------------------ */

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: image || `${BASE_URL}/og.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "theforgecodes",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "theforgecodes",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
}

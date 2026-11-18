import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BASE_URL } from "@/config/site";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import styles from "./lessons.module.css";

export function LessonPage({ parent, title, path, tone, guidePreview, intro, children }: {
  parent: { label: string; path: string };
  title: string;
  path: string;
  tone: "archive" | "swap" | "purple";
  guidePreview: { file: string; label: string; anchor: string };
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page} data-tone={tone}>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: parent.label, url: BASE_URL + parent.path },
        { name: title, url: BASE_URL + path },
      ])} />
      <header className={styles.intro}>
        <div>
          <Link href={parent.path}>‹ {parent.label}</Link>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        <a className={styles.preview} href={"#" + guidePreview.anchor}>
          <Image src={guidePreview.file} alt="" width={960} height={640} unoptimized />
          <span>{guidePreview.label} <span aria-hidden="true">↓</span></span>
        </a>
      </header>
      {children}
    </div>
  );
}

export function LessonFigure({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  return <figure className={styles.figure}>
    <Image src={file} alt={alt} width={1080} height={720} unoptimized />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function LessonContents({ links, illustration }: { links: [string, string][]; illustration: ReactNode }) {
  return <div className={styles.guideIndex}>
    {illustration}
    <nav aria-label="In this guide" className={styles.contents}>
      <strong>In this guide</strong>
      <ul>{links.map(([id, label]) => <li key={id}><a href={"#" + id}>{label}<span aria-hidden="true">↓</span></a></li>)}</ul>
    </nav>
  </div>;
}

export function LessonTable({ caption, headers, rows }: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return <table className={styles.lessonTable}>
    <caption>{caption}</caption>
    <thead><tr>{headers.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
    <tbody>{rows.map(([label, ...values], row) => <tr key={row}>
      <th scope="row">{label}</th>{values.map((value, column) => <td key={column}>{value}</td>)}
    </tr>)}</tbody>
  </table>;
}

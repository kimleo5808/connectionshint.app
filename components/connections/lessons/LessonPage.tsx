import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BASE_URL } from "@/config/site";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import styles from "./lessons.module.css";

export function LessonPage({ parent, title, path, intro, children }: {
  parent: { label: string; path: string };
  title: string;
  path: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: parent.label, url: BASE_URL + parent.path },
        { name: title, url: BASE_URL + path },
      ])} />
      <header className={styles.intro}>
        <Link href={parent.path}>‹ {parent.label}</Link>
        <h1>{title}</h1>
        <p>{intro}</p>
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

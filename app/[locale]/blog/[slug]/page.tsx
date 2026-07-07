import { Callout } from "@/components/mdx/Callout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { BASE_URL } from "@/config/site";
import { Link as I18nLink, Locale, LOCALES } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getPosts } from "@/lib/getBlogs";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { BlogPost } from "@/types/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{
  locale: string;
  slug: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((post) => post.slug === "/" + slug);

  if (!post) {
    return constructMetadata({
      title: "404",
      description: "Page not found",
      noIndex: true,
      locale: locale as Locale,
      path: `/blog/${slug}`,
      canonicalUrl: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    page: "blog",
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : [],
    locale: locale as Locale,
    path: `/blog/${slug}`,
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);

  const post = posts.find((item) => item.slug === "/" + slug);

  if (!post) {
    return notFound();
  }

  const slugClean = post.slug.replace(/^\//, "");

  return (
    <div className="w-full md:w-3/5 px-2 md:px-12">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description || "",
          url: `${BASE_URL}/blog/${slugClean}`,
          datePublished: post.date instanceof Date ? post.date.toISOString() : String(post.date),
          image: post.image,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Blog", url: `${BASE_URL}/blog` },
          { name: post.title, url: `${BASE_URL}/blog/${slugClean}` },
        ])}
      />

      {/* Breadcrumb */}
      <nav className="mt-6 mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <I18nLink
          href="/blog"
          prefetch={false}
          className="flex items-center gap-1 transition-colors hover:text-blue-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Posts
        </I18nLink>
        <span>/</span>
        <span className="line-clamp-1 text-foreground">{post.title}</span>
      </nav>

      <h1 className="break-words text-4xl font-bold mb-4">{post.title}</h1>
      {post.image && (
        <img src={post.image} alt={`Cover image for ${post.title}`} className="rounded-sm w-full" />
      )}
      {post.tags && post.tags.split(",").length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => {
            return (
              <div
                key={tag}
                className={`rounded-md bg-gray-200 hover:!no-underline dark:bg-[#24272E] flex px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-black hover:dark:bg-[#15AFD04C] hover:dark:text-[#82E9FF] text-gray-500 dark:text-[#7F818C] outline-none focus-visible:ring transition`}
              >
                {tag.trim()}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      {post.description && <Callout>{post.description}</Callout>}
      <MarkdownContent markdown={post.content || ""} />
    </div>
  );
}

export async function generateStaticParams() {
  let posts = (await getPosts()).posts;

  // Filter out posts without a slug
  posts = posts.filter((post) => post.slug);

  return LOCALES.flatMap((locale) =>
    posts.map((post) => {
      const slugPart = post.slug.replace(/^\//, "").replace(/^blog\//, "");

      return {
        locale,
        slug: slugPart,
      };
    })
  );
}

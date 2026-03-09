import { DEFAULT_LOCALE } from "@/i18n/routing";
import { STATIC_BLOG_POSTS } from "@/data/static-content";
import { BlogPost } from "@/types/blog";

export async function getPosts(
  locale: string = DEFAULT_LOCALE
): Promise<{ posts: BlogPost[] }> {
  const posts = STATIC_BLOG_POSTS.filter(
    (post) => (post.locale || DEFAULT_LOCALE) === locale && post.visible === "published"
  ).sort((a, b) => {
    if (a.pin !== b.pin) {
      return (b.pin ? 1 : 0) - (a.pin ? 1 : 0);
    }

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return { posts };
}

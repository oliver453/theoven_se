import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import CategoryIcon from "@/components/CategoryIcons";
import { client } from "@/lib/sanity";

async function getCategories() {
  try {
    const categories = await client.fetch(
      `
      *[_type == "category" && defined(title) && defined(slug.current)] | order(order asc, title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        order,
        "articleCount": count(*[_type == "article" && references(^._id)])
      }
    `,
      {},
      {
        next: { revalidate: 60 },
      },
    );

    return categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="z-10">
      {/* Hero Section */}
      <section className="pb-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Upptäck svar och insikter från Diavana-teamet
          </h1>

          <div className="mt-12">
            <SearchBar placeholder="Sök efter artiklar..." />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-foreground/60">Inga kategorier hittades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => {
              return (
                <CategoryCard
                  key={category._id}
                  title={category.title}
                  articleCount={category.articleCount}
                  icon={() => (
                    <CategoryIcon
                      icon={category.icon || "default"}
                      className="h-6 w-6 text-white"
                    />
                  )}
                  slug={category.slug.current}
                  description={category.description}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import CategoryIcon from '@/components/CategoryIcons'
import { client } from '@/lib/sanity'

async function getCategories() {
  try {
    const categories = await client.fetch(`
      *[_type == "category" && defined(title) && defined(slug.current)] | order(order asc, title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        order,
        "articleCount": count(*[_type == "article" && references(^._id)])
      }
    `)
        
    console.log('Fetched categories:', categories) // Debug
    return categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen z-10">
      {/* Hero Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-6">
            Upptäck svar och insikter från Diavana-teamet
          </h1>
                    
          <div className="mt-12">
            <SearchBar placeholder="Sök efter artiklar..." />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Inga kategorier hittades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => {                            
              return (
                <CategoryCard
                  key={category._id}
                  title={category.title}
                  articleCount={category.articleCount}
                  icon={() => <CategoryIcon icon={category.icon || 'general'} 
                  className="w-6 h-6 text-background" 
                />}
                  slug={category.slug.current}
                  description={category.description}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
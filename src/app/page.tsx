import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import { client } from '@/lib/sanity'
import { 
  MessageCircle, 
  Zap, 
  Users, 
  DollarSign, 
  GraduationCap, 
  Monitor, 
  Code, 
  Wand2, 
  Smartphone 
} from 'lucide-react'

// Icon mapping för kategorier
const iconMap = {
  'claude': MessageCircle,
  'paid-plans': Zap,
  'team': Users,
  'financial': DollarSign,
  'education': GraduationCap,
  'api': Monitor,
  'code': Code,
  'prompt-design': Wand2,
  'mobile': Smartphone,
}

async function getCategories() {
  try {
    return await client.fetch(`
      *[_type == "category"] | order(order asc, title asc) {
        _id,
        title,
        slug,
        description,
        icon,
        "articleCount": count(*[_type == "article" && references(^._id)])
      }
    `)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category: any) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageCircle
              
              return (
                <CategoryCard
                  key={category._id}
                  title={category.title}
                  articleCount={category.articleCount}
                  icon={IconComponent}
                  slug={category.slug.current}
                  description={category.description}
                />
              )
            })
          ) : (
            // Fallback categories om Sanity inte är konfigurerat än
            <>
              <CategoryCard
                title="Claude"
                articleCount={67}
                icon={MessageCircle}
                slug="claude"
                description="Allt om att använda Claude AI-assistenten"
              />
              <CategoryCard
                title="Betalda Claude-planer"
                articleCount={18}
                icon={Zap}
                slug="paid-plans"
                description="Information om prenumerationer och betalning"
              />
              <CategoryCard
                title="Claude för Work (Team och...)"
                articleCount={41}
                icon={Users}
                slug="team"
                description="Teamfunktioner och företagslösningar"
              />
              <CategoryCard
                title="Claude för finansiella tjänster"
                articleCount={1}
                icon={DollarSign}
                slug="financial"
                description="Specialiserade lösningar för finanssektorn"
              />
              <CategoryCard
                title="Claude för utbildning"
                articleCount={4}
                icon={GraduationCap}
                slug="education"
                description="Utbildningsverktyg och -resurser"
              />
              <CategoryCard
                title="Diavana API och API Console"
                articleCount={34}
                icon={Monitor}
                slug="api"
                description="Utvecklarverktyg och API-dokumentation"
              />
              <CategoryCard
                title="Claude Code"
                articleCount={4}
                icon={Code}
                slug="code"
                description="Kodverktyg och utvecklingsresurser"
              />
              <CategoryCard
                title="API Prompt Design"
                articleCount={4}
                icon={Wand2}
                slug="prompt-design"
                description="Tips för att skriva effektiva prompts"
              />
              <CategoryCard
                title="Claude Mobilappar"
                articleCount={21}
                icon={Smartphone}
                slug="mobile"
                description="Information om mobila applikationer"
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
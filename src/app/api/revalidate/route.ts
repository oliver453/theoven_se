import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Kontrollera hemlig token för säkerhet
    const token = request.nextUrl.searchParams.get('token')
    if (token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Hantera olika typer av uppdateringar från Sanity
    const { _type, slug, category } = body

    if (_type === 'article') {
      // Revalidera specifik artikel
      if (slug?.current) {
        revalidatePath(`/article/${slug.current}`)
      }
      
      // Revalidera kategori om artikel tillhör en kategori
      if (category?.slug?.current) {
        revalidatePath(`/category/${category.slug.current}`)
      }
      
      // Revalidera startsidan
      revalidatePath('/')
    }
    
    if (_type === 'category') {
      // Revalidera specifik kategori
      if (slug?.current) {
        revalidatePath(`/category/${slug.current}`)
      }
      
      // Revalidera startsidan
      revalidatePath('/')
    }

    return NextResponse.json({ 
      message: 'Revalidated successfully',
      revalidated: true 
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating' }, 
      { status: 500 }
    )
  }
}
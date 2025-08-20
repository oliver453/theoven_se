import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  icon: TagIcon, // Lägger till ikonen
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Sammanfattning',
      type: 'text',
      rows: 3,
      description: 'Kort beskrivning av artikeln som visas i listor'
    }),
    defineField({
      name: 'content',
      title: 'Innehåll',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Citat', value: 'blockquote'},
          ],
          lists: [
            {title: 'Punktlista', value: 'bullet'},
            {title: 'Numrerad lista', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Fet', value: 'strong'},
              {title: 'Kursiv', value: 'em'},
              {title: 'Kod', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                  {
                    title: 'Öppna i ny flik',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternativ text',
            }
          ]
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Kodblock',
          fields: [
            {
              name: 'language',
              title: 'Programmeringsspråk',
              type: 'string',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'Python', value: 'python'},
                  {title: 'JSON', value: 'json'},
                ]
              },
              initialValue: 'javascript'
            },
            {
              name: 'code',
              title: 'Kod',
              type: 'text',
              rows: 10
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Framhävd artikel',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicerad',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'updatedAt',
      title: 'Uppdaterad',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  orderings: [
    {
      title: 'Senast publicerad',
      name: 'publishedAtDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Äldst publicerad',
      name: 'publishedAtAsc',
      by: [
        {field: 'publishedAt', direction: 'asc'}
      ]
    },
    {
      title: 'Titel A-Ö',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'mainImage' // Denna refererar till ett fält som inte finns
    }
  }
})
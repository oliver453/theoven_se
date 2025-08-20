import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  icon: TagIcon,
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
      name: 'description',
      title: 'Beskrivning',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      options: {
        list: [
          {title: 'Meddelande', value: 'claude'},
          {title: 'Blixt', value: 'paid-plans'},
          {title: 'Användare', value: 'team'},
          {title: 'Dollar', value: 'financial'},
          {title: 'Utbildning', value: 'education'},
          {title: 'Monitor', value: 'api'},
          {title: 'Kod', value: 'code'},
          {title: 'Trollstav', value: 'prompt-design'},
          {title: 'Mobil', value: 'mobile'},
        ]
      },
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Sorteringsordning',
      type: 'number',
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
})
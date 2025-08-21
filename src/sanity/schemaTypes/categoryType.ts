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
          {title: 'Dator', value: 'desktop'},
          {title: 'Laptop', value: 'laptop'},
          {title: 'Enheter', value: 'devices'},
          {title: 'Dokument', value: 'documents'},
          {title: 'Filer', value: 'files'},
          {title: 'PDF', value: 'pdf'},
          {title: 'Word', value: 'word'},
          {title: 'Kodfiler', value: 'coding'},
          {title: 'Databas', value: 'database'},
          {title: 'Moln', value: 'cloud'},
          {title: 'Hårdvara', value: 'hardware'},
          {title: 'Sök', value: 'search'},
          {title: 'Webb', value: 'web'},
          {title: 'Inställningar', value: 'settings'},
          {title: 'Verktyg', value: 'tools'},
          {title: 'Felsökning', value: 'debugging'},
          {title: 'Terminal', value: 'terminal'},
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
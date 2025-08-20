import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Artiklar först (om det är huvudinnehållet)
      S.documentTypeListItem('article').title('Artiklar'),
      S.divider(),
      
      // Andra innehållstyper
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Kategorier'),
      S.documentTypeListItem('author').title('Författare'),
      S.divider(),
      
      // Alla andra dokumenttyper som inte är explicitly listade
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['article', 'post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
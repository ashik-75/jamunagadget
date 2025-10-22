import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import { productType } from './productType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, productType, orderType]
}

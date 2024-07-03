import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'userHash',
  title: 'User Hash',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'hash',
      title: 'Hash',
      type: 'string',
    }),
  ],
});
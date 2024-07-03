import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SpagghetiDEX',

  projectId: 'ch5ei8m2',
  dataset: 'user-address',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

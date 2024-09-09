import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../db/index.js';
import components from '../components/index.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [{
    resource: { model: getModelByName('Recommendation'), client: prisma },
    options: {
      properties: {
        type: {
          type: 'string',
          availableValues: [
            { value: 'tv-habits', label: 'TV Habits' },
            { value: 'custom-playlist', label: 'Custom Playlist' },
          ],
        },
        universes: {
          type: 'string',
          availableValues: [],
          components: {
            edit: components.UniversesCheckboxGroup,
          },
        },
        keywords: {
          type: 'mixed',
          components: {
            edit: components.ConditionalProperty,
          },
          custom: {
            showIf: {
              property: 'type',
              value: 'custom-playlist',
            },
            overrideComponents: {
              edit: components.KeywordsSelector,
            }
          }
        }
      },
    },
  }],
  databases: [],
};

export default options;

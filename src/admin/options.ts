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
      actions: {
        new: {
          before: (request, context) => {
            console.log(request);
          }
        },
      },
      properties: {
        type: {
          position: 1,
          type: 'string',
          availableValues: [
            { value: 'tv-habits', label: 'TV Habits' },
            { value: 'custom-playlist', label: 'Custom Playlist' },
          ],
        },
        universes: {
          position: 2,
          type: 'string',
          availableValues: [],
          components: {
            edit: components.UniversesCheckboxGroup,
          },
        },
        keywords: {
          type: 'mixed',
          isArray: true,
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
  }, {
    resource: { model: getModelByName('KeywordGroup'), client: prisma },
  }],
  databases: [],
};

export default options;

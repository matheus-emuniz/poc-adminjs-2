import { DefaultAuthProvider } from 'adminjs';

import componentLoader from './component-loader.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    return { email }
  },
});

export default provider;

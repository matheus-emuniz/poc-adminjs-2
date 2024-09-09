import AdminJS from 'adminjs';
import Fastify from 'fastify';
import AdminJSFastify from '@adminjs/fastify';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';

const port = process.env.PORT ? +process.env.PORT : 3000;

const start = async () => {
  const app = Fastify();

  await initializeDb();

  const admin = new AdminJS(options);

  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  await AdminJSFastify.buildRouter(
    admin,
    app,
  );

  app.listen({ port }, (err, addr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
    }
  });
};

start();

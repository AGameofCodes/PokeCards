import Server from './server';

const server = new Server();
server.init()
  .then(_ => server.queueStart());

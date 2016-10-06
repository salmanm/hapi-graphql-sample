import Hapi from 'hapi';
import Users from './routes/users';

const server = new Hapi.Server();

server.connection({
  port: 3000
});

server.register({
  register: Users
}, () =>
  server.start(() =>
    console.log('Server running at:', server.info.uri)
  )
);

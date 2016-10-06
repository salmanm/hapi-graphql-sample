import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import schema from './schema';

const server = new Hapi.Server();

server.connection({
  port: 3000
});


server.register({
  register: GraphQL,
  options: {
    query: {
      schema: schema,
      graphiql: true
    },
    route: {
      path: '/graphql',
      config: {}
    }
  }
}, () =>
  server.start(() =>
    console.log('Server running at:', server.info.uri)
  )
);

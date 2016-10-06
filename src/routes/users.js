import loki from 'lokijs';
import GraphQL from 'hapi-graphql';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

const plugin = {
  register: function (server, options, next) {
    const db = new loki('db.json');

    const users = db.addCollection('users');

    users.insert({id:'1', firstName:'Damian'});
    users.insert({id:'2', firstName:'Salman'});
    users.insert({id:'3', firstName:'Mark'});
    users.insert({id:'4', firstName:'Peter'});
    users.insert({id:'5', firstName:'Michele'});
    users.insert({id:'6', firstName:'Mihai'});

    function findUser(id) {
      console.log('QUERY FOR', id);

      return new Promise((resolve) => {
        setTimeout(() => {
          var result = users.find({id: id});
          console.log(result);
          resolve(result[0]);
        }, 100);
      });
    }

    const PersonType = new GraphQLObjectType({
      name: 'Person',
      description: '...',

      fields: () => ({
        id: { type: GraphQLString },
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },

        friends: {
          type: new GraphQLList(PersonType),
          resolve: (person) => person.friends.map(findUser)
        }
      })
    });

    const QueryType = new GraphQLObjectType({
      name: 'Query',
      description: '...',

      fields: () => ({
        person: {
          type: PersonType,
          args: {
            id: { type: GraphQLString }
          },

          resolve: (root, args) => findUser(args.id)
        }
      })
    });

    const Schema = new GraphQLSchema({
      query: QueryType
    });

    server.register({
      register: GraphQL,
      options: {
        query: {
          schema: Schema,
          graphiql: true
        },
        route: {
          path: '/graphql',
          config: {}
        }
      }
    }, function (err) {
      if (err) {
        console.log(err);
      }

      next();
    });
  }
};

plugin.register.attributes = {
  name: 'users',
  version: '0.0.1'
};

export default plugin;

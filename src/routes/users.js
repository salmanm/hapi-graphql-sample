import loki from 'lokijs';
import GraphQL from 'hapi-graphql';
import data from '../data/users.js';

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

    data.forEach(::users.insert);

    function findUser(id) {
      console.log('Query for: ', id);

      return new Promise((resolve) => {
        setTimeout(() => {
          var result = users.find({id: id});
          console.log(result, id);
          resolve(result[0]);
        }, 0);
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

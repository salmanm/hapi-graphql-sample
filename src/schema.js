import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

function getPerson(id) {
  // Would fetch from database, but returning a promise with stubbed data for test purpose.

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        firstName: 'John',
        lastName: 'Rambo',
        email: 'john@example.com',
        username: 'john',
        friends: [
          '/people/2',
          'people/3'
        ]
      });
    }, 100);
  });
}

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: '...',

  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    id: { type: GraphQLString },

    friends: {
      type: new GraphQLList(PersonType),
      resolve: (person) => person.friends.map(getPerson)
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

      resolve: () => getPerson()
    }
  })
});

export default new GraphQLSchema({
  query: QueryType
})

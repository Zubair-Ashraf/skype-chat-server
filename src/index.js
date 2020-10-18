import "@babel/polyfill";
import { GraphQLServer } from "graphql-yoga";
import { Query, Mutation, User, Subscription } from "./resolvers";
import contextMiddleware from "./middleware/auth";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
  },
  context: contextMiddleware,
});
server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("Server is running");
});

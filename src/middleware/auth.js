import { PubSub } from "graphql-yoga";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const pubsub = new PubSub();

const verifyUser = (context) => {
  let token;
  if (
    context.request &&
    context.request.headers &&
    context.request.headers.authorization
  ) {
    token = context.request.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  jwt.verify(token, "JWT_SECRET", (_, decodedToken) => {
    context.user = decodedToken;
  });
  context.prisma = prisma;
  context.pubsub = pubsub;
  return context;
};

export { verifyUser as default };

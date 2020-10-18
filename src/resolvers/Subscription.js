import { withFilter } from "graphql-yoga";

const Subscription = {
  receiveMessage: {
    subscribe: withFilter(
      (parent, args, { user, pubsub }) => {
        if (!user) throw new AuthenticationError("Unanthenticated");
        return pubsub.asyncIterator("NEW_MESSAGE");
      },
      ({ receiveMessage }, args, { pubsub, user }) => {
        if (
          receiveMessage.from === user.username ||
          receiveMessage.to === user.username
        )
          return true;
        return false;
      }
    ),
  },
};

export { Subscription as default };

import bcrypt from "bcryptjs";
import hashPassword from "../utils/hashPassword";
import generateToken from "../utils/generateToken";

const Mutation = {
  async register(_, { data: { username, email, password } }, { prisma }) {
    password = await hashPassword(password);
    const isUserAlreadyExist = await prisma.exists.User({
      OR: [{ email }, { username }],
    });
    if (isUserAlreadyExist) {
      throw new Error("This User already exist");
    }
    const user = await prisma.mutation.createUser({
      data: { username, email, password },
    });

    return { user, token: generateToken(user) };
  },
  async login(_, { data: { username, password } }, { prisma }) {
    let user = await prisma.query.user({ where: { username } });
    if (!user) throw new Error("No user found");
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new Error("Invalid credentials");
    return { user, token: generateToken(user) };
  },
  async sendMessage(
    _,
    { data: { content, to } },
    { prisma, user, pubsub },
    info
  ) {
    if (!user) throw new Error("Access Denied. You are not authorized");
    const recipient = await prisma.query.user({ where: { username: to } });
    if (!recipient) throw new Error("Recipient not found");
    if (recipient && recipient.username === user.username) {
      throw new Error("You can't send message itself");
    }
    const message = await prisma.mutation.createMessage({
      data: { from: user.username, to, content },
    });
    pubsub.publish("NEW_MESSAGE", { receiveMessage: message });
    return message;
  },
};

export { Mutation as default };

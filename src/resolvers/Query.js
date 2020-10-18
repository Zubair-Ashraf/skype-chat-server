const Query = {
  async users(_, args, { prisma, user }, info) {
    if (!user) throw new Error("Access Denied. You are not authorized");
    let users = await prisma.query.users(
      { where: { NOT: { username: user.username } } },
      info
    );
    let allUsersMessages = await prisma.query.messages({
      where: {
        OR: [{ from: user.username }, { to: user.username }],
      },
      orderBy: "createdAt_DESC",
    });

    // console.log(allUsersMessages);

    users = users.map((otherUser) => {
      const latestMessage = allUsersMessages.find(
        (message) =>
          message.from === otherUser.username ||
          message.to === otherUser.username
      );
      otherUser.latestMessage = latestMessage;
      return otherUser;
    });
    console.log(users);
    return users;
  },
  async receiveMessages(_, { data: { from } }, { prisma, user }, info) {
    if (!user) throw new Error("Access Denied. You are not authorized");
    const isUserExist = await prisma.query.user({ where: { username: from } });
    if (!isUserExist) throw new Error("User not found");
    const messages = await prisma.query.messages({
      where: {
        AND: [
          { OR: [{ from: user.username }, { from }] },
          { OR: [{ to: user.username }, { to: from }] },
        ],
      },
      orderBy: "createdAt_DESC",
    });
    return messages;
  },
};

export { Query as default };

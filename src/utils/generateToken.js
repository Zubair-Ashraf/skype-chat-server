import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    "JWT_SECRET",
    {
      expiresIn: "7 days",
    }
  );
};

export { generateToken as default };

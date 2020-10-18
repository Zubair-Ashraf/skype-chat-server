import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  return bcrypt.hash(password, 11);
};

export { hashPassword as default };

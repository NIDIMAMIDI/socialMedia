import bcrypt from 'bcrypt';
export const hashPassword = async (password, saltRounds) => {
  return await bcrypt.hash(password, saltRounds);
};

export const passwordChecker = async (plainPassword, hashPassword) => {
  return await bcrypt.compareSync(plainPassword, hashPassword);
};

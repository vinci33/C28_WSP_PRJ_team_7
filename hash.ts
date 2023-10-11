import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * @param plainPassword: supplied when signup
 */
// PlainText -> Hashed Password
export async function hashPassword(plainPassword: string) {
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * @param options.plainPassword: supplied when login
 * @param options.hashedPassword: looked up from the database
 */
// PlainText -> (Check with) Hashed Password
export async function checkPassword(options: { plainPassword: any; hashedPassword: any; }) {
  const isMatched = await bcrypt.compare(
    options.plainPassword,
    options.hashedPassword,
  );
  return isMatched;
}
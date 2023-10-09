import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * @params plainPassword: supplied when signup
 */
// PlainText -> Hashed Password
export async function hashPassword(plainPassword: string) {
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS)
  return hash
}

/**
 * @params options.plainPassword: supplied when login
 * @params options.hashedPassword: looked up from database
 */
// PlainText -> (Check with) Hashed Password
export async function checkPassword(options: {
  plainPassword: string
  hashedPassword: string
}) {
  const isMatched: boolean = await bcrypt.compare(
    options.plainPassword,
    options.hashedPassword,
  )
  return isMatched
}
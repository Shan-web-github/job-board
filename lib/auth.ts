import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || '123456789'

export async function signUp(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'user' 
    }
  })
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Invalid password')

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d'
  })

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
}

export async function getUserFromToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
    return prisma.user.findUnique({ where: { id: payload.userId } })
  } catch (error) {
    return null
  }
}
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany({
      include: { user: { select: { name: true } } }
    })
    return res.json(jobs)
  }

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1]
    const user = await getUserFromToken(token || '')
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { title, company, location, type, description } = req.body
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        description,
        userId: user.id
      }
    })
    return res.status(201).json(job)
  }

  return res.status(405).end()
}
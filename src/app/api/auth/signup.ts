import { signUp } from '../../../../lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { email, password, name } = req.body
    const user = await signUp(email, password, name)
    res.status(201).json(user)
} catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
}
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

function authorize(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req })
    if (!token) {
      return res.status(401).end()
    }
    return handler(req, res)
  }
}

export default authorize

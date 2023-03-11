import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
    oldPassword: string
    newPassword: string
  }
}
function authorize(handler) {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req })
    console.log(token)
    if (!token) {
      return res.status(401).end()
    }
    return handler(req, res)
  }
}

export default authorize

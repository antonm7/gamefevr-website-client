import { getToken } from 'next-auth/jwt'

function authorize(handler: any) {
  return async (req: any, res: any) => {
    const token = await getToken({ req })
    if (!token) {
      return res.status(401).end()
    }
    return handler(req, res)
  }
}

export default authorize

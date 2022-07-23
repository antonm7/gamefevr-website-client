import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export default async function (req: NextApiRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return false;
  return true;
}

import clientPromise from '../lib/functions/mongodb'

interface Props {
  error: string
  status: number,
  e?: any
}

async function generateErrorBackend({ error, status, e }: Props) {
  const client = await clientPromise
  const db = client.db()

  await db.collection('errors').insertOne({
    error,
    status,
    e
  })
}

export default generateErrorBackend

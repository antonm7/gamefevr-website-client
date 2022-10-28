import clientPromise from '../lib/functions/mongodb'
interface Props {
  error: string
  status: number
  e: any
}

async function GenerateError({ error, status, e }: Props) {
  const client = await clientPromise
  const db = client.db('gameFevr')

  await db.collection('errors').insertOne({
    error,
    status,
  })
}

export default GenerateError

import { Response } from 'express'
import { NextApiRequest } from 'next'
import clientPromise from '../../../lib/functions/mongodb'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: {
      page: number
      query: {
        yearRange: string[] | string | undefined
        genres: string[] | string | undefined
        consoles: string[] | string | undefined
        search: string | undefined
      }
    }
  }
}

const isNextPage = (page: number, count: number) => {
  if (page * 16 < count) {
    return true
  } else {
    return false
  }
}

export default async function handler(req: ExtendedNextApiRequest, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const { page, query } = req.body.body
  const { yearRange, genres, consoles, search } = query
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('short_games');

    let filtering: any = { $and: [] };

    if (search) {
      filtering.$and.push({ name: { $regex: new RegExp(search), $options: 'i' } });
    }

    if (yearRange) {
      filtering.$and.push({ released: { $gte: `${yearRange[0]}-01-01`, $lte: `${yearRange[1]}-12-31` } });
    }

    if (genres) {
      const genreIds = typeof genres === 'string' ? [parseInt(genres)] : Object.values(genres).map((id) => parseInt(id));
      filtering.$and.push({ 'genres.id': { $in: genreIds } });
    }

    if (consoles) {
      const consoleIds = typeof consoles === 'string' ? [parseInt(consoles)] : Object.values(consoles).map((id) => parseInt(id));
      filtering.$and.push({ 'parent_platforms.platform.id': { $in: consoleIds } });
    }

    const query = collection.find(filtering.$and.length ? filtering : {});

    const [data, count] = await Promise.all([
      query.limit(16).skip(16 * (page - 1)).toArray(),
      collection.countDocuments(filtering.$and.length ? filtering : {}) as unknown as number,
    ]);

    res.status(200).send({
      games: data.map((d) => ({ ...d })),
      count,
      isNextPage: isNextPage(page, count ? count : 0),
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


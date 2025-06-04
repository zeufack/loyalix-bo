import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page = 1, limit = 20 } = req.query;

  const backendRes = await fetch(
    `${process.env.BACKEND_API}/customers?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`
      }
    }
  );

  const data = await backendRes.json();
  res.status(200).json(data);
}

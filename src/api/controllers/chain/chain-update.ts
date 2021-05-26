import { Request, Response } from 'express'

export async function chainUpdate (req: Request, res: Response) {
  console.log(req, res)
  res.sendStatus(200)
}

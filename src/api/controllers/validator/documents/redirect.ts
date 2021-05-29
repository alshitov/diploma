import { Request, Response } from 'express'

export async function redirectDocument (req: Request, res: Response) {
  res.sendStatus(200)
}

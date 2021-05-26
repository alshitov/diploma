import { Request, Response } from 'express'

export async function chainGet (req: Request, res: Response) {
  console.log(req, res)
  res.sendStatus(200)
}

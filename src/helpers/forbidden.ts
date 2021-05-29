import { Request, Response } from 'express'

export function forbidden (_req: Request, res: Response) {
  res.sendStatus(403)
  return
}

import { Request, Response, NextFunction } from 'express'


export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next()
  } else {
  res.redirect('/login.html')
  }
}

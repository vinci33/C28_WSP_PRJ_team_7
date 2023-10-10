import { Request, Response, NextFunction } from 'express'
import { Users } from './model';

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session?.['users']) {
    next()
  } else {
    res.redirect('/login.html')
  }
}
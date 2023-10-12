import { Request, Response, NextFunction } from 'express'


export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  console.log(req.session.userId)
  if (req.session.userId) {
    console.log("user is logged in");
    next();
    return
  } else {
    res.redirect('/login.html');
    console.log("user is not logged in");
    return
  }
}

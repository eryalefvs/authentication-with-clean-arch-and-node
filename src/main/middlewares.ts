import { json, Request, Response, NextFunction } from "express"

export const bodyParser = json()

export const contentType = (req: Request, res: Response, next: NextFunction): void => {
    res.type("json")
    next()
}

export const cors = (req: Request, res: Response, next: NextFunction): void => {
    res.set("access-control-allow-origin", "*")
    res.set("access-control-allow-headers", "*")
    res.set("access-control-allow-methods", "*")
    next()
}

export const noCache = (req: Request, res: Response, next: NextFunction): void => {
    res.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.set('pragma', 'no-cache')
    res.set('expires', '0')
    res.set('surrogate-control', 'no-store')
    next()
}
import cookieParser from 'cookie-parser'
import applyExpressMiddleware from '../utils/apply-express-middleware'
import _debug from 'debug'

export default function (compiler, opts) {
  debug('Enable Express Cookie-Parser')

  const middleware = cookieParser()
  return async function koaExpressCookieParserMiddleware (ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, ctx.res)

    if (hasNext && next) {
      await next()
    }
  }
}

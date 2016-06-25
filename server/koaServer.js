import Koa from 'koa'
import convert from 'koa-convert'
import jwt from 'koa-jwt'
import proxy from 'koa-proxy'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import cors from 'kcors'
import historyApiFallback from 'koa-connect-history-api-fallback'

import mongoose from 'mongoose'

import webpack from 'webpack'
import webpackConfig from '../build/webpack.config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'

import _debug from 'debug'
import config from '../config'
import _log from 'logfilename'
import httpRequestHandler from './middleware/http-request-handler'
import { publicApi, privateApi } from './controller'

const debug = _debug('app:server')
const log = _log(__filename, config.log)
const paths = config.utils_paths
const app = new Koa()

// init mongoose to mongodb
debug("Init mongoose...")
mongoose.connect(config.mongo_uri)

// init koa server
debug("Init server middleware...")
// log api request
app.use(async(ctx, next) => {
  const start = new Date;
  log.info(`${ctx.method} ${ctx.url} begins`)
  await next();
  const ms = new Date - start;
  log.info(`${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`)
})

// koa-proxy
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)))
}

// koa-bodyparser
app.use(bodyParser())

// Rewrites all routes requests to the root /index.html file
// Remove this, if you want to implement isomorphic rendering
app.use(convert(historyApiFallback({
  verbose: false
})))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  app.use(serve(paths.client('static')))
  debug('Server is running on development mode.')
} else {
  debug('Server is running on production mode.')
  app.use(serve(paths.dist()))
}

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(httpRequestHandler())

// CORS
app.use(convert(cors({
  origin: (ctx) => {
    const originWhiteList = config.cors.origin
    const origin = ctx.request.header.origin
    if(typeof origin != 'undefined' && originWhiteList.indexOf(origin) != -1){
      return origin
    }
  },
  credentials: config.cors.credentials,
  allowMethods: config.cors.allowMethods
})))

// public api
app.use(publicApi.routes())

// jwt validation
app.use(convert(jwt({ secret: config.jwt.secret, key: 'jwtdata' })))

// private api
app.use(privateApi.routes())

export default app

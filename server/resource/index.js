import Router from 'koa-router'
import testApi from './test'
import AuthResource from './AuthResource'

export const publicApi = new Router({
  prefix: '/api'
})

publicApi.use('/auth', AuthResource.routes())
publicApi.use('/test', testApi.routes())

export const privateApi = new Router({
  prefix: '/api'
})

//privateApi.use('/private', testApi.routes())

import Router from 'koa-router'
import testApi from './test'
import authApi from './auth'

export const publicApi = new Router({
  prefix: '/api'
})

publicApi.use('/auth', authApi.routes())
publicApi.use('/test', testApi.routes())

export const privateApi = new Router({
  prefix: '/api'
})

//privateApi.use('/private', testApi.routes())

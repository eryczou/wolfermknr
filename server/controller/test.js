import Router from 'koa-router'
import User from '../data/models/User'


const test = new Router()

test.get('/random-increment', (ctx, next) => (
  ctx.body = {
    increment: Math.floor((Math.random() * 25) + 1)
  })
)

test.get('/users', async (ctx, next) => {
  await new User().fetchAll()
    .then((users) => {
      ctx.status = 200
      ctx.body = {
        payload: users.toJSON()
      }
    })
    .catch(function(error) {
      console.log(error)
    })
})


export default test

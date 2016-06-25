
const httpRequestHandler = () => async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = { message: 'Please Log In to access content' }
    } else {
      throw err
    }
  }
}

export default httpRequestHandler

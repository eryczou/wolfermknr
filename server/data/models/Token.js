import bookshelf from '../bookshelf'

const Token = bookshelf.Model.extend({
  tableName: 'token'
})

export default bookshelf.model('Token', Token)

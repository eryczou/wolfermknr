import bookshelf from '../bookshelf'

const User = bookshelf.Model.extend({
  tableName: 'user',
  idAttribute: 'user_id'
})

export default bookshelf.model('User', User)

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { TextField, FlatButton } from 'material-ui'
import { actions as postActions } from '../../modules/post'
import PostList from '../../components/PostList'
import classes from './PostCreator.scss'

class PostCreator extends React.Component {

  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    statusText: PropTypes.string.isRequired,
    postData: PropTypes.array.isRequired,
    createPost: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.inputHandler = this.inputHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  inputHandler(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  submitHandler(e) {
    e.preventDefault()
    e.stopPropagation()

    const title = $('#postCreator-title').val()
    const body = $('#postCreator-body').val()
    const coverUrl = $('#postCreator-coverUrl').val()
    const musicIds = $('#postCreator-musicIds').val()
    const tag = $('#postCreator-tag').val()

    this.props.createPost(title, body, coverUrl, musicIds, tag)
  }

  render() {

    let { statusText, isFetching } = this.props

    return (
      <div className={classes.postCreator}>
        <div className={classes.postForm}>
          <h2 className={classes.postFormTitle}>Create a Post</h2>
          <p>{statusText}</p>
          <TextField id='postCreator-title'
                     name='postTitle'
                     type='text'
                     hintText='Title'
                     autoComplete='off'
                     onClick={this.inputHandler}
          />
          <TextField id='postCreator-body'
                     name='postBody'
                     type='text'
                     hintText='Body'
                     multiLine={true}
                     autoComplete='off'
                     onClick={this.inputHandler}
          />
          <TextField id='postCreator-coverUrl'
                     name='postCoverUrl'
                     type='text'
                     hintText='CoverUrl'
                     autoComplete='off'
                     onClick={this.inputHandler}
          />
          <TextField id='postCreator-musicIds'
                     name='musicIds'
                     type='text'
                     hintText='MusicIds'
                     autoComplete='off'
                     onClick={this.inputHandler}
          />
          <TextField id='postCreator-tag'
                     name='tag'
                     type='text'
                     hintText='Tag'
                     autoComplete='off'
                     onClick={this.inputHandler}
          />
          <FlatButton
            label='Submit'
            disable={isFetching}
            onClick={this.submitHandler}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.post.isFetching,
    statusText: state.post.statusText,
    postData: state.post.postData
  }
}

export default connect(mapStateToProps, postActions)(PostCreator)

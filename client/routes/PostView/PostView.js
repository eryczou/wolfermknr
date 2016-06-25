import React from 'react'
import PostCreator from './containers/PostCreator'

class PostView extends React.Component {
  render() {
    return (
      <div>
        <PostCreator />
        {/*
        {docData.map(
          (data, index) =>
            <PostList key={index} title={data.title} items={data.items} />
        )}
        */}
      </div>
    )
  }
}

export default PostView

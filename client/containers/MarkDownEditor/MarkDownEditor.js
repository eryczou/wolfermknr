import React from 'react'
import SimpleMDE from 'simplemde'
import { connect } from 'react-redux'
import { actions as MDEActions } from '../../redux/modules/mde'
import classes from './MarkDownEditor.scss'

class MarkDownEditor extends React.Component {

  componentDidMount() {
    const { updateContent } = this.props
    const simplemde = new SimpleMDE({
      element: $('#wfx-mde-textarea')[0],
      autofucs: false,
      autosave: {
        enabled: true,
        delay: 10000,
        uniqueId: 'myUniqueMDEditor'
      },
      insertTexts: {
        horizontalRule: ["", '\n\n-----\n\n'],
        image: ['![](http://', ')'],
        link: ['[', '](http://)'],
        table: ["", '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'],
      },
      renderingConfig: {
        singleLineBreaks: true
      },
      hideIcons: ['side-by-side', 'fullscreen'],
      placeholder: 'Typing here...',
      showIcons: ['code', 'table', 'horizontal-rule'],
      status: ['autosave', 'lines', 'words'],
      tabSize: 2
    })

    simplemde.codemirror.on('change', function(){
      updateContent(simplemde.value())
    })

    updateContent(simplemde.value())
  }

  componentWillUnmount() {
    const { clearContent } = this.props
    clearContent()
  }

  render() {
    return (
      <div id='wfx-simple-mde'>
        <textarea id='wfx-mde-textarea'></textarea>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, MDEActions)(MarkDownEditor)

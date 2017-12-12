import React, { Component } from 'react'
import Navigator from 'utils/router'

export default class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount () {
    this.props.getProjectInfo()
  }

  render() {
    const { projectInfo } = this.props

    return (
      <div onClick={() => {
        Navigator.push('/list')
      }}>{projectInfo}</div>
    )
  }
}

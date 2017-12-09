import React, { Component } from 'react'

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
      <div>{projectInfo}</div>
    )
  }
}

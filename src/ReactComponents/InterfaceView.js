import React, { Component } from 'react'

export default class InterfaceView extends Component {
	constructor(props) {
		super(props)
		this.workspace = this.props.workspace

		this.timeTextComponent = React.createRef()
		this.drawCallsLabelComponent = React.createRef()
		this.fpsLabelComponent = React.createRef()

		this.selectionViewComponent = React.createRef()
		this.windowContainerComponent = React.createRef()

		this.buttonsMenuComponent = React.createRef()
		this.LoaderComponent = React.createRef()
	}

	render() {
		return <div />
	}
}

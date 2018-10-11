import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import workspace from 'Workspace'
import InterfaceView from './ReactComponents/InterfaceView.js'
import UI from 'UI'

/// --- workspace --- ///
export const game = workspace

export default class App extends Component {
	constructor(props) {
		super(props)

		this.UI = React.createRef()
		this.canvasElement = React.createRef()

		this.setFocusCanvas = this.setFocusCanvas.bind(this)
		this.onBlurCanvas = this.onBlurCanvas.bind(this)

		this.state = {
			canvas: {
				width: window.innerWidth * game.config.canvasMultiplier,
				height: window.innerHeight * game.config.canvasMultiplier,
				active: true,
			},
		}
	}

	componentDidMount() {
		workspace.init({ appComponent: this, UI: this.UI })
	}

	setFocusCanvas() {
		this.canvasElement.current.focus()
		if (this.state.canvas.active) return
		this.state.canvas.active = true
		this.setState({})
	}

	onBlurCanvas() {
		this.state.canvas.active = false
		this.setState({})
	}

	render() {
		return (
			<AppContainer>
				<canvas
					ref={this.canvasElement}
					id="canvas"
					width={this.state.canvas.width}
					height={this.state.canvas.height}
					onBlur={this.onBlurCanvas}
					onFocus={this.setFocusCanvas}
				>
					CANVAS element not supported!
				</canvas>
				<InactiveCanvasOverlay
					active={this.state.canvas.active}
					onClick={this.setFocusCanvas}
				/>
				<UI ref={this.UI} workspace={workspace} />
			</AppContainer>
		)
	}
}

const AppContainer = styled.div`
	height: 100%;
	width: 100%;

	> canvas {
		position: fixed;
		outline: none;
	}
`
const InactiveCanvasOverlay = styled.div`
	height: 100%;
	width: 100%;
	position: fixed;
	border: 5px solid rgba(255, 0, 0, 0.5);
	${props =>
		props.active
			? css`
					display: none;
			  `
			: css`
					display: block;
			  `};
`

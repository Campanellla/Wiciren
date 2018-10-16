import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import workspace from 'src/Workspace'
import UI from 'src/UI'

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
		let canvas = this.state.canvas
		if (canvas.active) return
		canvas.active = true
		this.setState({ canvas })
	}

	onBlurCanvas() {
		let canvas = this.state.canvas
		canvas.active = false
		this.setState({ canvas })
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

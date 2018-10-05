import React, { Component } from 'react'
import styled from 'styled-components'

import workspace from 'workspace.js'
import InterfaceView from './ReactComponents/InterfaceView.js'

/// --- workspace --- ///
export const game = workspace

class App extends Component {
	componentDidMount() {
		workspace.init()
	}

	render() {
		return (
			<AppContainer>
				<canvas
					id="canvas"
					width={window.innerWidth * game.config.canvasMultiplier}
					height={window.innerHeight * game.config.canvasMultiplier}
				>
					CANVAS element not supported!
				</canvas>

				<InterfaceView ref={game.interfaceComponent} workspace={game} />
			</AppContainer>
		)
	}
}

export default App

const AppContainer = styled.div`
	height: 100%;
	width: 100%;

	> canvas {
		position: fixed;
		outline: none;
	}
`

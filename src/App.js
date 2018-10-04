import React, { Component } from 'react'
import './App.css'

import init from './init.js'

import { GameWorkspace } from './workspace.js'
import InterfaceView from './ReactComponents/InterfaceView.js'

/// --- workspace --- ///
export const game = new GameWorkspace()

class App extends Component {
	componentDidMount() {
		init()
	}

	render() {
		return (
			<div className="App">
				<canvas
					id="canvas"
					width={window.innerWidth * game.config.canvasMultiplier}
					height={window.innerHeight * game.config.canvasMultiplier}
				>
					CANVAS element not supported!
				</canvas>

				<InterfaceView ref={game.interfaceComponent} workspace={game} />
			</div>
		)
	}
}

export default App

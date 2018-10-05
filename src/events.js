//import { game } from './App.js'

import { setCanvasSize } from './utils.js'

export function assignEvents(game) {
	game.canvas.oncontextmenu = onContextMenu

	function onContextMenu(e) {
		e.preventDefault()
	}

	/// resize canvas and engine onResize
	function onResize() {
		var ratio = game.config.canvasMultiplier //window.devicePixelRatio;

		var size = { x: window.innerWidth * ratio, y: window.innerHeight * ratio }
		setCanvasSize(game.canvas, size.x, size.y)
		game.engine.resize()
		setCanvasSize(game.canvas, size.x, size.y, true, ratio)
	}

	window.addEventListener('resize', onResize)

	// --- keypress --- //

	document.onkeydown = function(a) {
		if (a.key === 'Escape') {
			if (game.itemMenuDrawn) {
				game.hideMenu()
			} else {
				//game.configmenu.onclick()
			}
		} else if (a.key === 'r') {
			game.itemConstructor.rotationIndex =
				(game.itemConstructor.rotationIndex + 1) % 4
			game.selection.setRotation(game.itemConstructor.rotationIndex)

			///if (game.itemConstructor.activeItem) game.itemConstructor.helperMeshes = game.itemConstructor.activeItem.makeArrows();
		} else if (a.key === 'q') {
			game.itemConstructor.setInactiveConstructor()
		}
	}

	document.onkeyup = function(a) {}
}

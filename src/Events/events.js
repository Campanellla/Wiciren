import { setCanvasSize } from 'src/Utils'

export default function assignEvents(game) {
	game.canvas.oncontextmenu = e => e.preventDefault()

	/// resize canvas and engine onResize
	function onResize() {
		var ratio = game.config.canvasMultiplier
		var size = { x: window.innerWidth * ratio, y: window.innerHeight * ratio }
		setCanvasSize(game.canvas, size.x, size.y)
		game.engine.resize()
		setCanvasSize(game.canvas, size.x, size.y, true, ratio)
	}

	window.addEventListener('resize', onResize)

	// --- keypress --- //
	document.onkeydown = function(a) {
		if (a.key === 'Escape') {
			if (false) {
				// show menu
			} else {
				// hide menu
			}
		} else if (a.key === 'r') {
			game.itemConstructor.rotationIndex =
				(game.itemConstructor.rotationIndex + 1) % 4
			game.selection.setRotation(game.itemConstructor.rotationIndex)
		} else if (a.key === 'q') {
			game.itemConstructor.setInactiveConstructor()
		}
	}
	document.onkeyup = function(a) {}
}

import blockSelection from './blockSelection'
import setCanvasSize from './setCanvasSize'
import showAxis from './showAxis'

export { blockSelection, setCanvasSize, showAxis }

export const TAU = Math.PI / 2
export const PI2 = Math.PI * 2
export const nullpointer = { link: null }

export function ErrorOneTime() {
	var time = 500
	var timeout = false

	return function(text, timer) {
		if (!timeout) {
			console.log('%c' + text, 'color:red')
			timeout = true
			setTimeout(() => {
				timeout = false
			}, timer || time)
		}
	}
}

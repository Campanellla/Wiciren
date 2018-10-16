export default function setCanvasSize(canvas, w, h, r, m) {
	if (r) {
		if (m) {
			var pixelRatio = m
		} else {
			pixelRatio = window.devicePixelRatio
		}

		canvas.style.width = w / pixelRatio + 'px'
		canvas.style.height = h / pixelRatio + 'px'
	} else {
		canvas.style.width = w + 'px'
		canvas.style.height = h + 'px'
	}
}

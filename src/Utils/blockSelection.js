/// true to block selection of text(used while moving the windows)

export default function blockSelection(bool) {
	if (bool) {
		document.onselectstart = () => true
	} else {
		document.onselectstart = undefined
	}
}

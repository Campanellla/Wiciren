import game from 'src/Workspace'

export function onMouseMoveEvent(evt) {
	var pickResult = picker(this)

	if (pickResult && pickResult.hit) {
		if (
			pickResult.pickedMesh.type === 'ground' ||
			pickResult.pickedMesh.type === 'water' ||
			pickResult.pickedMesh.isObject
		) {
			let position = { x: 0, y: 0.01, z: 0 }

			position.x = Math.floor(pickResult.pickedPoint.x)
			position.z = Math.floor(pickResult.pickedPoint.z)

			game.selection.setPosition(position)

			if (game.itemConstructor.activeConstructor)
				game.itemConstructor.checkConstructor(position.x, position.z)
			if (game.itemConstructor.continuousConstruction)
				game.itemConstructor.constructActiveObject()
		}

		return
	}

	game.selection.setInvisible()
	if (game.itemConstructor.activeConstructor)
		game.itemConstructor.checkConstructor(-1, -1)
}

export function onMouseClickEvent(evt) {
	var button

	switch (evt.button) {
		case 0:
			button = 'left'
			break
		case 2:
			button = 'right'
			break
		default: //do nothing //
	}

	var pickResult = picker(this)

	if (pickResult && pickResult.hit) {
		if (
			pickResult.pickedMesh.type === 'ground' ||
			pickResult.pickedMesh.isObject
		) {
			let position = { x: 0, y: 0.01, z: 0 }

			position.x = Math.floor(pickResult.pickedPoint.x)
			position.z = Math.floor(pickResult.pickedPoint.z)

			let x = position.x
			let z = position.z

			let itemFromPick = undefined

			if (pickResult.pickedMesh.item)
				itemFromPick = pickResult.pickedMesh.item.link
			if (itemFromPick) {
				//console.log("I picked item:", itemFromPick);
			}

			let itemFromPosition = game.map.getItemFromCoord(x, z)

			if (itemFromPosition) {
				//console.log("I found item:", itemFromPosition);
			} else {
				game.itemConstructor.constructActiveObject()
				game.itemConstructor.continuousConstruction = true
			}

			if (game.actionSelected === 'remove' || button === 'right') {
				game.itemConstructor.deleteObject([x, z])
				//game.hideMenu();
			}
		}
	}
}

export function onMouseClickReleaseEvent(evt) {
	game.itemConstructor.continuousConstruction = false
}

export function onDoubleClick(evt) {
	var pickResult = picker(this)

	if (pickResult && pickResult.hit) {
		let pickedMesh = pickResult.pickedMesh
		if (pickedMesh.type === 'ground' || pickedMesh.isObject) {
			let foundItem = false

			if (pickedMesh.isObject && pickedMesh.item && pickedMesh.item.link) {
				foundItem = true
				if (game.UI.windowManager)
					game.UI.windowManager.drawItemMenu(pickResult.pickedMesh.item.link)
			}

			if (!foundItem) {
				let x = Math.floor(pickResult.pickedPoint.x)
				let z = Math.floor(pickResult.pickedPoint.z)

				let itemFromPosition = game.map.getItemFromCoord(x, z)

				if (itemFromPosition) {
					foundItem = true
					if (game.UI.windowManager)
						game.UI.windowManager.drawItemMenu(itemFromPosition)
				}
			}
		}
	}
}

function Picker() {
	var time = (1000 / 60) >>> 0

	var timeout = false
	var result = null

	// eslint-disable-next-line
	var counter1 = 0
	// eslint-disable-next-line
	var counter2 = 0

	return function(_this) {
		counter1++
		if (!timeout) {
			counter2++
			timeout = true
			result = _this.pick(
				_this.pointerX * game.config.canvasMultiplier,
				_this.pointerY * game.config.canvasMultiplier,
			)
			setTimeout(() => {
				timeout = false
			}, time)
		}
		return result
	}
}

var picker = Picker()

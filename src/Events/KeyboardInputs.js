import * as BABYLON from 'babylonjs'
import { onMouseMoveEvent } from './MouseEvents.js'
import game from 'src/Workspace'

export class FreeTopCameraKeyboardMoveInput {
	constructor() {
		this._keys = []
		this.keysLeft = [37, 65]
		this.keysRight = [39, 68]
		this.keysUp = [38, 87]
		this.keysDown = [40, 83]

		this.sensibility = game.config.keyboardSensibility
		this.wheelSensibility = game.config.wheelSensubility

		this.wheel = 0
	}

	getTypeName() {
		return 'FreeTopCameraKeyboardMoveInput'
	}

	getSimpleName() {
		return 'keyboardTopMove'
	}

	_onLostFocus(e) {
		this._keys = []
	}

	attachControl(element, noPreventDefault) {
		var _this = this
		if (!this._onKeyDown) {
			element.tabIndex = 1
			this._onKeyDown = function(evt) {
				if (
					_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
					_this.keysRight.indexOf(evt.keyCode) !== -1 ||
					_this.keysDown.indexOf(evt.keyCode) !== -1 ||
					_this.keysUp.indexOf(evt.keyCode) !== -1
				) {
					var index = _this._keys.indexOf(evt.keyCode)
					if (index === -1) {
						_this._keys.push(evt.keyCode)
					}
					if (!noPreventDefault) {
						evt.preventDefault()
					}
				}
			}
			this._onKeyUp = function(evt) {
				if (
					_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
					_this.keysRight.indexOf(evt.keyCode) !== -1 ||
					_this.keysDown.indexOf(evt.keyCode) !== -1 ||
					_this.keysUp.indexOf(evt.keyCode) !== -1
				) {
					var index = _this._keys.indexOf(evt.keyCode)
					if (index >= 0) {
						_this._keys.splice(index, 1)
					}
					if (!noPreventDefault) {
						evt.preventDefault()
					}
				}
			}

			this._onWheel = function(evt) {
				_this.wheel = evt.wheelDelta
			}

			element.addEventListener('wheel', this._onWheel, false)
			element.addEventListener('keydown', this._onKeyDown, false)
			element.addEventListener('keyup', this._onKeyUp, false)

			BABYLON.Tools.RegisterTopRootEvents([
				{ name: 'blur', handler: this._onLostFocus },
			])
		}
	}

	detachControl(element) {
		if (this._onKeyDown) {
			element.removeEventListener('wheel', this._onWheel)
			element.removeEventListener('keydown', this._onKeyDown)
			element.removeEventListener('keyup', this._onKeyUp)

			BABYLON.Tools.UnregisterTopRootEvents([
				{ name: 'blur', handler: this._onLostFocus },
			])

			this._keys = []
			this._onKeyDown = null
			this._onKeyUp = null
		}
	}

	checkInputs() {
		let camera = this.camera

		if (this._onKeyDown) {
			// Keyboard
			for (var index = 0; index < this._keys.length; index++) {
				var keyCode = this._keys[index]
				if (this.keysLeft.indexOf(keyCode) !== -1) {
					camera.position.x -= this.sensibility
				} else if (this.keysRight.indexOf(keyCode) !== -1) {
					camera.position.x += this.sensibility
				} else if (this.keysUp.indexOf(keyCode) !== -1) {
					camera.position.z += this.sensibility
				} else if (this.keysDown.indexOf(keyCode) !== -1) {
					camera.position.z -= this.sensibility
				}

				onMouseMoveEvent.call(game.scene)
			}
		}

		if (this._onWheel) {
			if (this.wheel > 0.01 || this.wheel < -0.01) {
				var a = 3.14 / 2
				camera.position.y += this.wheel * this.wheelSensibility

				var wmin = 10
				var vmin = 10
				var vmax = 50

				if (camera.position.y < wmin) {
					camera.position.y = wmin
					a = 1.046
					camera.rotation.x = a
				} else if (camera.position.y > vmax) {
					a = 3.14 / 2
					camera.rotation.x = a
					//camera.position.y = 50;
				} else {
					a =
						3.14 / 3 + (((camera.position.y - vmin) / (vmax - vmin)) * 3.14) / 6
					camera.rotation.x = a
				}

				if (game.config.keyboardProgressiveSensibility) {
					this.sensibility =
						game.config.keyboardSensibility +
						camera.position.y *
							game.config.keyboardProgressiveSensibilityMultiplier
				}

				onMouseMoveEvent.call(game.scene)
			}
			this.wheel = 0
		}
	}
}

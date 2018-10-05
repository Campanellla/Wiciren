import { updateObjects } from '../updates.js'

export default class Intervals {
	constructor(game) {
		this.time = 0.0
		this.frameTime = 0
		this.game = game
		this.startTime = new Date().getTime()
		this.lastTime = this.startTime

		let mapUpdateTimer = 1000 / 60
		let itemsUpdatetime = 1000 / 60
		let interfaceUpdateTimer = 1000 / 24

		this.updateMap = setInterval(this.game.map.updateMap, mapUpdateTimer)
		this.updateItems = setInterval(updateObjects, itemsUpdatetime)
		this.updateInterface = setInterval(
			this.updateInterface.bind(this),
			interfaceUpdateTimer,
		)
	}

	updateInterface() {
		let currentTime = new Date().getTime()
		let DT = (currentTime - this.lastTime) / 1000
		this.lastTime = currentTime
		this.time += DT

		let timeText =
			this.time.toFixed(1) +
			' s,' +
			' x: ' +
			this.game.camera.position.x.toFixed(1) +
			' z: ' +
			this.game.camera.position.z.toFixed(1) +
			', frameTime: ' +
			this.frameTime.toFixed(3)

		this.frameTime =
			(this.game.scninst.frameTimeCounter.current + this.frameTime * 9) / 10

		let _int = this.game.interfaceComponent.current

		if (_int) {
			if (_int.timeTextComponent.current)
				_int.timeTextComponent.current.setState({ text: timeText })
			if (_int.drawCallsLabelComponent.current)
				_int.drawCallsLabelComponent.current.setState({
					text: this.game.scninst.drawCallsCounter.current + ' dc',
				})
			if (_int.fpsLabelComponent.current)
				_int.fpsLabelComponent.current.setState({
					text: this.game.engine.getFps().toFixed() + ' fps',
				})
			if (this.game.componentsNeedUpdate.length) {
				this.game.componentsNeedUpdate.forEach(c => c.update())
			}
		}
	}
}

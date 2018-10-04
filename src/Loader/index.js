import meshesLoader from './meshesLoader'
import resources from './resources'

export default class Loader {
	constructor(game) {
		this.game = game
		this.meshes = {
			loaded: 0,
			loading: 0,
			current: '',
		}
		this.onLoad = null
		this.state = {
			meshes: false,
		}

		console.log(game)

		this.component = {}
	}

	insertMesh() {
		this.meshes.loading++

		if (this.component.current) {
			this.component.current.setState({
				loading: this.meshes.loading,
				loaded: this.meshes.loaded,
				active: true,
			})
		}
	}

	loadedMesh(current) {
		this.meshes.loading
		this.meshes.loaded++
		this.meshes.current = current
		console.log(current)
		this.check()
	}

	check() {
		if (this.meshes.loading === this.meshes.loaded) {
			console.log('LOADED')
			if (this.onLoad) {
				if (this.component.current) {
					this.component.current.setState({
						active: false,
					})
				}

				this.onLoad()
			}
		}
		if (this.component.current) {
			this.component.current.setState({
				loading: this.meshes.loading,
				loaded: this.meshes.loaded,
				current: this.meshes.current,
			})
		} else if (this.game.interfaceComponent.current) {
			this.component = this.game.interfaceComponent.current.LoaderComponent
		}
	}

	loadMeshes(scene, list) {
		if (list) {
			meshesLoader(scene, list)
		}
		meshesLoader(scene, resources.meshes)
	}
}

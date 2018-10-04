import { game } from '../App.js'
import * as BABYLON from 'babylonjs'

function loadMesh({ scene, fileName, folder, item, asItem, lod }) {
	let items = []
	items.push(item)
	if (lod) {
		lod.forEach(currentLod => {
			if (currentLod.item) items.push(currentLod.item.slice(0))
		})
	}
	game.loader.insertMesh()

	BABYLON.SceneLoader.ImportMeshAsync(items, folder, fileName, scene)
		.then(({ meshes }) => {
			let mainMesh = meshes.find(mesh => mesh.id === item)
			asItem = asItem || item
			mainMesh.setEnabled(false)

			game.meshes[asItem] = mainMesh

			if (lod && meshes.length > 0) {
				lod.forEach(currentLod => {
					if (currentLod.item) {
						let currentMesh = meshes.find(mesh => mesh.id === currentLod.item)
						let asItem = currentLod.asItem || currentLod.item

						currentMesh.type = mainMesh.type
						currentMesh.isObject = mainMesh.isObject
						currentMesh.position = mainMesh.position
						currentMesh.material = mainMesh.material
						currentMesh.rotation = mainMesh.rotation
						currentMesh.setEnabled(false)

						game.meshes[asItem] = currentMesh

						mainMesh.addLODLevel(currentLod.depth, currentMesh)
					} else {
						mainMesh.addLODLevel(currentLod.depth, null)
					}
				})
			}

			game.loader.loadedMesh(item)
		})
		.catch(e => {
			console.log('unable to load meshes', arguments, e)
		})
}

export default function meshesLoader(scene, list) {
	list.forEach(item =>
		loadMesh({
			scene,
			fileName: item.fileName,
			folder: item.folder,
			item: item.item,
			lod: item.lod,
		}),
	)
}

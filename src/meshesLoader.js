import {game} from './App.js';
import * as BABYLON from 'babylonjs';


export function loadMeshes(scene){
	
	
	BABYLON.SceneLoader.ImportMesh(["pipe", "pipeM", "pipeS"], "./", "pipe.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		
		//console.log(meshes)
		
		game.meshes.pipe = meshes[2];
		game.meshes.pipeM = meshes[1];
		game.meshes.pipeS = meshes[0];
		
		game.meshes.pipeM.type = game.meshes.pipe.type;
		game.meshes.pipeM.isObject = game.meshes.pipe.isObject;
		game.meshes.pipeM.position = game.meshes.pipe.position;
		game.meshes.pipeM.material = game.meshes.pipe.material;
		game.meshes.pipeM.rotation = game.meshes.pipe.rotation;
		
		game.meshes.pipeS.type = game.meshes.pipe.type;
		game.meshes.pipeS.isObject = game.meshes.pipe.isObject;
		game.meshes.pipeS.position = game.meshes.pipe.position;
		game.meshes.pipeS.material = game.meshes.pipe.material;
		game.meshes.pipeS.rotation = game.meshes.pipe.rotation;
		
		game.meshes.pipe.addLODLevel(250, null);
		game.meshes.pipe.addLODLevel(15, game.meshes.pipeM);
		game.meshes.pipe.addLODLevel(50, game.meshes.pipeS);
		
		game.meshes.pipeM.setEnabled(false);
		game.meshes.pipeS.setEnabled(false);
		game.meshes.pipe.setEnabled(false);
		
	});
	
	BABYLON.SceneLoader.ImportMesh(["pipe4", "pipe4M", "pipe4S"], "./", "pipe.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		
		//console.log(meshes)
		
		game.meshes.pipe4 = meshes[2];
		game.meshes.pipe4M = meshes[1];
		game.meshes.pipe4S = meshes[0];
		
		game.meshes.pipe4M.type = game.meshes.pipe4.type;
		game.meshes.pipe4M.isObject = game.meshes.pipe4.isObject;
		game.meshes.pipe4M.position = game.meshes.pipe4.position;
		game.meshes.pipe4M.material = game.meshes.pipe4.material;
		game.meshes.pipe4M.rotation = game.meshes.pipe4.rotation;
		
		game.meshes.pipe4.type = game.meshes.pipe4.type;
		game.meshes.pipe4S.isObject = game.meshes.pipe4.isObject;
		game.meshes.pipe4S.position = game.meshes.pipe4.position;
		game.meshes.pipe4S.material = game.meshes.pipe4.material;
		game.meshes.pipe4S.rotation = game.meshes.pipe4.rotation;
		
		game.meshes.pipe4.addLODLevel(250, null);
		game.meshes.pipe4.addLODLevel(15, game.meshes.pipe4M);
		game.meshes.pipe4.addLODLevel(50, game.meshes.pipe4S);
		
		game.meshes.pipe4M.setEnabled(false);
		game.meshes.pipe4S.setEnabled(false);
		game.meshes.pipe4.setEnabled(false);
		
	});
	
	BABYLON.SceneLoader.ImportMesh(["pipe3", "pipe3M", "pipe3S"], "./", "pipe.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		
		//console.log(meshes)
		
		game.meshes.pipe3 = meshes[2];
		game.meshes.pipe3M = meshes[1];
		game.meshes.pipe3S = meshes[0];
		
		game.meshes.pipe3M.type = game.meshes.pipe3.type;
		game.meshes.pipe3M.isObject = game.meshes.pipe3.isObject;
		game.meshes.pipe3M.position = game.meshes.pipe3.position;
		game.meshes.pipe3M.material = game.meshes.pipe3.material;
		game.meshes.pipe3M.rotation = game.meshes.pipe3.rotation;
		
		game.meshes.pipe3S.type = game.meshes.pipe3.type;
		game.meshes.pipe3S.isObject = game.meshes.pipe3.isObject;
		game.meshes.pipe3S.position = game.meshes.pipe3.position;
		game.meshes.pipe3S.material = game.meshes.pipe3.material;4
		game.meshes.pipe3S.rotation = game.meshes.pipe3.rotation;
		
		game.meshes.pipe3.addLODLevel(250, null);
		game.meshes.pipe3.addLODLevel(15, game.meshes.pipe3M);
		game.meshes.pipe3.addLODLevel(50, game.meshes.pipe3S);
		
		game.meshes.pipe3M.setEnabled(false);
		game.meshes.pipe3S.setEnabled(false);
		game.meshes.pipe3.setEnabled(false);
		
	});
	
	BABYLON.SceneLoader.ImportMesh(["pipeA", "pipeAM", "pipeAS"], "./", "pipe.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		
		//console.log(meshes)
		
		game.meshes.pipeA = meshes[1];
		game.meshes.pipeAM = meshes[0];
		game.meshes.pipeAS = meshes[2];
		
		game.meshes.pipeAM.type = game.meshes.pipeA.type;
		game.meshes.pipeAM.isObject = game.meshes.pipeA.isObject;
		game.meshes.pipeAM.position = game.meshes.pipeA.position;
		game.meshes.pipeAM.material = game.meshes.pipeA.material;
		game.meshes.pipeAM.rotation = game.meshes.pipeA.rotation;
		
		game.meshes.pipeAS.type = game.meshes.pipeA.type;
		game.meshes.pipeAS.isObject = game.meshes.pipeA.isObject;
		game.meshes.pipeAS.position = game.meshes.pipeA.position;
		game.meshes.pipeAS.material = game.meshes.pipeA.material;
		game.meshes.pipeAS.rotation = game.meshes.pipeA.rotation;
		
		game.meshes.pipeA.addLODLevel(250, null);
		game.meshes.pipeA.addLODLevel(15, game.meshes.pipeAM);
		game.meshes.pipeA.addLODLevel(50, game.meshes.pipeAS);
		
		game.meshes.pipeAM.setEnabled(false);
		game.meshes.pipeAS.setEnabled(false);
		game.meshes.pipeA.setEnabled(false);
		
	});
	
	
	BABYLON.SceneLoader.ImportMesh("pump", "./", "pump.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		game.meshes.pump = meshes[0];
		game.meshes.pump.setEnabled(false);
	});
	BABYLON.SceneLoader.ImportMesh("tank", "./", "tank.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		game.meshes.tank = meshes[0];
		game.meshes.tank.setEnabled(false);
	});
	BABYLON.SceneLoader.ImportMesh("engine", "./", "engine.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		game.meshes.engine = meshes[0];
		game.meshes.engine.setEnabled(false);
	});
	BABYLON.SceneLoader.ImportMesh("device", "./", "device.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		game.meshes.device = meshes[0];
		game.meshes.device.setEnabled(false);
	}); 
	BABYLON.SceneLoader.ImportMesh("arrow", "./", "arrow.babylon", scene, function (newMeshes, particleSystems) {
		var meshes = newMeshes;
		game.meshes.arrow = meshes[0];
		game.meshes.arrow.setEnabled(false);
	}); 
	
}
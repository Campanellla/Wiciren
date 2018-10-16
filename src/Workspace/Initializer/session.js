import game from 'src/Workspace'
import { GameMap } from 'src/Map.js'

export default function sessionInit() {
	/// --- create and draw ground --- ///
	game.map = new GameMap(100, 10, game.scene)

	/// --- and make small lake --- ///
	game.map.blocks[0].tiles[1][1].surface = 'water'
	game.map.blocks[0].tiles[1][1].height = -0.1
	game.map.blocks[0].tiles[2][1].surface = 'water'
	game.map.blocks[0].tiles[2][1].height = -0.1
	game.map.blocks[0].tiles[1][2].surface = 'water'
	game.map.blocks[0].tiles[1][2].height = -0.1
	game.map.blocks[0].tiles[2][2].surface = 'water'
	game.map.blocks[0].tiles[2][2].height = -0.1

	game.map.blocks[0].updateBlock()
}

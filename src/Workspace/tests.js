export function makeTests() {
	var passed = 0
	var failed = 0

	const test = fn => {
		let testResult = fn.call(this)
		if (testResult.OK) {
			passed++
			console.log(`%c${testResult.name} passed`, 'color: green')
		} else {
			failed++
			console.log(`%c${testResult.name} failed`, 'color: red')
		}
	}

	console.group('tests')
	test(itCreatedBox)
	test(itCreatedDevice)

	console.log(
		`tests finished\n%cpassed: ${passed} %cfailed: ${failed}`,
		'color:green',
		failed ? 'color: red' : 'color: green',
	)
	console.groupEnd('tests')

	return { passed, failed }
}

function itCreatedBox() {
	this.itemConstructor.setActiveConstructor('box')
	this.selection.position.x = 4
	this.selection.position.z = 4
	this.itemConstructor.constructActiveObject()
	this.itemConstructor.setInactiveConstructor()
	let item = this.map.getItemFromCoord(4, 4)
	return { name: 'create box', OK: item && item.type === 'box' }
}

function itCreatedDevice() {
	this.itemConstructor.setActiveConstructor('device')
	this.selection.position.x = 10
	this.selection.position.z = 10
	this.itemConstructor.constructActiveObject()
	this.itemConstructor.setInactiveConstructor()

	let item1 = this.map.getItemFromCoord(10, 10)
	let item2 = this.map.getItemFromCoord(10, 11)
	let item3 = this.map.getItemFromCoord(11, 10)
	let item4 = this.map.getItemFromCoord(11, 11)

	let OK =
		item1 &&
		item1.type === 'device' &&
		item2 &&
		item2.type === 'device' &&
		item3 &&
		item3.type === 'device' &&
		item4 &&
		item4.type === 'device'
	return { name: 'create device', OK }
}

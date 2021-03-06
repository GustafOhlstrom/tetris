const boardWidth = 10
const boardHeight = 20

const levels = [
	0.01667, 
	0.021017, 
	0.026977, 
	0.035256, 
	0.04693, 
	0.06361,
	0.0879, 
	0.1236, 
	0.1775, 
	0.2598, 
	0.388,
	0.59, 
	0.92, 
	1.46, 
	2.36, 
	3.91, 
	6.61, 
	11.43, 
	20
]


const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
const tetrominos = {
	I: [
		[0, 0, 0, 0],
		['I', 'I', 'I', 'I'],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	J: [
		['J', 0, 0],
		['J', 'J', 'J'],
		[0, 0, 0],
	],
	L: [
		[0, 0, 'L'],
		['L', 'L', 'L'],
		[0, 0, 0],
	],
	O: [
		['O', 'O'],
		['O', 'O'],
	],
	S:[
		[0, 'S', 'S'],
		['S', 'S', 0],
		[0, 0, 0]
	],
	T: [
		[0, 'T', 0],
		['T', 'T', 'T'],
		[0, 0, 0],
	],
	Z: [
		['Z', 'Z', 0],
		[0, 'Z', 'Z'],
		[0, 0, 0]
	]
}

const wallKicksTests = [
	[[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, 2]],
	[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
	[[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
	[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
]

const wallKicksTestsI = [
	[[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
	[[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
	[[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
	[[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
]

const countDown = [
	[
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
	],
	[
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C',0,0,0,0,0,0],
		[0,0,'C','C',0,0,0,0,0,0],
		[0,0,'C','C',0,0,0,0,0,0],
		[0,0,'C','C',0,0,0,0,0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,'C','C','C','C','C','C',0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
	],
	[
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,'C','C',0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
	]
]

export { boardWidth, boardHeight, levels, types, tetrominos, wallKicksTests, wallKicksTestsI, countDown }
var audioPath = 'res/audio/';
var sounds = [
	//dig
	{
		id: 'digStone1',
		src: 'dig/stone1.ogg'
	},
	{
		id: 'digStone2',
		src: 'dig/stone2.ogg'
	},
	{
		id: 'digStone3',
		src: 'dig/stone3.ogg'
	},
	{
		id: 'digStone4',
		src: 'dig/stone4.ogg'
	},
	{
		id: 'digGrass1',
		src: 'dig/grass1.ogg'
	},
	{
		id: 'digGrass2',
		src: 'dig/grass2.ogg'
	},
	{
		id: 'digGrass3',
		src: 'dig/grass3.ogg'
	},
	{
		id: 'digGrass4',
		src: 'dig/grass4.ogg'
	},
	{
		id: 'digWood1',
		src: 'dig/wood1.ogg'
	},
	{
		id: 'digWood2',
		src: 'dig/wood2.ogg'
	},
	{
		id: 'digWood3',
		src: 'dig/wood3.ogg'
	},
	{
		id: 'digWood4',
		src: 'dig/wood4.ogg'
	},
	{
		id: 'digGravel1',
		src: 'dig/gravel1.ogg'
	},
	{
		id: 'digGravel2',
		src: 'dig/gravel2.ogg'
	},
	{
		id: 'digGravel3',
		src: 'dig/gravel3.ogg'
	},
	{
		id: 'digGravel4',
		src: 'dig/gravel4.ogg'
	},
	{
		id: 'digSand1',
		src: 'dig/sand1.ogg'
	},
	{
		id: 'digSand2',
		src: 'dig/sand2.ogg'
	},
	{
		id: 'digSand3',
		src: 'dig/sand3.ogg'
	},
	{
		id: 'digSand4',
		src: 'dig/sand4.ogg'
	},
	{
		id: 'digSnow1',
		src: 'dig/snow1.ogg'
	},
	{
		id: 'digSnow2',
		src: 'dig/snow2.ogg'
	},
	{
		id: 'digSnow3',
		src: 'dig/snow3.ogg'
	},
	{
		id: 'digSnow4',
		src: 'dig/snow4.ogg'
	},
	{
		id: 'digCloth1',
		src: 'dig/cloth1.ogg'
	},
	{
		id: 'digCloth2',
		src: 'dig/cloth2.ogg'
	},
	{
		id: 'digCloth3',
		src: 'dig/cloth3.ogg'
	},
	{
		id: 'digCloth4',
		src: 'dig/cloth4.ogg'
	},
	//step
	{
		id: 'stepStone1',
		src: 'step/stone1.ogg'
	},
	{
		id: 'stepStone2',
		src: 'step/stone2.ogg'
	},
	{
		id: 'stepStone3',
		src: 'step/stone3.ogg'
	},
	{
		id: 'stepStone4',
		src: 'step/stone4.ogg'
	},
	{
		id: 'stepGrass1',
		src: 'step/grass1.ogg'
	},
	{
		id: 'stepGrass2',
		src: 'step/grass2.ogg'
	},
	{
		id: 'stepGrass3',
		src: 'step/grass3.ogg'
	},
	{
		id: 'stepGrass4',
		src: 'step/grass4.ogg'
	},
	{
		id: 'stepWood1',
		src: 'step/wood1.ogg'
	},
	{
		id: 'stepWood2',
		src: 'step/wood2.ogg'
	},
	{
		id: 'stepWood3',
		src: 'step/wood3.ogg'
	},
	{
		id: 'stepWood4',
		src: 'step/wood4.ogg'
	},
	{
		id: 'stepGravel1',
		src: 'step/gravel1.ogg'
	},
	{
		id: 'stepGravel2',
		src: 'step/gravel2.ogg'
	},
	{
		id: 'stepGravel3',
		src: 'step/gravel3.ogg'
	},
	{
		id: 'stepGravel4',
		src: 'step/gravel4.ogg'
	},
	{
		id: 'stepSand1',
		src: 'step/sand1.ogg'
	},
	{
		id: 'stepSand2',
		src: 'step/sand2.ogg'
	},
	{
		id: 'stepSand3',
		src: 'step/sand3.ogg'
	},
	{
		id: 'stepSand4',
		src: 'step/sand4.ogg'
	},
	{
		id: 'stepSnow1',
		src: 'step/snow1.ogg'
	},
	{
		id: 'stepSnow2',
		src: 'step/snow2.ogg'
	},
	{
		id: 'stepSnow3',
		src: 'step/snow3.ogg'
	},
	{
		id: 'stepSnow4',
		src: 'step/snow4.ogg'
	},
	{
		id: 'stepCloth1',
		src: 'step/cloth1.ogg'
	},
	{
		id: 'stepCloth2',
		src: 'step/cloth2.ogg'
	},
	{
		id: 'stepCloth3',
		src: 'step/cloth3.ogg'
	},
	{
		id: 'stepCloth4',
		src: 'step/cloth4.ogg'
	}
]
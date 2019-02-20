const fs = require('fs');

const path = process.argv[2] || './';
const WIDTH = 1936/2;
const HEIGHT = 1216/2;
const pathOut = './original';

const checkQuadrants = ({x1, y1, x2, y2}) => {
	const quadrants = ['left', 'center', 'right']
	
	if(x2 <= WIDTH) return 'left'; // Pure left
	
	if(x1 <= WIDTH && y2 <= HEIGHT){
		let leftArea = (WIDTH-x1)*(y2-y1);
		let centerArea = (x2-WIDTH)*(y2-y1);
		return leftArea > centerArea ? 'left' : 'center';
	}

	if(x1 > WIDTH && y2 <= HEIGHT) return 'center'; // Pure center

	if(x1 > WIDTH && y1 <= HEIGHT && y2 > HEIGHT){
		let centerArea = (x2-x1)*(HEIGHT-y1);
		let rightArea = (x2-x1)*(y2-HEIGHT);
		return centerArea > rightArea ? 'center' : 'right';
	}

	
	if(y1 > HEIGHT) return 'right'; // Pure right

	let leftArea = (WIDTH-x1)*(HEIGHT-y1);
	let centerArea = (x2-WIDTH)*(HEIGHT-y1);
	let rightArea = (x2-WIDTH)*(y2-HEIGHT);

	const arr = [leftArea, centerArea, rightArea];
	return quadrants[arr.indexOf(Math.max(...arr))];
};

const scaleTransBox = (box, quadrant) => {
	const {x1, y1, x2, y2} = box;
	const scale = ({x1, y1, x2, y2}) => ({
		x1: x1*2,
		y1: y1*2,
		x2: x2*2,
		y2: y2*2,
	});

	switch(quadrant) {
		case 'left':
			return scale(box);
		case 'center':
			return scale({
				...box,
				x1: x1 - WIDTH,
				x2: x2 - WIDTH
			});
		case 'right':
			return scale({
				x1: x1 - WIDTH,
				x2: x2 - WIDTH,
				y1: y1 - HEIGHT,
				y2: y2 - HEIGHT
			})
		case 'other':
			return box;
	}
};

const generateOriginalAnnotations = file => {
	
	const vottfile = JSON.parse(fs.readFileSync(`${path}/${file}`));
	const frameList = Object.keys(vottfile.frames);

	const newFrames = frameList.reduce( (acc, frameNumber) => {
		const newFrame = vottfile.frames[frameNumber]
		.filter( box => checkQuadrants(box.box) !== 'other')
		.reduce( (acc, box) => {
			const quadrant = checkQuadrants(box.box);
			const originalBox = scaleTransBox(box.box, quadrant);
			box.box = originalBox;
			const newBox = {...box, ...originalBox };
			acc[quadrant] = [...acc[quadrant], newBox];
			return acc;
		}, {
			left: [],
			center: [],
			right: []
		});
		
		acc.left[frameNumber]   = newFrame.left;
		acc.center[frameNumber] = newFrame.center;
		acc.right[frameNumber]  = newFrame.right;

		return acc
	}, { 
		left: {},
		center: {},
		right: {}
	});

	const leftVott   = { ...vottfile, frames: newFrames.left };
	const centerVott = { ...vottfile, frames: newFrames.center };
	const rightVott  = { ...vottfile, frames: newFrames.right };

	const videoName = file.split('.concat.')[0];

	fs.writeFileSync(
		`${pathOut}/${videoName}_idx97.12fps.json`,
		JSON.stringify(leftVott, null, '\t')
	);

	fs.writeFileSync(
		`${pathOut}/${videoName}_idx00.12fps.json`,
		JSON.stringify(centerVott, null, '\t')
	);

	fs.writeFileSync(
		`${pathOut}/${videoName}_idx98.12fps.json`,
		JSON.stringify(rightVott, null, '\t')
	);
};

fs.readdir(path, (err, items) => {
	
	items.filter(i => i.slice(-5) === '.json')
	.map( file => {
		generateOriginalAnnotations(file);
	});
    console.log('MapBack done!');
});
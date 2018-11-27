const fs = require('fs');


const folderName = process.argv[2];
if (!folderName) {
    throw new Error('You have to specify the folder name as an argument');
}

const path = './Drive/VoTT/';
const ext = '.mkv.mp4.json';

const listFiles = fs.readdirSync(path+folderName)
					.filter( file => file.slice(-13) === ext);

const defaultLag = Array(listFiles.length - 1).fill(0);

const lagByFolder = {
	'out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx00': [1, 2, 4, 10, 12, 16, 21, 23, 27],
	'out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx97_24fps': [ -33, -17, -21, -13, -10, -1, 11, -126, -120, -112, -98, -86, -79, -73, -70],
	'out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx98_24fps': [ 2, 10, 6, 20, 38, 52, 65, 57, 65, 74, 85, 97, 113, 122, 133]
}

const lag = lagByFolder[folderName] || defaultLag;

console.log('listFiles', listFiles)
console.log('lag', lag);

const vottfile = JSON.parse(
	fs.readFileSync(`${path}${folderName}/${folderName}_1${ext}`)
);

let frameList = Object.keys(vottfile.frames).map(Number); 
let lastFrame =  frameList[frameList.length-1];


for (let i = 2; i <= listFiles.length; i++) {

	console.log(`lag ${i} ${i*3}min ${lag[i-2]}`);

	let jsonfile = JSON.parse(
		fs.readFileSync(`${path}${folderName}/${folderName}_${i}${ext}`)
	);

	frameList = Object.keys(jsonfile.frames).map(Number);
	
	frameList.forEach(frame => {
		vottfile.frames[frame + lastFrame - lag[i-2]] = jsonfile.frames[frame];
		vottfile.visitedFrames.push(frame + lastFrame - lag[i-2]);
	});

	lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	console.log('lastFrame', lastFrame);
}


fs.writeFileSync(
	// `./${folderName}.mkv.mp4.json`,
	`${path}/${folderName}/${folderName}.mkv.mp4.json`,
	JSON.stringify(vottfile, null, '\t')
);
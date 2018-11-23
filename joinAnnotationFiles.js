const fs = require('fs');

const path = './Drive/VoTT/';
const folderName = 'out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx00';
const ext = '.mkv.mp4.json';

const listFiles = fs.readdirSync(path+folderName)
					.filter( file => file.slice(-13) === ext);

console.log(listFiles)

const vottfile = JSON.parse(
	fs.readFileSync(`${path}${folderName}/${folderName}_1${ext}`)
);

let frameList = Object.keys(vottfile.frames).map(Number); 
let lastFrame =  frameList[frameList.length-1];

console.log('lastFrame', lastFrame);
const desfase = [1, 2, 4, 10, 12, 0, 0, 0, 0];

for (let i = 2; i <= listFiles.length; i++) {
	let jsonfile = JSON.parse(
		fs.readFileSync(`${path}${folderName}/${folderName}_${i}${ext}`)
	);

	frameList = Object.keys(jsonfile.frames).map(Number);
	console.log('desfase', i,' ' ,desfase[i-2])
	frameList.forEach(frame => {
		vottfile.frames[frame + lastFrame - desfase[i-2]] = jsonfile.frames[frame];
		vottfile.visitedFrames.push(frame + lastFrame - desfase[i-2]);
	});

	lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	console.log('lastFrame', lastFrame);
}
	// // // ==============================================
	// let jsonfile3 = JSON.parse(
	// 	fs.readFileSync(`${path}${folderName}/${folderName}_${3}${ext}`)
	// );

	// frameList = Object.keys(jsonfile3.frames).map(Number);

	// frameList.forEach(frame => {
	// 	vottfile.frames[frame + lastFrame - 2] = jsonfile3.frames[frame];
	// 	vottfile.visitedFrames.push(frame + lastFrame - 2);
	// });

	// lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	// console.log('lastFrame', lastFrame);

	// // // ==============================================
	// let jsonfile4 = JSON.parse(
	// 	fs.readFileSync(`${path}${folderName}/${folderName}_${4}${ext}`)
	// );

	// frameList = Object.keys(jsonfile4.frames).map(Number);

	// frameList.forEach(frame => {
	// 	vottfile.frames[frame + lastFrame - 4] = jsonfile4.frames[frame];
	// 	vottfile.visitedFrames.push(frame + lastFrame - 4);
	// });

	// lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	// console.log('lastFrame', lastFrame);

	// // // ==============================================

	// let jsonfile5 = JSON.parse(
	// 	fs.readFileSync(`${path}${folderName}/${folderName}_${5}${ext}`)
	// );

	// frameList = Object.keys(jsonfile5.frames).map(Number);

	// frameList.forEach(frame => {
	// 	vottfile.frames[frame + lastFrame - 10] = jsonfile5.frames[frame];
	// 	vottfile.visitedFrames.push(frame + lastFrame - 10);
	// });

	// lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	// console.log('lastFrame', lastFrame);

	// // ==============================================

	// let jsonfile6 = JSON.parse(
	// 	fs.readFileSync(`${path}${folderName}/${folderName}_${6}${ext}`)
	// );

	// frameList = Object.keys(jsonfile6.frames).map(Number);

	// frameList.forEach(frame => {
	// 	vottfile.frames[frame + lastFrame - 12] = jsonfile6.frames[frame];
	// 	vottfile.visitedFrames.push(frame + lastFrame - 12);
	// });

	// lastFrame = lastFrame + Number(frameList[frameList.length-1]);
	// console.log('lastFrame', lastFrame);
// }

fs.writeFileSync(
	`./${folderName}.mkv.mp4.json`, //`${path}/${folderName}/${folderName}.mkv.mp4.json`, 
	JSON.stringify(vottfile, null, '\t')
);
const fs = require('fs');

const file = './out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx00_2';
const ext = '.mkv.mp4.json';

const vottfile = JSON.parse(fs.readFileSync(`${file}${ext}`));
const frameList = Object.keys(vottfile.frames).map(Number);

const crossedList = [
    5, 4, 10, 9, 3, 12, 17, 13, 16, 20, 21, 23,
    26, 30, 24, 27, 28, 29, 32, 31, 50, 51, 47,
    48, 49, 52, 53, 54, 55, 56, 57, 38, 58, 69,
    70, 86, 95, 114, 115, 116
]

frameList.forEach(frameNumber => {
    const frame = vottfile.frames[frameNumber];
    if(!frame.length) return;
    frame.forEach(box => {
        box.crossed = false;
    });
})

crossedList.map(crossed => {
    frameList.forEach(frameNumber => {
        const frame = vottfile.frames[frameNumber];
        if(!frame.length) return;

        frame.forEach(box => {
            if (box.boxId === crossed) {
                box.crossed = true;
                console.log('box', box);
            }
        });
    });
});

fs.writeFileSync(
	`./${file}_crossed${ext}`,
	JSON.stringify(vottfile, null, '\t')
);
console.log('Done!');

const fs = require('fs');

const path = './Drive/VoTT/';
const trackName = 'out.20170927_prolix_downtown_ann_2-09-27-2017_10-50-16_idx00';
const ext = '.mkv.mp4.json';

const vottfile = JSON.parse(fs.readFileSync(`${path}${trackName}/${trackName}${ext}`));

let maxBoxId = 0;
let idFrameTable = {};
let matchIdTable = {};
// hashtable para id repetido

const frameList = Object.keys(vottfile.frames).map(Number);

frameList.forEach(frameNumber => {
    const frame = vottfile.frames[frameNumber];
    if(!frame.length) return;

    frame.forEach(box => {

        // if (frameNumber >= 274 && frameNumber <= 284) {
        //     console.log('frameNumber', frameNumber);
        //     console.log('box.boxId', box.boxId);
        //     console.log('maxBoxId', maxBoxId);
        //     console.log(`idFrameTable[${box.boxId}]`, idFrameTable[box.boxId]);
        //     console.log('');
        // }

        // if new boxID
        if (!idFrameTable[box.boxId] ) {
            /*
            * this is a brand new boxId, probably for the first annotations
            */
            maxBoxId++;
            idFrameTable[box.boxId] = {
                lastFrame: frameNumber,
                match: maxBoxId
            };
            box.boxId = maxBoxId; // Changing the boxID
            return;
        }

        /*
        * If the box disappears for 15 sec in the video
        */
        if( (frameNumber - idFrameTable[box.boxId].lastFrame) > 30){
            maxBoxId++;
            idFrameTable[box.boxId] = {
                lastFrame: frameNumber,
                match: maxBoxId
            };
            box.boxId = maxBoxId; // Changing the boxID
        }
        else if(idFrameTable[box.boxId].match !== box.boxId){
            idFrameTable[box.boxId].lastFrame = frameNumber;
            box.boxId = idFrameTable[box.boxId].match;
        }

    });

});

fs.writeFileSync(
	`./${trackName}${ext}`,
	JSON.stringify(vottfile, null, '\t')
);
console.log('done!');

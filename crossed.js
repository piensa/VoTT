const fs = require('fs');

const file = process.argv[2];
const filecsv = process.argv[3];

if(!file){
    throw 'Add file parameter'
}

if(file.slice(-5) !== '.json'){
    throw 'You must specify a json file'
}

const vottfile = JSON.parse(fs.readFileSync(file));
const crossedList = fs.readFileSync(filecsv, 'utf8')
                  .split('\n')
                  .filter( ( _, i ) => i !== 0)
                  .map( el => 
                        el.split(',').map( n => Number(n))
                  );

const frameList = Object.keys(vottfile.frames).map(Number);

frameList.forEach(frameNumber => {
    const frame = vottfile.frames[frameNumber];
    if(!frame.length) return;
    frame.forEach(box => {
        box.crossed = false;
    });
});

crossedList.map(crossed => {
    [ boxId, iniFrame, finalFrame ] = crossed;

    frameList.forEach(frameNumber => {
        const frame = vottfile.frames[frameNumber];
        if(!frame.length) return;

        frame.forEach(box => {
            if (
                box.boxId === boxId &&
                frameNumber >= iniFrame &&
                frameNumber <= finalFrame
            ) {

                box.crossed = true;
            }
        });
    });
});

// console.log(crossedList);


fs.writeFileSync(
	`./${file.slice(0,-5)}_crossed.json`,
	JSON.stringify(vottfile, null, '\t')
);
console.log('Cross done!');

const fs = require('fs');
const filePath = process.argv[2];
 if (!filePath) {
    throw new Error('You have to specify the file path as an argument');
}
const logger = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let seconds = 0;

for (let i = 0; i < logger.length; i=i+2) {
    let focus = logger[i].unixtime;
    let blur = logger[i+1].unixtime;
    seconds = seconds + (blur - focus)/1000;
}



const t = logger
	.filter(
		el => el.type === 'blur' && typeof el.countedFrames === 'number'
	)
	.reduce( (acc, el, index) => {
		const t = (new Date(el.unixtime));
    	const date = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

		if(acc[date] === undefined){
			acc.count = el.countedFrames <= 100 ? 0 : el.countedFrames;
		}
		acc[date] = el.countedFrames - acc.count;

		return acc;
	}, { count: 0 });

delete t.count;

// Object.entries(t))

console.log(Object.entries(t).map(obj => {
        return [...['lola'], ...obj]
    }));

const firstLoggerEl = logger.find(
	el => el.type === 'blur' && typeof el.countedFrames === 'number'
);

const lastLoggerEl = logger[logger.length-1];

const countedFrames = firstLoggerEl.countedFrames <= 100 ? 
	lastLoggerEl.countedFrames : lastLoggerEl.countedFrames - firstLoggerEl.countedFrames;

console.log('total minutes in test: ', (seconds/60).toFixed(2));
console.log('total boxes: ', countedFrames);
console.log('Boxes per minute: ', (countedFrames * 60 /seconds).toFixed(2));
console.log(`Time to create a box: ${(seconds/countedFrames).toFixed(2)} seconds`);

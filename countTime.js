const fs = require('fs');
const filePath = './experiment_nov_6/logger.json';
const logger = JSON.parse(fs.readFileSync(filePath, 'utf-8'));


let seconds = 0;
for (let i = 0; i < logger.length; i=i+2) {
    let focus = logger[i].unixtime;
    let blur = logger[i+1].unixtime;
    seconds = seconds + (blur - focus)/1000;
}

const lastLoggerEl = logger[logger.length-1];

console.log('total minutes in test: ', (seconds/60).toFixed(2));
console.log('total boxes: ', lastLoggerEl.countedFrames);
console.log('Boxes per minute: ', (lastLoggerEl.countedFrames * 60 /seconds).toFixed(2));
console.log(`Time to create a box: ${(seconds/lastLoggerEl.countedFrames).toFixed(2)} seconds`);

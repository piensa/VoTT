const fs = require('fs');
const path = './Drive/VoTT/';
const ext = '.log.json';

function countTime(path, logPath) {
    const pathFile = `${path}${logPath[0]}/${logPath[1]}`
    const logger = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
    let seconds = 0;
    for (let i = 0; i < logger.length; i=i+2) {
        let focus = logger[i].unixtime;
        let blur = logger[i+1].unixtime;
        seconds = seconds + (blur - focus)/1000;
    }
    const lastLoggerEl = logger[logger.length-1];
    const t = new Date(logger[0].unixtime);
    const dateString = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

    return `${logPath[1]}, ${dateString}, ${seconds}, ${lastLoggerEl.countedFrames}`;
}

const stdCSV = fs.readdirSync(path)
					.filter( folder => folder.slice(0, 4) === 'out.')
                    .map( folder => {
                        return fs.readdirSync(path + folder)
                                 .filter(file => file.slice(-9) === ext)
                                 .map(file => [folder, file])
                    })
                    .reduce( (acc, x) => acc.concat(x), [] ) //flatten
                    .map(logPath => countTime(path, logPath))
                    .reduce( (prev, next) => {
                        return `${prev}\n${next}`;
                    });

fs.writeFileSync(
	`./statistics.csv`,
	`filename, dateString, seconds, boxCount\n${stdCSV}`
);
console.log('Done!');

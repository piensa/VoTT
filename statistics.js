const fs = require('fs');
const path = './Drive/VoTT/concat/';
const ext = '.log.json';

function countTime(path, logPath) {
    const pathFile = `${path}${logPath[0]}/${logPath[1]}`;

    const logger = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
    let seconds = 0;
    for (let i = 0; i < logger.length; i=i+2) {
        let focus = logger[i].unixtime;
        let blur = logger[i + 1].unixtime;
        seconds = seconds + (blur - focus)/1000;
    }

    // const firstLoggerEl = logger.find(
    //     el => el.type === 'blur' && typeof el.countedFrames === 'number'
    // );
    // const lastLoggerEl = logger[logger.length-1];

    // const countedFrames = firstLoggerEl.countedFrames <= 100 ? 
    //     lastLoggerEl.countedFrames : lastLoggerEl.countedFrames - firstLoggerEl.countedFrames;

    // const t = new Date(logger[0].unixtime);
    // const dateString = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

    const countObj = logger
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

    delete countObj.count;

    return Object.entries(countObj)
    .map(obj => {
        return [...logPath, ...obj]
    });

    // return `${logPath}, ${dateString}, ${seconds}, ${countedFrames}`;
}

// const stdCSV = fs.readdirSync(path)
// 					.filter( folder => folder.slice(0, 4) === 'out.')
//                     .map( folder => {
//                         return fs.readdirSync(path + folder)
//                                  .filter(file => file.slice(-9) === ext)
//                                  .map(file => [folder, file])
//                     })
//                     .reduce( (acc, x) => acc.concat(x), [] ) //flatten
//                     .map(logPath => countTime(path, logPath))
//                     .reduce( (prev, next) => {
//                         return `${prev}\n${next}`;
//                     });

// const stdCSV = fs.readdirSync(path)
//                     .filter(file => file.slice(-9) === ext)
//                     .map(logPath => countTime(path, logPath))
//                     .reduce( (prev, next) => `${prev}\n${next}`);

const stdCSV = fs.readdirSync(path)
                .filter(folder => folder.includes('prolix'))
                .map( folder => (
                    fs.readdirSync(path + folder)
                      .filter(file => file.slice(-9) === ext)
                      .map(file => [folder, file])
                ))
                .reduce( (acc, x) => acc.concat(x), [] ) //flatten
                .map(logPath => countTime(path, logPath))
                .reduce( (acc, x) => acc.concat(x), [] )
                .reduce( (prev, next) => `${prev}\n${next}`);


// console.log(stdCSV)

fs.writeFileSync(
	`./statistics.csv`,
	`filename, file, dateString, boxCount\n${stdCSV}`
);
console.log('Done!');

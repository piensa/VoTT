const fs = require('fs');

const file = process.argv[2];
const filecsv = process.argv[3];

if(!file || !filecsv){
    throw 'Add files parameter'
}

if(file.slice(-5) !== '.json'){
    throw 'You must specify a json file'
}
if(filecsv.slice(-4) !== '.csv'){
    throw 'You must specify a csv file'
}

const vottfile = JSON.parse(fs.readFileSync(file));

const matchesList = fs.readFileSync(filecsv, 'utf8')
                  .split('\n')
                  .filter( ( _, i ) => i !== 0)
                  .map( el => el.split(',').map( n => Number(n) ))
                //   .map( el => {
                //   		const match = {}
                //   		if (el[0]) {
                //   			match.left = el[0]
                //   		}
                //   		if (el[1]) {
                //   			match.center = el[1]
                //   		}
                //   		if (el[2]) {
                //   			match.right = el[2]
                //   		}
                //   		return match;
	               // })

const matchObj = matchesList.reduce( (acc, el) => {
	el = el.filter(x => x !== 0);

	for (let i = 0; i < el.length; i++) {

		if(el[0]){
			acc[el[0]] = el.join('-');
		}

		// rotation
		el = [...el.slice(1), el[0]]
	}

	return acc;
}, {});

Object.keys(vottfile.frames).map( frame => {
	vottfile.frames[frame].forEach(box => {
		box.matchIds = matchObj[box.boxId] || String(box.boxId);
	})
})

// console.log(matchesList)
// console.log(matchObj)

// {
// 	'1': '2',
// 	'2': '1',
// 	'4': '5',
// 	'13': '9-0' 
// }

// [ [ 0, 1, 2 ],
//   [ 4, 5, 0 ],
//   [ 0, 6, 10 ],
//   [ 0, 7, 12 ],
//   [ 13, 9, 0 ],
//   [ 14, 8, 0 ],
//   [ 16, 15, 0 ],
//   [ 0, 20, 17 ],
//   ]

vottfile.matchesList = matchesList;

fs.writeFileSync(
	`./${file.slice(0,-5)}_matched.json`,
	JSON.stringify(vottfile, null, '\t')
);
console.log('Match done!');
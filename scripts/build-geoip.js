var ipLocation = require('ip-location')
var dataSource = require('../res/dataSource');
var _ = require('../vendor/lodash.min');
var fs = require('fs');
var path = require('path')


// var fd = fs.openSync(path.resolve(__dirname, '../res/ipdata.json'), 'w+');
// console.log(`fd ${fd}`);



// console.log('dataSource', dataSource);
/*
 *	из массива пар вида [ip,count] создаем объект {ip1:count1, ..., ipN: countN}
 *	[['a',1],['b',2]] => {'a':1, 'b':2}
 *	повторяющиеся ключи объекта будут перезаписаны, то есть размер массива ключей может уменьшиться
*/
var infoByIp = {};
var countByIp = _.fromPairs(dataSource);
var promises = [];
_.forEach(_.keys(countByIp), function (ip, index) {
	// console.log(`index ${index} ip ${ip}`);

	promises.push(ipLocation(ip));
})



Promise.all(promises).then(
	function (data) {
		infoByIp = _.reduce(data, function(acc,v, k) {
			acc[v.ip]=v;
			return acc;
		}, {});


		console.log('infoByIp', infoByIp);
		writeFile('../res/ipdata.json', JSON.stringify(infoByIp))
		writeFile('../res/ipdata.js', 'var ipdata = '+JSON.stringify(infoByIp)+';');

	},
	function (err) {
		console.warn('(!) ipLocation', err);
	}
)

function writeFile(filePath, value) {
	var fd = fs.openSync(path.resolve(__dirname, filePath), 'w+');

	fs.write(fd, value, (err) => {
		if (err) throw err;
		console.log(`${filePath} has been saved!`);
	});

}
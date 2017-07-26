// отображение карты при помощи `JS API Спутник-Карт`
L.sm.apiKey = 'example@maps-js.apissputnik.ru'
var map = L.sm.map('map', {zoom: 3});

if (!dataSource) {
	throw new Error(' (!) missed `/res/dataSource.js` ');
}



/*
 *	из массива пар вида [ip,count] создаем объект {ip1:count1, ..., ipN: countN}
 *	[['a',1],['b',2]] => {'a':1, 'b':2}
 *	повторяющиеся ключи объекта будут перезаписаны, то есть размер массива ключей может уменьшиться
*/
var countByIp = _.fromPairs(dataSource);

// проверка нет ли повторений IP в исходных данных
if (Object.keys(countByIp).length !== dataSource.length) {
	throw new Error('duplicated IPs not supported yet');
}


console.log('countByIp', countByIp, 'total IPs', Object.keys(countByIp).length);


console.log('ipdata', ipdata);


/*

var pfd = _.map(dataSource,function(v){
	return {ip:v[0], count: v[1]}
});

console.log(pfd)
*/

/*
 * для отображения данных на карте мире
 * необходимо связать IP с географическими координатами (latitude, longitude)
 *
 * у нас 300 IP, имеет смысл получать данные не по одной позиции, а пачками
 * подготовка к запросу IP Geolocation API - Batch JSON [ip-api]
 * http://ip-api.com/docs/api:batch
 *
 * Ограничение: IP-API позволяет запрашивать не более 100 позиций в batch-запросе
 *
 */
// разбить данные на порции по 100 записей
/*
var pkgdSourceData = _.chunk(dataSource, 100);
console.log('pkgdSourceData', pkgdSourceData);
// данные запросов
var pkgdRequestData = [];
_.forEach(pkgdSourceData, function (data, index) {
	var ips = _.map(data, function(pair){
		return {query:pair[0]};
	})
	if (ips && ips.length) {
		pkgdRequestData.push(ips)
	}
})

console.log('req0', JSON.stringify(pkgdRequestData[0]));
getCoords(pkgdRequestData[0]).then(
	function (response) {
		console.log('response', response);

	}
)

function getCoords(query) {
	apiUrl = 'http://ip-api.com/batch?fields=country,city,status,message,lat,lon';
	return axios.post(apiUrl,  (query));
}
*/

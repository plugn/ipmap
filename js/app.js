// отображение карты при помощи `JS API Спутник-Карт`
L.sm.apiKey = 'example@maps-js.apissputnik.ru'
var map = L.sm.map('map', {zoom: 3});

if (!dataSource) {
	throw new Error(' (!) missed `/res/dataSource.js` ');
}

if (!ipdata) {
	throw new Error(' (!) missed `/res/ipdata.js` ');
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


console.log('countByIp', countByIp, 'ipdata', ipdata);


var feats = _.map(ipdata, function(v){
	return {
		"type": "Feature",
		"properties": _.extend({}, v, {count:countByIp[v.ip]}),
		"geometry": {
		"type": "Point",
			"coordinates": [v.longitude, v.latitude]
	},
		"popupTemplate": "страна: {country_name}, город: {city}<br>IP : {ip}<br>обращений : {count}"
	};
})

// console.log('feats', feats);
var geoJsonCssData = {
	"type": "FeatureCollection",
	"features": feats
};

 L.sm.geoJson(geoJsonCssData).addTo(map);
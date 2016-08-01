function pluviamRequest(stationId){
$.getJSON('http://local.api.pluvi.am/stations/' + stationId + '/last')
	.done(function (result){

		$('#pluviamStationName').html('Estação meteorológica ' + result.station.name);
		$('#pluviamStationLocation').html(result.station.city + ' - ' + result.station.county + ' - ' + result.station.country);

		var resultDate = new Date(result.weather.date);

		$('#pluviamDateLocal').html(resultDate);
		$('#pluviamDateGTM').html(resultDate);

		$('#pluviamTemperature').html(result.weather.temperature);
		$('#pluviamTemperatureUnit').html(result.weather.temperatureUnit);

		$('#pluviamHumidity').html(result.weather.humidity);
		$('#pluviamHumidityUnit').html(result.weather.humidityUnit);

		$('#pluviamPressure').html(result.weather.pressure);
		$('#pluviamPressureUnit').html(result.weather.pressureUnit);

		$('#pluviamWindSpeed').html(result.weather.windSpeed);
		$('#pluviamWindSpeedUnit').html(result.weather.windSpeedUnit);

		$('#pluviamWindDirection').html(result.weather.windDirection);
		$('#pluviamWindDirectionUnit').html(result.weather.windDirectionUnit);

		$('#pluviamPrecipitation').html(result.weather.precipitation);
		$('#pluviamPrecipitationUnit').html(result.weather.precipitationUnit);

		$('#pluviamStationLink').attr('href', result.station.url);

		$('#pluviamStation').show();
	});
}

function pluviamFormatDateUTC(date){

}




<div id="pluviamStation" style="display:none">
	<div id="pluviamTitle">
		<span id="pluviamStationName"></span>
	</div>
	<div>
		<span id="pluviamStationLocation"></span>
	</div>
	<div>Temperatura:
		<span id="pluviamTemperature"></span>&nbsp;
		<span id="pluviamTemperatureUnit"></span>
	</div>
	<div>Umidade:
		<span id="pluviamHumidity"></span>&nbsp;
		<span id="pluviamHumidityUnit"></span>
	</div>
	<div>Pressão:
		<span id="pluviamPressure"></span>&nbsp;
		<span id="pluviamPressureUnit"></span>
	</div>
	<div>Vento:
		<span id="pluviamWindSpeed"></span>&nbsp;
		<span id="pluviamWindSpeedUnit"></span>&nbsp;
		<span id="pluviamWindDirection"></span>&nbsp;
		<span id="pluviamWindDirectionUnit"></span>
	</div>
	<div>Chuva hoje:
		<span id="pluviamPrecipitation"></span>&nbsp;
		<span id="pluviamPrecipitationUnit"></span>
	</div>
	<div>Última atualização:
		<span id="pluviamDateLocal"></span>&nbsp;
		<span id="pluviamDateGMT"></span>&nbsp;
	</div>
	<a href="#" id="pluviamStationLink">Acesse aqui os gráficos</a>
</div>

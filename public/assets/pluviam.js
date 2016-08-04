<style>
	#pluviamStation{
		display: none;
		margin-left: 50px;
		margin-top: 5px;
	}
	.pluviamInfo{
		font-size: 16px;
	}
	#pluviamTitle{
		font-size: 16px;
	    text-align: center;
	}

	.pluviamAlignCenter{
		text-align: center;
	}

	.pluviamValue{
		font-size: 16px;
	    font-weight: bold;
	}

	.pluviamUnit{
		font-size: 12px;
	}

	.pluviamMarginTop{
		margin-top: 9px;
	}
</style>

<div id="pluviamStation" style="">
	<div id="pluviamTitle">
		<span id="pluviamStationName"></span>
	</div>
	<div class="pluviamAlignCenter">
		<span id="pluviamStationLocation"></span>
	</div>
	<div class="pluviamInfo pluviamMarginTop">Temperatura:
		<span class="pluviamValue" id="pluviamTemperature"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamTemperatureUnit"></span>
	</div>
	<div class="pluviamInfo">Umidade:
		<span class="pluviamValue" id="pluviamHumidity"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamHumidityUnit"></span>
	</div>
	<div class="pluviamInfo">Pressão:
		<span class="pluviamValue" id="pluviamPressure"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamPressureUnit"></span>
	</div>
	<div class="pluviamInfo">Vento:
		<span class="pluviamValue" id="pluviamWindSpeed"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamWindSpeedUnit"></span>&nbsp;
		&nbsp;Rajada:
		<span class="pluviamValue" id="pluviamWindGust"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamWindGustUnit"></span>&nbsp;
		&nbsp;Dir:
		<span class="pluviamValue" id="pluviamWindDirection"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamWindDirectionUnit"></span>
	</div>
	<div class="pluviamInfo">Precipitação hoje:
		<span class="pluviamValue" id="pluviamPrecipitation"></span>&nbsp;
		<span class="pluviamUnit" id="pluviamPrecipitationUnit"></span>
	</div>
	<div class="pluviamAlignCenter pluviamMarginTop">Última atualização:
		<span id="pluviamDateLocal"></span>&nbsp;
	</div>
	<div class="pluviamAlignCenter">
		<a href="#" id="pluviamStationLink">pluviam</a>
	</div>
</div>

<script>
function pluviamRequest(stationId){
$.getJSON('http://local.api.pluvi.am/stations/' + stationId + '/last')
	.done(function (result){

		$('#pluviamStationName').html('Estação Meteorológica ' + result.station.name);
		$('#pluviamStationLocation').html(result.station.city + ' - ' + result.station.county + ' - ' + result.station.country);

		var resultDate = new Date(result.weather.date);

		console.log(resultDate.toISOString());
		$('#pluviamDateLocal').html(pluviamFormatDate(resultDate.toISOString())  + ' Local');

		$('#pluviamTemperature').html(result.weather.temperature);
		$('#pluviamTemperatureUnit').html(result.weather.temperatureUnit);

		$('#pluviamHumidity').html(result.weather.humidity);
		$('#pluviamHumidityUnit').html(result.weather.humidityUnit);

		$('#pluviamPressure').html(result.weather.pressure);
		$('#pluviamPressureUnit').html(result.weather.pressureUnit);

		$('#pluviamWindSpeed').html(result.weather.windSpeed);
		$('#pluviamWindSpeedUnit').html(result.weather.windSpeedUnit);

		$('#pluviamWindGust').html(result.weather.windGust);
		$('#pluviamWindGustUnit').html(result.weather.windGustUnit);

		$('#pluviamWindDirection').html(result.weather.windDirection);
		$('#pluviamWindDirectionUnit').html(result.weather.windDirectionUnit);

		$('#pluviamPrecipitation').html(result.weather.precipitation);
		$('#pluviamPrecipitationUnit').html(result.weather.precipitationUnit);

		$('#pluviamStationLink').attr('href', result.station.url);

		$('#pluviamStation').show();
	})
}

function pluviamFormatDate (date) {
	return date.substr(11, 2) + ':' + date.substr(14, 2) + ' ' +
	date.substr(0, 4) + '/' + date.substr(5, 2) + '/' + date.substr(8, 2);
}

pluviamRequest('577e1e6d894057a155fa0e99');

</script>

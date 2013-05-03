var cars = ["Acura", "Honda"];
var data = {'selectedCarIndex': '', 'start': {}, 'stop': {}};
jQuery(document).ready(function($) {
	$.each(cars, function(index, val) {
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block cars").attr("rel", index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(handleStartPosition);
	}
	$('a.cars').click(function() {
		data['selectedCarIndex'] = $(this).attr("rel");
		$('#step-two h3.title').text(cars[data['selectedCarIndex']]);
		$('#step-one').fadeOut('slow', function() {
			$('#step-two').fadeIn('slow');
		});
		return false;
	});
	$('form#starting-form').submit(function() {
		setStartingFormData();
		$('#step-three h3.title').text(cars[data['selectedCarIndex']]);
		$('#step-two').fadeOut('slow', function() {
			$('#step-three').fadeIn('slow');
		});
		return false;
	});
	$('form#stopping-form').submit(function(){
		if ( navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition(handleStopPosition);
		}
		setStoppingFormData();
		$('#step-confirm h3.title').text(cars[data['selectedCarIndex']]+"Trip Confirm");
		$('#step-three').fadeOut('slow', function() {
			$('#step-confirm').fadeIn('slow', function() {
				alert(data['start']['lat']+" - "+data['start']['long']+"\r\n"+data['stop']['lat']+" - "+data['stop']['long']+"\r\n");
			});
		});
		return false;
	});
});
function handleStartPosition(pos) {
	data['start'] = {'lat': pos.coords.latitude, 'long': pos.coords.longitude};
};
function handleStopPosition(pos) {
	data['stop'] = {'lat': pos.coords.latitude, 'long': pos.coords.longitude};
};
function setStartingFormData() {
	$.extend(data['start'], {'location': $('input#starting-location').val(), 'odometer': $('input#starting-odometer').val(), 'reason': $('input#reason').val()});
};
function setStoppingFormData() {
	$.extend(data['stop'], {'location': $('input#stopping-location').val(), 'odometer': $('input#stopping-odometer').val()});
};


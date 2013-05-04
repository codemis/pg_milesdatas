var cars = ["Acura", "Honda"];
var data = {'selectedCarIndex': '', 'start': {}, 'stop': {}};
var startingStepComplete = false;
var stoppingStepComplete = false;
jQuery(document).ready(function($) {
	$.each(cars, function(index, val) {
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block cars").attr("rel", index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(handleStartPosition);
	}
	$('a.cars').click(function() {
		data['selectedCarIndex'] = $(this).attr("rel");
		$('#step-nav h3.title').text(cars[data['selectedCarIndex']]);
		$('#step-one').fadeOut('slow', function() {
			$('#step-nav').fadeIn('slow');
		});
		return false;
	});
	$('a.step-nav-link').click(function() {
		var rel = $(this).attr('rel');
		$('#step-nav').fadeOut('slow', function() {
			$('#'+rel).fadeIn('slow');
		});
	});
	$('form#starting-form').submit(function() {
		setStartingFormData();
		$('#step-two').fadeOut('slow', function() {
			$('a.step-nav-link[rel="step-two"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
			checkAndShowSaveButton();
			$('#step-nav').fadeIn('slow');
		});
		return false;
	});
	$('form#stopping-form').submit(function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(handleStopPosition);
		}
		setStoppingFormData();
		$('#step-three').fadeOut('slow', function() {
			$('a.step-nav-link[rel="step-three"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
			checkAndShowSaveButton();
			$('#step-nav').fadeIn('slow');
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
	startingStepComplete = true;
};
function setStoppingFormData() {
	$.extend(data['stop'], {'location': $('input#stopping-location').val(), 'odometer': $('input#stopping-odometer').val()});
	stoppingStepComplete = true;
};
function checkAndShowSaveButton() {
	if((startingStepComplete === true) && (stoppingStepComplete === true)) {
		$('a.step-nav-complete').removeClass('disabled');
	}
};


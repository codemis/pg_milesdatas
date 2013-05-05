var cars = ["Acura", "Honda"];
var data = {'selectedCarIndex': '', 'start': {'useCoords': false}, 'stop': {'useCoords': false}};
var startingStepComplete = false;
var stoppingStepComplete = false;
jQuery(document).ready(function($) {
	$.each(cars, function(index, val) {
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block cars").attr("rel", index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
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
		setupForms(rel);
		$('#step-nav').fadeOut('slow', function() {
			$('#'+rel).fadeIn('slow');
		});
	});
	$('a.step-nav-complete').click(function() {
		console.log(data);
		return false;
	});
	$('form#start-form').submit(function() {
		setStartingFormData();
		$('#step-two').fadeOut('slow', function() {
			$('a.step-nav-link[rel="step-two"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
			checkAndShowSaveButton();
			$('#step-nav').fadeIn('slow');
		});
		return false;
	});
	$('form#stop-form').submit(function(){
		setStoppingFormData();
		$('#step-three').fadeOut('slow', function() {
			$('a.step-nav-link[rel="step-three"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
			checkAndShowSaveButton();
			$('#step-nav').fadeIn('slow');
		});
		return false;
	});
	$('button.coordinates').click(function() {
		switchCoordinates(this);
		return false;
	});
});
function handleStartPosition(pos) {
	$.extend(data['start'], {'lat': pos.coords.latitude, 'long': pos.coords.longitude});
};
function handleStopPosition(pos) {
	$.extend(data['stop'], {'lat': pos.coords.latitude, 'long': pos.coords.longitude});
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
	if((startingStepComplete === true) && (stoppingStepComplete === true)){
		$('a.step-nav-complete').removeClass('disabled');
	}
};
function setupForms(step) {
	if((step == 'step-two') && (startingStepComplete === true)){
		$('input#starting-location').val(data['start']['location']);
		$('input#starting-odometer').val(data['start']['odometer']);
		$('input#reason').val(data['start']['reason']);
	}else if((step == 'step-three') && (stoppingStepComplete === true)){
		$('input#stopping-location').val(data['stop']['location']);
		$('input#stopping-odometer').val(data['stop']['odometer']);
	}
};
function switchCoordinates(ele) {
	var button = $(ele);
	var rel = button.attr('rel');
	if(data[rel]['useCoords'] === true){
		data[rel]['useCoords'] = false;
		button.removeClass('btn-success').addClass('btn-danger').html('<i class="icon-screenshot icon-white"></i> Coordinates: Off');
		data[rel]['lat'] = null;
		data[rel]['long'] = null;
	}else{
		if(navigator.geolocation){
			data[rel]['useCoords'] = true;
			if(rel == 'start') {
				navigator.geolocation.getCurrentPosition(handleStartPosition);
			} else{
				navigator.geolocation.getCurrentPosition(handleStopPosition);
			}
			button.removeClass('btn-danger').addClass('btn-success').html('<i class="icon-screenshot icon-white"></i> Coordinates: On');
		} else{
			alert('Sorry, but your phone does not offer your coordinates.');
		}
	}
};

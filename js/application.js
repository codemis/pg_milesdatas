/**
 * The array of available cars
 * @var Array 
 */
var cars = ["Acura", "Honda"];
/**
 * Holds the data that is submitted by the various forms.  It is sent to the server to save the data
 * @var JSON Object 
 */
var data = {'selectedCarIndex': '', 'starting': {'useCoords': false}, 'stopping': {'useCoords': false}};
/**
 * Tells us if they completed the starting step of the app
 * @var Boolean 
 */
var startingStepComplete = false;
/**
 * Tells us if they completed the stopping step of the app
 * @var Boolean 
 */
var stoppingStepComplete = false;
/**
 * A variable to hold the local storage object
 * @var Object 
 */
var localStorage;
/**
 * The API_KEY to access the POST request
 * @var String 
 */
var API_KEY = "";
/**
 * Trigger events on the page load. 
 */
jQuery(document).ready(function($) {
	setupStepOne();
	localStorage = window.localStorage;
	API_KEY = localStorage.API_KEY;
	if(API_KEY == null || API_KEY == "" || API_KEY == undefined) {
		$('#step-api-key button.close').hide();
		$('#step-api-key').modal({"backdrop": "static"});
	}
	/**
	 * OnClick event for car buttons 
	 */
	$('a.cars').click(function() {
		data['selectedCarIndex'] = $(this).attr("rel");
		$('#step-nav h3.title').text(cars[data['selectedCarIndex']]);
		$('#step-one').fadeOut('slow', function() {
			$('#step-nav').fadeIn('slow');
		});
		return false;
	});
	/**
	 * OnClick event for the step buttons 
	 */
	$('a.step-nav-link').click(function() {
		var rel = $(this).attr('rel');
		setupForms(rel);
		$('#step-nav').fadeOut('slow', function() {
			$('#'+rel).fadeIn('slow');
		});
	});
	/**
	 * OnClick event for completing the recording.  This will send to the web server for saving 
	 */
	$('a.step-nav-complete').click(function(e) {
		e.preventDefault();
		$(this).text('Sending').addClass('disabled');
		saveData();
		return false;
	});
	/**
	 * OnSubmit event for the starting form 
	 */
	$('form#starting-form').submit(function() {
		if(isFormIsValid('starting') === true){
			setStartingFormData();
			$('#step-two').fadeOut('slow', function() {
				$('a.step-nav-link[rel="step-two"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
				checkAndShowSaveButton();
				$('#step-nav').fadeIn('slow');
			});
		}
		return false;
	});
	/**
	 * OnSubmit event for the stopping form 
	 */
	$('form#stopping-form').submit(function(){
		if(isFormIsValid('stopping') === true){
			setStoppingFormData();
			$('#step-three').fadeOut('slow', function() {
				$('a.step-nav-link[rel="step-three"]').children('i').removeClass('icon-exclamation-sign').addClass('icon-ok');
				checkAndShowSaveButton();
				$('#step-nav').fadeIn('slow');
			});
		}
		return false;
	});
	/**
	 * Handle the API Form 
	 */
	$('form#api-key-form').submit(function() {
		if(isInputValid("api-key-input")) {
			saveAndSetApiKey();
			$('#step-api-key').modal('hide');
		}
		return false;
	});
	/**
	 * OnClick event for setting automatically determine GPS with coordinates 
	 */
	$('button.coordinates').click(function() {
		switchCoordinates(this);
		return false;
	});
	/**
	 * Handle the settings button 
	 */
	$('a.settings-btn').click(function() {
		$('#step-api-key button.close').show();
		$("#api-key-input").val(API_KEY);
		$('#step-api-key').modal({});
		return false;
	});
});
/**
 * Setup the first step
 * @return void 
 */
function setupStepOne() {
	/**
	 * Initial page shows a button for each car to select the car your using 
	 */
	$.each(cars, function(index, val) {
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block cars").attr("rel", index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
};
/**
 * Save the new API Key, and set it to the local var
 * @return void 
 */
function saveAndSetApiKey() {
	localStorage.API_KEY = $("#api-key-input").val();
	API_KEY = localStorage.API_KEY;
};
/**
 * Callback function when the starting coordinates are located
 * @var Object pos the coordinates object provided by the navigator.geolocation.getCurrentPosition method
 * @return void
 */
function handleStartPosition(pos) {
	$.extend(data['starting'], {'lat': pos.coords.latitude, 'long': pos.coords.longitude});
};
/**
 * Callback function when the stopping coordinates are located
 * @var Object pos the coordinates object provided by the navigator.geolocation.getCurrentPosition method
 * @return void
 */
function handleStopPosition(pos) {
	$.extend(data['stopping'], {'lat': pos.coords.latitude, 'long': pos.coords.longitude});
};
/**
 * Sets up the starting date into the data JSON Object
 * @return void 
 */
function setStartingFormData() {
	$.extend(data['starting'], {'location': $('input#starting-location').val(), 'odometer': $('input#starting-odometer').val(), 'reason': $('input#reason').val()});
	startingStepComplete = true;
};
/**
 * Sets up the stopping date into the data JSON Object
 * @return void 
 */
function setStoppingFormData() {
	$.extend(data['stopping'], {'location': $('input#stopping-location').val(), 'odometer': $('input#stopping-odometer').val()});
	stoppingStepComplete = true;
};
/**
 * Checks whether the user has completed both the starting and stopping steps, then disables the save button
 * @return void 
 */
function checkAndShowSaveButton() {
	if((startingStepComplete === true) && (stoppingStepComplete === true)){
		$('a.step-nav-complete').removeClass('disabled');
	}
};
/**
 * Fill the form with the current data, if it exists
 * @var String the step you are on (step-two or step-three)
 * @return void 
 */
function setupForms(step) {
	if((step == 'step-two') && (startingStepComplete === true)){
		$('input#starting-location').val(data['starting']['location']);
		$('input#starting-odometer').val(data['starting']['odometer']);
		$('input#reason').val(data['starting']['reason']);
	}else if((step == 'step-three') && (stoppingStepComplete === true)){
		$('input#stopping-location').val(data['stopping']['location']);
		$('input#stopping-odometer').val(data['stopping']['odometer']);
	}
};
/**
 * Switch whether we are using the coordinates provided by the device or not
 * @var JQuery Object ele the coordinates button that was clicked
 * @return void
 */
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
			if(rel == 'starting') {
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
/**
 * Checks whether the form is valid, or missing fields
 * @var String formType the type of form to validate (starting or stopping)
 * @return boolean 
 */
function isFormIsValid(formType) {
	var isValid = true;
	if(data[formType]['useCoords'] === false){
		isValid = isInputValid(formType+'-location');
	}else{
		hideFormError(formType+'-location');
	}
	isValid = isInputValid(formType+'-odometer');
	if(formType == 'starting'){
		isValid = isInputValid('reason');
	}
	return isValid;
};
/**
 * Checks if the input is set or empty
 * @var String inputId the CSS ID of the input to check
 * @return boolean
 */
function isInputValid(inputId) {
	if($('input#'+inputId).val() == ''){
		displayFormError(inputId);
		return false;
	}else{
		hideFormError(inputId);
		return true;
	}
};
/**
 * Displays an error on the input specified 
 * @var String inputId the CSS ID of the input to check
 * @return void
 */
function displayFormError(inputId){
	var errorInput = $('input#'+inputId);
	if(errorInput.siblings('span.help-inline').length == 0){
		errorInput.parent().append($('<span/>').addClass('help-inline').text('This field is required!'));
	}
	errorInput.parents('div.control-group').first().addClass('error');
};
/**
 * Removes any errors on the input specified 
 * @var String inputId the CSS ID of the input to check
 * @return void
 */
function hideFormError(inputId){
	var noErrorInput = $('input#'+inputId);
	noErrorInput.siblings('span.help-inline').remove();
	noErrorInput.parents('div.control-group').first().removeClass('error');
};
function saveData() {
	var dataParam = {'api_key': API_KEY, 'record': {'car': cars[data['selectedCarIndex']], 'start_lat': data['starting']['lat'], 'start_long': data['starting']['long'], 'start_location': data['starting']['location'], 'start_odometer': data['starting']['odometer'], 'start_use_coords': data['starting']['useCoords'], 'stop_lat': data['stopping']['lat'], 'stop_long': data['stopping']['long'], 'stop_location': data['stopping']['location'], 'stop_odometer': data['stopping']['odometer'], 'stop_use_coords': data['stopping']['useCoords'], 'reason': data['starting']['reason']}};
	$.post('http://milesdatas.herokuapp.com/records.json', dataParam,
	 function(resp){
	    $('#step-nav').fadeOut('slow', function() {
				data = {'selectedCarIndex': '', 'starting': {'useCoords': false}, 'stopping': {'useCoords': false}};
				startingStepComplete = false;
				stoppingStepComplete = false;
				$('#step-one').fadeIn('slow', function() {
					alert('Your record has been saved!');
				});
			});
	}).fail(function(){ alert('Sorry, unable to save the data!'); });
};

var cars = ["Acura", "Honda"];
var data = {'selectedCarIndex': ''};
jQuery(document).ready(function($) {
	$.each(cars, function(index, val) {
	  //<a href="#" class="btn btn-large btn-primary" rel="car-one">Acura<br><i class="icon-auto"></i></a>
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block cars").attr("rel", index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
	$('a.cars').click(function() {
		data['selectedCarIndex'] = $(this).attr("rel");
		$('#step-two h3.title').text(cars[data['selectedCarIndex']]);
		$('#step-one').fadeOut('slow', function() {
			$('#step-two').fadeIn('slow');
		});
		return false;
	});
});

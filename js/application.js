var cars = ["Acura", "Honda"];
jQuery(document).ready(function($) {
	$.each(cars, function(index, val) {
	  //<a href="#" class="btn btn-large btn-primary" rel="car-one">Acura<br><i class="icon-auto"></i></a>
		var carButton = $('<a/>').addClass("btn btn-large btn-primary btn-block").attr("rel", "car-"+index).html(val+"<br><i class='icon-auto'></i></a>");
		$('#step-one').append(carButton);
	});
});

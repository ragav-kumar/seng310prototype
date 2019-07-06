$(function () {
	// ----- jQuery starts here -----
	// News tabs (via jquery UI)
	$("#cell-news").tabs();
	// 
	// Bus favourites
	$("#cell-bus i").click(function () { 
		// Toggle star behaviour
		$(this).toggleClass("far").toggleClass("fas");
		if ($(this).hasClass("fas")) {
			$(this).parent().addClass("star");
		} else {
			$(this).parent().removeClass("star");
		}
	});
	// Header Icons
	$(".email-icon").click(function (e) { 
		e.preventDefault();
		alert("");
	});
	function headerIconClick(e) {
		e.preventDefault();
		if ($(this).hasClass("email-icon")) {
			alert("This would open uvic webmail in a simulated browser view.");
		} else if ($(this).hasClass("notification-icon")) {
			window
		}
	}
	// ----- jQuery ends here -----
});

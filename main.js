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
		alert("This would open uvic webmail in a simulated browser view.");
	});
	$(".notification-icon").click(function (e) {
		e.preventDefault();
		alert("Notification window not implemented yet");
	});
	$(".settings-icon").click(function (e) {
		e.preventDefault();
		$(".popup-wrap").show();
		$(".popup-settings").show();
	});
	// ----- jQuery ends here -----
});

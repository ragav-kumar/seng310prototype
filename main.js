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
	// ----- jQuery ends here -----
});

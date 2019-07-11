$(function () {
	// used to identify which button was hit in a form
	let submitAction;
	// ----- jQuery starts here -----
	// Allows closing popup by clicking black area, without breaking children clicks.
	$(".popup-wrap").click(function (e) {
		if (e.target !== this) return;
		e.preventDefault();
		$(".popup-wrap, .popup-wrap popup").hide();
	});
	// News tabs (via jquery UI)
	$("#cell-news").tabs();
	$(".flipswitch").flipswitch({
		texts: null,
		height: 30,
		width: 50,
		init: "right"
	});
	
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
	$("body.logged-in .email-icon").click(function (e) {
		e.preventDefault();
		alert("This would open uvic webmail in a simulated browser view.");
	});
	$(".notification-icon").click(function (e) {
		e.preventDefault();
		alert("Due to technical difficulties, Notifications have been disabled for this demo.");
	});
	$("body.logged-in .settings-icon").click(function (e) {
		e.preventDefault();
		$(".popup-wrap").show();
		$(".popup-settings").show();
	});
	$(".settings-save").click(function(e) {
		e.preventDefault();
		$(".popup-wrap").hide();
		$(".popup-settings").hide();
	});
	// Store name of submit button, allowing 2 submit buttons
	$("input[type=submit]").click(function() {
		submitAction = $(this).attr("name");
	});
	$("#form-login").submit(function(e) {
		e.preventDefault();
		if (submitAction == "cancel") { // close login popup
			$(".popup-wrap").hide();
			$(".popup-login").hide();
		} else {
			if ($("#login-id").val() && $("#login-password").val()) {
				window.location.href = "loggedin.html";
			} else { // error message
				alert("Please enter your netlink ID and password");
			}
		}
	});
	// Logout. Done the lazy way for now!
	$(".logout").click(function(e) {
		e.preventDefault();
		if (confirm("Really logout?")) {
			window.location.href = "index.html";
		}
	});
	// When logged out, tapping any "locked" tile (or settings) will trigger login.
	$("body.logged-out").on("click", ".user-icon, .cell-locked, .settings-icon", function (e) {
		e.preventDefault();
		$(".popup-wrap").show();
		$(".popup-login").show();
	});
	//----------Tile customizer
	$(".cancel-tile-select").click(function(e){
		e.preventDefault();
		$(".popup-wrap").hide();
		$(".popup-tiles").hide();
	});
	var insertRow;
	var insertCell;
	function showTileDialog() {
		console.log("show");
		$(".popup-wrap").show();
		$(".popup-tiles").show();
	}
	function tileReplace() {
		insertRow = 0;
		insertCell = 1;
		showTileDialog();
	}
	let tileRemove = (row) => {
		// For demo, only defined for timetable tile
		$(".row-" + row).html(`
		<div class="cell cell-1">
			<div class="cell-tile cell-empty">
				<div class="empty-plus">+</div>
				<div class="empty-text">Tap to add</div>
			</div>
		</div>
		<div class="cell cell-2">
			<div class="cell-tile cell-empty">
				<div class="empty-plus">+</div>
				<div class="empty-text">Tap to add</div>
			</div>
		</div>
		`);
	}
	/* $("body").on("click", ".xmark, .replace", function(e) {
		$(this).addClass("bigX");
		setTimeout(() => {
			$(this).removeClass("bigX");	
			if ($(this).hasClass("xmark") && $(this).parents(".row-1").length) {
				//remove action
				tileRemove(1);
			} else if ($(this).hasClass("replace") && $(this).parents(".row-0").length) {
				tileReplace();
			}
		}, 200);
	}); */
	(function() { 

		// how many milliseconds is a long press?
		let longpress = 200;
		// holds the start time
		let start;
		let selector = ".xmark, .replace";
		
		$( "body" ).on( 'mousedown', selector, function( e ) {
			e.preventDefault();
			start = new Date().getTime();
			$(this).addClass("bigX");
			setTimeout(() => {
				if ($(this).hasClass("bigX")) {
					$(this).trigger("mouseup");
				}
			}, 200);
		} );
	
		$( "body" ).on( 'mouseleave', selector, function( e ) {
			e.preventDefault();
			start = 0;
			$(this).removeClass("bigX");
		} );
	
		$( "body" ).on( 'mouseup', selector, function( e ) {
			e.preventDefault();
			$(this).removeClass("bigX");
			if ( new Date().getTime() >= ( start + longpress )  ) {
				if ($(this).hasClass("xmark") && $(this).parents(".row-1").length) {
					//remove action
					tileRemove(1);
				} else if ($(this).hasClass("replace") && $(this).parents(".row-0").length) {
					tileReplace();
				}
			}
		} );
	
	}());
	$(".tile-choice").click(function(e) {
		e.preventDefault();
		if ($(this).hasClass("disabled")) {
			return;
		}
		let newTile;
		switch ($(this).data("tile")) {
			case "faq":
				newTile = `<img id="cell-icon" src="img/help.png"><h3>FAQ</h3>`;
				// if (insertRow==1) {
				// 	alert("Due to technical limitations of mocking up this prototype in a browser (as opposed to an app), please complete the next subtask before saving and leaving the customizer.");
				// }
				break;
			case "grades":
				newTile = `<img id="cell-icon" src="img/exam.png"><h3>Course Grades</h3>`;
				break;
			case "library":
				newTile = `<img id="cell-icon" src="img/living-room-books-group.png"><h3>Library</h3>`;
				break;
			default:
				return;
		}
		newTile = "<img class=\"xmark\" src=\"img/x-mark.png\"><img class=\"replace\" src=\"img/replace.png\"><div class=\"cell-tile cell-tile-single\">" + newTile + "</div>";
		$(".popup-wrap").hide();
		$(".popup-tiles").hide();
		// Check if we're in row 0. If yes, this is a replace.
		if (insertRow == 0 && $(".row-0 .cell-1-2").length) {
			// First delete.
			tileRemove(0);
		}
		// Insert new tile
		let selector = ".row-" + insertRow + " .cell-" + insertCell;
		// console.log(selector);
		// console.log(newTile);
		$(selector).html(newTile);
	});
	$(".tile-wrap").on("click", ".cell-empty", function() {
		insertRow = $(this).parents(".row-0").length ? 0 : 1;
		insertCell = $(this).parents(".cell-1").length ? 1 : 2;
		showTileDialog();
	});
	
	// How do we show correct tiles in logged in view? We use GET.
	function loggedinTiles() {
		var queryDict = {};
		location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
	}
});

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
		alert("Notification window not implemented yet");
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
		insertRow = 2;
		insertCell = 2;
		showTileDialog();
	}
	let tileRemove = () => {
		// For demo, only defined for timetable tile
		$(".row-1").html(`
		<div class="cell cell-1">
			<div class="cell-empty">
				<div class="empty-plus">+</div>
				<div class="empty-text">Tap to add</div>
			</div>
		</div>
		<div class="cell cell-2">
			<div class="cell-empty">
				<div class="empty-plus">+</div>
				<div class="empty-text">Tap to add</div>
			</div>
		</div>
		`);
	}
	(function() { 

		// how many milliseconds is a long press?
		let longpress = 1000;
		// holds the start time
		let start;
		let selector = ".xmark, .replace";
		
		$( selector ).on( 'mousedown', function( e ) {
			start = new Date().getTime();
			$(this).addClass("bigX");
			setTimeout(() => {
				if ($(this).hasClass("bigX")) {
					$(this).trigger("mouseup");
				}
			}, 1000);
		} );
	
		$( selector ).on( 'mouseleave', function( e ) {
			start = 0;
			$(this).removeClass("bigX");
		} );
	
		$( selector ).on( 'mouseup', function( e ) {
			$(this).removeClass("bigX");
			if ( new Date().getTime() >= ( start + longpress )  ) {
				if ($(this).hasClass("xmark") && $(this).parents(".row-1").length) {
					//remove action
					tileRemove();
				} else if ($(this).hasClass("replace") && $(this).parents(".row-0").length) {
					tileReplace();
				}
			}
		} );
	
	}());
	// ----- jQuery ends here -----
});

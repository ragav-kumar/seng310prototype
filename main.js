//For jQuery - React integration
let PubSubManager = {
		subscribers: [],
		subscribe: function(toggleCallback, insertCallback) {
			this.subscribers.push({
				toggle: toggleCallback,
				insert: insertCallback
			});
		},
		toggleState: function() {
			this.subscribers.forEach(subscriber => {
				subscriber.toggle();
			});
		},
		insertTile: function(type) {
			this.subscribers.forEach(subscriber => {
				subscriber.insert(type);
			});
		},
		showTileSelect: function() {
			$(".popup-wrap").show();
			$(".popup-tiles").show();
		},
		triggerRefresh: function() {
			$(".TileNews").tabs();
		}
	};
//------------------------------------------------------------------------------
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
	$(".TileNews").tabs();
	$(".flipswitch").flipswitch({
		texts: null,
		height: 30,
		width: 50,
		init: "right"
	});
	// Header Icons
	$("body.logged-in .email-icon").click(function (e) {
		e.preventDefault();
		alert("This would open uvic webmail in a simulated browser view.");
	});
	$("body.logged-in .notification-icon").click(function (e) {
		e.preventDefault();
		$(".popup-wrap").show();
		$(".popup-notify").show();
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
				window.location.href = "react.html";
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
	$(".tile-choice").click(function(e) {
		e.preventDefault();
		if ($(this).hasClass("disabled")) {
			return;
		}
		// Publish to react
		PubSubManager.insertTile($(this).data("tile"));
		// And hide popup
		$(".popup-wrap").hide();
		$(".popup-tiles").hide();
	});
	$(".popup-notify a").click(function(e) {
		e.preventDefault();
		$(".popup-wrap").hide();
		$(".popup-notify").hide();
	})
	$(".tile-customizer-button").click(function(e) {
		e.preventDefault();
		// Just notify React of whats happened.
		PubSubManager.toggleState();
		$("body").addClass("CustomizerOn");
		//Hide settings
		$(".popup-wrap").hide();
		$(".popup-settings").hide();
		//Swap out social media for save/cancel
		$(".customizer-off").hide();
		$(".customizer-on").show();
	});
	$(".tile-select-save, .tile-select-cancel").click(function(e) {
		$("body").removeClass("CustomizerOn");
		PubSubManager.toggleState();
		$(".customizer-off").show();
		$(".customizer-on").hide();
	});
});

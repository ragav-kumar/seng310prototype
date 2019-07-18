var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React from 'react'

var tile_sizes = {
	"news": 2,
	"timetable": 2,
	"nextbus": 2,
	"grades": 1,
	"onecard": 1,
	"registration": 1,
	"rooms": 1,
	"library": 1,
	"canteen": 1,
	"map": 1,
	"faq": 1
};
//------------------------------------------------------------------------------

var TiledContent = function (_React$Component) {
	_inherits(TiledContent, _React$Component);

	function TiledContent(props) {
		_classCallCheck(this, TiledContent);

		var _this = _possibleConstructorReturn(this, (TiledContent.__proto__ || Object.getPrototypeOf(TiledContent)).call(this, props));

		_this.state = {
			row0: ["news", null],
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null],
			custMode: false
		};
		_this.changeMode = _this.changeMode.bind(_this);
		return _this;
	}

	_createClass(TiledContent, [{
		key: "changeMode",
		value: function changeMode(row) {
			//TODO:
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				React.Fragment,
				null,
				React.createElement(Row, { rowNumber: "0", cells: this.state.row0, custMode: this.state.custMode, changeMode: this.changeMode }),
				React.createElement(Row, { rowNumber: "1", cells: this.state.row1, custMode: this.state.custMode, changeMode: this.changeMode }),
				React.createElement(Row, { rowNumber: "2", cells: this.state.row2, custMode: this.state.custMode, changeMode: this.changeMode }),
				React.createElement(Row, { rowNumber: "3", cells: this.state.row3, custMode: this.state.custMode, changeMode: this.changeMode })
			);
		}
	}]);

	return TiledContent;
}(React.Component);
//------------------------------------------------------------------------------


var Row = function (_React$Component2) {
	_inherits(Row, _React$Component2);

	function Row(props) {
		_classCallCheck(this, Row);

		var _this2 = _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).call(this, props));

		_this2.state = {
			left: props.cells[0],
			right: props.cells[1]
		};
		_this2.handleDeleteReplace = _this2.handleDeleteReplace.bind(_this2);
		_this2.handleInsert = _this2.handleInsert.bind(_this2);
		return _this2;
	}

	_createClass(Row, [{
		key: "handleDeleteReplace",
		value: function handleDeleteReplace(e, col, action) {
			this.setState(_defineProperty({}, col, null));
			if (action === "replace") {
				// Replace: Trigger Tile Selection
				this.handleInsert(col);
			}
		}
	}, {
		key: "handleInsert",
		value: function handleInsert(col) {
			this.props.changeMode(e);
		}
	}, {
		key: "render",
		value: function render() {
			var className = "Row Row-" + this.props.rowNumber;
			var cells = void 0;
			if (this.state.left && tile_sizes[this.state.left] === 2) {
				// Double cell
				cells = React.createElement(DoubleTile, { type: this.state.left, custMode: this.props.custMode });
			} else {
				cells = [];
				if (this.state.left) {
					cells.push(React.createElement(SingleTile, { key: "1", column: "1", type: this.state.left, custMode: this.props.custMode }));
				} else {
					cells.push(React.createElement(EmptyTile, { key: "1", column: "1", custMode: this.props.custMode }));
				}
				if (this.state.right) {
					cells.push(React.createElement(SingleTile, { key: "2", column: "2", type: this.state.right, custMode: this.props.custMode }));
				} else {
					cells.push(React.createElement(EmptyTile, { key: "2", column: "2", custMode: this.props.custMode }));
				}
			}
			return React.createElement(
				"div",
				{ className: className },
				cells
			);
		}
	}]);

	return Row;
}(React.Component);
//------------------------------------------------------------------------------


function SingleTile(props) {
	return React.createElement(Tile, {
		className: "Tile-" + props.column,
		type: props.type,
		custMode: props.custMode
	});
}
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return React.createElement(Tile, {
		className: "Tile-1-2",
		type: props.type,
		custMode: props.custMode
	});
}
// Always single size
function EmptyTile(props) {
	return React.createElement(Tile, {
		className: "Tile-" + props.column + " Tile-empty",
		type: "empty",
		custMode: props.custMode
	});
}
//------------------------------------------------------------------------------
/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off)
 * @param {*} props 
 */
function Tile(props) {
	var icons = null;
	var contents = null;
	if (props.custMode) {
		// Customizer mode
		var handleClick = function handleClick(e, action) {
			return props.onClick(e, props.row, props.col, action);
		};
		if (props.type !== "empty") {
			icons = React.createElement(
				React.Fragment,
				null,
				React.createElement("img", { className: "xmark", src: "img/x-mark.png", onClick: function onClick(e) {
						return handleClick(e, "delete");
					} }),
				React.createElement("img", { className: "replace", src: "img/replace.png", onClick: function onClick(e) {
						return handleClick(e, "replace");
					} })
			);
		}
		// In customizer mode, we just need to know if its empty.
		if (props.type === "empty") {
			// + sign
			contents = React.createElement(
				React.Fragment,
				null,
				React.createElement(
					"div",
					{ "class": "empty-plus" },
					"+"
				),
				React.createElement(
					"div",
					{ "class": "empty-text" },
					"Tap to add"
				)
			);
		} else {
			contents = React.createElement(
				"div",
				{ className: "Tile-inner" },
				React.createElement("img", { className: "cell-icon", src: "img/" + props.title + ".png" }),
				React.createElement(
					"h3",
					null,
					props.title
				)
			);
		}
	} else {
		// Determine what kind of tile to display.
		switch (props.type) {
			case "grades":
			case "registration":
			case "rooms":
			case "library":
			case "canteen":
			case "faq":
			case "map":
				contents = React.createElement(TileSimple, { title: props.type });
				break;
			case "news":
				contents = React.createElement(TileNews, null);
				break;
			case "timetable":
				contents = React.createElement(TileTimetable, null);
				break;
			case "nextbus":
				contents = React.createElement(TileNextBus, null);
				break;
			case "onecard":
				contents = React.createElement(TileOneCard, null);
				break;
		}
	}

	return React.createElement(
		"div",
		{ className: "Tile " + props.className },
		icons,
		contents
	);
}
//------------------------------------------------------------------------------
// Tile Types
function TileSimple(props) {
	return React.createElement(
		"div",
		{ className: "TileSimple" },
		React.createElement("img", { className: "cell-icon", src: "img/" + props.title + ".png" }),
		React.createElement(
			"h3",
			null,
			props.title
		)
	);
}
function TileNews(props) {
	return React.createElement(
		"div",
		{ className: "TileNews" },
		React.createElement(
			"ul",
			null,
			React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#news-1" },
					"Today's Events"
				)
			),
			React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#news-2" },
					"Campus News"
				)
			),
			React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#news-3" },
					"Important Dates"
				)
			)
		),
		React.createElement(
			"div",
			{ id: "news-1" },
			React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					"2019 Spring Convocation"
				),
				React.createElement(
					"li",
					null,
					"June 2019 Undergraduate Convocation Schedule"
				),
				React.createElement(
					"li",
					null,
					"Learn to Meditate"
				)
			)
		),
		React.createElement(
			"div",
			{ id: "news-2" },
			React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					"Extended Library Hours"
				),
				React.createElement(
					"li",
					null,
					"Campus closed on July 1st. Happy Canada Day!"
				),
				React.createElement(
					"li",
					null,
					"Starbucks Opening Soon"
				)
			)
		),
		React.createElement(
			"div",
			{ id: "news-3" },
			React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					"Graduation Application Deadline July 15"
				),
				React.createElement(
					"li",
					null,
					"Course Drop Deadline June 30"
				),
				React.createElement(
					"li",
					null,
					"July Courses begin on July 2"
				)
			)
		)
	);
}
function TileTimetable(props) {
	return React.createElement(
		"div",
		{ className: "TileTimetable" },
		React.createElement(
			"h3",
			null,
			"Monday July 10"
		),
		React.createElement(
			"ul",
			null,
			React.createElement(
				"li",
				null,
				"11:30am - 12:50am SENG310 ECS123"
			),
			React.createElement(
				"li",
				null,
				"1:00pm - 3:50pm CSC370 DTB143"
			)
		),
		React.createElement(
			"h3",
			null,
			"Tuesday July 11"
		),
		React.createElement(
			"ul",
			null,
			React.createElement(
				"li",
				null,
				"8:30am - 11:20am CSC462 ECS125"
			),
			React.createElement(
				"li",
				null,
				"2:30pm - 5:20pm CSC426 CLE235"
			),
			React.createElement(
				"li",
				null,
				"5:30pm - 6:50pm CSC375 HSD103"
			)
		)
	);
}
function TileNextBus(props) {
	return React.createElement(
		"div",
		{ className: "TileNextBus" },
		React.createElement(
			"h2",
			null,
			"Next Bus"
		),
		React.createElement(
			"ul",
			{ className: "bus-list" },
			React.createElement(
				"li",
				{ "data-bus": "7" },
				React.createElement("i", { className: "fas fa-star" }),
				"7 Uvic/Downton:Bay G 1:48pm"
			),
			React.createElement(
				"li",
				{ "data-bus": "11" },
				React.createElement("i", { className: "fas fa-star" }),
				"11 Tillicum Mall/Uvic: Bay H 1:58pm"
			),
			React.createElement(
				"li",
				{ "data-bus": "4" },
				React.createElement("i", { className: "far fa-star" }),
				"4 Uvic/Downtown: Bay A 1:50pm"
			),
			React.createElement(
				"li",
				{ "data-bus": "9" },
				React.createElement("i", { className: "far fa-star" }),
				"9 Royal Oak/Uvic: Bay E 1:52pm"
			)
		)
	);
}
function TileOneCard(props) {
	return React.createElement(
		"div",
		{ className: "TileOneCard" },
		React.createElement("img", { className: "cell-icon", src: "img/onecard.png" }),
		React.createElement(
			"h3",
			null,
			"OneCard"
		),
		React.createElement(
			"h2",
			null,
			"$29.37"
		)
	);
}

ReactDOM.render(React.createElement(TiledContent, null), document.querySelector('#TiledContent'));
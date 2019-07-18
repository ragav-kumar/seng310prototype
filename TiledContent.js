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

		_this.triggerCustomizerMode = function () {
			_this.setState({
				custMode: !_this.state.custMode
			});
		};

		_this.insertTile = function (type) {
			var rowName = "row" + _this.state.insertInto.row;
			rowData = _this.state[rowName];
			rowData[_this.state.insertInto.col - 1] = type;
			// Enforce a tile on a specific row+col
			_this.setState({
				rowName: rowData
			});
		};

		_this.state = {
			row0: ["news", null],
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null],
			custMode: false,
			context: props.context,
			insertInto: { row: 0, col: 1 }
		};
		_this.state.context.subscribe(_this.triggerCustomizerMode, _this.insertTile);

		_this.handleTileIcon = _this.handleTileIcon.bind(_this);
		return _this;
	}
	// The only change is to move tiles into customizer mode.


	_createClass(TiledContent, [{
		key: "handleTileIcon",
		value: function handleTileIcon(row, col, action) {
			// Identify row
			console.log({ row: row, col: col, action: action });
			var rowName = "row" + row;
			rowData = this.state[rowName];
			// Clear affected tile
			rowData[col - 1] = null;
			newState = { rowName: rowData };
			// replace check
			if (action === "replace") {
				newState = Object.assign({}, newState, {
					insertInto: { row: row, col: col }
				});
			}
			this.setState(newState);
			// Trigger customizer if necessary
			if (action === "replace") {
				this.state.context.showTileSelect();
			}
		}
	}, {
		key: "render",
		value: function render() {
			// console.log(this.state);
			return React.createElement(
				React.Fragment,
				null,
				React.createElement(Row, { rowNumber: "0",
					cells: this.state.row0,
					custMode: this.state.custMode,
					onTileIconClick: this.handleTileIcon
				}),
				React.createElement(Row, { rowNumber: "1",
					cells: this.state.row1,
					custMode: this.state.custMode,
					onTileIconClick: this.handleTileIcon
				}),
				React.createElement(Row, { rowNumber: "2",
					cells: this.state.row2,
					custMode: this.state.custMode,
					onTileIconClick: this.handleTileIcon
				}),
				React.createElement(Row, { rowNumber: "3",
					cells: this.state.row3,
					custMode: this.state.custMode,
					onTileIconClick: this.handleTileIcon
				})
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

		_this2.passAlongClick = _this2.passAlongClick.bind(_this2);
		return _this2;
	}

	_createClass(Row, [{
		key: "passAlongClick",
		value: function passAlongClick(row, col) {
			var _this3 = this;

			return function (action) {
				_this3.props.onTileIconClick(row, col, action);
			};
		}
	}, {
		key: "render",
		value: function render() {
			var left = this.props.cells[0];
			var right = this.props.cells[1];
			var className = "Row Row-" + this.props.rowNumber;
			var row = this.props.rowNumber;
			var cells = void 0;
			if (left && tile_sizes[left] === 2) {
				// Double cell
				cells = React.createElement(DoubleTile, {
					type: left,
					custMode: this.props.custMode,
					onTileIconClick: this.passAlongClick(row, 1)
				});
			} else {
				cells = React.createElement(
					React.Fragment,
					null,
					React.createElement(SingleTile, {
						column: "1",
						type: left,
						custMode: this.props.custMode,
						onTileIconClick: this.passAlongClick(row, 1)
					}),
					React.createElement(SingleTile, {
						column: "2",
						type: right,
						custMode: this.props.custMode,
						onTileIconClick: this.passAlongClick(row, 2)
					})
				);
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
	if (!props.type) {
		return React.createElement(EmptyTile, {
			className: "Tile-" + props.column,
			custMode: props.custMode,
			handleClick: props.onTileIconClick
		});
	} else {
		return React.createElement(Tile, {
			className: "Tile-" + props.column,
			type: props.type,
			custMode: props.custMode,
			onTileIconClick: props.onTileIconClick
		});
	}
}
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return React.createElement(Tile, {
		className: "Tile-1-2",
		type: props.type,
		custMode: props.custMode,
		onTileIconClick: props.onTileIconClick
	});
}
//------------------------------------------------------------------------------
function EmptyTile(props) {
	var className = "Tile-empty";
	if (props.custMode) {
		className += " Tile-customizer";
		return React.createElement(
			"div",
			{ className: "Tile Tile-empty " + props.className },
			React.createElement(
				"div",
				{ className: className, onClick: function onClick(e) {
						return props.handleClick("replace");
					} },
				React.createElement(
					"div",
					{ className: "empty-plus" },
					"+"
				),
				React.createElement(
					"div",
					{ className: "empty-text" },
					"Tap to add"
				)
			)
		);
	} else {
		return React.createElement(
			"div",
			{ className: "Tile Tile-empty " + props.className },
			React.createElement("div", { className: className })
		);
	}
}
//------------------------------------------------------------------------------
/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off)
 * @param {*} props 
 */

var Tile = function (_React$Component3) {
	_inherits(Tile, _React$Component3);

	function Tile(props) {
		_classCallCheck(this, Tile);

		var _this4 = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this, props));

		_this4.typeLabels = {
			grades: "Course Grades",
			registration: "Registration",
			rooms: "Room Bookings",
			library: "Library",
			canteen: "Canteens",
			faq: "FAQ",
			map: "Map",
			news: "Campus News",
			timetable: "Timetable",
			nextbus: "Next Bus",
			onecard: "OneCard"
		};

		_this4.state = {
			bigX: false,
			bigR: false
		};
		_this4.handleClick = _this4.handleClick.bind(_this4);
		_this4.getContent = _this4.getContent.bind(_this4);
		return _this4;
	}

	_createClass(Tile, [{
		key: "getContent",
		value: function getContent(custMode, type) {
			if (custMode) {
				var size = tile_sizes[type] == 1 ? "Tile-cust-single" : "Tile-cust-double";
				return React.createElement(
					"div",
					{ className: "Tile-customizer " + size },
					React.createElement("img", { src: "img/" + type + ".png" }),
					React.createElement(
						"h3",
						null,
						this.typeLabels[type]
					)
				);
			}
			switch (type) {
				case "grades":
				case "registration":
				case "rooms":
				case "library":
				case "canteen":
				case "faq":
				case "map":
					return React.createElement(TileSimple, { title: type });
				case "news":
					return React.createElement(TileNews, null);
				case "timetable":
					return React.createElement(TileTimetable, null);
				case "nextbus":
					return React.createElement(TileNextBus, null);
				case "onecard":
					return React.createElement(TileOneCard, null);
			}
		}
	}, {
		key: "handleClick",
		value: function handleClick(action) {
			var _this5 = this;

			if (action === "replace") {
				this.setState({ bigR: true });
			} else {
				this.setState({ bigX: true });
			}
			setTimeout(function () {
				_this5.setState({
					bigR: false,
					bigX: false
				});
				return _this5.props.onTileIconClick(action);
			}, 200);
		}
	}, {
		key: "render",
		value: function render() {
			var _this6 = this;

			var icons = null;
			if (this.props.custMode) {
				// Customizer mode
				var classX = this.state.bigX ? "xmark bigX" : "xmark";
				var classR = this.state.bigR ? "replace bigX" : "replace";
				icons = React.createElement(
					React.Fragment,
					null,
					React.createElement("img", {
						className: classX,
						src: "img/x-mark.png",
						onClick: function onClick(e) {
							return _this6.handleClick("delete");
						}
					}),
					React.createElement("img", {
						className: classR,
						src: "img/replace.png",
						onClick: function onClick(e) {
							return _this6.handleClick("replace");
						}
					})
				);
			}
			return React.createElement(
				"div",
				{ className: "Tile " + this.props.className },
				icons,
				this.getContent(this.props.custMode, this.props.type)
			);
		}
	}]);

	return Tile;
}(React.Component);
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

var TileNextBus = function (_React$Component4) {
	_inherits(TileNextBus, _React$Component4);

	function TileNextBus(props) {
		_classCallCheck(this, TileNextBus);

		var _this7 = _possibleConstructorReturn(this, (TileNextBus.__proto__ || Object.getPrototypeOf(TileNextBus)).call(this, props));

		_this7.state = {
			a: "fas",
			b: "fas",
			c: "far",
			d: "far"
		};
		_this7.handleClick = _this7.handleClick.bind(_this7);
		return _this7;
	}

	_createClass(TileNextBus, [{
		key: "handleClick",
		value: function handleClick(e, num) {
			var newColor = this.state[num] === "fas" ? "far" : "fas";
			this.setState(_defineProperty({}, num, newColor));
		}
	}, {
		key: "render",
		value: function render() {
			var _this8 = this;

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
						React.createElement("i", { className: this.state.a + " fa-star", onClick: function onClick(e) {
								return _this8.handleClick(e, "a");
							} }),
						"\xA07 Uvic/Downton:Bay G 1:48pm"
					),
					React.createElement(
						"li",
						{ "data-bus": "11" },
						React.createElement("i", { className: this.state.b + " fa-star", onClick: function onClick(e) {
								return _this8.handleClick(e, "b");
							} }),
						"\xA011 Tillicum Mall/Uvic: Bay H 1:58pm"
					),
					React.createElement(
						"li",
						{ "data-bus": "4" },
						React.createElement("i", { className: this.state.c + " fa-star", onClick: function onClick(e) {
								return _this8.handleClick(e, "c");
							} }),
						"\xA04 Uvic/Downtown: Bay A 1:50pm"
					),
					React.createElement(
						"li",
						{ "data-bus": "9" },
						React.createElement("i", { className: this.state.d + " fa-star", onClick: function onClick(e) {
								return _this8.handleClick(e, "d");
							} }),
						"\xA09 Royal Oak/Uvic: Bay E 1:52pm"
					)
				)
			);
		}
	}]);

	return TileNextBus;
}(React.Component);

ReactDOM.render(React.createElement(TiledContent, { context: PubSubManager }), document.querySelector('#TiledContent'));
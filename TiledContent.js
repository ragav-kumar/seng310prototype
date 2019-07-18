var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tile_sizes;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';

var tile_sizes = (_tile_sizes = {
	"news": 2
}, _defineProperty(_tile_sizes, "news", 2), _defineProperty(_tile_sizes, "news", 2), _defineProperty(_tile_sizes, "grades", 1), _defineProperty(_tile_sizes, "onecard", 1), _defineProperty(_tile_sizes, "registration", 1), _defineProperty(_tile_sizes, "rooms", 1), _defineProperty(_tile_sizes, "library", 1), _defineProperty(_tile_sizes, "canteen", 1), _defineProperty(_tile_sizes, "map", 1), _defineProperty(_tile_sizes, "faq", 1), _tile_sizes);

var TiledContent = function (_React$Component) {
	_inherits(TiledContent, _React$Component);

	function TiledContent(props) {
		_classCallCheck(this, TiledContent);

		var _this = _possibleConstructorReturn(this, (TiledContent.__proto__ || Object.getPrototypeOf(TiledContent)).call(this, props));

		_this.state = {
			row0: ["news", null],
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null]
		};
		_this.handleDeleteReplace = _this.handleDeleteReplace.bind(_this);
		return _this;
	}

	_createClass(TiledContent, [{
		key: "handleDeleteReplace",
		value: function handleDeleteReplace(e, row, col, action) {
			// In either case, remove tile
			var rowName = "row" + row;
			var rowState = this.state[rowName];
			rowState[col] = null;
			this.setState(_defineProperty({}, rowName, rowState));
			if (action === "replace") {// Replace: Trigger Tile Selection
				//TODO:
			}
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				React.Fragment,
				null,
				React.createElement(Row, { rowNumber: "0", cells: this.state.row0 }),
				React.createElement(Row, { rowNumber: "1", cells: this.state.row1 }),
				React.createElement(Row, { rowNumber: "2", cells: this.state.row2 }),
				React.createElement(Row, { rowNumber: "3", cells: this.state.row3 })
			);
		}
	}]);

	return TiledContent;
}(React.Component);

function Row(props) {
	var className = "Row Row-" + props.rowNumber;
	var cellNames = props.cells;
	var cells = void 0;
	if (cellNames[0] && tile_sizes[cellNames[0]] === 2) {
		// Double cell
		cells = React.createElement(DoubleTile, { type: cellNames[0] });
	} else {
		cells = React.createElement(
			React.Fragment,
			null,
			cellNames[0] ? React.createElement(SingleTile, { column: "1", type: cellNames[0] }) : React.createElement(EmptyTile, { column: "1" }),
			cellNames[1] ? React.createElement(SingleTile, { column: "2", type: cellNames[1] }) : React.createElement(EmptyTile, { column: "2" })
		);
	}
	return React.createElement(
		"div",
		{ className: className },
		cells
	);
}
function TileModifyIcon(props) {
	var className = "xmark";
	if (props.clicked) {
		className += " bigX";
	}
	var src = props.isReplace ? "img/replace.png" : "img/x-mark.png";
	var action = props.isReplace ? "replace" : "delete";
	return React.createElement("img", {
		className: className,
		src: src,
		onClick: function onClick(e) {
			return props.onClick(e, props.row, props.col, action);
		}
	});
}

/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off)
 * @param {*} props 
 */
function Tile(props) {
	var className = "Tile " + props.className;
	var isEmpty = props.type === "empty";
	return React.createElement(
		"div",
		{ className: className },
		isEmpty ? null : React.createElement("img", { className: "xmark", src: "img/x-mark.png", alt: "xmark" }),
		isEmpty ? null : React.createElement("img", { className: "replace", src: "img/replace.png", alt: "replace" }),
		props.children
	);
}

function SingleTile(props) {
	return React.createElement(Tile, {
		className: "Tile-" + props.column,
		type: props.type
	});
}
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return React.createElement(Tile, {
		className: "Tile-1-2",
		type: props.type
	});
}
// Always single size
function EmptyTile(props) {
	return React.createElement(Tile, {
		className: "Tile-" + props.column,
		type: "empty"
	});
}
//------------------------------------------------------------------------------
// Tile Types


ReactDOM.render(React.createElement(TiledContent, null), document.querySelector('#TiledContent'));
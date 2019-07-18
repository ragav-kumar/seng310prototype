import React from 'react'

const tile_sizes = {
	"news": 2,
	"news": 2,
	"news": 2,
	"grades": 1,
	"onecard": 1,
	"registration": 1,
	"rooms": 1,
	"library": 1,
	"canteen": 1,
	"map": 1,
	"faq": 1,
};

class TiledContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			row0: ["news", null],
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null],
		};
		this.handleDeleteReplace = this.handleDeleteReplace.bind(this);
	}
	handleDeleteReplace(e, row, col, action) {
		// In either case, remove tile
		const rowName = "row" + row
		let rowState = this.state[rowName];
		rowState[col] = null;
		this.setState({
			[rowName]: rowState
		});
		if (action === "replace") { // Replace: Trigger Tile Selection
			//TODO:
		}
	}
	render() {
		return (
			<React.Fragment>
				<Row rowNumber="0" cells={this.state.row0} />
				<Row rowNumber="1" cells={this.state.row1} />
				<Row rowNumber="2" cells={this.state.row2} />
				<Row rowNumber="3" cells={this.state.row3} />
			</React.Fragment>
		);
	}
}

function Row(props) {
	const className = "Row Row-" + props.rowNumber;
	const cellNames = props.cells;
	let cells;
	if (cellNames[0] && tile_sizes[cellNames[0]] === 2) { // Double cell
		cells = (<DoubleTile type={cellNames[0]} />);
	} else {
		cells = (
			<React.Fragment>
				{cellNames[0] ? <SingleTile column="1" type={cellNames[0]} /> : <EmptyTile column="1" />}
				{cellNames[1] ? <SingleTile column="2" type={cellNames[1]} /> : <EmptyTile column="2" />}
			</React.Fragment>
		);
	}
	return (
		<div className={className}>
			{cells}
		</div>
	);
}
function TileModifyIcon(props) {
	let className = "xmark";
	if (props.clicked) {
		className += " bigX";
	}
	const src = props.isReplace ? "img/replace.png" : "img/x-mark.png";
	const action = props.isReplace ? "replace" : "delete";
	return (
		<img
			className={className}
			src={src}
			onClick={(e) => props.onClick(e, props.row, props.col, action)}
		/>
	);
}


/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off)
 * @param {*} props 
 */
function Tile (props) {
	const className = "Tile " + props.className;
	const isEmpty = props.type === "empty"
	return (
		<div className={className}>
			{isEmpty ? null : <img className="xmark" src="img/x-mark.png" alt="xmark" />}
			{isEmpty ? null : <img className="replace" src="img/replace.png" alt="replace" />}
			{props.children}
		</div>
	);
}

function SingleTile(props) {
	return (
		<Tile
			className={"Tile-" + props.column}
			type={props.type}
		/>
	);
}
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return (
		<Tile
			className={"Tile-1-2"}
			type={props.type}
		/>
	);
}
// Always single size
function EmptyTile(props) {
	return (
		<Tile
			className={"Tile-" + props.column}
			type="empty"
		/>
	);
}
//------------------------------------------------------------------------------
// Tile Types


ReactDOM.render(<TiledContent />, document.querySelector('#TiledContent'));
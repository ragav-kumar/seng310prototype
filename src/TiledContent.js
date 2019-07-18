// import React from 'react'

const tile_sizes = {
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
	"faq": 1,
};
//------------------------------------------------------------------------------
class TiledContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			row0: ["news", null],
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null],
			custMode: false
		};
		this.changeMode = this.changeMode.bind(this);
	}
	changeMode(row, ) {
		//TODO:
	}
	render() {
		return (
			<React.Fragment>
				<Row rowNumber="0" cells={this.state.row0} custMode={this.state.custMode} changeMode={this.changeMode}/>
				<Row rowNumber="1" cells={this.state.row1} custMode={this.state.custMode} changeMode={this.changeMode}/>
				<Row rowNumber="2" cells={this.state.row2} custMode={this.state.custMode} changeMode={this.changeMode}/>
				<Row rowNumber="3" cells={this.state.row3} custMode={this.state.custMode} changeMode={this.changeMode}/>
			</React.Fragment>
		);
	}
}
//------------------------------------------------------------------------------
class Row extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			left: props.cells[0],
			right: props.cells[1],
		}
		this.handleDeleteReplace = this.handleDeleteReplace.bind(this);
		this.handleInsert = this.handleInsert.bind(this);
	}
	handleDeleteReplace(e, col, action) {
		this.setState({
			[col]: null
		});
		if (action === "replace") { // Replace: Trigger Tile Selection
			this.handleInsert(col);
		}
	}
	handleInsert(col) {
		this.props.changeMode(e);
	}
	render() {
		const className = "Row Row-" + this.props.rowNumber;
		let cells;
		if (this.state.left && tile_sizes[this.state.left] === 2) { // Double cell
			cells = <DoubleTile type={this.state.left} custMode={this.props.custMode}/>;
		} else {
			cells = [];
			if (this.state.left) {
				cells.push(<SingleTile key="1" column="1" type={this.state.left} custMode={this.props.custMode}/>);
			} else {
				cells.push(<EmptyTile key="1" column="1" custMode={this.props.custMode}/>);
			}
			if (this.state.right) {
				cells.push(<SingleTile key="2" column="2" type={this.state.right} custMode={this.props.custMode}/>);
			} else {
				cells.push(<EmptyTile key="2" column="2" custMode={this.props.custMode}/>);
			}
		}
		return (
			<div className={className}>
				{cells}
			</div>
		);
	}
}
//------------------------------------------------------------------------------
function SingleTile(props) {
	return (
		<Tile
			className={"Tile-" + props.column}
			type={props.type}
			custMode={props.custMode}
		/>
	);
}
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return (
		<Tile
			className={"Tile-1-2"}
			type={props.type}
			custMode={props.custMode}
		/>
	);
}
// Always single size
function EmptyTile(props) {
	return (
		<Tile
			className={"Tile-" + props.column + " Tile-empty"}
			type="empty"
			custMode={props.custMode}
		/>
	);
}
//------------------------------------------------------------------------------
/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off)
 * @param {*} props 
 */
function Tile (props) {
	let icons = null;
	let contents = null;
	if (props.custMode) { // Customizer mode
		const handleClick = (e, action) => props.onClick(e, props.row, props.col, action);
		if (props.type !== "empty") {
			icons = (
				<React.Fragment>
					<img className="xmark" src="img/x-mark.png" onClick={e => handleClick(e, "delete")}/>
					<img className="replace" src="img/replace.png" onClick={e => handleClick(e, "replace")}/>
				</React.Fragment>
			);
		}
		// In customizer mode, we just need to know if its empty.
		if (props.type === "empty") { // + sign
			contents = (
				<React.Fragment>
					<div class="empty-plus">+</div>
					<div class="empty-text">Tap to add</div>
				</React.Fragment>
			);
		} else {
			contents = (
				<div className="Tile-inner">
					<img className="cell-icon" src={"img/" + props.title + ".png"} />
					<h3>{props.title}</h3>
				</div>
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
				contents = <TileSimple title={props.type} />;
				break;
			case "news":
				contents = <TileNews />;
				break;
			case "timetable":
				contents = <TileTimetable />;
				break;
			case "nextbus":
				contents = <TileNextBus />;
				break;
			case "onecard":
				contents = <TileOneCard />
				break;
		}
	}
	
	return (
		<div className={"Tile " + props.className}>
			{icons}
			{contents}
		</div>
	);
}
//------------------------------------------------------------------------------
// Tile Types
function TileSimple(props) {
	return(
		<div className="TileSimple">
			<img className="cell-icon" src={"img/" + props.title + ".png"} />
			<h3>{props.title}</h3>
		</div>
	);
}
function TileNews(props) {
	return(
		<div className="TileNews">
			{/* Tabs */}
			<ul>
				<li><a href="#news-1">Today's Events</a></li>
				<li><a href="#news-2">Campus News</a></li>
				<li><a href="#news-3">Important Dates</a></li>
			</ul>
			{/* Content */}
			<div id="news-1">
				<ul>
					<li>2019 Spring Convocation</li>
					<li>June 2019 Undergraduate Convocation Schedule</li>
					<li>Learn to Meditate</li>
				</ul>
			</div>
			<div id="news-2">
				<ul>
					<li>Extended Library Hours</li>
					<li>Campus closed on July 1st. Happy Canada Day!</li>
					<li>Starbucks Opening Soon</li>
				</ul>
			</div>
			<div id="news-3">
				<ul>
					<li>Graduation Application Deadline July 15</li>
					<li>Course Drop Deadline June 30</li>
					<li>July Courses begin on July 2</li>
				</ul>
			</div>
		</div>
	);
}
function TileTimetable(props) {
	return(
		<div className="TileTimetable">
			<h3>Monday July 10</h3>
			<ul>
				<li>11:30am - 12:50am SENG310 ECS123</li>
				<li>1:00pm - 3:50pm CSC370 DTB143</li>
			</ul>
			<h3>Tuesday July 11</h3>
			<ul>
				<li>8:30am - 11:20am CSC462 ECS125</li>
				<li>2:30pm - 5:20pm CSC426 CLE235</li>
				<li>5:30pm - 6:50pm CSC375 HSD103</li>
			</ul>
		</div>
	);
}
function TileNextBus(props) {
	return(
		<div className="TileNextBus">
			<h2>Next Bus</h2>
			<ul className="bus-list">
				<li data-bus="7"><i className="fas fa-star"></i>7 Uvic/Downton:Bay G 1:48pm</li>
				<li data-bus="11"><i className="fas fa-star"></i>11 Tillicum Mall/Uvic: Bay H 1:58pm</li>
				<li data-bus="4"><i className="far fa-star"></i>4 Uvic/Downtown: Bay A 1:50pm</li>
				<li data-bus="9"><i className="far fa-star"></i>9 Royal Oak/Uvic: Bay E 1:52pm</li>
			</ul>
		</div>
	);
}
function TileOneCard(props) {
	return(
		<div className="TileOneCard">
			<img className="cell-icon" src="img/onecard.png" />
			<h3>OneCard</h3>
			<h2>$29.37</h2>
		</div>
	);
}

ReactDOM.render(<TiledContent />, document.querySelector('#TiledContent'));
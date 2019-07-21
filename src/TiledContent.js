// import React from 'react'

// Each tile can be either a single (one tile wide) or a double (2 wide)
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
/**
 * Root Component. I'm only using React for the tiled content area; everything
 * else was built in straight HTML and jQuery. Mostly because I didn't know
 * React at the time.
 */
class TiledContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			row0: ["news", null], // First 4 states are tiles in a given row
			row1: ["timetable", null],
			row2: ["onecard", "registration"],
			row3: ["nextbus", null],
			custMode: false, // Customizer Mode on / off
			context: props.context, // Used to pass in a manager to talk with jQuery (see below)
			insertInto: { row: 0, col: 1 }, // Coords to insert new tile into
		};
		/* This application was initially built in HTML + jQuery. Then I learned React, and realized
		that the tiled content area (which was only partially implemented at this point) would be
		vastly easier to implement in React. Given that I had a grand total of one day to implement
		it in React, I decided to ONLY implement that part of the page in React, and leave the rest as is.
		Thus, React must be able to talk to the old jQuery code to interface with popupo menus.
		I do this with a Publish / Subscribe Manager (PubSubManager in main.js) passed in via
		React's context.
		*/
		this.state.context.subscribe(this.triggerCustomizerMode, this.insertTile);
		
		this.handleTileIcon = this.handleTileIcon.bind(this);
	}
	// Customizer mode is triggered from jQuery side
	triggerCustomizerMode = () => {
		this.setState({
			custMode: !this.state.custMode
		});
	}
	// A popup on jQuery side will notify what tile I should insert (type)
	insertTile = (type) => {
		const rowName = "row" + this.state.insertInto.row;
		rowData = this.state[rowName];
		rowData[this.state.insertInto.col-1] = type;
		// Enforce a tile on a specific row+col
		this.setState({
			rowName: rowData
		});
	}
	/**
	 * Used to handle the corner icons on the tiles
	 * @param {int} row 
	 * @param {int} col 
	 * @param {string} action "replace" or "delete"
	 */
	handleTileIcon(row, col, action) {
		// Identify row
		console.log({row, col, action});
		const rowName = "row" + row;
		rowData = this.state[rowName];
		// Clear affected tile
		rowData[col-1] = null;
		newState = { rowName: rowData };
		// replace check
		if (action === "replace") {
			newState = Object.assign({}, newState, {
				insertInto: {row: row, col: col}
			});
		}
		this.setState(newState);
		// Trigger customizer if necessary
		if (action === "replace") {
			this.state.context.showTileSelect();
		}
	}
	render() {
		// console.log(this.state);
		return (
			<React.Fragment>
				<Row rowNumber="0"
					cells={this.state.row0}
					custMode={this.state.custMode}
					onTileIconClick={this.handleTileIcon}
				/>
				<Row rowNumber="1"
					cells={this.state.row1}
					custMode={this.state.custMode}
					onTileIconClick={this.handleTileIcon}
				/>
				<Row rowNumber="2"
					cells={this.state.row2}
					custMode={this.state.custMode}
					onTileIconClick={this.handleTileIcon}
				/>
				<Row rowNumber="3"
					cells={this.state.row3}
					custMode={this.state.custMode}
					onTileIconClick={this.handleTileIcon}
				/>
			</React.Fragment>
		);
	}
}
//------------------------------------------------------------------------------
/**
 * The row is just one of many intermediate components. Biggest contribution is
 * to indicate which row + column a TileIconClick action is sent from. IOW this 
 * is where tile location is defined.
 */
class Row extends React.Component {
	constructor(props) {
		super(props);
		this.passAlongClick = this.passAlongClick.bind(this);
	}
	passAlongClick(row, col) { // Insert coord data into the call passed up the tree
		return (action) => {
			this.props.onTileIconClick(row, col, action);
		}
	}
	
	render() {
		const left = this.props.cells[0];
		const right = this.props.cells[1];
		const className = "Row Row-" + this.props.rowNumber;
		const row = this.props.rowNumber;
		let cells;
		if (left && tile_sizes[left] === 2) { // Double Tile
			cells = (
				<DoubleTile
					type={left}
					custMode={this.props.custMode}
					onTileIconClick={this.passAlongClick(row, 1)}
				/>
			);
		} else { // Single Tile
			cells = (
				<React.Fragment>
					<SingleTile
						column="1"
						type={left}
						custMode={this.props.custMode}
						onTileIconClick={this.passAlongClick(row, 1)}
					/>
					<SingleTile
						column="2"
						type={right}
						custMode={this.props.custMode}
						onTileIconClick={this.passAlongClick(row, 2)}
					/>
				</React.Fragment>
			);
		}
		return (
			<div className={className}>
				{cells}
			</div>
		);
	}
}
//------------------------------------------------------------------------------
/**
 * Single Tiles can be empty! Anyway, this is just a pass through component
 * @param {*} props 
 */
function SingleTile(props) {
	if (!props.type) {
		return (
			<EmptyTile
				className={"Tile-" + props.column}
				custMode={props.custMode}
				handleClick={props.onTileIconClick}
			/>
		);
	} else {
		return (
			<Tile
				className={"Tile-" + props.column}
				type={props.type}
				custMode={props.custMode}
				onTileIconClick={props.onTileIconClick}
			/>
		);
	}
}
/**
 * Nothing fancy, a pass through component for Double-size tiles. I only distinguished
 * these two for the classes, TBH.
 * @param {*} props 
 */
function DoubleTile(props) {
	//Double Tiles cannot be empty, so no check
	return (
		<Tile
			className={"Tile-1-2"}
			type={props.type}
			custMode={props.custMode}
			onTileIconClick={props.onTileIconClick}
		/>
	);
}
//------------------------------------------------------------------------------
/**
 * EmptyTile is either empty (custMode: OFF) or has a plus sign (custMode: ON).
 * In the latter case, it can trigger insert events (which are piped to jQuery)
 * @param {*} props 
 */
function EmptyTile(props) {
	let className = "Tile-empty"
	if (props.custMode) {
		className += " Tile-customizer"
		return (
			<div className={"Tile Tile-empty " + props.className}>
				<div className={className} onClick={e => props.handleClick("replace")}>
					<div className="empty-plus">+</div>
					<div className="empty-text">Tap to add</div>
				</div>
			</div>
		);
	} else {
		return <div className={"Tile Tile-empty " + props.className}><div className={className}></div></div>;
	}
}
//------------------------------------------------------------------------------
/**
 * Renders a generic tile. This one's not actually visible outside.
 * Tiles vary based on their state (customizer on or off). This component is only
 * used if the Tile contains content; empty tiles are handed off to EmptyTile instead
 * @param {*} props 
 */
class Tile extends React.Component {
	constructor(props) {
		super(props);
		// bigX and bigR are used for the "growing" animation when the corner
		// icons are clicked.
		this.state = {
			bigX: false,
			bigR: false
		}
		this.handleClick = this.handleClick.bind(this);
		this.getContent = this.getContent.bind(this);
	}
	typeLabels = { // About what it looks like, though perhaps a bit buried.
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
		onecard: "OneCard",
	}
	getContent(custMode, type) {
		// in Customizer mode, tile content is not shown. Instead, we are limited
		// to only an icon and title text.
		if (custMode) {
			const size = tile_sizes[type] == 1 ? "Tile-cust-single" : "Tile-cust-double";
			return (
				<div className={"Tile-customizer " + size}>
					<img src={"img/" + type + ".png"} />
					<h3>{this.typeLabels[type]}</h3>
				</div>
			);
		}
		// Outside customizer mode... I hand off to subcomponents as appropriate.
		switch (type) {
			case "grades":
			case "registration":
			case "rooms":
			case "library":
			case "canteen":
			case "faq":
			case "map":
				return <TileSimple title={type} />;
			case "news":
				return <TileNews />;
			case "timetable":
				return <TileTimetable />;
			case "nextbus":
				return <TileNextBus />;
			case "onecard":
				return <TileOneCard />;
		}
	}
	/**
	 * Handles clicks! Passes things up the hierarchy after doing the icon animation thing.
	 * @param {string} action "replace" or "delete"
	 */
	handleClick(action) {
		if (action === "replace") {
			this.setState({ bigR: true });
		} else {
			this.setState({ bigX: true });
		}
		// Basically, the icon grows over 0.2s upon click. Makes it clear what happened.
		setTimeout(() => {
			this.setState({
				bigR: false,
				bigX: false
			});
			return this.props.onTileIconClick(action);
		}, 200);
	}

	render() {
		let icons = null;
		// Since we use getContent(), we only need to worry about rendering the icons.
		if (this.props.custMode) { // Customizer mode
			const classX = this.state.bigX ? "xmark bigX" : "xmark";
			const classR = this.state.bigR ? "replace bigX" : "replace";
			icons = (
				<React.Fragment>
					<img
						className={classX}
						src="img/x-mark.png"
						onClick={e => this.handleClick("delete")}
					/>
					<img
						className={classR}
						src="img/replace.png"
						onClick={e => this.handleClick("replace")}
					/>
				</React.Fragment>
			);
		}
		return (
			<div className={"Tile " + this.props.className}>
				{icons}
				{this.getContent(this.props.custMode, this.props.type)}
			</div>
		);
	}
}
//------------------------------------------------------------------------------
// Tile Types
//------------------------------------------------------------------------------
// Icon and image, thassall.
function TileSimple(props) {
	return(
		<div className="TileSimple">
			<img className="cell-icon" src={"img/" + props.title + ".png"} />
			<h3>{props.title}</h3>
		</div>
	);
}
/**
 * This ones a bit finicky. It's tabbed content, and my attempts to integrate a react
 * library hit face first the issues I was having with babel 6 (babel 7, I couldn't get working
 * at the time). So I left them with the jQuery-ui tabs, but that is problematic since those onluy
 * render on initial page load...
 * @param {*} props 
 */
function TileNews(props) {
	return(
		<div className="TileNews">
			{/* Tabs */}**
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
function TileOneCard(props) {
	return(
		<div className="TileOneCard">
			<img className="cell-icon" src="img/onecard.png" />
			<h3>OneCard</h3>
			<h2>$29.37</h2>
		</div>
	);
}
/**
 * Implemented interactivity in the form of the favourite stars. As with other things,
 * I ended up having to leave it at "functional-ish"; I should get back and make these sort themselves into two sublists.
 */
class TileNextBus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			a: "fas",
			b: "fas",
			c: "far",
			d: "far",
		}
		this.handleClick = this.handleClick.bind(this);
	}
	/**
	 * Used the solid vs empty stars from font awesome for the effect here
	 * @param {object} e 
	 * @param {int} num Bus number (state name)
	 */
	handleClick(e, num) {
		const newColor = this.state[num] === "fas" ? "far" : "fas";
		this.setState({
			[num]: newColor
		});
	}
	render() {
		return(
			<div className="TileNextBus">
				<h2>Next Bus</h2>
				<ul className="bus-list">
					<li data-bus="7">
						<i className={this.state.a + " fa-star"} onClick={(e) => this.handleClick(e, "a")}></i>
						&nbsp;7 Uvic/Downton:Bay G 1:48pm
					</li>
					<li data-bus="11">
						<i className={this.state.b + " fa-star"} onClick={(e) => this.handleClick(e, "b")}></i>
						&nbsp;11 Tillicum Mall/Uvic: Bay H 1:58pm
						</li>
					<li data-bus="4">
						<i className={this.state.c + " fa-star"} onClick={(e) => this.handleClick(e, "c")}></i>
						&nbsp;4 Uvic/Downtown: Bay A 1:50pm
					</li>
					<li data-bus="9">
						<i className={this.state.d + " fa-star"} onClick={(e) => this.handleClick(e, "d")}></i>
						&nbsp;9 Royal Oak/Uvic: Bay E 1:52pm
					</li>
				</ul>
			</div>
		);
	}
}

ReactDOM.render(React.createElement(TiledContent, { context: PubSubManager }), document.querySelector('#TiledContent'));
(d => {

// Set up a tournament player
class Player {
	constructor(name) {
		this.name = name;
		this.isWinner = false;
	}
}

// Set up the tournament
class Tournament {
	constructor() {
		this.players = [];
		this.pairs = [];
	}

	playerExists(name) {
		// Check whether player already exists before adding to the tournament
		let exists = false;
		this.players.map(player => {
			if (player.name === name) {
				exists = true;
			}
		});
		return exists;
	} 

	addPlayer(newPlayer) {
		this.players.push(newPlayer);
	}

	size() {
		return this.players.length;
	}

	noLosers() {
		// Set players to be winners if there are only two in the tournament
		this.players.map(player => player.isWinner = true);
	}

	generateFinal() {
		// Return the finalists
		let finalPlayers = this.players.filter(player => player.isWinner === true);
		finalPlayers = finalPlayers[0].name + " vs " + finalPlayers[1].name;
		return finalPlayers;
	}

	randomisePlayers() {
		// Randomise the players at the beginning of each round so that byes are fairly shared
		let randomisedPlayers = [];
		let input = this.players.slice();
		let len = input.length;
		for (let i = 0; i < len; i += 1) {
			console.log(i);
			let rand = Math.floor(Math.random() * Math.floor(input.length));
			randomisedPlayers.push(input[rand]);
			let removed = input.splice(rand, 1);
		}
		this.players = randomisedPlayers;
		console.log(this.players);
	}

	createPairs(arr) {
		// Create the pairs for each match
		this.pairs = [];
		if (arr === "winners") {
			let winners = this.players.filter(player => player.isWinner);
			for (let i = 0; i < winners.length; i+=2) {
				(winners[i+1]) ? this.pairs.push({player1: winners[i].name, player2: winners[i+1].name}) : this.pairs.push({player1: winners[i].name, player2: "BYE"});
			}
		} else {
			// If no rounds have been played yet, use all the players
			for (let i = 0; i < this.players.length; i+=2) {
				(this.players[i+1]) ? this.pairs.push({player1: this.players[i].name, player2: this.players[i+1].name}) : this.pairs.push({player1: this.players[i].name, player2: "BYE"});
			}
		}
	}

	generateMatches() {
		// Generate fragment to print out the matches
		let section = d.createElement("section");
		this.pairs.map((match, index) => {
			let div = d.createElement("div");
			let h3 = d.createElement("h3");
			h3.textContent = "Match " + (index + 1);
			div.appendChild(h3);
			let p = d.createElement("p");
			p.textContent = match.player1;
			
			// Set a player with a bye to be a winner
			if (match.player2 === "BYE") {
				p.classList.add("winner-highlight");
				this.players.map(player => player.name === match.player1 ? player.isWinner = true : player);
			}
			div.appendChild(p);
			p = d.createElement("p");
			p.textContent = "vs";
			div.appendChild(p);
			p = d.createElement("p");
			p.textContent = match.player2;
			div.appendChild(p);
			section.appendChild(div);
		});
		return section;
	}

	winnerReset() {
		// Set the winner status to false, as the round hasn't been played yet.
		this.players.map(player => player.isWinner = false);
	}

	matchWinner(winnerName) {
		let domDirection = "next";
		let loserName = "";

		// Get DOM location from the clicked element to manage highlighting on pairs
		this.pairs.map(pair => {
			if (pair.player1 === winnerName) {
				loserName = pair.player2;

			} else if (pair.player2 === winnerName) {
				loserName = pair.player1;
				domDirection = "previous";
			}		
		});

		// Make sure only one player in each pair is the winner
		this.players.map(player => {
			if (player.name === winnerName) {
				player.isWinner = true;
			}
			if (player.name === loserName) {
				player.isWinner = false;
			}
		});
		return domDirection;
	}

	findWinners() {
		let winners = this.players.filter(player => player.isWinner);
		let nextRound = false;
		
		// Error if not all winners have been selected
		if (winners.length < this.pairs.length) {
			d.getElementById("draw-error").textContent = "Please select a winner's name for each match";

		// Go to final if there are 2 winners
		} else if (winners.length <= 2) {			
			d.getElementById("next-round").classList.add("hidden");
			let finalists = this.generateFinal();
			printFinal(finalists);
		} else {
			nextRound = true;
		}
		return nextRound;
	}

	reset() {
		this.pairs = [];
		this.players = [];
	}

}

// Set initial variables
let input = d.getElementById("input");
let inputError = d.getElementById("input-error");
let output = d.getElementById("players-list");
let draw = d.getElementById("draw");
let drawList = d.getElementById("draw-list");
let nextRound = d.getElementById("next-round");
let roundButton = d.getElementById("round-button");
let final = d.getElementById("final");
let finalList = d.getElementById("final-list");

let tournament = new Tournament();

// Gather user input and add names to players array
let addPlayerClicked = () => {
	inputError.textContent = "";
	let name = input.value;

	// Validate input.  Don't accept blank values as players
	if (name.length < 1) {
		inputError.textContent = "Please enter the player's name";
	} else {
		
		// Don't accept players with the same name as an existing player
		let exists = tournament.playerExists(name);
		if (exists) {
			inputError.textContent = "This player is already in the tournament, please use a different name";
		
		// Otherwise, add the player to the tournament
		} else {
			let newPlayer = new Player(name);
			tournament.addPlayer(newPlayer);
			let li = d.createElement("li");
			li.textContent = name;
			output.appendChild(li);
			input.value = "";
		}
	}
	input.focus();
}

// Create the initial Tournament draw
let createTournament = () => {

	// Check there are at least 2 players
	let tournamentSize = tournament.size();
	if (tournamentSize < 2) {
		inputError.textContent = "Enter at least 2 players to make a tournament";
		return;
	}

	// Go straight to the final if only 2 players
	d.getElementById("add-players").classList.add("hidden");
	if (tournamentSize == 2) {
		let finalists = tournament.noLosers();
		finalists = tournament.generateFinal();
		printFinal(finalists);
	} else {
		tournament.randomisePlayers();

		// Print the draw
		draw.classList.remove("hidden");
		tournament.createPairs();
		printDraw();
		nextRound.classList.remove("hidden");
	}
}

// Print the matches
let printDraw = () => {
	tournament.winnerReset();
	let section = tournament.generateMatches();
	drawList.appendChild(section);
}

// Handle a player in the draw being selected as a winner
let winnerClicked = e => {
	let winner = e.target;
	let winnerName = winner.textContent;

	// Ignore the click unless a player was selected
	let exists = tournament.playerExists(winnerName);
	if (!exists) {
    	return;  
	}

	// Manage the visual highlighting
	let domDirection = tournament.matchWinner(winnerName);
	winner.classList.add("winner-highlight");
	domDirection === "next" ? winner.nextElementSibling.nextElementSibling.classList.remove("winner-highlight") : winner.previousElementSibling.previousElementSibling.classList.remove("winner-highlight");
}

// Generate the next round from the players where isWinner is true
let roundClicked = () => {
	let nextRound = tournament.findWinners();
	if (nextRound) {
		let h2 = d.createElement("h2");
		h2.textContent = "Next round";
		d.getElementById("draw-error").textContent = "Select each winner's name to progress to the next round";
		drawList.appendChild(h2);
		tournament.randomisePlayers();
		tournament.createPairs("winners");
		printDraw();
		d.getElementById("next-round").classList.remove("hidden");
	}
}

// Display the finalists
let printFinal = (finalists) => {
	final.classList.remove("hidden");
	let div = d.createElement("div");
	let p = d.createElement("p");
	p.textContent = finalists;
	div.appendChild(p);
	finalList.appendChild(div);
}

// Reset values when the new tournament button is clicked
let newTournament = () => {
	tournament.reset();
	d.getElementById("add-players").classList.remove("hidden");
	final.classList.add("hidden");
	draw.classList.add("hidden");
	output.textContent = "";
	drawList.textContent = "";
	inputError.textContent = "";
	finalList.textContent = "";
}

// Event handlers for buttons and winner selections
d.getElementById("input-button").addEventListener("click", addPlayerClicked);
d.getElementById("create-tournament").addEventListener("click", createTournament);
drawList.addEventListener("click", winnerClicked);
roundButton.addEventListener("click", roundClicked);
d.getElementById("new-button").addEventListener("click", newTournament);

})(document);

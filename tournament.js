(d => {

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

let players = [];
let pairs = [];

// Gather user input and add names to players array
let addPlayerClicked = () => {
	inputError.textContent = "";
	let name = input.value;

	// Validate input.  Don't accept blank values as players
	if (name.length < 1) {
		inputError.textContent = "Please enter the player's name";
	} else {
		// Don't accept players with the same name as an existing player
		let exists = false;
		players.map(player => {
			if (player.name === name) {
				inputError.textContent = "This player is already in the tournament, please use a different name";
				exists = true;
			}
		});

		// Otherwise, add the player to the tournament
		if (!exists) {
			players.push({name: name, isWinner: false});
			let li = d.createElement("li");
			li.textContent = name;
			output.appendChild(li);
			input.value = "";
		}
	}
	input.focus();
}

// Return randomised players from the passed array
let randomisePlayers = (input, length) => {
	let randomisedPlayers = [];
	for (let i = 0; i < length; i += 1) {
		let rand = Math.floor(Math.random() * Math.floor(input.length));
		randomisedPlayers.push(input[rand]);
		let removed = input.splice(rand, 1);
	}
	return randomisedPlayers;
}

// Create the initial Tournament draw
let createTournament = () => {

	// Check there are at least 2 players
	if (players.length < 2) {
		inputError.textContent = "Enter at least 2 players to make a tournament";
		return;
	}

	// Go straight to the final if only 2 players
	d.getElementById("add-players").classList.add("hidden");
	if (players.length == 2) {
		printFinal(players);
	} else {

		// Randomise the players
		players = randomisePlayers(players, players.length);
		console.log(players);
		draw.classList.remove("hidden");

		// Print the draw
		printDraw(players);
		nextRound.classList.remove("hidden");
	}
}

// Print the draw
let printDraw = (players) => {

	// Create the match pairings
	pairs = [];
	for (let i = 0; i < players.length; i+=2) {
		(players[i+1]) ? pairs.push({player1: players[i].name, player2: players[i+1].name}) : pairs.push({player1: players[i].name, player2: "BYE"});
	}

	// Print the matches
	let section = d.createElement("section");
	pairs.map((match, index) => {
		let div = d.createElement("div");
		let h3 = d.createElement("h3");
		h3.textContent = "Match " + (index + 1);
		div.appendChild(h3);
		let p = d.createElement("p");
		p.textContent = match.player1;
		(match.player2 === "BYE") ? p.classList.add("winner-highlight") : null;
		div.appendChild(p);
		p = d.createElement("p");
		p.textContent = "vs";
		div.appendChild(p);
		p = d.createElement("p");
		p.textContent = match.player2;
		div.appendChild(p);
		section.appendChild(div);
	});
	drawList.appendChild(section);

	// Set the winner status to false, as the round hasn't been played yet, unless the player has a bye.
	players.map(player => player.isWinner = false);
	if (players.length % 2 === 1) {
		players[players.length-1].isWinner = true;
	}
}

// Handle a player in the draw being selected as a winner
let winnerClicked = e => {
	let winner = e.target;
	let winnerName = winner.textContent;

	// Ignore the click unless a player was selected
	let validPlayer = players.filter(player => player.name === winnerName);
	if (validPlayer.length === 0) {
    	return;  
	}

	// Get loser name and DOM location from the clicked element
	let loserName = "";
	let domDirection = "next";
	pairs.map(pair => {
		if (pair.player1 === winnerName) {
			loserName = pair.player2;

		} else if (pair.player2 === winnerName) {
			loserName = pair.player1;
			domDirection = "previous";
		}		
	});

	// Make sure only one player in each pair is the winner
	players.map(player => {
		if (player.name === winnerName) {
			player.isWinner = true;
		}
		if (player.name === loserName) {
			player.isWinner = false;
		}
	});

	// Manage the visual highlighting
	winner.classList.add("winner-highlight");
	domDirection === "next" ? winner.nextElementSibling.nextElementSibling.classList.remove("winner-highlight") : winner.previousElementSibling.previousElementSibling.classList.remove("winner-highlight");

	console.log(players);
}

// Generate the next round from the players where isWinner is true
let roundClicked = () => {
	let winners = players.filter(player => player.isWinner);

// Check all the matches have a winner selected
	if (winners.length < pairs.length) {
		d.getElementById("draw-error").textContent = "Please select a winner for each match";

// Print the final if only two players left
	} else if (winners.length <= 2) {
		nextRound.classList.add("hidden");
		printFinal(winners);

// Otherwise generate the next round
	} else {
		let h2 = d.createElement("h2");
		h2.textContent = "Next round";
		d.getElementById("draw-error").textContent = "Select the winners to progress to the next round";
		drawList.appendChild(h2);
		winners = randomisePlayers(winners, winners.length);
		printDraw(winners);
		nextRound.classList.remove("hidden");
	}
}

// Display the final draw
let printFinal = (finalists) => {
	final.classList.remove("hidden");
	let div = d.createElement("div");
	let p = d.createElement("p");
	p.textContent = finalists[0].name + " vs " + finalists[1].name;
	div.appendChild(p);
	finalList.appendChild(div);
}

// Reset values when the new tournament button is clicked
let newTournament = () => {
	d.getElementById("add-players").classList.remove("hidden");
	final.classList.add("hidden");
	draw.classList.add("hidden");
	players = [];
	winners = [];
	pairs = [];
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

(d => {

let input = d.getElementById("input");
let output = d.getElementById("players-list");
let draw = d.getElementById("draw");
let drawList = d.getElementById("draw-list");
let drawTitle = d.getElementById("draw-title");
let roundButton = d.getElementById("round-button");
let final = d.getElementById("final");
let roundText = d.getElementById("round-text");
let inputError = d.getElementById("input-error");

let players = [];
let pairs = [];

// Gather form input and add names to players array
let submitPlayerClicked = () => {
	inputError.textContent = "";
	let name = input.value;

	// Validate input
	if (name.length < 1) {
		inputError.textContent = "Please enter the player's name";
	} else {
		let exists = false;
		players.map(player => {
			if (player.name === name) {
				inputError.textContent = "This player is already in the tournament, please use a different name";
				exists = true;
			}
		});

		if (!exists) {
			players.push({name: name, isWinner: false});

		// Output list of players
			let li = d.createElement("li");
			li.textContent = name;
			output.appendChild(li);
			input.value = "";
		}
	}
	input.focus();
}

// Randomise players from initial list
let randomisePlayers = (input, length) => {
	let randomisedPlayers = [];
	for (i = 0; i<length; i+=1) {
		let rand = Math.floor(Math.random() * Math.floor(input.length));
		randomisedPlayers.push(input[rand]);
		let removed = input.splice(rand, 1);
	}
	return randomisedPlayers;
}

// Print the draw
let printDraw = (players) => {
	let section = d.createElement("section");

	// Create the match pairings
	pairs = [];
	for (let i = 0; i < players.length; i+=2) {
		(players[i+1]) ? pairs.push({player1: players[i].name, player2: players[i+1].name}) : pairs.push({player1: players[i].name, player2: "BYE"});
	}

	// Print the matches
	pairs.map((match, index) => {
		console.log("pairs", pairs);
		console.log("players", players);
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
	players.map(player => player.isWinner = false);
	if (players.length % 2 === 1) {
		players[players.length-1].isWinner = true;
	}
}

// Create the initial Tournament draw
let createTournament = () => {
	d.getElementById("add-players").classList.add("hidden");
	if (players.length <= 2) {
		printFinal(players);
	} else {
		// let playersCopy = players.slice();
		players = randomisePlayers(players, players.length);
		console.log(players);
		d.getElementById("draw").classList.remove("hidden");
		printDraw(players);
		roundText.classList.remove("hidden");
	}
}

// Mark a player as the winner
let winnerClicked = e => {
	let winner = e.target;
	let winnerName = winner.textContent;

	let validPlayer = players.filter(player => player.name === winnerName);
	console.log(validPlayer);
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
	players.map(player => {
		if (player.name === winnerName) {
			player.isWinner = true;
		}
		if (player.name === loserName) {
			player.isWinner = false;
		}
	});
	winner.classList.add("winner-highlight");
	// winner.domDirection.domDirection.classList.remove("winner-highlight");
	domDirection === "next" ? winner.nextElementSibling.nextElementSibling.classList.remove("winner-highlight") : winner.previousElementSibling.previousElementSibling.classList.remove("winner-highlight");

	console.log(players);
}

// Generate the next round from the players where isWinner is true
let roundClicked = () => {
	let winners = players.filter(player => player.isWinner);

// Check correct number of winners are selected
	if (winners.length < pairs.length) {
		d.getElementById("draw-error").textContent = "Please select a winner for each match";

	} else 

// Print final if only two players left
	if (winners.length <= 2) {
		d.getElementById("round-text").classList.add("hidden");
		printFinal(winners);

// Otherwise generate the next round
	} else {
		let h2 = d.createElement("h2");
		h2.textContent = "Next round";
		d.getElementById("draw-error").textContent = "";

		drawList.appendChild(h2);
		winners = randomisePlayers(winners, winners.length);
		printDraw(winners);
		roundText.classList.remove("hidden");
	}
}

let printFinal = (winners) => {
	final.classList.remove("hidden");
	let div = d.createElement("div");
	let p = d.createElement("p");
	p.textContent = winners[0].name + " vs " + winners[1].name;
	div.appendChild(p);
	d.getElementById("final-list").appendChild(div);
}

// Reset values
let newTournament = () => {
	d.getElementById("add-players").classList.remove("hidden");
	d.getElementById("final").classList.add("hidden");
	d.getElementById("draw").classList.add("hidden");
	players = [];
	winners = [];
	pairs = [];
	output.textContent = "";
	drawList.textContent = "";
	inputError.textContent = "";
	d.getElementById("final-list").textContent = "";
	console.log(players);
}

d.getElementById("button").addEventListener("click", submitPlayerClicked);
d.getElementById("create-tournament").addEventListener("click", createTournament);
drawList.addEventListener("click", winnerClicked);
roundButton.addEventListener("click", roundClicked);
d.getElementById("new-tournament").addEventListener("click", newTournament);

})(document);

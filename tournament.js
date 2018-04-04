(d => {

let input = d.getElementById("input");
let output = d.getElementById("players-list");
let draw = d.getElementById("draw");
let drawList = d.getElementById("draw-list");
let drawTitle = d.getElementById("draw-title");
let roundButton = d.getElementById("round-button");
let final = d.getElementById("final");

let players = [];

// Gather form input and add names to players array
let submitPlayerClicked = () => {
	let name = input.value;
	players.push({name: name, isWinner: false});

// Output list of players
	let li = d.createElement("li");
	li.textContent = name;
	output.appendChild(li);
	input.value = "";
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
	let pairs = [];
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
		roundButton.classList.remove("hidden");
	}
}

// Mark a player as the winner
let winnerClicked = e => {
	let winner = e.target;
	winner.classList.add("winner-highlight");
	players.map(player => (player.name == winner.textContent) ? player.isWinner = !player.isWinner : player);
}

// Generate the next round from the players where isWinner is true
let roundClicked = () => {
	let winners = players.filter(player => player.isWinner);

// Check winners are selected
// 	if (winners.length < players.length / 2) {
// 		d.getElementById("draw-error").textContent = "Please select the winners";

// 	} else 

// Print final if only two players left
	if (winners.length <= 2) {
		roundButton.classList.add("hidden");
		printFinal(winners);

// Otherwise generate the next round
	} else {
		let h2 = d.createElement("h2");
		h2.textContent = "Next round";
		drawList.appendChild(h2);
		winners = randomisePlayers(winners, winners.length);
		printDraw(winners);
		roundButton.classList.remove("hidden");
	}
}

let printFinal = (winners) => {
	final.classList.remove("hidden");
	let div = d.createElement("div");
	let p = d.createElement("p");
	p.textContent = winners[0].name + " vs " + winners[1].name;
	div.appendChild(p);
	d.getElementById("final-list").appendChild(div);
	// d.getElementById("final-list").textContent = winners[0].name + " vs " + winners[1].name;
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
	d.getElementById("final-list").textContent = "";
}

d.getElementById("button").addEventListener("click", submitPlayerClicked);
d.getElementById("create-tournament").addEventListener("click", createTournament);
drawList.addEventListener("click", winnerClicked);
roundButton.addEventListener("click", roundClicked);
d.getElementById("new-tournament").addEventListener("click", newTournament);

})(document);

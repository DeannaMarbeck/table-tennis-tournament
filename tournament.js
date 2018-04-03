(d => {

let input = d.getElementById("input");
let output = d.getElementById("players-list");
let draw = d.getElementById("draw");
let drawTitle = d.getElementById("draw-title");
let roundButton = d.getElementById("round-button");
let rounds = d.getElementById("rounds");

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

	players.map((player, index) => {
		if (index % 2 === 0) {
			p = d.createElement("p");
			p.textContent = player.name;
			draw.appendChild(p);
		} else {
			p = d.createElement("p");
			p.textContent = " plays "
			draw.appendChild(p);
			p = d.createElement("p");
			p.textContent = player.name;
			draw.appendChild(p);
		} 
		// Reset player
		player.isWinner = false;
	});
	if (players.length % 2 === 1) {
		p = d.createElement("p");
		p.textContent = "has a BYE";
		draw.appendChild(p);
	}
}

// Create the initial Tournament draw
let createTournament = () => {
	let playersCopy = players.slice();
	let randomisedPlayers = randomisePlayers(playersCopy, players.length);
	console.log(randomisedPlayers);
	drawTitle.textContent = "Here is the tournament draw";
	printDraw(randomisedPlayers);
}

// Mark a player as the winner
let winnerClicked = e => {
	let winner = e.target;
	winner.style.border = "2px solid red";
	players.map(player => (player.name == winner.textContent) ? player.isWinner = !player.isWinner : player);
	console.log(players);
}

// Generate the next round from the players where isWinner is true
let roundClicked = () => {
	let winners = players.filter(player => player.isWinner == true);
	if (winners.length <= 2) {
		let p = d.createElement("p");
		p.textContent = "Last round: " + winners[0].name + " vs " + winners[1].name;
		draw.appendChild(p);
		return;
	}
	if (winners.length < players.length / 2) {
		d.getElementById("draw-error").textContent = "Please select the winners";
	} else {
		d.getElementById("round-title").textContent = "Next round";
		printDraw(winners);
	}
}

d.getElementById("button").addEventListener("click", submitPlayerClicked);
d.getElementById("create-tournament").addEventListener("click", createTournament);
draw.addEventListener("click", winnerClicked);
roundButton.addEventListener("click", roundClicked);

})(document);

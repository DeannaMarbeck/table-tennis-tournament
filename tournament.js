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
	let numPlayers = players.length;
	let matchNum = 1;
	players.map((player, index) => {
		if (index % 2 === 0) {
			let h3 = d.createElement("h3");
			h3.textContent = "Match " + matchNum;
			drawList.appendChild(h3);
			p = d.createElement("p");
			p.textContent = player.name;
			drawList.appendChild(p);
			matchNum += 1;
		} else {
			p = d.createElement("p");
			p.textContent = " plays "
			drawList.appendChild(p);
			p = d.createElement("p");
			p.textContent = player.name;
			drawList.appendChild(p);
		} 

		// Reset player
		player.isWinner = false;
	});

	if (numPlayers % 2 === 1) {
		p = d.createElement("p");
		p.textContent = "has a BYE";
		drawList.appendChild(p);
	}
}

// Create the initial Tournament draw
let createTournament = () => {
	d.getElementById("add-players").classList.add("hidden");
	if (players.length <= 2) {
		printFinal(players);
	} else {
		let playersCopy = players.slice();
		players = randomisePlayers(playersCopy, players.length);
		d.getElementById("draw").classList.remove("hidden");
		printDraw(players);
	}
}

// Mark a player as the winner
let winnerClicked = e => {
	let winner = e.target;
	winner.style.border = "2px solid red";
	players.map(player => (player.name == winner.textContent) ? player.isWinner = !player.isWinner : player);
	if (players.length % 2 === 1) {
		players[players.length-1].isWinner = true;
	}
	console.log(players);
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
		printFinal(winners);

// Otherwise generate the next round
	} else {
		let h2 = d.createElement("h2");
		h2.textContent = "Next round";
		drawList.appendChild(h2);
		printDraw(winners);
	}
}

let printFinal = (winners) => {
	final.classList.remove("hidden");
	d.getElementById("final-list").textContent = winners[0].name + " vs " + winners[1].name;
}

let newTournament = () => {
	d.getElementById("add-players").classList.remove("hidden");
	d.getElementById("final").classList.add("hidden");
	d.getElementById("draw").classList.add("hidden");
	players = [];
	output.textContent = "";
}

d.getElementById("button").addEventListener("click", submitPlayerClicked);
d.getElementById("create-tournament").addEventListener("click", createTournament);
drawList.addEventListener("click", winnerClicked);
roundButton.addEventListener("click", roundClicked);
d.getElementById("new-tournament").addEventListener("click", newTournament);

})(document);

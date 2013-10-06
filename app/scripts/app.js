function counter_appears(location, counter) {
document.getElementById('cell'+location).classList.toggle(counter);
document.getElementById('cell'+location).innerHTML = counter;
}

/*
everytime make_next_move is called, a new cell is drawn with an alternate color
e.g. first time draw X, second time draw O... and so on
*/

var currentPlayer = "x";

function next_move(location) {
	if (currentPlayer=="x") {
		currentPlayer="o";
		counter_appears(location, "x");
	}
	else {
		currentPlayer="x";
		counter_appears(location, "o");
	}
}

function square_already_clicked(location) {
	return document.getElementById('cell'+location).innerHTML;
}

function next_move_no_conflicts(location) {
	if (square_already_clicked(location)==="x") {
}
	else if (square_already_clicked(location)==="o") {
}
	else {
	next_move(location);
}
}
/*
var cell1_content = square_already_clicked(1);
var cell2_content = square_already_clicked(2);
var cell3_content = square_already_clicked(3);

function is_top_3_occupied(location) {
	if (cell1_content==="x" && cell2_content==="x" && cell3_content==="x") {
		console.log(x wins!);
	}
}
function next_move_no_conflicts_checks_x_win(location) {
	function next_move_no_conflicts(location);
	function is_top_3_occupied(location0);
}
*/
class GameModel {
	board;
	turn;
	status = 'active';
	winner = { name: null, winnerCells: [] };
	player1 = 'x';
	player2 = 'o';
	observers = [];

	constructor() {
		this.resetBoard();
	}

	subscribe(observer) {
		this.observers.push(observer);
	}

	notifyUpdate() {
		const state = this.getState();
		this.observers.forEach((observer) => observer(state));
	}

	getState() {
		return {
			board: [...this.board],
			turn: this.turn,
			status: this.status,
			winner: this.winner,
		};
	}

	resetBoard() {
		this.board = Array(9).fill(null);
		this.turn = this.player1;
		this.status = 'active';
		this.winner = { name: null, winnerCells: [] };
		this.notifyUpdate();
	}

	setCell(index) {
		if (this.board[index] === null) {
			this.board[index] = this.turn;
			if (this.iskWin()) {
				this.notifyUpdate();
				return;
			}
			this.changeTurn();
			this.notifyUpdate();
		}
	}

	changeTurn() {
		this.turn = this.turn === this.player1 ? this.player2 : this.player1;
	}

	iskWin() {
		const winningCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (
				this.board[a] &&
				this.board[a] === this.board[b] &&
				this.board[a] === this.board[c]
			) {
				this.winner = {
					name: this.turn,
					winnerCells: [a, b, c],
				};
				this.status = 'finished';
				return true;
			}
		}
	}
}

export default GameModel;

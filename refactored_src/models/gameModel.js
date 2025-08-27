class GameModel {
	board;
	turn;
	status = 'undefined';
	winner = { name: null, winnerCells: [] };
	gameType = 'player';
	player1 = 'X';
	player2 = 'O';
	observers = [];
	settings = {};

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
			gameType: this.gameType,
			settings: this.settings,
		};
	}

	setGameType(gameType) {
		this.gameType = gameType;
	}

	setSettings(settings) {
		this.settings = settings;
		if (this.status !== 'active') {
			this.turn = settings.firstPlayer;
		}
	}

	reset(shouldNotify = true) {
		this.board = Array(9).fill(null);
		this.winner = { name: null, winnerCells: [] };
		this.turn = this.settings.firstPlayer || 'X';
		this.changeStatus('undefined');
		if (shouldNotify) {
			this.notifyUpdate();
		}
	}

	setCell(index) {
		if (this.board[index] === null) {
			this.board[index] = this.turn;
			this.checkWin();
		}
	}

	checkWin() {
		if (this.isWin()) {
			this.changeStatus('finished');
			this.notifyUpdate();
			return;
		}
		if (this.isDraw()) {
			this.changeStatus('draw');
			this.notifyUpdate();
			return;
		}
		this.changeStatus('active');
		this.changeTurn();
		this.notifyUpdate();
	}

	changeTurn() {
		this.turn = this.turn === this.player1 ? this.player2 : this.player1;
	}

	changeStatus(newStatus) {
		this.status = newStatus;
	}

	isWin() {
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
				this.changeStatus('finished');
				return true;
			}
		}
	}

	isDraw() {
		return this.board.every((cell) => cell !== null);
	}
}

export default GameModel;

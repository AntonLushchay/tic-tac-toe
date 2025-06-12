import pencilSvg from '../assets/svg/pencil-filter.svg';

import gameTemplate from './templates/game-template.html';

class GameView {
	penciline = pencilSvg;
	template = gameTemplate;
	appRoot;
	controller;
	buttons;
	cells = [];
	currentPlayerElem;
	winnerElem;
	status;

	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render(state) {
		this.appRoot.innerHTML = this.template;
		this.bindEvents();

		this.currentPlayerElem = this.appRoot.querySelector('.current-player');
		this.winnerElem = this.appRoot.querySelector('.result-message');

		this.setCells(state.board);
		this.setCurrentPlayer(state.turn);
		this.isWinner(state.winner);
		this.status = state.status;
	}

	updateView(state) {
		this.setCells(state.board);
		this.setCurrentPlayer(state.turn);
		this.isWinner(state.winner);
		this.checkStatus(state.status);
	}

	bindEvents() {
		this.buttons = this.appRoot.querySelectorAll('[data-js-game-button]');
		this.buttons.forEach((button) => {
			button.addEventListener('click', this.handleButtonClick);
		});

		this.cells = this.appRoot.querySelectorAll('[data-js-game-cell]');
		this.cells.forEach((cell) => {
			cell.addEventListener('click', this.handleCellClick);
		});
	}

	handleButtonClick = (event) => {
		const buttonId = event.currentTarget.id;
		console.log('Button clicked:', buttonId);
		this.controller.navigateTo(buttonId);
	};

	handleCellClick = (event) => {
		if (this.status === 'finished') {
			console.log('Game is finished, no more moves allowed.');
			return;
		}

		const cellID = Number(event.currentTarget.dataset.jsGameCell);
		console.log('Cell clicked:', cellID);
		this.controller.makeMove(cellID);
	};

	setCells(board) {
		this.cells.forEach((cell, index) => {
			cell.textContent = board[index];
		});
	}

	setCurrentPlayer(turn) {
		this.currentPlayerElem.textContent = turn;
	}

	isWinner(winner) {
		if (winner) {
			this.winnerElem.textContent = `Winner: ${winner}`;
			this.status = 'finished';
			const resultContainer = this.appRoot.querySelector('.game-result');
			if (resultContainer) {
				resultContainer.style.display = 'block';
			}
			console.log('Current winner:', this.winnerElem.textContent);
		}
	}

	checkStatus(status) {
		if (status === 'finished') {
			console.log('Game status: finished');
		}
	}

	cleanup() {
		if (this.buttons && this.buttons.length > 0) {
			this.buttons.forEach((button) => {
				button.removeEventListener('click', this.handleButtonClick);
			});
		}
		this.buttons = null;
		console.log('GameView event listeners cleaned up.');
	}
}

export default GameView;

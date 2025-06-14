import cross from '../assets/svg/cross.svg';
import circle from '../assets/svg/circle.svg';

import gameTemplate from './templates/game-template.html';

class GameView {
	crossIcon = cross;
	circleIcon = circle;
	template = gameTemplate;
	appRoot;
	controller;
	buttons;
	cells = [];
	currentPlayerElem;
	winnerElem;
	winnerDialogElem;
	status = 'undefined';

	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render(state) {
		console.log('state of view: ', state);
		if (this.status === 'undefined') {
			this.appRoot.innerHTML = this.template;
			this.findElements();
			this.setListeners();
			this.setBoardLines();
		}
		this.setViewState(state);
	}

	findElements() {
		this.currentPlayerElem = this.appRoot.querySelector(
			'.game__current-player-name',
		);
		this.cells = this.appRoot.querySelectorAll('[data-js-game-cell]');
		this.buttons = this.appRoot.querySelectorAll('[data-js-game-button]');
		this.winnerDialogElem = this.appRoot.querySelector(
			'[data-js-game-dialog]',
		);
		this.winnerElem = this.winnerDialogElem.querySelector(
			'[data-js-dialog-winner]',
		);
	}

	setListeners() {
		this.buttons.forEach((button) => {
			button.addEventListener('click', this.handleButtonClick);
		});

		this.cells.forEach((cell) => {
			cell.addEventListener('click', this.handleCellClick);
		});
	}

	setBoardLines() {
		const gameBoardElem = this.appRoot.querySelector('.game__board');
		for (let i = 1; i <= 4; i++) {
			gameBoardElem.style.setProperty(
				`--random-angle-${i}`,
				`${Math.floor(Math.random() * (5 - -5 + 1)) + -5}deg`,
			);
		}
	}

	handleButtonClick = (event) => {
		const buttonId = event.currentTarget.id;
		this.controller.buttonAction(buttonId);
	};

	handleCellClick = (event) => {
		if (this.status === 'finished') {
			return;
		}

		const cellID = Number(event.currentTarget.dataset.jsGameCell);
		this.controller.makeMove(cellID);
	};

	setViewState(state) {
		this.status = state.status;

		console.log('crossIcon: ', this.crossIcon);
		console.log('circleIcon: ', this.circleIcon);

		this.cells.forEach((cell, index) => {
			if (state.board[index] === 'x') {
				cell.innerHTML = this.crossIcon;
				this.setRandomCellPadding(cell);
			} else if (state.board[index] === 'o') {
				cell.innerHTML = this.circleIcon;
				this.setRandomCellPadding(cell);
			}
		});

		this.currentPlayerElem.textContent = state.turn;

		this.isWinner(state.winner);
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

	setRandomCellPadding(cell) {
		cell.style.setProperty(
			'--random-cell-padding-y',
			`${Math.random() * 20}px`,
		);
		cell.style.setProperty(
			'--random-cell-padding-x',
			`${Math.random() * 20}px`,
		);
	}

	cleanup() {
		if (this.buttons && this.buttons.length > 0) {
			this.buttons.forEach((button) => {
				button.removeEventListener('click', this.handleButtonClick);
			});
		}
		this.buttons = null;
		this.cells = [];
		this.currentPlayerElem = null;
		this.winnerElem = null;
		this.status = 'undefined';

		console.log('GameView event listeners cleaned up.');
	}
}

export default GameView;

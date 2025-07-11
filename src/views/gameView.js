import cross from '../assets/svg/cross.inline.svg';
import circle from '../assets/svg/circle.inline.svg';
import crossSound from '../assets/sound/cross.m4a';
import circleSound from '../assets/sound/circle.m4a';
import lineSound from '../assets/sound/line.m4a';
import { translations } from '../i18n/translations.js';

import gameTemplate from './templates/game-template.html';

class GameView {
	crossIcon = cross;
	circleIcon = circle;
	template = gameTemplate;
	gameElem;
	appRoot;
	controller;
	buttons;
	cells = [];
	currentPlayerSignElem;
	winBoardLine;
	winner2ndSpanElem;
	winnerDialogElem;
	dialogCloseButtonElem;
	status = 'undefined';
	isDraw = false;
	language = 'en';

	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render(state, previousHash) {
		console.log('GameView. State from GameModel: ', state);

		if (state.status === 'undefined' || previousHash === 'settings') {
			this.appRoot.innerHTML = this.template;
			this.findElements();
			this.setListeners();
			this.setBoardLines();
		}

		this.setViewState(state);
	}

	findElements() {
		this.gameElem = this.appRoot.querySelector('.game');
		this.titleElem = this.appRoot.querySelector('.game__title');
		this.currentPlayerLabelElem = this.appRoot.querySelector(
			'.game__current-player-label',
		);
		this.currentPlayerSignElem = this.appRoot.querySelector(
			'.game__current-player-name',
		);
		this.aiThinkingElem = this.appRoot.querySelector(
			'[data-js-game-ai-thinking]',
		);
		this.cells = this.appRoot.querySelectorAll('[data-js-game-cell]');
		this.buttons = this.appRoot.querySelectorAll('[data-js-game-button]');
		this.winBoardLine = this.appRoot.querySelector(
			'[data-js-game-win-line]',
		);
		this.winnerDialogElem = this.appRoot.querySelector(
			'[data-js-game-dialog]',
		);
		this.winnerSpanContainer = this.winnerDialogElem.querySelector(
			'.dialog__game-winner',
		);
		this.winner1stSpanElem = this.winnerDialogElem.querySelector(
			'.dialog__game-winner--1st-span',
		);
		this.winner2ndSpanElem = this.winnerDialogElem.querySelector(
			'.dialog__game-winner--2nd-span',
		);
		this.winner3rdSpanElem = this.winnerDialogElem.querySelector(
			'.dialog__game-winner--3rd-span',
		);
		this.dialogCloseButtonElem =
			this.winnerDialogElem.querySelector('#dialogCloseButton');
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
		const boardLines = gameBoardElem.querySelectorAll(
			'[data-js-board-line]',
		);

		boardLines.forEach((line) => {
			line.addEventListener('animationstart', this.handleAnimatedSound, {
				once: true,
			});
		});

		for (let i = 1; i <= 4; i++) {
			gameBoardElem.style.setProperty(
				`--random-angle-${i}`,
				`${Math.floor(Math.random() * (5 - -5 + 1)) + -5}deg`,
			);
		}
	}

	playSound(soundType) {
		if (!this.soundOn) {
			return;
		}
		let sound;
		switch (soundType) {
			case 'cross':
				sound = new Audio(crossSound);
				sound.currentTime = 0.3;
				break;
			case 'circle':
				sound = new Audio(circleSound);
				sound.currentTime = 0.6;
				break;
			case 'line':
				sound = new Audio(lineSound);
				sound.currentTime = 0.3;
				break;
			default:
				return;
		}
		sound.play().catch((error) => {
			console.warn('Error playing sound:', error);
		});
	}

	handleAnimatedSound = (event) => {
		if (event.target.className.includes('line')) {
			this.playSound('line');
		}
	};

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
		this.changeLanguage(state.settings.language);
		this.changeSound(state.settings.soundEnabled);

		this.setStatus(state);

		this.setCells(state);

		this.setCurrentPlayer(state.turn);
	}

	changeLanguage(language) {
		this.language = language;
		this.buttons.forEach((button) => {
			if (button.id !== 'settingsButton') {
				button.textContent =
					translations[language]['gameView'][button.id];
			}
		});
		this.titleElem.textContent =
			translations[language]['gameView']['title'];
		this.currentPlayerLabelElem.textContent =
			translations[language]['gameView']['currentPlayer'];
		this.aiThinkingElem.textContent =
			translations[language]['gameView']['aiThinking'];

		this.winner1stSpanElem.textContent =
			translations[language]['gameView']['winner1stSpanElem'];
		this.winner3rdSpanElem.textContent =
			translations[language]['gameView']['winner3rdSpanElem'];
	}

	changeSound(soundEnabled) {
		this.soundOn = soundEnabled;
	}

	setStatus(state) {
		this.status = state.status;
		if (this.status === 'finished') {
			this.showWinDialog(state.winner);
			setTimeout(() => {
				this.drawWinLine(state.winner.winnerCells, state.winner.name);
				this.playSound('line');
			}, 1000);
		} else if (this.status === 'draw') {
			this.showWinDialog(state.winner);
		}
	}

	setCells(state) {
		this.cells.forEach((cell, index) => {
			if (!cell.innerHTML) {
				if (state.board[index] === 'X') {
					cell.innerHTML = this.crossIcon;
					this.setRandomCellTranslate(cell);
					this.playSound('cross');
				} else if (state.board[index] === 'O') {
					cell.innerHTML = this.circleIcon;
					this.setRandomCellTranslate(cell);
					this.playSound('circle');
				}
			}
		});
	}

	setCurrentPlayer(turn) {
		if (turn === 'X') {
			this.currentPlayerSignElem.innerHTML = this.crossIcon;
			this.currentPlayerSignElem.style.setProperty('--color', 'red');
		} else {
			this.currentPlayerSignElem.innerHTML = this.circleIcon;
			this.currentPlayerSignElem.style.setProperty('--color', 'blue');
		}
	}

	showAiThinking() {
		this.aiThinkingElem.classList.toggle('game__ai-thinking--active');
	}

	showWinDialog(winner) {
		this.updateWinDialog(winner.name);

		if (this.status === 'draw') {
			this.winnerDialogElem.showModal();
			this.dialogCloseButtonElem.focus();
		} else {
			const showDialog = () => {
				this.winnerDialogElem.showModal();
				this.dialogCloseButtonElem.focus();
			};

			this.winBoardLine.addEventListener('animationend', showDialog, {
				once: true,
			});
		}
	}

	hideDialog() {
		this.winnerDialogElem.close();
	}

	updateWinDialog(winnerName) {
		if (this.status === 'finished') {
			if (winnerName === 'X') {
				this.winnerDialogElem.style.setProperty(
					'--background-color',
					'rgb(251, 198, 198)',
				);
				this.winner2ndSpanElem.innerHTML = this.crossIcon;
				this.winner2ndSpanElem.style.setProperty('--color', 'red');
			} else {
				this.winner2ndSpanElem.innerHTML = this.circleIcon;
				this.winner2ndSpanElem.style.setProperty('--color', 'blue');
				this.winnerDialogElem.style.setProperty(
					'--background-color',
					'rgb(199, 199, 249)',
				);
			}
		} else if (this.status === 'draw') {
			this.winnerSpanContainer.textContent =
				translations[this.language]['gameView']['drawDialog'];
		}
	}

	drawWinLine(winnerCells, winnerName) {
		const startCellData =
			this.cells[winnerCells[0]].getBoundingClientRect();
		const endCellData = this.cells[winnerCells[2]].getBoundingClientRect();
		const gameRect = this.gameElem.getBoundingClientRect();

		const horizontalLineXY = {
			x1: startCellData.x - gameRect.x,
			y1: startCellData.y - gameRect.y + startCellData.height / 2,
			x2: endCellData.x - gameRect.x + endCellData.width,
			y2: endCellData.y - gameRect.y + endCellData.height / 2,
		};

		const verticalLineXY = {
			x1: startCellData.x - gameRect.x + startCellData.width / 2,
			y1: startCellData.y - gameRect.y,
			x2: endCellData.x - gameRect.x + endCellData.width / 2,
			y2: endCellData.y - gameRect.y + endCellData.height,
		};

		// Слева сверху в право вниз "\"
		const diagonalLineXY1 = {
			x1: startCellData.x - gameRect.x,
			y1: startCellData.y - gameRect.y,
			x2: endCellData.x - gameRect.x + endCellData.width,
			y2: endCellData.y - gameRect.y + endCellData.height,
		};

		// Слева снизу в право вверх "/"
		const diagonalLineXY2 = {
			x1: startCellData.x - gameRect.x + startCellData.width,
			y1: startCellData.y - gameRect.y,
			x2: endCellData.x - gameRect.x,
			y2: endCellData.y - gameRect.y + endCellData.height,
		};

		const winTypesObj = {
			horizontal: startCellData.y === endCellData.y,
			vertical: startCellData.x === endCellData.x,
			diagonal1:
				endCellData.x - startCellData.x > 0 &&
				endCellData.y - startCellData.y > 0,
			diagonal2:
				endCellData.x - startCellData.x < 0 &&
				endCellData.y - startCellData.y > 0,
		};

		const winType = Object.keys(winTypesObj).find(
			(key) => winTypesObj[key] === true,
		);

		switch (winType) {
			case 'horizontal':
				this.setWinLine(horizontalLineXY, winnerName);
				break;
			case 'vertical':
				this.setWinLine(verticalLineXY, winnerName);
				break;
			case 'diagonal1':
				this.setWinLine(diagonalLineXY1, winnerName);
				break;
			case 'diagonal2':
				this.setWinLine(diagonalLineXY2, winnerName);
				break;
			default:
				console.error('Unknown win type:', winType);
		}
	}

	setWinLine(lineCoordinates, winnerName) {
		const deltaX = lineCoordinates.x2 - lineCoordinates.x1;
		const deltaY = lineCoordinates.y2 - lineCoordinates.y1;
		const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
		const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const lineColor = winnerName === 'X' ? 'red' : 'blue';

		this.winBoardLine.style.setProperty(
			'--left-indent',
			lineCoordinates.x1 + 'px',
		);
		this.winBoardLine.style.setProperty(
			'--top-indent',
			lineCoordinates.y1 + 'px',
		);
		this.winBoardLine.style.setProperty('--line-length', lineLength + 'px');
		this.winBoardLine.style.setProperty('--angle', angle + 'deg');
		this.winBoardLine.style.setProperty('--color', lineColor);
		this.winBoardLine.classList.add('game__win-line--active');
	}

	setRandomCellTranslate(cell) {
		const svgIcon = cell.querySelector('svg');
		svgIcon.style.transform = `translate(${Math.random() * (15 - -15) + -15}px, ${Math.random() * (15 - -15) + -15}px)`;
	}

	cleanup() {
		if (this.buttons && this.buttons.length > 0) {
			this.buttons.forEach((button) => {
				button.removeEventListener('click', this.handleButtonClick);
			});
		}
		if (this.cells && this.cells.length > 0) {
			this.cells.forEach((cell) => {
				cell.removeEventListener('click', this.handleCellClick);
			});
		}
		this.buttons = null;
		this.cells = [];
		this.currentPlayerSignElem = null;
		this.winner2ndSpanElem = null;
		this.winBoardLine = null;
		this.status = 'undefined';
		this.winnerDialogElem = null;
		this.dialogCloseButtonElem = null;
		this.appRoot.innerHTML = '';

		console.log('GameView event listeners cleaned up.');
	}
}

export default GameView;

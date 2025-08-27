import BaseView from './baseView.js';
import { i18nService } from '../services/i18nService.js';
import gameTemplate from './templates/game-template.html';
import crossIcon from '../assets/svg/cross.inline.svg';
import circleIcon from '../assets/svg/circle.inline.svg';

class GameView extends BaseView {
	_template = gameTemplate;
	_controller;

	constructor(appRoot, controller) {
		super(appRoot);
		this._controller = controller;
	}

	render(state, previousHash) {
		if (state.status === 'undefined' || previousHash === 'settings') {
			this._renderTemplate(this._template);
			this._bindElements();
			this._bindListeners();
			this._setupBoardLines();
		}

		this._update(state);
	}

	_bindElements() {
		this.gameElem = this._findElement('.game');
		this.titleElem = this._findElement('.game__title');
		this.currentPlayerLabelElem = this._findElement('.game__current-player-label');
		this.currentPlayerSignElem = this._findElement('.game__current-player-name');
		this.aiThinkingElem = this._findElement('[data-js-game-ai-thinking]');
		this.cells = this._findElements('[data-js-game-cell]');
		this.buttons = this._findElements('[data-js-game-button]');
		this.winBoardLine = this._findElement('[data-js-game-win-line]');
		this.winnerDialogElem = this._findElement('[data-js-game-dialog]');
		this.winnerSpanContainer = this._findElement('.dialog__game-winner');
		this.winner1stSpanElem = this._findElement('.dialog__game-winner--1st-span');
		this.winner2ndSpanElem = this._findElement('.dialog__game-winner--2nd-span');
		this.winner3rdSpanElem = this._findElement('.dialog__game-winner--3rd-span');
	}

	_bindListeners() {
		this.buttons.forEach((button) => {
			this._addListener(button, 'click', this._handleButtonClick);
		});

		this.cells.forEach((cell) => {
			this._addListener(cell, 'click', this._handleCellClick);
		});
	}

	_setupBoardLines() {
		const gameBoardElem = this._findElement('.game__board');
		const boardLines = gameBoardElem.querySelectorAll('[data-js-board-line]');

		boardLines.forEach((line) => {
			this._addListener(line, 'animationstart', this._handleAnimatedSound);
		});

		for (let i = 1; i <= 4; i++) {
			gameBoardElem.style.setProperty(
				`--random-angle-${i}`,
				`${Math.floor(Math.random() * (5 - -5 + 1)) + -5}deg`,
			);
		}
	}

	_handleAnimatedSound = (event) => {
		if (event.target.className.includes('line')) {
			this._controller.playSound('line');
		}
	};

	_handleButtonClick = (event) => {
		this._controller.buttonAction(event.currentTarget.id);
	};

	_handleCellClick = (event) => {
		if (this.gameStatus === 'finished') return;
		this._controller.makeMove(Number(event.currentTarget.dataset.jsGameCell));
	};

	_update(state) {
		this.gameStatus = state.status;
		this._updateLanguage();
		this._updateCells(state.board);
		this._updateCurrentPlayer(state.turn);

		if (state.status === 'finished') {
			this._showWinDialog(state.winner);
			setTimeout(() => {
				this._drawWinLine(state.winner.winnerCells, state.winner.name);
				this._controller.playSound('line');
			}, 1000);
		} else if (state.status === 'draw') {
			this._showWinDialog(state.winner);
		}
	}

	_updateLanguage() {
		this.titleElem.textContent = i18nService.getString('title', 'gameView');
		this.currentPlayerLabelElem.textContent = i18nService.getString('currentPlayer', 'gameView');
		this.aiThinkingElem.textContent = i18nService.getString('aiThinking', 'gameView');
		this.winner1stSpanElem.textContent = i18nService.getString('winner1stSpanElem', 'gameView');
		this.winner3rdSpanElem.textContent = i18nService.getString('winner3rdSpanElem', 'gameView');
		this.buttons.forEach(button => {
			if (button.id !== 'settingsButton') {
				button.textContent = i18nService.getString(button.id, 'gameView');
			}
		});
	}

	_updateCells(board) {
		this.cells.forEach((cell, index) => {
			if (!cell.innerHTML && board[index]) {
				cell.innerHTML = board[index] === 'X' ? crossIcon : circleIcon;
				this._setRandomCellTranslate(cell);
				this._controller.playSound(board[index] === 'X' ? 'cross' : 'circle');
			}
		});
	}

	_updateCurrentPlayer(turn) {
		this.currentPlayerSignElem.innerHTML = turn === 'X' ? crossIcon : circleIcon;
		this.currentPlayerSignElem.style.setProperty('--color', turn === 'X' ? 'red' : 'blue');
	}

	showAiThinking(show) {
		this.aiThinkingElem.classList.toggle('game__ai-thinking--active', show);
	}

	_showWinDialog(winner) {
		this._updateWinDialog(winner.name);
		if (this.gameStatus === 'draw') {
			this.winnerDialogElem.showModal();
		} else {
			const showDialog = () => {
				this.winnerDialogElem.showModal();
			};
			this.winBoardLine.addEventListener('animationend', showDialog, { once: true });
		}
	}

	hideDialog() {
		this.winnerDialogElem.close();
	}

	_updateWinDialog(winnerName) {
		if (this.gameStatus === 'finished') {
			const isX = winnerName === 'X';
			this.winnerDialogElem.style.setProperty('--background-color', isX ? 'rgb(251, 198, 198)' : 'rgb(199, 199, 249)');
			this.winner2ndSpanElem.innerHTML = isX ? crossIcon : circleIcon;
			this.winner2ndSpanElem.style.setProperty('--color', isX ? 'red' : 'blue');
		} else if (this.gameStatus === 'draw') {
			this.winnerSpanContainer.textContent = i18nService.getString('drawDialog', 'gameView');
		}
	}

	_drawWinLine(winnerCells, winnerName) {
		// This logic is complex but purely for display. It's acceptable here.
		// A future refactor could turn this into a separate component/helper.
		const startCellData = this.cells[winnerCells[0]].getBoundingClientRect();
		const endCellData = this.cells[winnerCells[2]].getBoundingClientRect();
		const gameRect = this.gameElem.getBoundingClientRect();

		const getLineCoords = (type) => {
			switch (type) {
				case 'horizontal': return { x1: startCellData.x - gameRect.x, y1: startCellData.y - gameRect.y + startCellData.height / 2, x2: endCellData.x - gameRect.x + endCellData.width, y2: endCellData.y - gameRect.y + endCellData.height / 2 };
				case 'vertical': return { x1: startCellData.x - gameRect.x + startCellData.width / 2, y1: startCellData.y - gameRect.y, x2: endCellData.x - gameRect.x + endCellData.width / 2, y2: endCellData.y - gameRect.y + endCellData.height };
				case 'diagonal1': return { x1: startCellData.x - gameRect.x, y1: startCellData.y - gameRect.y, x2: endCellData.x - gameRect.x + endCellData.width, y2: endCellData.y - gameRect.y + endCellData.height };
				case 'diagonal2': return { x1: startCellData.x - gameRect.x + startCellData.width, y1: startCellData.y - gameRect.y, x2: endCellData.x - gameRect.x, y2: endCellData.y - gameRect.y + endCellData.height };
				default: return null;
			}
		};

		const winTypesObj = {
			horizontal: startCellData.y === endCellData.y,
			vertical: startCellData.x === endCellData.x,
			diagonal1: endCellData.x - startCellData.x > 0 && endCellData.y - startCellData.y > 0,
			diagonal2: endCellData.x - startCellData.x < 0 && endCellData.y - startCellData.y > 0,
		};
		const winType = Object.keys(winTypesObj).find(key => winTypesObj[key]);
		const lineCoordinates = getLineCoords(winType);

		if (lineCoordinates) {
			this._setWinLine(lineCoordinates, winnerName);
		}
	}

	_setWinLine(coords, winnerName) {
		const deltaX = coords.x2 - coords.x1;
		const deltaY = coords.y2 - coords.y1;
		const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
		const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		this.winBoardLine.style.setProperty('--left-indent', `${coords.x1}px`);
		this.winBoardLine.style.setProperty('--top-indent', `${coords.y1}px`);
		this.winBoardLine.style.setProperty('--line-length', `${lineLength}px`);
		this.winBoardLine.style.setProperty('--angle', `${angle}deg`);
		this.winBoardLine.style.setProperty('--color', winnerName === 'X' ? 'red' : 'blue');
		this.winBoardLine.classList.add('game__win-line--active');
	}

	_setRandomCellTranslate(cell) {
		const svgIcon = cell.querySelector('svg');
		svgIcon.style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)`;
	}
}

export default GameView;

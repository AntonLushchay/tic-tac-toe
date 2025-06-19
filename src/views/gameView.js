import cross from '../assets/svg/cross.inline.svg';
import circle from '../assets/svg/circle.inline.svg';

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
	winBoardLine;
	winnerElem;
	winnerDialogElem;
	dialogCloseButtonElem;
	status = 'undefined';
	isDraw = false;

	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render(state) {
		console.log('state from model: ', state);

		if (state.status === 'undefined') {
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
		this.winBoardLine = this.appRoot.querySelector(
			'[data-js-game-win-line]',
		);
		this.winnerDialogElem = this.appRoot.querySelector(
			'[data-js-game-dialog]',
		);
		this.winnerElem = this.winnerDialogElem.querySelector(
			'[data-js-dialog-winner]',
		);
		this.dialogCloseButtonElem =
			this.winnerDialogElem.querySelector('#dialogCloseButton');

		console.log('buttons: ', this.buttons);
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
		this.setStatus(state);

		this.setCells(state);

		this.setCurrentPlayer(state);
	}

	setStatus(state) {
		this.status = state.status;
		console.log('status: ', this.status);
		if (this.status === 'finished') {
			this.showWinDialog(state.winner);
			this.drawWinLine(state.winner.winnerCells, state.winner.name);
		} else if (this.status === 'draw') {
			this.showWinDialog(state.winner);
		}
	}

	setCells(state) {
		this.cells.forEach((cell, index) => {
			if (!cell.innerHTML) {
				if (state.board[index] === 'x') {
					cell.innerHTML = this.crossIcon;
					this.setRandomCellTranslate(cell);
				} else if (state.board[index] === 'o') {
					cell.innerHTML = this.circleIcon;
					this.setRandomCellTranslate(cell);
				}
			}
		});
	}

	setCurrentPlayer(state) {
		if (state.turn === 'x') {
			this.currentPlayerElem.innerHTML = this.crossIcon;
			this.currentPlayerElem.style.setProperty('--color', 'red');
		} else {
			this.currentPlayerElem.innerHTML = this.circleIcon;
			this.currentPlayerElem.style.setProperty('--color', 'blue');
		}
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
			if (winnerName === 'x') {
				this.winnerDialogElem.style.setProperty(
					'--background-color',
					'rgb(251, 198, 198)',
				);
				this.winnerElem.innerHTML = this.crossIcon;
				this.winnerElem.style.setProperty('--color', 'red');
			} else {
				this.winnerElem.innerHTML = this.circleIcon;
				this.winnerElem.style.setProperty('--color', 'blue');
				this.winnerDialogElem.style.setProperty(
					'--background-color',
					'rgb(199, 199, 249)',
				);
			}
		} else if (this.status === 'draw') {
			const dialogDrawTextElem = this.winnerDialogElem.querySelector(
				'.dialog__game-winner',
			);
			dialogDrawTextElem.textContent = 'DRAW!';
		}
	}

	drawWinLine(winnerCells, winnerName) {
		const startCellData =
			this.cells[winnerCells[0]].getBoundingClientRect();
		const endCellData = this.cells[winnerCells[2]].getBoundingClientRect();

		const horizontalLineXY = {
			x1: startCellData.x,
			y1: startCellData.y + startCellData.height / 2,
			x2: endCellData.x + endCellData.width,
			y2: endCellData.y + endCellData.height / 2,
		};

		const verticalLineXY = {
			x1: startCellData.x + startCellData.width / 2,
			y1: startCellData.y,
			x2: endCellData.x + endCellData.width / 2,
			y2: endCellData.y + endCellData.height,
		};

		// Слева сверху в право вниз "\"
		const diagonalLineXY1 = {
			x1: startCellData.x,
			y1: startCellData.y,
			x2: endCellData.x + endCellData.width,
			y2: endCellData.y + endCellData.height,
		};

		// Слева снизу в право вверх "/"
		const diagonalLineXY2 = {
			x1: startCellData.x + startCellData.width,
			y1: startCellData.y,
			x2: endCellData.x,
			y2: endCellData.y + endCellData.height,
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
		const lineColor = winnerName === 'x' ? 'red' : 'blue';

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
		this.buttons = null;
		this.cells = [];
		this.currentPlayerElem = null;
		this.winnerElem = null;
		this.winBoardLine = null;
		this.status = 'undefined';
		this.winnerDialogElem = null;
		this.dialogCloseButtonElem = null;

		console.log('GameView event listeners cleaned up.');
	}
}

export default GameView;

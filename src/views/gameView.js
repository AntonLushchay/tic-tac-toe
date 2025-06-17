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
	winBoardLine;
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
		this.winBoardLine = this.appRoot.querySelector(
			'[data-js-game-win-line]',
		);
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

		this.cells.forEach((cell, index) => {
			if (!cell.innerHTML) {
				if (state.board[index] === 'x') {
					cell.innerHTML = this.crossIcon;
					this.setRandomCellMargin(cell);
				} else if (state.board[index] === 'o') {
					cell.innerHTML = this.circleIcon;
					this.setRandomCellMargin(cell);
				}
			}
		});

		this.currentPlayerElem.textContent = state.turn;

		if (state.winner.name) {
			this.winnerElem.textContent = `Winner: ${state.winner.name}`;
			this.status = 'finished';

			this.drawWinLine(state.winner.winnerCells, state.winner.name);
		}
	}

	drawWinLine(winnerCells, winnerName) {
		const startCellData =
			this.cells[winnerCells[0]].getBoundingClientRect();
		const endCellData = this.cells[winnerCells[2]].getBoundingClientRect();

		console.log('startCellData: ', startCellData);
		console.log('endCellData: ', endCellData);

		const horizontalLineXY = {
			x1: startCellData.x,
			y1: startCellData.y + startCellData.height / 2,
			x2: endCellData.x + endCellData.width,
			y2: endCellData.y + endCellData.height / 2,
		};
		console.log('horizontalLineXY: ', horizontalLineXY);

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
			x1: startCellData.x,
			y1: startCellData.y + startCellData.height,
			x2: endCellData.x + endCellData.width,
			y2: endCellData.y,
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
		const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // +90 to adjust the angle to CSS coordinate system
		const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const lineColor = winnerName === 'x' ? 'red' : 'blue';

		console.log('lineCoordinates: ', lineCoordinates);
		console.log('deltaX: ', deltaX);
		console.log('deltaY: ', deltaY);
		console.log('angle: ', angle);
		console.log('lineLength: ', lineLength);

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

	setRandomCellMargin(cell) {
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
		this.status = 'undefined';

		console.log('GameView event listeners cleaned up.');
	}
}

export default GameView;

import GameModel from '../models/gameModel';
import GameView from '../views/gameView';

import aiMove from './components/aiMove';

class GameController {
	model;
	view;
	hash;

	constructor(appRoot) {
		this.model = new GameModel();
		this.view = new GameView(appRoot, this);
		this.model.subscribe(this.handleModelUpdate);
		this.hash = 'game';
	}

	show(previousHash, gameType) {
		this.model.setGameType(gameType);
		this.view.render(this.model.getState(), previousHash);
	}

	handleModelUpdate = async (state) => {
		this.view.render(state);

		if (
			state.gameType === 'ai' &&
			state.turn === 'O' &&
			state.winner.name === null
		) {
			this.view.showAiThinking();
			await this.makeAiMove(state.board, state.settings.aiDifficulty);
			this.view.showAiThinking();
		}
	};

	setSettings(settings) {
		this.model.setSettings(settings);
	}

	buttonAction(buttonId) {
		switch (buttonId) {
			case 'restartButton':
				this.view.cleanup();
				this.model.resetBoard();
				break;
			case 'backButton':
				window.location.hash = 'home';
				this.model.resetState();
				break;
			case 'dialogCloseButton':
				this.view.hideDialog();
				break;
			case 'settingsButton':
				window.location.hash = 'settings';
				break;
			default:
				console.warn(`Unknown button clicked: ${buttonId}`);
				return;
		}
	}

	makeMove(cellID) {
		this.model.setCell(cellID);
	}

	async makeAiMove(board, difficulty) {
		const aiChoosenCell = await aiMove(board, difficulty);
		console.log(`AI chose cell: ${aiChoosenCell}`);

		this.model.setCell(aiChoosenCell);
	}

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default GameController;

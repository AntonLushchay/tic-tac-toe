import GameModel from '../models/gameModel.js';
import GameView from '../views/gameView.js';
import { soundService } from '../services/soundService.js';
import aiMove from './components/aiMove.js';

class GameController {
	_model;
	_view;

	constructor(appRoot) {
		this._model = new GameModel();
		this._view = new GameView(appRoot, this);
		this._model.subscribe(this._handleModelUpdate);
	}

	show(previousHash, gameType) {
		this._model.setGameType(gameType);
		this._view.render(this._model.getState(), previousHash);
	}

	setSettings(settings) {
		this._model.setSettings(settings);
		soundService.setSoundEnabled(settings.soundEnabled);
	}

	// Action called by the view when a button is clicked
	buttonAction(buttonId) {
		switch (buttonId) {
			case 'restartButton':
				this._view.cleanup();
				this._model.reset();
				break;
			case 'backButton':
				window.location.hash = 'home';
				this._model.reset(false); // Reset without notifying, view will be cleaned up
				break;
			case 'dialogCloseButton':
				this._view.hideDialog();
				break;
			case 'settingsButton':
				window.location.hash = 'settings';
				break;
			default:
				console.warn(`Unknown button clicked: ${buttonId}`);
		}
	}

	// Action called by the view when a cell is clicked
	makeMove(cellID) {
		this._model.setCell(cellID);
	}

	// Action called by the view to play a sound
	playSound(soundType) {
		soundService.playSound(soundType);
	}

	cleanup() {
		if (this._view) {
			this._view.cleanup();
		}
	}

	// Private method to handle model updates
	_handleModelUpdate = async (state) => {
		this._view.render(state);

		if (
			state.gameType === 'ai' &&
			state.turn === 'O' &&
			state.winner.name === null
		) {
			this._view.showAiThinking(true);
			const aiChosenCell = await aiMove(state.board, state.settings.aiDifficulty);
			this._model.setCell(aiChosenCell);
			this._view.showAiThinking(false);
		}
	};
}

export default GameController;

import GameModel from '../models/gameModel';
import GameView from '../views/gameView';

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

	show(previousHash) {
		this.view.render(this.model.getState(), previousHash);
	}

	handleModelUpdate = (state) => {
		this.view.render(state);
		return;
	};

	buttonAction(buttonId) {
		switch (buttonId) {
			case 'restartButton':
				this.view.cleanup();
				this.model.resetBoard();
				break;
			case 'backButton':
				window.location.hash = 'home';
				this.model.resetBoard();
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

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default GameController;

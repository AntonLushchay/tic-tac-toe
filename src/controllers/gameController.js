import GameModel from '../models/gameModel';
import GameView from '../views/gameView';

class GameController {
	model;
	view;

	constructor(appRoot) {
		this.model = new GameModel();
		this.view = new GameView(appRoot, this);

		this.model.subscribe(this.handleModelUpdate);
	}

	show() {
		this.view.render(this.model.getState());
	}

	handleModelUpdate = (state) => {
		this.view.updateView(state);
	};

	buttonAction(buttonId) {
		switch (buttonId) {
			case 'restartButton':
				window.location.hash = 'game';
				this.model.resetBoard();
				break;
			case 'backButton':
				window.location.hash = 'home';
				this.model.resetBoard();
				break;
			case 'dialogCloseButton':
				this.view.hideDialog();
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

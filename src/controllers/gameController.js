import GameView from '../views/gameView';

class GameController {
	view;

	constructor(appRoot) {
		this.view = new GameView(appRoot);
	}

	show() {
		this.view.render();
	}

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default GameController;

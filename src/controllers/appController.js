import HomeController from './homeController';
import GameController from './gameController';
import SettingsController from './settingsController';

class AppController {
	appRoot;
	homeController;
	gameController;
	settingsController;
	currentController;
	newHash;
	previousHash;

	constructor() {
		this.appRoot = document.getElementById('app-root');
		if (!this.appRoot) {
			throw new Error(
				'AppController Error: Root element #app-root not found.',
			);
		}

		this.homeController = new HomeController(this.appRoot);
		this.gameController = new GameController(this.appRoot);
		this.settingsController = new SettingsController(this.appRoot);

		window.addEventListener('hashchange', this.handleHashChange.bind(this));
		this.handleHashChange();
	}

	handleHashChange() {
		//settings нажали , back нажали
		this.previousHash = this.newHash || 'home'; //game, settings
		this.newHash = window.location.hash.slice(1); // settings, game

		if (
			this.currentController && //game, settings
			typeof this.currentController.cleanup === 'function' &&
			this.newHash !== 'settings' // false, true
		) {
			this.currentController.cleanup();
			console.log(
				`Cleaning up controller: ${this.currentController.constructor.name}`,
			);
		}

		let nextController;
		switch (this.newHash) {
			case 'game':
				nextController = this.gameController;
				break;

			case 'settings':
				nextController = this.settingsController;
				break;

			case '':
			default:
				nextController = this.homeController;
				break;
		}

		if (nextController && nextController.show) {
			nextController.show(this.previousHash);
			this.currentController = nextController; // settings controller
		} else {
			console.warn(
				`AppController Error: No controller found for hash: ${this.newHash}. Defaulting to home view.`,
			);
		}
	}
}

export default AppController;

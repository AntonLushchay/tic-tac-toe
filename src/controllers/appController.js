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

		this.settingsController = new SettingsController(this.appRoot);
		this.homeController = new HomeController(this.appRoot);
		this.gameController = new GameController(this.appRoot);

		this.settingsController.subscribe(this.handleModelUpdate);

		window.addEventListener('hashchange', this.handleHashChange.bind(this));
		this.handleHashChange();
	}

	handleModelUpdate = (settings) => {
		console.log('settings in App controller: ', settings);
		this.gameController.setSettings(settings);
		// this.homeController.setSettings(settings);
	};

	handleHashChange() {
		this.previousHash = this.newHash || 'home';
		this.newHash = window.location.hash.slice(1);

		if (
			this.currentController &&
			typeof this.currentController.cleanup === 'function' &&
			this.newHash !== 'settings'
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
			this.currentController = nextController;
		} else {
			console.warn(
				`AppController Error: No controller found for hash: ${this.newHash}. Defaulting to home view.`,
			);
		}
	}
}

export default AppController;

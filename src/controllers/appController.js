import HomeController from './homeController';
import GameController from './gameController';
// import SettingsController from './settingsController';

class AppController {
	appRoot;
	homeController;
	gameController;
	settingsController;
	currentController;

	constructor() {
		this.appRoot = document.getElementById('app-root');
		if (!this.appRoot) {
			throw new Error(
				'AppController Error: Root element #app-root not found.',
			);
		}

		this.homeController = new HomeController(this.appRoot);
		this.gameController = new GameController(this.appRoot);
		// this.settingsController = new SettingsController(this.appRoot);

		window.addEventListener('hashchange', this.handleHashChange.bind(this));
		this.handleHashChange();
	}

	handleHashChange() {
		const hash = window.location.hash.slice(1);

		if (
			this.currentController &&
			typeof this.currentController.cleanup === 'function'
		) {
			this.currentController.cleanup();
		}

		let nextController;
		switch (hash) {
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
			nextController.show();
			this.currentController = nextController;
		} else {
			console.warn(
				`AppController Error: No controller found for hash: ${hash}. Defaulting to home view.`,
			);
			this.homeController.show();
			this.currentController = this.homeController;
		}
	}
}

export default AppController;

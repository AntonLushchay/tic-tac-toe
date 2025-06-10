import HomeController from './homeController';
// import GameController from './gameController';
// import SettingsController from './settingsController';

class AppController {
	appRoot;
	homeController;
	gameController;
	settingsController;

	constructor() {
		this.appRoot = document.getElementById('app-root');
		if (!this.appRoot) {
			throw new Error(
				'AppController Error: Root element #app-root not found.',
			);
		}

		this.homeController = new HomeController(this.appRoot);
		// this.gameController = new GameController();
		// this.settingsController = new SettingsController();

		window.addEventListener('hashchange', this.handleHashChange.bind(this));
		this.handleHashChange();
	}

	handleHashChange() {
		const hash = window.location.hash.slice(1);
		console.log('hash', hash);
		switch (hash) {
			case '':
				this.homeController.show();
				break;
			case 'game':
				this.gameController.show();
				break;
			case 'settings':
				this.settingsController.show();
				break;
			default:
				this.homeController.show();
				break;
		}
	}
}

export default AppController;

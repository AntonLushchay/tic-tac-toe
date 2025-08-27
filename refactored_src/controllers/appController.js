import HomeController from './homeController.js';
import GameController from './gameController.js';
import SettingsController from './settingsController.js';
import { i18nService } from '../services/i18nService.js';

class AppController {
	_appRoot;
	_settingsController;
	_gameController;
	_homeController;
	_currentController;

	constructor() {
		this._appRoot = document.getElementById('app-root');
		if (!this._appRoot) {
			throw new Error('AppController Error: Root element #app-root not found.');
		}

		// Initialize controllers
		this._settingsController = new SettingsController(this._appRoot);
		this._gameController = new GameController(this._appRoot);
		this._homeController = new HomeController(this._appRoot);

		// Subscribe to settings changes to pass them to other controllers
		this._settingsController.subscribe(this._handleSettingsChange);

		// Set initial settings and language
		const initialSettings = this._settingsController.getSettings();
		this._handleSettingsChange(initialSettings);
		i18nService.setLanguage(initialSettings.language);

		window.addEventListener('hashchange', this._handleHashChange);
		this._handleHashChange(); // Initial route handling
	}

	_handleSettingsChange = (settings) => {
		this._gameController.setSettings(settings);
		this._homeController.setSettings(settings);
		// When language changes, we need to re-render the current view
		if (this._currentController && this._currentController.show) {
			this._currentController.show();
		}
	}

	_handleHashChange = () => {
		const hash = window.location.hash.slice(1);
		let [route, params] = hash.split('?');

		if (this._currentController && typeof this._currentController.cleanup === 'function') {
			this._currentController.cleanup();
		}

		let nextController;
		let gameType = null;

		switch (route) {
			case 'game':
				nextController = this._gameController;
				if (params && params.includes('type=ai')) {
					gameType = 'ai';
				} else {
					gameType = 'player';
				}
				break;
			case 'settings':
				nextController = this._settingsController;
				break;
			case '':
			case 'home':
			default:
				nextController = this._homeController;
				break;
		}

		if (nextController && nextController.show) {
			nextController.show(null, gameType); // Passing gameType for game controller
			this._currentController = nextController;
		} else {
			console.warn(`AppController Error: No controller found for hash: ${hash}.`);
		}
	}
}

export default AppController;

import HomeView from '../views/homeView.js';

class HomeController {
	_view;

	constructor(appRoot) {
		this._view = new HomeView(appRoot, this);
	}

	show() {
		this._view.render();
	}

	setSettings(settings) {
		// Home view doesn't currently depend on settings, but it's good practice to have the method.
	}

	buttonAction(buttonId) {
		switch (buttonId) {
			case 'playerVPlayerButton':
				window.location.hash = 'game';
				break;
			case 'playerVAiButton':
				window.location.hash = 'game?type=ai';
				break;
			case 'settingsButton':
				window.location.hash = 'settings';
				break;
			default:
				console.warn(`Unknown button clicked in Home: ${buttonId}`);
		}
	}

	cleanup() {
		if (this._view) {
			this._view.cleanup();
		}
	}
}

export default HomeController;

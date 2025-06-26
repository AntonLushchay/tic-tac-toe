import HomeView from '../views/homeView';

class HomeController {
	view;
	hash;
	settings = {};

	constructor(appRoot) {
		this.view = new HomeView(appRoot, this);
		this.hash = 'home';
	}

	show() {
		this.view.render(this.settings);
	}

	setSettings(settings) {
		// this.view.setSettings(settings);
		this.settings = settings;
	}

	navigateTo(buttonId) {
		switch (buttonId) {
			case 'oneVsOnePlayButton':
				window.location.hash = 'game';
				break;
			case 'settingsButton':
				window.location.hash = 'settings';
				break;
			default:
				console.warn(`Unknown button clicked: ${buttonId}`);
				return;
		}
	}

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default HomeController;

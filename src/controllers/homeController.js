import HomeView from '../views/homeView';

class HomeController {
	view;

	constructor(appRoot) {
		this.view = new HomeView(appRoot, this);
	}

	show() {
		this.view.render();
	}

	navigateTo(buttonId) {
		switch (buttonId) {
			case 'playButton':
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

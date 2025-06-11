import HomeView from '../views/homeView';

class HomeController {
	view;

	constructor(appRoot) {
		this.view = new HomeView(appRoot);
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

export default HomeController;

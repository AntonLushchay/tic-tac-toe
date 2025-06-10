import HomeView from '../views/homeView';

class HomeController {
	view;

	constructor(appRoot) {
		this.view = new HomeView(appRoot);
	}

	show() {
		this.view.render();
	}
}

export default HomeController;

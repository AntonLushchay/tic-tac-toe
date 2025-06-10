import homeTemplate from './templates/home-template.html';

class HomeView {
	template;
	appRoot;

	constructor(appRoot) {
		this.template = homeTemplate;
		this.appRoot = appRoot;
	}

	render() {
		this.appRoot.innerHTML = this.template;
	}
}

export default HomeView;

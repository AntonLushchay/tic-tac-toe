import pencilSvg from '../assets/svg/pencil-filter.svg';

import gameTemplate from './templates/game-template.html';

class GameView {
	template;
	appRoot;
	pencilIcon;

	constructor(appRoot) {
		this.template = gameTemplate;
		this.appRoot = appRoot;
		this.penciline = pencilSvg;
	}

	render() {
		console.log('template game controller', this.template);
		this.appRoot.innerHTML = this.template;
		// this.bindEvents();
	}

	bindEvents() {
		const pencilElement = this.appRoot.querySelector('.pencil-icon');
		if (pencilElement) {
			pencilElement.src = this.penciline;
		}
	}

	cleanup() {
		console.log('GameView cleanup called.');
	}
}

export default GameView;

import BaseView from './baseView.js';
import { i18nService } from '../services/i18nService.js';
import homeTemplate from './templates/home-template.html';

class HomeView extends BaseView {
	_template = homeTemplate;
	_controller;

	constructor(appRoot, controller) {
		super(appRoot);
		this._controller = controller;
	}

	render() {
		this._renderTemplate(this._template);
		this._bindElements();
		this._bindListeners();
		this._updateLanguage();
	}

	_bindElements() {
		this.titleElem = this._findElement('.home__title');
		this.buttons = this._findElements('[data-js-home-button]');
	}

	_bindListeners() {
		this.buttons.forEach(button => {
			this._addListener(button, 'click', this._handleButtonClick);
		});
	}

	_handleButtonClick = (event) => {
		this._controller.buttonAction(event.currentTarget.id);
	}

	_updateLanguage() {
		this.titleElem.textContent = i18nService.getString('title', 'homeView');
		this.buttons.forEach(button => {
			button.textContent = i18nService.getString(button.id, 'homeView');
		});
	}
}

export default HomeView;

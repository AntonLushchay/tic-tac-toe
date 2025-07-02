import settingsModel from '../models/settingsModel';
import settingsView from '../views/settingsView';

class SettingsController {
	constructor(appRoot) {
		this.model = new settingsModel();
		this.view = new settingsView(appRoot, this);
		this.hash = 'settings';
		this.observers = [];
		this.model.subscribe(this.handleModelUpdate);
	}

	subscribe(observer) {
		this.observers.push(observer);
	}

	show(previousHash) {
		this.view.render(this.model.getState());
		this.previousHash = previousHash;
	}

	getSettings() {
		return this.model.getState();
	}

	handleModelUpdate = (settings) => {
		this.view.updateSettingsView(settings);
		this.notifyAppController(settings);
		return;
	};

	notifyAppController(settings) {
		this.observers.forEach((observer) => observer(settings));
	}

	buttonAction(buttonId) {
		switch (buttonId) {
			case 'backButton':
				window.location.hash = this.previousHash || 'home';
				break;
		}
	}

	changeLanguage(lang) {
		this.model.setLanguage(lang);
	}

	changeFirstPlayer(sign) {
		this.model.setFirstPlayer(sign);
	}

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default SettingsController;

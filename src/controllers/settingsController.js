import settingsModel from '../models/settingsModel';
import settingsView from '../views/settingsView';

// В настройках пусть будет:
// выбор языка
// настройка звука
// выбор кто ходит первый

class SettingsController {
	constructor(appRoot) {
		this.model = new settingsModel();
		this.view = new settingsView(appRoot, this);
		this.hash = 'settings';
	}

	show(previousHash) {
		this.view.render();
		this.previousHash = previousHash;
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

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default SettingsController;

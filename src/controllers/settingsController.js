import settingsModel from '../models/settingsModel';
import settingsView from '../views/settingsView';

// В настройках пусть будет:
// выбор языка
// настройка звука
// выбор кто ходит первый

class SettingsController {
	constructor(appRoot) {
		this.settingsModel = new settingsModel();
		this.view = new settingsView(appRoot, this);
	}

	show() {
		this.view.render();
	}

	changeLanguage(lang) {
		this.settingsModel.setLanguage(lang);
	}

	cleanup() {
		if (this.view) {
			this.view.cleanup();
		}
	}
}

export default SettingsController;

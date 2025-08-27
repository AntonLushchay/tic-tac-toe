import crossSound from '../assets/sound/cross.m4a';
import circleSound from '../assets/sound/circle.m4a';
import lineSound from '../assets/sound/line.m4a';

class SoundService {
	_soundEnabled = true;
	_sounds = {
		cross: new Audio(crossSound),
		circle: new Audio(circleSound),
		line: new Audio(lineSound),
	};

	constructor() {
		// Pre-configure audio objects
		this._sounds.cross.currentTime = 0.3;
		this._sounds.circle.currentTime = 0.6;
		this._sounds.line.currentTime = 0.3;
	}

	setSoundEnabled(isEnabled) {
		this._soundEnabled = isEnabled;
	}

	playSound(soundType) {
		if (!this._soundEnabled) {
			return;
		}

		const sound = this._sounds[soundType];
		if (sound) {
			// To allow playing the sound again before it finishes, we reset its current time.
			sound.currentTime = soundType === 'circle' ? 0.6 : 0.3;
			sound.play().catch((error) => {
				console.warn(`Error playing sound '${soundType}':`, error);
			});
		} else {
			console.warn(`Sound type '${soundType}' not recognized.`);
		}
	}
}

// Export a singleton instance
export const soundService = new SoundService();

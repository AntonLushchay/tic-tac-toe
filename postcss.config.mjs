export default {
	plugins: [
		// Autoprefixer для автоматического добавления вендорных префиксов
		[
			'autoprefixer',
			{
				grid: 'autoplace', // Поддержка CSS Grid
				flexbox: 'no-2009', // Исключаем старый flexbox синтаксис
			},
		],

		// PostCSS Preset Env для современных CSS возможностей
		[
			'postcss-preset-env',
			{
				stage: 1, // Используем стабильные возможности CSS
				features: {
					'nesting-rules': true, // Поддержка вложенности CSS
					'custom-properties': true, // CSS переменные
					'logical-properties-and-values': false, // Пока отключаем логические свойства
				},
			},
		],
	],
};

import { defineConfig } from 'eslint/config'; //кажется это баг с подчеркиванием
import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
	{
		ignores: ['dist/**/*', 'node_modules/**/*'],
	},
	prettierConfig,
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: {
			js,
			import: importPlugin,
			prettier: prettierPlugin,
		},
		extends: ['js/recommended'],
		rules: {
			// Современный JavaScript
			'no-var': 'error',
			'prefer-const': 'error',

			// Предотвращение ошибок
			eqeqeq: ['error', 'always'],

			// Читаемость и обслуживаемость
			'max-depth': ['warn', 4],
			'max-lines': ['warn', 300],

			// Отладка
			'no-console': 'warn',
			'no-alert': 'warn',

			// Стиль кода
			camelcase: 'warn',
			quotes: ['warn', 'single'],

			// Правила импорта
			'import/no-unresolved': 'error',
			'import/named': 'error',
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
					'newlines-between': 'always',
				},
			],

			// Интеграция с Prettier
			'prettier/prettier': 'warn',
		},
		languageOptions: { globals: globals.browser },
	},
]);

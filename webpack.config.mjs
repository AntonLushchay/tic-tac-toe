import path from 'path';
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
	const isProduction = argv.mode === 'production';
	return {
		mode: isProduction ? 'production' : 'development',

		// Кэширование для ускорения пересборки
		cache: {
			type: 'filesystem',
			cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
		},

		entry: {
			main: './src/index.js',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isProduction ? '[name].[contenthash].js' : '[name].js',
			assetModuleFilename: (pathData) => {
				const filepath = path
					.dirname(pathData.filename)
					.split('/')
					.slice(1);
				if (isProduction) {
					return `${filepath.join('/')}/[name].[hash][ext][query]`;
				} else {
					return `${filepath.join('/')}/[name][ext][query]`;
				}
			},
			clean: true,
		},

		optimization: {
			minimize: isProduction, // Минификация только в production и только JS
			usedExports: isProduction, // Tree-shaking только в production
			sideEffects: false,
			splitChunks: isProduction
				? {
						chunks: 'all',
						minSize: 20000, // Минимальный размер чанка 20KB
						maxSize: 244000, // Максимальный размер чанка 244KB
						cacheGroups: {
							vendor: {
								test: /[\\/]node_modules[\\/]/,
								name: 'vendors',
								chunks: 'all',
								priority: 10,
								reuseExistingChunk: true,
							},
							common: {
								name: 'common',
								minChunks: 2,
								chunks: 'all',
								priority: 5,
								reuseExistingChunk: true,
							},
						},
					}
				: false,

			// Кэширование модулей для лучшей производительности
			moduleIds: isProduction ? 'deterministic' : 'named',
			chunkIds: isProduction ? 'deterministic' : 'named',
		},

		resolve: {
			// Ускоряем поиск модулей
			extensions: ['.js', '.json'],
			modules: ['node_modules'],
			// Кэш для резолвинга
			cache: !isProduction,
		},

		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										debug: !isProduction,
										// Только необходимые полифиллы
										useBuiltIns: 'usage',
										corejs: 3,
										// Более агрессивная оптимизация в production
										modules: false,
									},
								],
							],
							cacheDirectory: !isProduction,
							cacheCompression: false, // Быстрее без сжатия кэша
						},
					},
				},

				// HTML Loader - обрабатывает картинки в HTML
				{
					test: /\.html$/i,
					loader: 'html-loader',
					exclude: /node_modules/,
					options: {
						sources: {
							list: [
								// Картинки
								{
									tag: 'img',
									attribute: 'src',
									type: 'src',
								},
								// Иконки
								{
									tag: 'link',
									attribute: 'href',
									type: 'src',
									filter: (tag, attribute, attributes) => {
										return (
											attributes.rel &&
											attributes.rel.includes('icon')
										);
									},
								},
								// HTML файлы в ссылках
								{
									tag: 'a',
									attribute: 'href',
									type: 'src',
									filter: (tag, attribute, attributes) => {
										// Обрабатываем только .html файлы
										return /\.html$/.test(attributes.href);
									},
								},
							],
						},
					},
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										[
											'autoprefixer',
											{
												grid: 'autoplace', // Автоматическая поддержка CSS Grid
											},
										],
										// Можно добавить больше плагинов в будущем
										// ...(isProduction ? [['cssnano', { preset: 'default' }]] : []),
									],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									outputStyle: isProduction
										? 'compressed'
										: 'expanded',
								},
							},
						},
					],
				},

				{
					test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
					type: 'asset',
					parser: {
						dataUrlCondition: {
							maxSize: 8 * 1024, // 8KB - если меньше, то встроить в base64
						},
					},
				},
			],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				chunks: ['main'],
				minify: isProduction
					? {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyCSS: true,
							minifyJS: true,
						}
					: false,
			}),
			new HtmlWebpackPlugin({
				template: './src/pages/about.html',
				filename: './pages/about.html',
				chunks: [],
				minify: isProduction
					? {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyCSS: true,
							minifyJS: true,
						}
					: false,
			}),

			new MiniCssExtractPlugin({
				filename: isProduction
					? '[name].[contenthash].css'
					: '[name].css',
			}),
		].filter(Boolean),

		devServer: {
			static: {
				directory: path.join(__dirname, 'dist'),
			},
			watchFiles: ['src/**/*.html'],
			compress: true,
			port: 3000,
			open: true,
			hot: true,
			devMiddleware: {
				writeToDisk: true,
				stats: 'minimal',
			},
			client: {
				progress: true, // Показываем прогресс компиляции
			},
		},

		devtool: isProduction ? false : 'source-map',
	};
};

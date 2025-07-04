import path from 'path';
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
	const isProduction = argv.mode === 'production';

	const basePlugins = [
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
		new MiniCssExtractPlugin({
			filename: isProduction
				? '[name].[contenthash:8].css'
				: '[name].css',
			chunkFilename: isProduction
				? '[id].[contenthash:8].css'
				: '[id].css',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: 'src/assets/svg',
					to: 'assets/svg/',
					globOptions: {
						ignore: ['**/*.inline.svg'],
					},
				},
			],
		}),
	];

	return {
		mode: isProduction ? 'production' : 'development',

		// Кэш отключен по причине бага:
		// https://github.com/webpack-contrib/image-minimizer-webpack-plugin/issues/417
		// https://github.com/webpack/webpack/issues/14532
		// cache: {
		// 	type: 'filesystem',
		// 	cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
		// 	buildDependencies: {
		// 		config: [__filename],
		// 	},
		// },

		entry: {
			main: './src/app.js',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
			chunkFilename: isProduction
				? '[name].[contenthash:8].chunk.js'
				: '[name].chunk.js',
			publicPath: isProduction ? '/tic-tac-toe/' : '/',
			assetModuleFilename: (pathData) => {
				const filepath = path
					.dirname(pathData.filename)
					.split('/')
					.slice(1);
				if (isProduction) {
					return `${filepath.join('/')}/[name].[contenthash][ext][query]`;
				} else {
					return `${filepath.join('/')}/[name][ext][query]`;
				}
			},
			clean: true,
			environment: {
				arrowFunction: true,
				bigIntLiteral: false,
				const: true,
				destructuring: true,
				dynamicImport: true,
				forOf: true,
				module: true,
			},
		},
		optimization: {
			minimize: isProduction,
			usedExports: true,
			sideEffects: false,
			runtimeChunk: isProduction ? 'single' : false,
			splitChunks: {
				chunks: 'all',
				minSize: 20000,
				maxSize: 244000,
				cacheGroups: {
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						priority: -10,
						chunks: 'all',
						enforce: true,
						reuseExistingChunk: true,
					},
					styles: {
						name: 'styles',
						test: /\.(css|scss|sass)$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
			moduleIds: isProduction ? 'deterministic' : 'named',
			chunkIds: isProduction ? 'deterministic' : 'named',
		},
		resolve: {
			extensions: ['.js', '.mjs', '.json'],
			modules: ['node_modules'],
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
										useBuiltIns: 'usage',
										corejs: 3,
										modules: false,
									},
								],
							],
							cacheDirectory: true,
							cacheCompression: false,
						},
					},
				},
				{
					test: /\.html$/i,
					loader: 'html-loader',
					options: {
						sources: {
							list: [
								{
									tag: 'img',
									attribute: 'src',
									type: 'src',
								},
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
								{
									tag: 'use',
									attribute: 'href', // или 'xlink:href' если используется
									type: 'src', // Указывает html-loader обрабатывать это как ссылку на ресурс
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
							options: {
								importLoaders: 2,
								modules: {
									auto: true,
									localIdentName: isProduction
										? '[hash:base64:5]'
										: '[name]__[local]--[hash:base64:5]',
								},
							},
						},
						{
							loader: 'postcss-loader',
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
					test: /\.(png|jpg|jpeg|gif|mp3|m4a)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.inline\.svg$/i,
					type: 'asset/source',
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
				},
			],
		},
		plugins: isProduction
			? [
					...basePlugins,
					// Минимизация и генерация форматов для production
					new ImageMinimizerPlugin({
						test: /\.(jpe?g|png|gif|svg)$/i,
						minimizer: {
							implementation: ImageMinimizerPlugin.sharpMinify,
							options: {
								encodeOptions: {
									jpeg: { quality: 80 },
									png: { quality: 80 },
									gif: {},
								},
							},
						},
						// Генерация WebP и AVIF
						generator: [
							{
								// type: 'asset',
								preset: 'webp',
								implementation:
									ImageMinimizerPlugin.sharpGenerate,
								options: {
									encodeOptions: {
										webp: { quality: 75 },
									},
								},
							},
							{
								// type: 'asset',
								preset: 'avif',
								implementation:
									ImageMinimizerPlugin.sharpGenerate,
								options: {
									encodeOptions: {
										avif: { quality: 70 },
									},
								},
							},
						],
					}),
				]
			: basePlugins,
		devServer: {
			compress: true,
			watchFiles: ['src/**/*'],
			open: true,
			hot: true,
			devMiddleware: {
				writeToDisk: true,
				stats: 'minimal',
			},
		},
		devtool: isProduction ? false : 'source-map',
		performance: {
			hints: isProduction ? 'warning' : false,
			maxEntrypointSize: 250000,
			maxAssetSize: 250000,
		},
		stats: 'normal',
		infrastructureLogging: {
			level: 'info',
		},
	};
};

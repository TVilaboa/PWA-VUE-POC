const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bundleOutputDir = './wwwroot/dist';
// ES6+
//import WebpackPwaManifest from 'webpack-pwa-manifest'

// ES5
var WebpackPwaManifest = require('webpack-pwa-manifest')


module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 'main': './ClientApp/boot-app.js' },
        resolve: {
            extensions: ['.js', '.vue'],
            alias: {
                'vue$': 'vue/dist/vue',
                'components': path.resolve(__dirname, './ClientApp/components'),
                'views': path.resolve(__dirname, './ClientApp/views'),
                'utils': path.resolve(__dirname, './ClientApp/utils'),
                'api': path.resolve(__dirname, './ClientApp/store/api')
            }
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [
                { test: /\.vue$/, include: /ClientApp/, use: 'vue-loader' },
                { test: /\.js$/, include: /ClientApp/, use: 'babel-loader' },
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader' }) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            new WebpackPwaManifest({
                name: 'PWA Vue POC',
                short_name: 'PWAVue',
                description: 'My awesome Progressive Web App!',
                background_color: '#ffffff',
                crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
                icons: [
                    //{
                    //    src: path.resolve('src/assets/icon.png'),
                    //    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                    //},
                    //{
                    //    src: path.resolve('src/assets/large-icon.png'),
                    //    size: '1024x1024' // you can also use the specifications pattern
                    //},
                    {
                        src: path.resolve('ClientApp/assets/favicon.ico'),
                        'sizes': '64x64 32x32 24x24 16x16',
                        'type': 'image/x-icon'
                    }

                ]
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin(),
                new ExtractTextPlugin('site.css')
            ])
    }];
};

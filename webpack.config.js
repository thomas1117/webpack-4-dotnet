const path = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const jsonfile = require('jsonfile');
const PORT = 8080;
const WebpackMd5Hash = require('webpack-md5-hash');

// similiar to extract text plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// export as a function to pass context
module.exports = (env, argv) => {
    let prod = argv.mode === 'production';

    const webpackObj = {
        entry: { main: __dirname + '/web/wwwroot/js/main.js' },
        devServer: {
            host: 'localhost', // Defaults to `localhost`
            port: PORT, // Defaults to 8080
            hot: true,
            inline: true,
        },
        output: {
            path: path.resolve(__dirname + '/web/wwwroot', 'dist'),
            filename: prod ? '[name].[chunkhash].js' : 'main.js'
        },
        devtool: prod ? '' : 'cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                //MiniCssExtractPlugin.loader, 
                {
                    test: /\.scss$/,
                    use:  ['style-loader?sourceMap',/**/ 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
                },
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'vue-loader'
                    }
                },
            ]
        },
        resolve: {
            alias: {
                vue: prod ? 'vue/dist/vue.min' : 'vue/dist/vue.js',
                $: "jquery",
                jquery: "jQuery",
                "window.jQuery": "jquery"
            },
            extensions: ['*', '.js', '.vue'],
        },
        plugins: [],
        performance: { hints: false },
    };

    // const webpackObj = {
    //     entry: { main: __dirname + '/web/wwwroot/js/main.js' },
    //     devServer: {
    //         host: 'localhost', // Defaults to `localhost`
    //         port: PORT, // Defaults to 8080
    //         hot: true,
    //         inline: true,
    //     },
    //     output: {
    //         path: path.resolve(__dirname + '/web/wwwroot', 'dist'),
    //         filename: prod ? '[name].[chunkhash].js' : 'main.js'
    //     },
    //     plugins: []
    // };
    
    if (!prod) {
        let file =  path.resolve(__dirname + '/web/wwwroot/dist/manifest.json');
        let obj = {js: "http://localhost:8080/main.js"};
        jsonfile.writeFile(file, obj, {spaces: 4}, function(err) {
            console.error(err)
        })
    } else {
        webpackObj.plugins.push(new WebpackAssetsManifest({
            output: 'manifest.json',
            space: 2,
            writeToDisk: false,
            assets: {},
            replacer: require('./format'),
        }));   
    }

    return webpackObj;
}
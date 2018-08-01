const path = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const jsonfile = require('jsonfile');
const WebpackMd5Hash = require('webpack-md5-hash');
// similiar to extract text plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PORT = 8080;
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
                {
                    test: /\.scss$/,
                    use:  [
                        prod ? MiniCssExtractPlugin.loader : 'style-loader?sourceMap', 
                        'css-loader?sourceMap', 
                        'postcss-loader?sourceMap', 
                        'sass-loader?sourceMap'
                    ]
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
        optimization: {},
        plugins: []
        ,
        performance: { hints: false },
    };
    
    if (prod) {
        webpackObj.plugins.push(new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: prod ? '[name].[chunkhash].css' : "[name].css",
            chunkFilename: "[id].css"
        }));
        
        webpackObj.optimization = {
            splitChunks: {
                cacheGroups: {
                    'vendor': {
                        test: /[\\/]node_modules[\\/]/,
                            name: 'vendor',
                            chunks: "initial",
                    },
                    'main': {
                        test: __dirname + '/web/wwwroot/js/',
                            name: 'main',
                            chunks: "all",
                    }
                }
            }
        }
    } 
    
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
            publicPath: '/dist/',
            replacer: require('./format'),
        }));   
    }

    return webpackObj;
}
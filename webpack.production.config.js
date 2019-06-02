var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var config = {
    entry: path.join(__dirname, './src/main.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/bundle.js'
    },
    resolve:{
        alias: { //别名
            jquery:'jquery/dist/jquery.js'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './index.html'),//html模板路径
            filename: 'index.html',//生成的html存放路径，相对于 path
            inject: true, //允许插件修改哪些内容，包括head与body
            hash: false,//为静态资源生成hash值
            minify: {
                collapseWhitespace: true,//删除空白符
                removeComments: true,//移除注释
                removeAttributeQuotes: true
            },
        }),
        new webpack.ProvidePlugin({
            '$': 'jquery'//无需import直接使用
        }),
        new ExtractTextWebpackPlugin("css/[name].css"),//提取css的插件
        new OptimizeCssAssetsPlugin()// 压缩CSS的插件
    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            maxInitialRequests: 10,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'jquery',
                    enforce: true,
                    priority: 10,
                    chunks: 'initial'
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",//从哪里取出样式
                    use: ["css-loader", {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }]//顺序是由后向前查找
                })
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/, //排出node_modules里面的js文件
            },
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', {
                        loader: "postcss-loader",//自动兼容前缀
                        options: {
                            plugins: [
                                require("autoprefixer")//自动兼容前缀
                            ]
                        }
                    }, "less-loader"]
                })
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
                use: ['url-loader?limit=10240&&name=[name].[ext]&outputPath=./assets/&publicPath=../'],
            }
        ]
    }
};
module.exports = config;
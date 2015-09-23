module.exports = [

    {
        entry: {
            "downloads": "./app/downloads.js",
            /*frontpage views*/
            "download": "./app/views/download.js",
            /*admin views*/
            "download-settings": "./app/views/admin/settings.js",
            "admin-file": "./app/views/admin/file.js",
            "admin-download": "./app/views/admin/download.js"
        },
        output: {
            filename: "./app/bundle/[name].js"
        },
        externals: {
            "lodash": "_",
            "jquery": "jQuery",
            "uikit": "UIkit",
            "vue": "Vue"
        },
        module: {
            loaders: [
                {test: /\.vue$/, loader: "vue"}
            ]
        }
    }

];

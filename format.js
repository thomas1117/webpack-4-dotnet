const path = require('path');
module.exports = (key, value) => {

    const manifest = value;
    const tracker = {};
    const keysToDelete = [];
    const keys = Object.keys(manifest);
    keys.forEach((src) => {
        var key = src.split('.')[1];

        if (!tracker[key]) {
            tracker[key] = [];
        }
        
        tracker[key].push(manifest[src]);
        manifest[key] = manifest[src];
    });

    // for json formatting of keys returns string or array
    for (var key in manifest) {
        manifest[key] = tracker[key] ? tracker[key] : manifest[key];

        if (keysToDelete.indexOf(key) !== -1) {
            delete manifest[key];
        }
    }

    return manifest;
};
"use strict";
exports.__esModule = true;
exports._dirname = void 0;
var path_1 = require("path");
var url_1 = require("url");
exports._dirname = typeof __dirname !== "undefined"
    ? __dirname
    : (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));

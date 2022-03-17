"use strict";
exports.__esModule = true;
var Backend_1 = require("./source/backend/Backend");
var fs_1 = require("fs");
var path_1 = require("path");
var discord_js_1 = require("discord.js");
//import config from "./config.json" assert { type: "json" }
var dirname_1 = require("./source/dirname");
var testItem;
var mem;
var backend2 = new Backend_1["default"]();
//backend2.treasuryForGuild()
var schatzkammerPath = (0, path_1.resolve)(dirname_1._dirname, "./schatzkammer.json");
var rawSchatzkammer = (0, fs_1.readFileSync)(schatzkammerPath).toString();
var schatzkammer = new discord_js_1.Collection(JSON.parse(rawSchatzkammer));
var _loop_1 = function (userid, loot) {
    //mem = ctx.guild.get_member(userid)
    loot.items.forEach(function (element) {
        testItem.gulden = Math.floor(Math.random() * 100 + 1);
        testItem.item = element;
        backend2.rob(userid, testItem);
    });
};
for (var _i = 0, schatzkammer_1 = schatzkammer; _i < schatzkammer_1.length; _i++) {
    var _a = schatzkammer_1[_i], userid = _a[0], loot = _a[1];
    _loop_1(userid, loot);
}
var ergebnis;
ergebnis = backend2.treasuryForGuild();
for (var _b = 0, ergebnis_1 = ergebnis; _b < ergebnis_1.length; _b++) {
    var _c = ergebnis_1[_b], userid = _c[0], loot = _c[1];
    console.log("user: " + userid);
    console.log("gulden: " + loot.gulden);
    for (var _d = 0, _e = loot.items; _d < _e.length; _d++) {
        var x = _e[_d];
        console.log(x);
    }
}

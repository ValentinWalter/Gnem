"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.run("CREATE  TABLE  IF NOT EXIST schatzkammer(NR int(5) Primary Key Auto_Incroment, Item Varchar(20), gulden int(10), opfer Varchar(20)");
var haltItem;
var bag;
var Backend = /** @class */ (function () {
    function Backend() {
    }
    Backend.prototype.rob = function (member, loot) {
        // mutate database
        db.run("insert into schatzkammer (Item, Gulden, Opfer) Values  (?,?,?)", (loot.item, loot.gulden, member));
    };
    Backend.prototype.treasuryForGuild = function ( /*guild: Guild*/) {
        // read database
        var rueckgabe = new discord_js_1.Collection();
        db.each("select opfer, Sum(gulden) as guld, count(*) as anzahl from schatzkammer group by opfer", function (err, row) {
            //var member:string
            //member = row.opfer
            //if(row.opfer.guild == guild){
            while (bag.length != 0) {
                bag.pop;
            }
            db.each("select Item as i from schatzkammer where opfer = '(?)'", (row.opfer), function (err2, row2) {
                console.log(row2.i);
                bag.push(row2.i);
            });
            haltItem.gulden = row.guld;
            haltItem.items = bag;
            rueckgabe.set(row.opfer, haltItem);
            //}
        });
        return rueckgabe;
    };
    return Backend;
}());
exports["default"] = Backend;

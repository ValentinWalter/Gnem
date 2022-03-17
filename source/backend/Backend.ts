import { createComponent } from "@discordjs/builders"
import { Collection, Guild, GuildMember } from "discord.js"
export type Loot = {
  gulden: number
  items: string[]
}

export type LootItem = {
  gulden: number
  item: string
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.run("CREATE  TABLE  IF NOT EXIST schatzkammer(NR int(5) Primary Key Auto_Incroment, Item Varchar(20), gulden int(10), opfer Varchar(20)")

var haltItem:Loot
var bag:string[]


export default class Backend {
  rob(member: String, loot: LootItem) {
    // mutate database
    db.run("insert into schatzkammer (Item, Gulden, Opfer) Values  (?,?,?)", (loot.item, loot.gulden, member))
  }

  treasuryForGuild(/*guild: Guild*/): Collection<String, Loot> {
    // read database
    var rueckgabe = new Collection<String, Loot>()
    db.each("select opfer, Sum(gulden) as guld, count(*) as anzahl from schatzkammer group by opfer", function(err: any, row: { opfer: String; guld: number; anzahl: any }){
      //var member:string
      //member = row.opfer
      //if(row.opfer.guild == guild){
      while(bag.length != 0){
        bag.pop
      }
  
     db.each("select Item as i from schatzkammer where opfer = '(?)'", (row.opfer), function(err2: any, row2: { i: string }){
       console.log(row2.i)
        bag.push(row2.i)
     } )
     
     haltItem.gulden = row.guld
     haltItem.items = bag
     rueckgabe.set(row.opfer, haltItem)
    //}
    })
    
    return rueckgabe
  }
}
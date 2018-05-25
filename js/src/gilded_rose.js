function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

var items = []

const DEGRADE_BASE             = 1;
const AGED_BRIE                = 'Aged Brie';
const BACKSTAGE_PASS           = 'BACKSTAGE_PASS';
const CONJURED                 = 'CONJURED';
const TAFKAL_CONCERT_BACKSTAGE = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS                 = 'Sulfuras, Hand of Ragnaros';

/**
 *
 * @param {Item} item Item to degrade
 * @param {Integer} degradeAmount amount to degrade by
 */
const dropQuality = (item, degradeAmount = DEGRADE_BASE) => {
  // The quality of an item is never negative
  item.quality = Math.max(item.quality - degradeAmount, 0);
}

/**
 *
 * @param {Item} item item to raise quality on
 * @param {Integer} amount amount to raise quality by
 */
const raiseQuality = (item, amount) => {
  // The quality of an item is never more than 50
  item.quality = Math.min(item.quality + amount, 50);
}

function update_quality() {
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    const {name, sell_in, quality} = item;
    // todo: talk with the Goblin because matching by name is janky
    let category = name;
    if(name.match(/Conjured/) !== null) {
      category = CONJURED;
    }
    console.log(name);
    if(name.match(/Backstage Passes/i) !== null) {
      category = BACKSTAGE_PASS;
    }
    switch(category) {
      case AGED_BRIE:
        // "Aged Brie" actually increases in quality the older it gets
        raiseQuality(item, 1);
        item.sell_in--;
        break;
      case CONJURED:
        // "Conjured" items degrade in quality twice as fast as normal items
        dropQuality(item, DEGRADE_BASE * 2);
        item.sell_in--;
        break;
      case BACKSTAGE_PASS:
        console.log('backstage pass');
        /*
        "Backstage passes", like aged brie, increases in quality as it's sell-in
        value approaches; quality increases by 2 when there are 10 days or less
        and by 3 when there are 5 days or less but quality drops to 0 after the
        concert
        */
        if(sell_in <= 0) {
          // backstage passes are worthless after concert date
          item.quality = 0;
        } else if(sell_in <= 5) {
          //  quality increases by 3 when there are 5 days or less
          raiseQuality(item, 3);
        } else if(sell_in <= 10) {
          //  quality increases by 2 when there are 10 days or less
          raiseQuality(item, 2);
        } else {
          // quality increases by 1 as normal
          raiseQuality(item, 1);
        }
        if(sell_in > 0) {
          item.sell_in--;
        }
        break;
      case SULFURAS:
        // "Sulfuras", being a legendary item, never has to be sold or decreases in quality
        item.sell_in = 0;
        break;
      default:
        item.sell_in--;
        dropQuality(item, (
          (sell_in < 0)
          // Once the sell by date has passed, quality degrades twice as fast
          ? (DEGRADE_BASE * 2)
          : DEGRADE_BASE
        ));
        break;
    }
  }
}

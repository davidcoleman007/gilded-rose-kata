describe("Gilded Rose -> updateQuality()", function() {

  it("is a function", function() {
    expect(typeof(update_quality)).toBe('function');
  });

  it('Once the sell by date has passed, quality degrades twice as fast', () => {
    items = [
      new Item('foo', -1, 4)
    ];
    update_quality();
    expect(items[0].quality).toBe(2);
  });

  it('The quality of an item is never negative', () => {
    items = [
      new Item('foo', 3, 4)
    ];
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    expect(items[0].quality).toBe(0);
  });

  it('The quality of an item is never more than 50', () => {
    items = [
      new Item(AGED_BRIE, 3, 48)
    ];
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    expect(items[0].quality).toBe(50);
  });

  it('"Aged Brie" actually increases in quality the older it gets', () => {
    items = [
      new Item(AGED_BRIE, 3, 4)
    ];
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    expect(items[0].quality).toBe(11);
  });

  it('"Backstage Passes" increase in quality as sell_in date approaches', () => {
    items = [
      new Item(TAFKAL_CONCERT_BACKSTAGE, 20, 5)
    ];
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    update_quality();
    expect(items[0].quality).toBe(10);
  });

  it('"Backstage Passes" increase in quality by 2 when sell_in date is <= 10', () => {
    items = [
      new Item(TAFKAL_CONCERT_BACKSTAGE, 10, 10)
    ];
    update_quality(); // 10 + 2
    update_quality(); // 12 + 2
    update_quality(); // 14 + 2
    update_quality(); // 16 + 2
    update_quality(); // 18 + 2
    expect(items[0].quality).toBe(20);
  });

  it('"Backstage Passes" increase in quality by 3 when sell_in date is <= 5', () => {
    items = [
      new Item(TAFKAL_CONCERT_BACKSTAGE, 5, 20)
    ];
    update_quality(); // + 3 = 23
    update_quality(); // + 3 = 26
    update_quality(); // + 3 = 29
    update_quality(); // + 3 = 32
    update_quality(); // + 3 = 35
    expect(items[0].quality).toBe(35);
  });

  it('"Backstage Passes" have no value after the concert', () => {
    items = [
      new Item(TAFKAL_CONCERT_BACKSTAGE, 5, 5)
    ];
    update_quality(); // + 3 = 8
    update_quality(); // + 3 = 11
    update_quality(); // + 3 = 14
    update_quality(); // + 3 = 17
    update_quality(); // + 3 = 20
    update_quality(); // 0
    expect(items[0].quality).toBe(0);
  });

  it('"Conjured" items degrade twice as fast as normal', () => {
    items = [
      new Item('Conjured Mana Cake', 5, 12)
    ];
    update_quality(); // 10
    update_quality(); // 8
    update_quality(); // 6
    expect(items[0].quality).toBe(6);
  });

  it('At the end of each day our system lowers quality for every item', () => {
    items = [
      new Item('foo', 3, 4),
      new Item('bar', 3, 4)
    ];
    update_quality();
    items.forEach(
      item => {
        expect(item.quality).toBe(3);
      }
    );
  });

  it('At the end of each day our system lowers sell_in for every item', () => {
    items = [
      new Item('foo', 3, 4),
      new Item('bar', 3, 4)
    ];
    update_quality();
    items.forEach(
      item => {
        expect(item.sell_in).toBe(2);
      }
    );
  });

  it('never modifies sulfuras which never expires and is always 80 quality', () => {
    items = [
      new Item(SULFURAS, 0, 80),
    ];
    update_quality();
    expect(items[0].quality).toBe(80);
    expect(items[0].sell_in).toBe(0);
  });
});


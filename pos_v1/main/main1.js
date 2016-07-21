'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
function printReceipt(tags) {
  let allCartItem = loadAllItems();
  let promotionItems = loadPromotions();
  let initCartItems = barcodeCount(tags);
  let cartItems = getCartItemInfo(initCartItems, allCartItem);
  let finalCartItems = buildFianlCartItems(cartItems, promotionItems);
  let finalTotal = buildFianlTotal(finalCartItems);
  let receipt = buildReceipt(finalCartItems, finalTotal);
  console.log(receipt);
}

//#NO.1:获取商品数量
function barcodeCount(barcodeArr) {
  var initCartItems = [];
  barcodeArr.forEach(function(barcode) {
    var item = {};
    if (isExist(barcode, initCartItems) === false) {
      if (barcode.length > 10) {
        item.barcode = barcode.substring(0, 10);
        item.count = barcode.substring(11);
      } else {
        item.barcode = barcode;
        item.count = 1;
      }
      initCartItems.push(item);
    }
  });
  return initCartItems;
}

function isExist(barcode, initCartItems) {
  for (var i = 0; i < initCartItems.length; i++) {
    if (barcode === initCartItems[i].barcode) {
      initCartItems[i].count++;
      return true;
    }
  }
  return false;
}

//#NO.2:获取商品信息
var fixtures = require('../test/fixtures.js');
var allCartItem = fixtures.loadAllItems();

function getCartItemInfo(initCartItems, allCartItem) {
  var cartItems = [];
  initCartItems.forEach(function(item) {
    var cartItemInfo = {};
    var itemInfo = allCartItem.find(function(itemInfo) {
      if (item.barcode === itemInfo.barcode) {
        return itemInfo;
      }
    });
    cartItemInfo.item = itemInfo;
    cartItemInfo.count = item.count;
    cartItems.push(cartItemInfo);
  });
  return cartItems;
}

//#NO.3:计算优惠价格 & #NO.4:计算优惠小计
var promotionItems = fixtures.loadPromotions();

function buildFianlCartItems(cartItems, promotionItems) {
  var finalCartItems = [];
  cartItems.forEach(function(itemInfo) {
    var finalItemInfo = {};
    finalItemInfo.item = itemInfo.item;
    finalItemInfo.count = itemInfo.count;
    if (isPromotion(itemInfo, promotionItems) == true) {
      var free = parseInt((itemInfo.count / 3)) * itemInfo.item.price;
      finalItemInfo.subtotal = itemInfo.count * itemInfo.item.price - free;
    } else {
      finalItemInfo.subtotal = itemInfo.count * itemInfo.item.price;
    }
    finalCartItems.push(finalItemInfo);
  });
  return finalCartItems;
}

function isPromotion(itemInfo, promotionItems) {
  var isPro = false;
  promotionItems.forEach(function(promotionType) {
    for (var i = 0; i < promotionType.barcodes.length; i++) {
      if (promotionType.barcodes[i] == itemInfo.item.barcode) {
        isPro = true;
      }
    }
  });
  return isPro;
}


//#NO.5：计算总价及节省金额
function buildFianlTotal(finalCartItems) {
  var finalTotal = {};
  finalTotal.total = 0;
  finalTotal.save = 0;
  finalCartItems.forEach(function(finalItemInfo) {
    finalTotal.total += finalItemInfo.subtotal;
    finalTotal.save += (finalItemInfo.count * finalItemInfo.item.price) - finalItemInfo.subtotal;
  });
  return finalTotal;
}

//#NO.6:生成小票 & #NO.7:打印
function buildReceipt(finalCartItems, finalTotal) {
  let receipt = '***<没钱赚商店>收据***';
  for (let finalItemInfo of finalCartItems) {
    receipt += `
名称：${finalItemInfo.item.name}，数量：${finalItemInfo.count}${finalItemInfo.item.unit}，单价：${finalItemInfo.item.price.toFixed(2)}(元)，小计：${finalItemInfo.subtotal.toFixed(2)}(元)`;
  }

  receipt += `
----------------------
总计：${finalTotal.total.toFixed(2)}(元)
节省：${finalTotal.save.toFixed(2)}(元)
**********************`;

  // console.log(receipt);
  return receipt;
}

let a = 'a-a';
console.log(a.indexOf('-'));
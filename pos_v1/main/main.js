'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
function printReceipt(tags) {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let formattedTags = formatTags(tags);
    let countedBarcodes = countBarcodes(formattedTags);
    let cartItems = buildCartItems(countedBarcodes, allItems);
    let promotedItems = buildPromotedItems(cartItems, promotions);
    let totalPrices = calculateTotalPrices(promotedItems);
    let receipt = buildReceipt(promotedItems, totalPrices);
    let receiptString = printReceiptString(receipt);
    console.log(receiptString);
}


function isExist(barcode, array) {
    for (let countItem of array) {
        if (barcode === countItem.barcode) {
            return countItem;
        }
    }
    return null;
}


//#1
function formatTags(tags) {
    let formattedTags = [];
    for (let tag of tags) {
        if (tag.indexOf("-") === -1) {
            formattedTags.push({barcode: tag, count: 1});
        } else {
            let temps = tag.split("-");
            formattedTags.push({barcode: temps[0], count: parseInt(temps[1])});
        }
    }
    return formattedTags;
}


//#2
function countBarcodes(formattedTags) {
    let countedBarcodes = [];
    for (let formattedTag of formattedTags) {
        let countItem = isExist(formattedTag.barcode, countedBarcodes);
        if (countItem === null) {
            countedBarcodes.push({barcode: formattedTag.barcode, count: formattedTag.count})
        } else {
            countItem.count += formattedTag.count;
        }
    }
    return countedBarcodes;
}


//#3
function buildCartItems(countedBarcodes, allItems) {
    let cartItems = [];
    for (let countedBarcode of countedBarcodes) {
        let item = isExist(countedBarcode.barcode, allItems);
        let cartItem = {
            barcode: item.barcode,
            name: item.name,
            unit: item.unit,
            price: item.price,
            count: countedBarcode.count
        };
        cartItems.push(cartItem);
    }
    return cartItems;
}

//#4
function buildPromotedItems(cartItems, promotions) {
    let promotedItems = [];
    let currentPromotion = promotions[0];
    for (let cartItem of cartItems) {

        let saved = 0;
        let hasPromoted = false;
        for (let barcode of currentPromotion.barcodes) {
            if (cartItem.barcode === barcode) {
                hasPromoted = true;
            }
        }
        if (currentPromotion.type === 'BUY_TWO_GET_ONE_FREE' && hasPromoted) {
            var savedCount = Math.floor(cartItem.count / 3);
            saved = cartItem.price * savedCount;
        }

        let payPrice = cartItem.count * cartItem.price - saved;

        promotedItems.push({
            barcode: cartItem.barcode,
            name: cartItem.name,
            unit: cartItem.unit,
            price: cartItem.price,
            count: cartItem.count,
            payPrice,
            saved
        });
    }
    return promotedItems;
}

//#5
function calculateTotalPrices(promotedItems) {
    let totalPrices = {
        totalPayPrice: 0,
        totalSaved: 0
    };

    for (let promotedItem of promotedItems) {
        totalPrices.totalPayPrice += promotedItem.payPrice;
        totalPrices.totalSaved += promotedItem.saved;
    }
    return totalPrices;
}

//#6
function buildReceipt(promotedItems, totalPrices) {
    let receiptItems = [];

    for (let element of promotedItems) {
        receiptItems.push(
            {
                name: element.name,
                unit: element.unit,
                price: element.price,
                count: element.count,
                payPrice: element.payPrice
            }
        );
    }
    let receipt = {
        receiptItems,
        totalPayPrice: totalPrices.totalPayPrice,
        totalSaved: totalPrices.totalSaved
    };
    return receipt;
}


//#7
function printReceiptString(receipt) {
    let receiptString = '***<没钱赚商店>收据***';
    for (let receiptItem of receipt.receiptItems) {
        receiptString += `
名称：${receiptItem.name}，数量：${receiptItem.count}${receiptItem.unit}，单价：${receiptItem.price.toFixed(2)}(元)，小计：${receiptItem.payPrice.toFixed(2)}(元)`;
    }

    receiptString += `
----------------------
总计：${receipt.totalPayPrice.toFixed(2)}(元)
节省：${receipt.totalSaved.toFixed(2)}(元)
**********************`;


    return receiptString;
}
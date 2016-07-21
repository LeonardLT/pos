'use strict';

describe('pos', () => {

    it('#1.formatTags', () => {

        let tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2'
        ];

        let formattedTags = formatTags(tags);

        const expectFormattedTags = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];


        expect(formattedTags).toEqual(expectFormattedTags);

    });

    it('#2.countBarcodes', () => {

        let formattedTags = [
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000003', count: 2}
        ];

        let countedBarcodes = countBarcodes(formattedTags);

        const expectFormattedTags = [

            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];

        expect(countedBarcodes).toEqual(expectFormattedTags);

    });

    it('#3.buildCartItems', () => {
        let countedBarcodes = [

            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000003', count: 2}
        ];

        let allItems = loadAllItems();

        let cartItems = buildCartItems(countedBarcodes, allItems);

        const expectCartItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2
            }
        ];

        expect(cartItems).toEqual(expectCartItems);

    });

    it('#4.buildPromotedItems', () => {
        let cartItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2
            }
        ];

        let promotions = loadPromotions();

        var promotedItems = buildPromotedItems(cartItems, promotions);

        const expectPromotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3,
                payPrice: 6,
                saved: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0
            }
        ];

        expect(promotedItems).toEqual(expectPromotedItems);
    });

    it('#5.calculateTotalPrices', () => {
        let promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3,
                payPrice: 6,
                saved: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0
            }
        ];

        let totalPrices = calculateTotalPrices(promotedItems);

        const expectTotalPrices =
        {
            totalPayPrice: 36,
            totalSaved: 3
        };

        expect(totalPrices).toEqual(expectTotalPrices);

    });

    it('#6.buildReceipt', () => {

        let totalPrices = {
            totalPayPrice: 36,
            totalSaved: 3
        };

        let promotedItems = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 3,
                payPrice: 6,
                saved: 3
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2,
                payPrice: 30,
                saved: 0
            }
        ];

        let receipt = buildReceipt(promotedItems, totalPrices);

        const expectReceipt = {
            receiptItems: [
                {
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    count: 3,
                    payPrice: 6
                },
                {
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    count: 2,
                    payPrice: 30
                }
            ],
            totalPayPrice: 36,
            totalSaved: 3
        };

        expect(receipt).toEqual(expectReceipt);

    });


    it('should print text', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});

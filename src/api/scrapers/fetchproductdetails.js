const {request, checkRes} = require('../../utils');

module.exports = async (product, options) => {
    const {country, currency, proxy, timeout, userAgent} = options;
    const variantArray = [];
    let webURL;

    if (typeof product == 'string') {
        if (product.includes('stockx.com/')) {
            webURL = product.split('stockx.com/')[1].split('/')[0];
        } else {
            webURL = product;
        }
    } else {
        webURL = product.objectID;
    }

    const url = `https://stockx.com/api/products/${webURL}?includes=market&currency=${currency}&country=${country}`;
    const headers = {
        'user-agent': userAgent,
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
    };

    const res = await request(url, 'GET', headers, null, proxy, timeout);

    checkRes(res);

    const {data: shoeObj} = res;

    const variants = shoeObj.Product.children;

    for (let key in variants) {
        variantArray.push({
            size: variants[key].shoeSize,
            uuid: key,
            market: variants[key].market
        });
    }

    return {
        name: shoeObj.Product.shoe,
        image: shoeObj.Product.media.imageUrl,
        urlKey: shoeObj.Product.urlKey,
        pid: shoeObj.Product.styleId,
        uuid: shoeObj.Product.uuid,
        variants: variantArray
    };
};

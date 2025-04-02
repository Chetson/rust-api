export const productPriceFormater = (price) => {
    return Number(Math.round(price * 100)/100).toFixed(2)
}

export const productPrice = (price, discount = null, personal = null) => {
    let total = price

    if (discount) { total -= total * discount/100 }
    if (personal) { total -= total * personal/100 }

    return productPriceFormater(total)
}

export const productPriceAmount = (price, amount) => {
    return productPriceFormater(price * amount)
}

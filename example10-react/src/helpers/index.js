export const totalPriceAmount = (price, discount, personal) => {
    const pr = price - discount
    const total = pr - (pr/100*personal)
    return Math.round(total*100)/100
}

export const totalPricePercent = (price, discount, personal) => {
    const pr = price - (price/100*discount)
    const total = pr - (pr)/100*personal
    return Math.round(total*100)/100
}

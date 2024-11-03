export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY"
    }).format(price)
}
const buttonNameList = {
    deleteProduct: "Ürün Sil",
    moveTable: "Masa Taşı",
    //splitProducts: "Ürün Ayır",
    moveProduct: "Ürün Taşı",
    //mergeCheck: "Adisyon Birleştir",
    sendOrder: "Gönder",
    checkout: "Ödeme",
    //nameTable: "Masa İsimlendir",
    changePrice: "Fiyat Değiştir",
    discount: "İskonto",
    cover: "Kuver",
    sendfirst: "Önden Gönder",
    //catering: "İkram",
    //nopayment: "Ödeme Yok",
    //readbarcode: "Barkod Okuma",
    fastcheckout: "Hızlı Ödeme",
    print: "Yazdır"
}
const takeAwayButtonNameList = {
    deleteProduct: "Ürün Sil",
    sendOrder: "Gönder",
    sendfirst: "Önden Gönder",
}
const caseSaleButtonNameList = {
    deleteProduct: "Ürün Sil",
    checkout: "Ödeme",
    discount: "İskonto",
    cover: "Kuver",
    sendfirst: "Önden Gönder",
    fastcheckout: "Hızlı Ödeme",
}
const takeawayButtons = [
    {
        name: "deleteProduct",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "sendOrder",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "sendfirst",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "checkout",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "fastcheckout",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "print",
        color: "hsl(3, 81%, 46%)"
    },
]
const caseSaleButtons = [
    {
        name: "deleteProduct",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "sendfirst",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "checkout",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "discount",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "cover",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "fastcheckout",
        color: "hsl(3, 81%, 46%)"
    },
]

const buttons = [
    {
        name: "deleteProduct",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "moveProduct",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "checkout",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "moveTable",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "sendOrder",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "changePrice",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "discount",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "cover",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "sendfirst",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "fastcheckout",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "print",
        color: "hsl(3, 81%, 46%)"
    },
]

const featurebuttons = [
    {
        name: "mergeCheck",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "nameTable",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "catering",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "nopayment",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "readbarcode",
        color: "hsl(3, 81%, 46%)"
    },
    {
        name: "splitProducts",
        color: "hsl(3, 81%, 46%)"
    },
]


const rightButtons: any[] = [];
const bottomButtons: any[] = [];

buttons.forEach((button: any, i: number) => {
    if (i < 9) {
        rightButtons.push(button);
    }
    if (i > 2) {
        bottomButtons.push(button);
    }
})

export { buttons, rightButtons, bottomButtons, buttonNameList, takeawayButtons, takeAwayButtonNameList, caseSaleButtons, caseSaleButtonNameList };

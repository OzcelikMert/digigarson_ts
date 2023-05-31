export const payment_types = {
    1: "pos_bank",
    2: "pos_cash",
    3: "app_payment",
    4: "serve",
    5: "discount",
    6: "tick",
    7: "sodexo",
    8: "smart",
    9: "winwin",
    10: "multinet",
    11: "setcard",
    12: "metropol",
    13: "edended",
    14: "tips"
}


export const order_types = {
    1: "Restorantta garson/pos tarafından normal sipariş",
    2: "Restorantta mobil app tarafından normal sipariş",
    3: "Adrese teslim",
    4: "Gel al",
    5: "Kasa Satış"
}
export const order_status = {
    1: "Sipariş İletildi",
    2: "Sipariş Onaylandı",
    3: "Sipariş Hazırlanıyor",
    4: "Sipariş Yolda",
}

export const expenses_types = {
    1: "Isletme Gideri"
}

export const currency_types = {
    "TL": "Turkish Lira",
    "EUR": "Euro",
    "USD": "Dolar",
}

export const roles_types: any = {
    "superadmin": [0],
    "regionalmanager": [100],
    "superbranchmanager": [200],
    "branchmanager": [300],
    "waiter": [400],
    "pos": [500],
    "branchaccounting": [600],
    "kitchen": [700],
    "delivery": [800],
    "user": [1000]
}

export const options_state_types: any = {
    1: "Durum Bazlı",
    2: "Malzeme Bazlı",
    3: "Ürün Bazlı"
}

export const options_type_types: any = {
    1: "Tekli Seçim",
    2: "Çoklu Seçim"
}
export const ingredient_unit_types: any = {
    1: "adet",
    2: "bag",
    3: "gram",
    4: "kilogram",
    5: "cuval",
    6: "deste",
    7: "düzine",
    8: "dilim",
    9: "kasa",
    10: "koli",
    11: "litre",
    12: "metre",
    13: "mililitre",
}

export const invoice_types = {
    1: "Yeni alış",
    2: "Yeni alış iade",
    3: "Yeni satış",
    4: "Yeni satış iade",
}

export const process_type={
    1:"Para Ekle",
    2:"Para Çek"
}

export const quantity_type = {
    1:"Gram",
    2:"Kilogram",
    3:"Litre",
    4:"Adet"
}

export const langItems_type = {
   1: "Product",
   2: "Category",
   3: "Options",
   4: "Service"
}

export const discount_type = {
    0: "Flat",
    1: "Percentile"
}
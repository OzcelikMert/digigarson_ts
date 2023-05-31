import ReactDOMServer from "react-dom/server";
import { payment_types } from "constants/paymentTypes"

export enum SaveSettings {
    General, Groups
}

export default class Service {
    static ipcRenderer: any = window.require("electron").ipcRenderer
    static Printers: any = Service.ipcRenderer.sendSync("printers")

    static CurrentPrinter: string | null = null;
    static CurrentSafePrinterName: string | null = null;

    static IsPreview: boolean = false;

    static Groups: any[] = [];

    static saveSettings(type: SaveSettings) {
        if (type === SaveSettings.General) {
            localStorage.setItem("general-printer", JSON.stringify({
                printer: this.CurrentPrinter!,
                name: this.CurrentSafePrinterName
            }))
        }

        if (type === SaveSettings.Groups)
            localStorage.setItem("printer-groups", JSON.stringify(this.Groups))
    }

    static loadSettings() {
        const printerSettings = JSON.parse(localStorage.getItem("general-printer") as string)
        if (printerSettings) {
            this.CurrentPrinter = printerSettings.printer
            this.CurrentSafePrinterName = printerSettings.name
        }

        this.Groups = JSON.parse(localStorage.getItem("printer-groups") as string) || []
    }

    static get settings() {
        return {
            printer: this.CurrentPrinter,
            preview: this.IsPreview
        }
    }

    static payload_with_settings(data: any) {
        return {
            data,
            settings: this.settings
        }
    }

    static print(data: any, height?: number, printer?: string) {
        if (printer)
            data.settings.printer = printer;
            data.settings.height = height;
        Service.ipcRenderer.send("print", JSON.stringify(data))
    }
    static printReport(report: any, type: string) {
        if (!report)
            return;
        const payments = (): String => {
        let element = `<table style="font-weight: 700, font-size:22px; width: 100%">
            <thead>
                <tr >
                    <th style="text-align: start;">
                        <strong>Ödeme Tipi</strong>
                    </th>
                    <th style="text-align: end;">
                        <strong>Fiyat</strong>
                    </th>
                </tr>
            </thead>
            <tbody>`;
            
                report?.payments?.map((payment: any) =>{
                    element += `<tr>
                        <td style="text-align: start;">
                            <strong>${payment_types[payment.type - 1]}</strong>
                        </td>
                        <td style="text-align: end;">
                            <strong>${payment.amount}${payment.currency}</strong>
                        </td>
                    </tr>`}
                )
            element += `
            </tbody>
        </table>`;
    return element; 
        } 
        const products = () => {
            let element = `
            <table>
                <thead>
                <tr >
                    <th style="text-align: start;">
                        <strong>Ürün Adeti</strong>
                    </th>
                    <th style="text-align: end;">
                        <strong>Fiyat</strong>
                    </th>
                </tr>
                </thead>
                <tbody>`
                        report?.products?.map((product: any) =>
                        {
                            element += `
                            <tr>
                            <td style="text-align: start;">
                                <strong> ${product.quantity + "x " + product.productName}</strong>
                            </td>
                            <td style="text-align: end;">
                                <strong>${product.price}TL</strong>
                            </td>
                        </tr>`;
                        }
                        )
                    element += `
                    </tbody>
                </table>`;
                return element;
        }


        const date = new Date().toLocaleDateString();
        const data = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${type}</div>`,
            },
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px">Yazdırılma zamanı:  ${date} </div>`,
                style: `text-align:center;`,
            },
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                            --------------------------
                        </div>`,
            },
            {
                type: "text",
                value: '<div style= "font-weight: 700;font-size:22px; text-align:center;">Ödeme Bilgileri</div>',
            },
            {
                type: "text",
                value: payments(),
            },
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                --------------------------
            </div>`,
        },
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">Ürünler</div>`,

            },
            {
                type: "text",
                value: products(),
            },
        ];
        this.print(this.payload_with_settings(data))
    }
    static printCheck(check: any) {
        if (!check.orders.length)
            return
            let Products =
                `<table>
                <thead>
                    <tr style="">
                        <td style="text-align:start">
                            <strong>Ürün</strong>
                        </td>
                        <td style="text-align:end">
                            <strong>Fiyat</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>`;
                check.orders.map((order: any) =>{
                    Products += `<tr >
                    <td style="text-align:start; font-size: 14">
                    <strong> ${order.quantity+"x"+order.name}</strong>
                    </td>
                    <td style="text-align:end; font-size: 14">
                        <strong>${order.price}${check.total.currency}</strong>
                    </td>
                </tr>`
                })
                Products+= `
                </tbody>
            </table>`;
        const discounts = check?.discount?.map((discount: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>1x </span>
                    iskonto
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {discount.amount}
                    <span style={{ fontSize: 16 }}>{discount.type==0?"%":check.total.currency}</span>
                </span>
            </div>
        )
        const covers = check?.cover?.map((cover: any) =>
            <div style={{ marginBottom: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", backgroundColor: "#000"}}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>{cover.quantity}x </span>
                    {cover.title}
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {cover.price}
                    <span style={{ fontSize: 16 }}>{check.total.currency}</span>
                </span>
            </div>
        )
        function setHeight(){
          let height = 0;
          height+=20;
          (check.orders?.length > 0) ? height += check.orders.length: height+=5; 

          return height;
        }
        const data: any[] = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${check.branch}</div>`,
            },
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column;justify-content: center; width:100%; text-align:center">
                            <span>Tarih: ${this.formatDate(new Date())}</span><br>
                            <span>Masa: ${check.table}</span><br>
                            <span>Kişi: ${this.CurrentSafePrinterName}</span>
                        </div>`
                  ,
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">Ürünler</div>`,
            },
            {
                type: "text",
                value: Products,
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${check?.cover?.length ? "Kuver": ""}</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(covers),
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${check?.discount?.length ? "Iskontolar": ""}</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
            },
            {
                type: "text",
                value:`
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:155px">Toplam</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${check.total.amount} ${check.total.currency}</span>
                        </div>
                        `
            },
            {
                type: "text",
                value:`
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Ödenen Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${check.paymentReceived.amount} ${check.total.currency}</span>
                        </div>
                        `
            },
            {
                type: "text",
                value:`
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Kalan Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${(check.total.amount - check.paymentReceived.amount)} ${check.total.currency}</span>
                        </div>
                        `
            }
        ];
        this.print(this.payload_with_settings(data), setHeight())
    }

    static printAll(check: any) {
        
        let sum = 0;
        if (!check.orders.length)
            return;
        const products = (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: "start" }}>
                        <strong>Ürün</strong>
                    </th>
                    <th style={{ textAlign: "end" }}>
                        <strong>Fiyat</strong>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    check.orders.map((order: any) =>
                        <tr>
                            <td style={{ textAlign: "start", fontSize: "16", marginLeft:"10px" }}>
                                {order.quantity + "x " + order.name}
                            </td>
                            <td style={{ textAlign: "end", fontSize: "14" }}>
                                <strong>{order.price} TL</strong>
                            </td>
                        </tr>
                    )
                }   
                <tr>
                    <td style={{ textAlign: "center" }}>
                        <strong>Ödeme Türleri</strong>
                    </td>
                </tr>
                {
                    check.payments.map((order: any) =>
                    <tr>
                        <td style={{ textAlign: "start", fontSize: "14" }}>
                            <strong>{payment_types[order.type - 1]}</strong>
                        </td>
                        <td style={{ textAlign: "end", fontSize: "14" }}>
                            <strong>{order.amount} {order.currency}</strong>
                        </td>
                    </tr>
                    )
                }

            </tbody>
        </table>)
        const discounts = check?.discount?.map((discount: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>1x </span>
                    iskonto
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {discount.amount}
                    <span style={{ fontSize: 16 }}>{discount.type == 0 ? "%" : check.total.currency}</span>
                </span>
            </div>
        )

        const covers = check?.cover?.map((cover: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>{cover.quantity}x </span>
                    {cover.title}
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {cover.price}
                    <span style={{ fontSize: 16 }}>{check.total.currency}</span>
                </span>
            </div>
        )

        const baseData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <div style={{textAlign:"center"}}>
                            <span>{check.branch}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", textAlign: "center" }}>
                            <span>Tarih: {this.formatDate(new Date())}</span>
                            <br></br>
                            <span>Masa: {check.table}</span>
                            <br></br>
                            <span>Kişi: {this.CurrentSafePrinterName}</span>
                        </div>
                        <hr />
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px"
                }
            },
        ];
        const cover = covers?.length > 0 ? [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Kuverler</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(covers),
                css: {
                    "font-weight": "500",
                    "font-size": "14px"
                },
            },
        ] : [];
        const productData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Ürünler</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
                css: {
                    "font-weight": "900",
                    "font-size": "17px"
                },
            },
        ]
        const discount = discounts?.length > 0 ? [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Iskontolar</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
                css: {
                    "font-weight": "500",
                    "font-size": "14px"
                },
            },
        ] : [];
        const getTotalPayment = () => {
            let sum = 0;
            check?.total.forEach((total: any) => sum += total.amount)
            return sum;
        }
        const total = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr />

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ left: 0, textAlign:"start" }}>Toplam</span>
                            <span style={{ right: 0, float:"right" }}>{getTotalPayment()} {check.total[0].currency}</span>
                        </div>
                        <hr />
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px"
                },
            }
        ]
        const data = baseData.concat(cover.concat(productData.concat(discount.concat(total))))

        this.print(this.payload_with_settings(data))
    }
    static printTakeaway(check: any) {
        let sum = 0;
        if (!check.orders.length)
            return;
        const products = (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: "start" }}>
                        <strong>Ürün</strong>
                    </th>
                    <th style={{ textAlign: "end" }}>
                        <strong>Fiyat</strong>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    check?.orders.map((product: any) =>
                        <tr>
                            <td style={{ textAlign: "start", fontSize: "16", marginLeft:"10px" }}>
                                {product.quantity + "x " + product.name}
                            </td>
                            <td style={{ textAlign: "end", fontSize: "14" }}>
                                <strong>{product.price} TL</strong>
                            </td>
                        </tr>
                    )
                }   
                <tr>
                    <td style={{ textAlign: "center" }}>
                        <strong>Ödeme Türleri</strong>
                    </td>
                </tr>
                {
                    check?.total.map((payment: any) =>
                    <tr>
                        <td style={{ textAlign: "start", fontSize: "14" }}>
                            <strong>{payment_types[payment.type - 1]}</strong>
                        </td>
                        <td style={{ textAlign: "end", fontSize: "14" }}>
                            <strong>{payment.amount} {payment.currency}</strong>
                        </td>
                    </tr>
                    )
                }

            </tbody>
        </table>)
        const discounts = check?.discount?.map((discount: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>1x </span>
                    iskonto
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {discount.amount}
                    <span style={{ fontSize: 16 }}>{discount.type == 0 ? "%" : check.total.currency}</span>
                </span>
            </div>
        )

        const covers = check?.cover?.map((cover: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>{cover.quantity}x </span>
                    {cover.title}
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {cover.price}
                    <span style={{ fontSize: 16 }}>{check.total.currency}</span>
                </span>
            </div>
        )

        const baseData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <div style={{textAlign:"center"}}>
                            <span>{check.branch}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", textAlign: "center" }}>
                            <span>Tarih: {this.formatDate(new Date())}</span>
                            <br></br>
                            <span>Kişi: {check.customer}</span>
                            <br></br>
                            <span>Adres: {check.address}</span>
                            <br></br>
                            <span>Telefon: {check.customerPhone}</span>
                        </div>
                        <hr />
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px"
                }
            },
        ];
        const cover = covers?.length > 0 ? [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Kuverler</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(covers),
                css: {
                    "font-weight": "500",
                    "font-size": "14px"
                },
            },
        ] : [];
        const productData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Ürünler</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
                css: {
                    "font-weight": "900",
                    "font-size": "17px"
                },
            },
        ]
        const discount = discounts?.length > 0 ? [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(<div style={{ width: "100%", textAlign: "center" }}>Iskontolar</div>),
                css: {
                    "font-weight": "700",
                    "font-size": "16px"
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
                css: {
                    "font-weight": "500",
                    "font-size": "14px"
                },
            },
        ] : [];
        const getTotalPayment = () => {
            let sum = 0;
            check?.orders.forEach((order: any) => sum += order.price)
            return sum;
        }
        const total = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr />

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ left: 0, textAlign:"start" }}>Toplam</span>
                            <span style={{ right: 0, float:"right" }}>{getTotalPayment()} TL</span>
                        </div>
                        <hr />
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px"
                },
            }
        ]
        const data = baseData.concat(cover.concat(productData.concat(discount.concat(total))))

        this.print(this.payload_with_settings(data))
    }
    static printProductsInOrder(check: any) {
        const getTotalPayment = () => {
            let sum = 0;
            check.orders.forEach((order:any) => sum += order.price)
            return sum;
        }
        if (!check.orders.length)
            return
            let Products =
                `<table>
                <thead>
                    <tr style="">
                        <td style="text-align:start">
                            <strong>Ürün</strong>
                        </td>
                        <td style="text-align:end">
                            <strong>Fiyat</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>`;
                check.orders.map((order: any) =>{
                    Products += `<tr >
                    <td style="text-align:start; font-size: 14">
                    <strong> ${order.quantity+"x"+order.name}</strong>
                    </td>
                    <td style="text-align:end; font-size: 14">
                        <strong>${order.price} TL</strong>
                    </td>
                </tr>`
                })
                Products+= `
                </tbody>
            </table>`;
        const discounts = check?.discount?.map((discount: any) =>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>1x </span>
                    iskonto
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {discount.amount}
                    <span style={{ fontSize: 16 }}>{discount.type==0?"%":check.total.currency}</span>
                </span>
            </div>
        )
        const covers = check?.cover?.map((cover: any) =>
            <div style={{ marginBottom: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", backgroundColor: "#000"}}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 7 }}>
                    <span style={{ fontSize: 16 }}>{cover.quantity}x </span>
                    {cover.title}
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {cover.price}
                    <span style={{ fontSize: 16 }}>{check.total.currency}</span>
                </span>
            </div>
        )
        function setHeight(){
          let height = 0;
          height+=20;
          (check.orders?.length > 0) ? height += check.orders.length: height+=5; 
          return height;
        }
        const data: any[] = [
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column;justify-content: center; width:100%; text-align:center">
                            <span>Tarih: ${this.formatDate(new Date())}</span><br>      
                            <span>Kişi: ${check.name}</span><br>
                            <span>Adres: ${check.address}</span><br>
                        </div>`
                  ,
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">Ürünler</div>`,
            },
            {
                type: "text",
                value: Products,
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${check?.cover?.length ? "Kuver": ""}</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(covers),
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${check?.discount?.length ? "Iskontolar": ""}</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
            },
            {
                type: "text",
                value:`
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 4px;font-weight:700;font-size:16px; margin-right:155px">Toplam</span>
                            <span style="right: 4px;font-weight:700;font-size:16px;">${getTotalPayment().toFixed(2)} TL</span>
                        </div>
                        `
            }
        ];
        this.print(this.payload_with_settings(data), setHeight())
    }
    static printCheckDeleteOrderKitchen(check: any, printer?: string) {
        if (!check.orders.length)
            return;
        const products = check.orders.map((order: any) => <>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                <div style={{ width: "fit-content" }}>
                    <span style={{ fontSize: 22, fontWeight: 700 }}>{order.quantity}x </span>
                    <span style={{ fontSize: 22, fontWeight: 700 }}> {order.name} </span>

                </div>
            </div>
            {
                order.optionNames && order.optionNames.map((option: any) => <>
                    <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                        {
                            option.sub_options.map((sub: any) => {
                                return <div>
                                    <span style={{ fontSize: 24, fontWeight: 900, paddingLeft: 15 }}>.</span>
                                    <span style={{ fontSize: 18, fontWeight: 600, paddingLeft: 5 }}>{sub}, </span>
                            </div>
                            })
                        }
                    </div>

                </>)
            }
        </>
        )
        const dataTop = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:24px; text-align:center;">${check.branch}</div>`,
            },
            {
                type: "text",
                value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center; font-size: 20px">
                            <span>Tarih: ${this.formatDate(new Date())}</span>
                            <span>Masa: ${check.table}</span>
                            <span>Kişi: ${this.CurrentSafePrinterName}</span>
                        </div>
                        <hr />
                        <div style="display: flex; flex-direction: column, justify-content: center, width: 100%, ">
                            <span style="font-weight: 900; font-size:24px; text-align:center;">İptal Edilen Ürünler</span>
                        </div>`

            },]

        const dataBottom = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ left: 0 }}>..</span>
                            <span style={{ right: 0 }}></span>
                        </div>
                        <hr />
                    </>
                ),
            }
        ];
        let data: any[] = [];
        if (check?.firstOrders?.length > 0) {
            
        }
        else {
            data = dataTop.concat(dataBottom);
        }

        this.print(this.payload_with_settings(data), 0, printer)
    }
    static printCheckDeleteOrderKitchenByGroup(check: any) {
        const Groups = this.Groups.map(group => ({
            ...group,
            products: check.orders.filter((order: any) => group.categories.includes(order.category)),
            firstProducts: check.firstOrders.filter((order: any) => group.categories.includes(order.category))
        }))
        console.log(Groups)
        Groups.length ? Groups.forEach(data => 
            data.products.length && this.printCheckDeleteOrderKitchen({ ...check, orders: data.products, firstOrders: data.firstProducts }, data.printer)
        ) : this.printCheckDeleteOrderKitchen(check)
    }
    static printKitchen(check: any, printer?: string) {
        if (!check.orders.length)
            return;
        const products = check.orders.map((order: any) => <>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                <div style={{ width: "fit-content" }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{order.quantity}x </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}> {order.name} </span>

                </div>
            </div>
            {
                order.optionNames && order.optionNames.map((option: any) => <>
                    <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>                  
                        {
                            option.sub_options.map((sub: any) => {
                                return <div>
                                    <span style={{ fontSize: 24, fontWeight: 900, paddingLeft: 15 }}>.</span>
                                    <span style={{ fontSize: 18, fontWeight: 600, paddingLeft: 5 }}>{sub}, </span>
                                </div>
                            })
                        }
                    </div>

                </>)
            }
        </>
        )
        const firstProducts = check?.firstOrders?.map((order: any) => <>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{order.quantity}x </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}> {order.name} </span>
                </span>
            </div>
            {
                order.optionNames && order.optionNames.map((option: any) => <>
                    <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                        {
                            option.sub_options.map((sub: any) => {
                                return <div>
                                <span style={{ fontSize: 19, fontWeight: 700, paddingLeft: 15 }}>.</span>
                                <span style={{ fontSize: 16, fontWeight: 400, paddingLeft: 5 }}>{sub}, </span>
                            </div>
                            })
                        }
                    </div>

                </>)
            }
        </>
        )


        const dataTop = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${check.branch}</div>`,
            },
            {
                type: "text",
                value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center">
                            <span>Tarih: ${this.formatDate(new Date())}</span>
                            <span>Masa: ${check.table}</span>
                            <span>Kişi: ${this.CurrentSafePrinterName}</span>
                        </div>
                        <hr />
                        <div style="display: flex; flex-direction: column, justify-content: center, width: 100%, ">
                            <span style="font-weight: 700; font-size:18px; text-align:center;">Ürünler</span>
                        </div>`

            },]
        const dataMid = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(firstProducts)

            },
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                --------------------------
            </div>`
            },
        ]

        const dataBottom = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ left: 0 }}>..</span>
                            <span style={{ right: 0 }}></span>
                        </div>
                        <hr />
                    </>
                ),
            }
        ];
        let data: any[] = [];
        if (check?.firstOrders?.length > 0) {
            data = dataTop.concat(dataMid.concat(dataBottom));
        }
        else {
            data = dataTop.concat(dataBottom);
        }

        this.print(this.payload_with_settings(data), 0, printer)
    }

    static printKitchenByGroup(check: any) {
        const Groups = this.Groups.map(group => ({
            ...group,
            products: check.orders.filter((order: any) => group.categories.includes(order.category)),
            firstProducts: check.firstOrders.filter((order: any) => group.categories.includes(order.category))
        }))
        console.log(Groups)
        Groups.length ? Groups.forEach(data => 
            data.products.length && this.printKitchen({ ...check, orders: data.products, firstOrders: data.firstProducts }, data.printer)
        ) : this.printKitchen(check)
    }

    static printTakeawayKitchen(check: any, printer?: string) {
        if (!check.orders.length)
            return;
        const products = check.orders.map((order: any) => <>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                <div style={{ width: "fit-content" }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{order.quantity}x </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}> {order.name} </span>

                </div>
            </div>
            {
                order.optionNames && order.optionNames.map((option: any) => <>
                    <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>                  
                        {
                            option.sub_options.map((sub: any) => {
                                return <div>
                                    <span style={{ fontSize: 24, fontWeight: 900, paddingLeft: 15 }}>.</span>
                                    <span style={{ fontSize: 18, fontWeight: 600, paddingLeft: 5 }}>{sub}, </span>
                                </div>
                            })
                        }
                    </div>

                </>)
            }
        </>
        )
        const firstProducts = check?.firstOrders?.map((order: any) => <>
            <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{order.quantity}x </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}> {order.name} </span>
                </span>
            </div>
            {
                order.optionNames && order.optionNames.map((option: any) => <>
                    <div style={{ marginBottom: 3, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" }}>
                        {
                            option.sub_options.map((sub: any) => {
                                return <div>
                                <span style={{ fontSize: 19, fontWeight: 700, paddingLeft: 15 }}>.</span>
                                <span style={{ fontSize: 16, fontWeight: 400, paddingLeft: 5 }}>{sub}, </span>
                            </div>
                            })
                        }
                    </div>

                </>)
            }
        </>
        )


        const dataTop = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${check.branch}</div>`,
            },
            {
                type: "text",
                value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center">
                            <span>Tarih: ${this.formatDate(new Date())}</span>
                            <span>Kişi: ${check.customer}</span>
                        </div>
                        <hr />
                        <div style="display: flex; flex-direction: column, justify-content: center, width: 100%, ">
                            <span style="font-weight: 700; font-size:18px; text-align:center;">Ürünler</span>
                        </div>`

            },]
        const dataMid = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(firstProducts)

            },
            {
                type: "text",
                value:`<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                --------------------------
            </div>`
            },
        ]

        const dataBottom = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ left: 0 }}>..</span>
                            <span style={{ right: 0 }}></span>
                        </div>
                        <hr />
                    </>
                ),
            }
        ];
        let data: any[] = [];
        if (check?.firstOrders?.length > 0) {
            data = dataTop.concat(dataMid.concat(dataBottom));
        }
        else {
            data = dataTop.concat(dataBottom);
        }

        this.print(this.payload_with_settings(data), 0, printer)
    }

    static printTakeawayKitchenByGroup(check: any) {
        const Groups = this.Groups.map(group => ({
            ...group,
            products: check.orders.filter((order: any) => group.categories.includes(order.category)),
            firstProducts: check.firstOrders.filter((order: any) => group.categories.includes(order.category))
        }))
        console.log(Groups)
        Groups.length ? Groups.forEach(data => 
            data.products.length && this.printTakeawayKitchen({ ...check, orders: data.products, firstOrders: data.firstProducts }, data.printer)
        ) : this.printTakeawayKitchen(check)
    }

    static printCustomer(customer: any){
        const data = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${customer.branch}</div>`,
            },
            {
                type: "text",
                value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center">
                            <span>Tarih: ${this.formatDate(new Date())}</span>
                        </div>
                        <hr />
                        <div style="text-align: center">
                            <span> <b>Müşteri:</b>  ${customer.name}</span> </br>
                            <span> <b>Adres Başlığı:</b> ${customer.title}</span> </br>
                            <span> <b>Adres:</b> ${customer.address}</span> </br>
                            <span> <b>Açıklama:</b> ${customer.description}</span> </br>
                            <span> <b>Müşteri Kredisi:</b> ${customer.customerCredit}</span>
                        </div>
                        <hr/>
                        `
            },]

            this.print(this.payload_with_settings(data))
    }

    static formatDate(date: Date) {
        const y = "0" + date.getHours();
        const z = "0" + date.getMinutes();
        const s = "0" + date.getSeconds();
        const h = "0" + date.getDate();
        const ano = date.getFullYear().toString().substr(-2);
        const ms = date.getMonth();

        return (
            y.substr(-2) +
            ":" +
            z.substr(-2) +
            ":" +
            s.substr(-2) +
            " -  " +
            h.substr(-2) +
            "/" + ms + "/" + ano
        );
    }
}
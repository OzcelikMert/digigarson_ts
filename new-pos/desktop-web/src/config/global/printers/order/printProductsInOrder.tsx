import ReactDOMServer from "react-dom/server";
import DateFormat from "../date/date";
import Print from "../print/print";
import Settings, {PrinterDefaultColumnHeight} from "../settings/settings";
import {payment_types} from "../../../../constants/paymentTypes";

export default class ProductsInOrder {
    static printProductsInOrder(check: any) {
        if (!check.orders.length) return;
        let perDefaultHeight = PrinterDefaultColumnHeight;
        let height = 0;
        let Products = (
            <table>
                <thead>
                <tr>
                    <th style={{textAlign: "start"}}>
                        <strong>Ürün</strong>
                    </th>
                    <th style={{textAlign: "end"}}>
                        <strong>Fiyat</strong>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    check?.cover?.map((cover: any) => {
                        height += perDefaultHeight;
                        return (<tr>
                            <td style={{
                                textAlign: "start",
                                fontSize: "16",
                                marginLeft: "10px",
                            }}>
                                <strong>{cover.quantity + "x " + cover.title}</strong>
                            </td>
                            <td style={{textAlign: "end", fontSize: "14"}}>
                                <strong>{(Number(cover.price) * Number(cover.quantity)).toFixed(2)} TL</strong>
                            </td>
                        </tr>);
                    })
                }
                {
                    check?.orders.map((order: any) => {
                        height += perDefaultHeight;
                        return (
                            <tr>
                                <td
                                    style={{
                                        textAlign: "start",
                                        fontSize: "16",
                                        marginLeft: "10px",
                                    }}
                                >
                                    {order.quantity + "x " + order.name}
                                </td>
                                <td style={{textAlign: "end", fontSize: "14"}}>
                                    <strong>{order.price} TL</strong>
                                </td>
                            </tr>
                        )
                    })
                }
                {
                    check.payments
                        ? <tr>
                            <hr/>
                            <td style={{textAlign: "center"}}>
                                <strong>Ödeme Türleri</strong>
                            </td>
                        </tr> : null

                }
                {
                    check?.payments?.map((order: any) => (
                        <tr>
                            <td style={{textAlign: "start", fontSize: "14"}}>
                                <strong>{payment_types[order.type - 1]}</strong>
                            </td>
                            <td style={{textAlign: "end", fontSize: "14"}}>
                                <strong>
                                    {order.amount} {order.currency}
                                </strong>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        );

        const discounts = check?.discount?.map((discount: any) => {
            height += perDefaultHeight;
            return (
                <div style={{
                    marginBottom: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}>
                <span style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingRight: 7,
                }}>Iskonto</span>
                    <span style={{
                        fontSize: 16,
                        fontWeight: 500
                    }}>-{Number(discount.amount).toFixed(2)} {check.total.currency}</span>
                </div>
            )
        });

        const data: any[] = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${Settings.CurrentSafePrinterName}</div>`,
            },
            {
                type: "text",
                value: `<div style="display: flex; flex-direction: column;justify-content: center; width:100%; text-align:center">
                <span>Tarih: ${DateFormat.formatDate(
                    new Date()
                )}</span><br>      
                <span>
                    ${
                    check.name
                        ? `Kişi: ${check.name}`
                        : `Masa: ${check.table}`
                }
                </span><br>
                ${
                    check.address
                        ? `<span>Adres: ${check.address}</span><br>`
                        : ``
                }
                ${check.phone
                    ? `<span>Telefon: ${check.phone}</span>`
                    : ``
                }
              </div><hr>`,
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">Ürünler</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(Products),
            },
            {
                type: "text",
                value: `<br/>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
            },
            {
                type: "text",
                value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 4px;font-weight:700;font-size:16px; margin-right:155px"><hr>Toplam</span>
                            <span style="right: 4px;font-weight:700;font-size:16px;">${Number(check.total.amount).toFixed(2)} ${check.total.currency}<hr></span>
                        </div>
                        `,
            }
        ];

        if (check.paymentReceived) {
            data.push(
                {
                    type: "text",
                    value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Ödenen Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${Number(check.paymentReceived.amount).toFixed(2)} ${check.paymentReceived.currency}</span>
                        </div>
                        `,
                },
                {
                    type: "text",
                    value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Kalan Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${(Number(check.total.amount) - Number(check.paymentReceived.amount)).toFixed(2)} ${check.total.currency}</span>
                        </div>
                        `,
                }
            )
        }

        Print.print(Settings.payload_with_settings(data), height);
    }
}

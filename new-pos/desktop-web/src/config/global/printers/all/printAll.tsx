import ReactDOMServer from "react-dom/server";
import DateFormat from "../date/date";
import Print from "../print/print";
import Settings from "../settings/settings";
import {payment_types} from "constants/paymentTypes";

export default class All {
    static printAll(check: any) {
        console.log(check);
        if (!check.orders.length) return;
        const products = (
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
                {check?.orders.map((order: any) => (
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
                ))}
                <tr>
                    <td style={{textAlign: "center"}}>
                        <strong>Ödeme Türleri</strong>
                    </td>
                </tr>
                {check?.payments.map((order: any) => (
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
                ))}
                </tbody>
            </table>
        );
        const discounts = check?.discount?.map((discount: any) => (
            <div
                style={{
                    marginBottom: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
        <span
            style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: 7,
            }}
        >
          <span style={{fontSize: 16}}>1x </span>
          iskonto
        </span>
                <span style={{fontSize: 16, fontWeight: 500}}>
          {discount.amount}
                    <span style={{fontSize: 16}}>
            {discount.type == 0 ? "%" : check.total.currency}
          </span>
        </span>
            </div>
        ));

        const covers = check?.cover?.map((cover: any) => (
            <div
                style={{
                    marginBottom: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
        <span
            style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: 7,
            }}
        >
          <span style={{fontSize: 16}}>{cover.quantity}x </span>
            {cover.title}
        </span>
                <span style={{fontSize: 16, fontWeight: 500}}>
          {cover.price}
                    <span style={{fontSize: 16}}>{check.total.currency}</span>
        </span>
            </div>
        ));

        const baseData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <div style={{textAlign: "center", fontSize: "22px", fontWeight: "700"}}>
                            <span>{Settings.CurrentSafePrinterName}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            <span>Tarih: {DateFormat.formatDate(new Date())}</span>
                            <br></br>
                            <span>Masa: {check.table}</span>
                            <br></br>
                        </div>
                        <hr/>
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px",
                },
            },
        ];
        const cover =
            covers?.length > 0
                ? [
                    {
                        type: "text",
                        value: ReactDOMServer.renderToStaticMarkup(
                            <div style={{width: "100%", textAlign: "center"}}>
                                Kuverler
                            </div>
                        ),
                        css: {
                            "font-weight": "700",
                            "font-size": "16px",
                        },
                    },
                    {
                        type: "text",
                        value: ReactDOMServer.renderToStaticMarkup(covers),
                        css: {
                            "font-weight": "500",
                            "font-size": "14px",
                        },
                    },
                ]
                : [];
        const productData = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <div style={{width: "100%", textAlign: "center"}}>Ürünler</div>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "16px",
                },
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
                css: {
                    "font-weight": "900",
                    "font-size": "17px",
                },
            },
        ];
        const discount =
            discounts?.length > 0
                ? [
                    {
                        type: "text",
                        value: ReactDOMServer.renderToStaticMarkup(
                            <div style={{width: "100%", textAlign: "center"}}>
                                Iskontolar
                            </div>
                        ),
                        css: {
                            "font-weight": "700",
                            "font-size": "16px",
                        },
                    },
                    {
                        type: "text",
                        value: ReactDOMServer.renderToStaticMarkup(discounts),
                        css: {
                            "font-weight": "500",
                            "font-size": "14px",
                        },
                    },
                ]
                : [];
        const getTotalPayment = () => {
            let sum = 0;
            check?.total.forEach((total: any) => (sum += total.amount));
            return sum;
        };
        const total = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(
                    <>
                        <hr/>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <span style={{left: 0, textAlign: "start"}}>Toplam</span>
                            <span style={{right: 0, float: "right"}}>
                {getTotalPayment()} {check.total[0].currency}
              </span>
                        </div>
                        <hr/>
                    </>
                ),
                css: {
                    "font-weight": "700",
                    "font-size": "18px",
                },
            },
        ];
        const data = baseData.concat(
            cover.concat(productData.concat(discount.concat(total)))
        );

        Print.print(Settings.payload_with_settings(data));
    }
}

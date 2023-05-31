import ReactDOMServer from "react-dom/server";
import DateFormat from "../date/date";
import Print from "../print/print";
import Settings from "../settings/settings";

export default class Check {
    static printCheck(check: any) {
        console.log(check.orders)
        if (!check.orders.length) return;
        let Products = `<table>
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

        check.orders.map((order: any) => {
            Products += `<tr >
                    <td style="text-align:start; font-size: 14">
                    <strong> ${order.product.prices[order.priceIndex].amount + "x " + order.product.title}</strong>
                    </td>
                    <td style="text-align:end; font-size: 14">
                        <strong>${order.product.prices[order.priceIndex].price} ${order.product.prices[order.priceIndex].currency}</strong>
                    </td>
                </tr>`;
        });
        Products += `
                </tbody>
            </table>`;
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
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    backgroundColor: "#000",
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

        function setHeight() {
            let height = 0;
            height += 20;
            check.orders?.length > 0
                ? (height += check.orders.length)
                : (height += 5);

            return height;
        }

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
                            <span>Masa: ${check.table}</span><br>
                        </div>`,
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
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${
                    check?.cover?.length ? "Kuver" : ""
                }</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(covers),
            },
            {
                type: "text",
                value: `<div style="font-weight:700;font-size:16px; width: 100%; text-align: center">${
                    check?.discount?.length ? "Iskontolar" : ""
                }</div>`,
            },
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(discounts),
            },
            {
                type: "text",
                value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:155px">Toplam</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${check.total.amount} ${check.total.currency}</span>
                        </div>
                        `,
            },
            {
                type: "text",
                value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Ödenen Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${check.paymentReceived.amount} ${check.paymentReceived.currency}</span>
                        </div>
                        `,
            },
            {
                type: "text",
                value: `
                        <div style=" display: flex; flex-direction: row; justify-content:space-evenly; align-self: space-between; align-content: center; width:100%">
                            <span style="left: 8px;font-weight:700;font-size:16px; margin-right:125px">Kalan Tutar</span>
                            <span style="right: 8px;font-weight:700;font-size:16px;">${check.total.amount - check.paymentReceived.amount} ${check.total.currency}</span>
                        </div>
                        `,
            },
        ];
        Print.print(Settings.payload_with_settings(data), setHeight());
    }
}

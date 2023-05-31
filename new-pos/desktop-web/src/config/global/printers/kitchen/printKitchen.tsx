import ReactDOMServer from "react-dom/server";
import DateFormat from "../date/date";
import Print from "../print/print";
import Settings, {PrinterDefaultColumnHeight} from "../settings/settings";

export default class Kitchen {
    static printKitchen(check: any, printer?: string) {
        if (!check.orders.length) return;
        let perDefaultHeight = PrinterDefaultColumnHeight;
        let height = 0;
        const products = check.orders.map((order: any) => {
            height += perDefaultHeight;
            return (
                <>
                    <div
                        style={{
                            marginBottom: 3,
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                    >
                        <div style={{width: "fit-content"}}>
            <span style={{fontSize: 18, fontWeight: 600}}>
              {order.quantity}x{" "}
            </span>
                            <span style={{fontSize: 18, fontWeight: 600}}>
              {" "}
                                {order.name}{" "}
            </span>
                        </div>
                    </div>
                    {order.optionNames && order.optionNames.map((option: any) => {
                        height += perDefaultHeight;
                        return (
                            <div style={{
                                marginBottom: 3,
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                width: "100%",
                                paddingLeft: 15,
                                fontSize: 18, fontWeight: 600
                            }}>
                                <span style={{fontSize: 24, fontWeight: "bold"}}>.</span> {option.title}:
                                <span style={{overflow: "hidden", wordBreak: "break-all"}}>
                                    {option.sub_options.map((sub: any) => {
                                        height += perDefaultHeight;
                                        return (
                                            <span>{sub},</span>
                                        );
                                    })}
                                </span>
                            </div>
                        )
                    })}
                </>
            )
        });
        const firstProducts = check?.firstOrders?.map((order: any) => {
            height += perDefaultHeight;
            return (
                <>
                    <div
                        style={{
                            marginBottom: 3,
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                    >
                        <div style={{width: "fit-content"}}>
            <span style={{fontSize: 18, fontWeight: 600}}>
              {order.quantity}x{" "}
            </span>
                            <span style={{fontSize: 18, fontWeight: 600}}>
              {" "}
                                {order.name}{" "}
            </span>
                        </div>
                    </div>
                    {order.optionNames && order.optionNames.map((option: any) => {
                        height += perDefaultHeight;
                        return (
                            <div style={{
                                marginBottom: 3,
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                width: "100%",
                                paddingLeft: 15,
                                fontSize: 18, fontWeight: 600
                            }}>
                                <span style={{fontSize: 24, fontWeight: "bold"}}>.</span> {option.title}:
                                <span style={{overflow: "hidden", wordBreak: "break-all"}}>
                                    {option.sub_options.map((sub: any) => {
                                        height += perDefaultHeight;
                                        return (
                                            <span>{sub},</span>
                                        );
                                    })}
                                </span>
                            </div>
                        )
                    })}
                </>
            )
        });

        const dataTop = [
            {
                type: "text",
                value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${check.branch ?? Settings.CurrentSafePrinterName}</div>`,
            },
            {
                type: "text",
                value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center">
                            ${check.invoiceName ? `<span>${check.invoiceName}</span><br>` : ""}
                            <span>Tarih: ${DateFormat.formatDate(new Date())}</span><br>
                            <span>${check.customer ? `Adres: ${check.address}` : `Masa: ${check.table}`}</span><br>
                            <span>${check.customer ? `Kişi: ${check.customer}` : ``}</span><br>
                        </div>
                        <hr />
                        <div style="display: flex; flex-direction: column, justify-content: center, width: 100%, ">
                            <span style="font-weight: 700; font-size:18px; text-align:center;">Ürünler</span>
                        </div>`,
            },
        ];
        const dataFirstOrders = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(firstProducts),
            },
            {
                type: "text",
                value: `<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                --------------------------
            </div>`,
            },
        ];

        const dataOrders = [
            {
                type: "text",
                value: ReactDOMServer.renderToStaticMarkup(products),
            },
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
                            <span style={{left: 0}}>..</span>
                            <span style={{right: 0}}></span>
                        </div>
                        <hr/>
                    </>
                ),
            },
        ];
        let data: any[] = [];
        if (check?.firstOrders?.length > 0) {
            data = dataTop.concat(dataFirstOrders.concat(dataOrders));
        } else {
            data = dataTop.concat(dataOrders);
        }

        Print.print(Settings.payload_with_settings(data), height, printer);
    }
}

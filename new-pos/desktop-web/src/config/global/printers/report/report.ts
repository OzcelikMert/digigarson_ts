import Settings, {PrinterDefaultColumnHeight} from "../settings/settings";
import Print from "../print/print";
import { payment_types } from "constants/paymentTypes";

export default class Report {
  static printReport(report: any, type: string) {
    if (!report) return;
    let perDefaultHeight = PrinterDefaultColumnHeight;
    let height = 0;
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

      report?.payments?.map((payment: any) => {
        height += perDefaultHeight;
        element += `<tr>
                        <td style="text-align: start;">
                            <strong>${payment_types[payment.type - 1]}</strong>
                        </td>
                        <td style="text-align: end;">
                            <strong>${Number(payment.amount).toFixed(2)}${payment.currency}</strong>
                        </td>
                    </tr>`;
      });
      element += `
            </tbody>
        </table>`;
      return element;
    };
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
                <tbody>`;
      report?.products?.map((product: any) => {
        height += perDefaultHeight;
        element += `
                            <tr>
                            <td style="text-align: start;">
                                <strong> ${
            product.quantity + "x " + product.productName
        }</strong>
                            </td>
                            <td style="text-align: end;">
                                <strong>${Number(product.price).toFixed(2)}TL</strong>
                            </td>
                        </tr>`;
      });
      element += `
                    </tbody>
                </table>`;
      return element;
    };

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
        value: `<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
                            --------------------------
                        </div>`,
      },
      {
        type: "text",
        value:
          '<div style= "font-weight: 700;font-size:22px; text-align:center;">Ödeme Bilgileri</div>',
      },
      {
        type: "text",
        value: payments(),
      },
      {
        type: "text",
        value: `<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; text-align:center; font-weight: 700; font-size:22px"">
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
    Print.print(Settings.payload_with_settings(data), height);
  }
}

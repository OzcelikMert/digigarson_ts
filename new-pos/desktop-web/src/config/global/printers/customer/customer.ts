import Print from "../print/print";
import Settings from "../settings/settings";
import DateFormat from "../date/date";

export default class Customer {
  static printCustomer(customer: any) {
    const data = [
      {
        type: "text",
        value: `<div style="font-weight: 700;font-size:22px; text-align:center;">${Settings.CurrentSafePrinterName}</div>`,
      },
      {
        type: "text",
        value: `<div style=" display: flex; flex-direction: column; justify-content: center; width: 100%; text-align: center">
                            <span>Tarih: ${DateFormat.formatDate(
                              new Date()
                            )}</span>
                        </div>
                        <hr />
                        <div style="text-align: center">
                            <span> <b>Müşteri:</b>  ${
                              customer.name
                            }</span> </br>
                            <span> <b>Adres Başlığı:</b> ${
                              customer.title
                            }</span> </br>
                            <span> <b>Adres:</b> ${
                              customer.address
                            }</span> </br>
                            <span> <b>Telefon Numarası:</b> ${
                              customer.gsm_no
                            }</span> </br>
                            <span> <b>Açıklama:</b> ${
                              customer.description
                            }</span> </br>
                            <span> <b>Müşteri Kredisi:</b> ${
                              customer.customerCredit
                            }</span>
                        </div>
                        <hr/>
                        `,
      },
    ];

    Print.print(Settings.payload_with_settings(data));
  }
}

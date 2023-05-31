import Category from "./orders/category/category";
import Check from "./orders/check";
import Navbar from "./orders/navbar";
import Products from "./orders/products/products";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Http from "services/http";
import Response from "services/response"
import Takeaway from 'services/takeaway'
import CustomerService from 'services/customer'
import "./takeaway-detail.css"
import { payment_types } from "constants/paymentTypes";
import Printer from "services/printer"


export default function () {

  const { t, i18n } = useTranslation();
  const [takeaways, setTakeaways] = useState<any[]>()


  let takeawayId = location.pathname.split("/")[3];
  let takeaway = takeaways?.find((takeaway: any) => takeaway._id == takeawayId);
  const customerId = takeaway?.customer.customer_id

  const Services = {
    Takeaway: new Takeaway(useContext(Http.Context)!),
    Customers: new CustomerService(useContext(Http.Context)!)
  }

  const Fetchs = {
    Takeaway: {
      All: new Response<any>(),
      Interval: new Response<any>(),
      Create: new Response<any>(),
      Pay: new Response<any>(),
    },
    Customers: new Response<any>(),
  }

  useEffect(() => ((!Fetchs.Takeaway.All.data && Fetchs.Takeaway.All.handle(Services.Takeaway.get())), undefined), [Fetchs.Takeaway.All.data])
  useEffect(() => Fetchs.Takeaway.All.data && setTakeaways(Fetchs.Takeaway.All.data), [Fetchs.Takeaway.All.data])
  useEffect(() => (!Fetchs?.Customers?.data && Fetchs?.Customers?.handle(Services.Customers.get()),undefined), [Fetchs?.Customers?.data])
  useEffect(() => Fetchs?.Customers?.data , [Fetchs?.Customers?.data]);

  const getPhoneNumber = (id: any) => {
      if(customerId){
        let phone = ""
      Fetchs?.Customers?.data?.map((customer: any) => {
        if(customer.id === id){
            phone = customer.gsm_no;
        }
      })
      return phone;
    }
  }
  const getTotalPayment = () => {
    let sum = 0;
    takeaway?.payments.forEach((payment: any) => payment.type == 14 ? undefined : sum += payment.amount)
    return sum;
  }
  const getTotalOrders = () => {
      let sum = 0;
      takeaway?.products.forEach((product: any) => sum += product.price)
      return sum;
  }
  const getProductCount = () => {
      let sum = 0;
      takeaway?.products.forEach((product: any) => sum += product.quantity)
      return sum;
  }

  const printData = {
    ...Fetchs.Takeaway.All.data, orders: takeaway?.products.map((product: any) => ({
        name: product.productName,
        quantity: product.quantity,
        price: product.price
    })),
    ...Fetchs.Takeaway.All.data, total: takeaway?.payments.map((payments: any) => (
        {
            currency: payments.currency,
            amount: payments.amount,
            type: payments.type
        }
    )),
    ...Fetchs.Takeaway.All.data, customer: takeaway?.customer.full_name,
    ...Fetchs.Takeaway.All.data, address: takeaway?.customer.address.address,
    ...Fetchs.Takeaway.All.data, courierId: takeaway?.courier,
    customerPhone: getPhoneNumber(customerId)
  };

  return (
    <>
      <div className='oldTakeawayContainer'>
        <table style={{ width: "90%", border: "1px solid" }} >
          <tr style={{ width: "50%", background: "grey", color: "white" }}  >
            <th>
              {t("user")}
            </th>
            <th>
              {t("payment-status")}
            </th>
            <th>
              {t("date")}
            </th>
          </tr>
          <tr style={{ width: "50%" }} >
            <th>
              {takeaway?.customer?.full_name}
            </th>
            <th>
              {takeaway?.is_it_paid ? t("paid") : ("not-paid")}
            </th>
            <th>
              {new Date(takeaway?.createdAt).toLocaleDateString()}
            </th>
          </tr>
        </table>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", height: "33vh" }}>

          <div>
            <div style={{ textAlign: "center" }}>  <strong>{t("orders")}</strong>  </div>
            <table style={{ width: "61vw", height: "15vh" }} cellSpacing="0" cellPadding="0" >
              <tr>
                <td>
                  <table style={{ width: "100%" }} cellSpacing="0" cellPadding="1" >
                    <tr style={{ color: "white", background: "chocolate", height: "52px" }}>
                      <th style={{ width: "13vw" }}>{t("number")}</th>
                      <th style={{ width: "35vw" }}>{t("product-name")}</th>
                      <th style={{ width: "13vw" }}>{t("price")}</th>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ height: "22vh", overflow: "auto" }}>
                    <table cellSpacing="0" cellPadding="1"  >
                      {
                        takeaway?.products?.map((product: any) => <tr>
                          <th style={{ width: "13vw" }}>{product.quantity}</th>
                          <th style={{ width: "35vw" }}>{product.productName}</th>
                          <th style={{ width: "13vw" }}>{product.price}</th>
                        </tr>)
                      }

                    </table>

                  </div>
                </td>
              </tr>
            </table>
            <div>
              <tr >
                <th style={{ width: "13vw", border: "1px solid" }}>{t("total")}</th>
                <th style={{ width: "35vw", border: "1px solid" }}>{getProductCount()} {t("number-product")}</th>
                <th style={{ width: "13vw", border: "1px solid" }}>{getTotalOrders()} TL</th>
              </tr>
            </div>

          </div>

          <div style={{ marginLeft: "2px" }} >
            <div style={{ textAlign: "center" }}>  <strong>{t("payments")}</strong>  </div>
            <table style={{ width: "61vw" }} cellSpacing="0" cellPadding="0" >
              <tr>
                <td>
                  <table style={{ width: "100%" }} cellSpacing="0" cellPadding="1" >
                    <tr style={{ color: "white", background: "green", }}>
                      <th style={{ width: "13vw" }}>{t("type")}</th>
                      <th style={{ width: "35vw" }}>{t("quantity")}</th>
                      <th style={{ width: "13vw" }}>{t("payment-date")}</th>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ height: "22vh", overflow: "auto" }}>
                    <table cellSpacing="0" cellPadding="1"  >
                      {
                        takeaway?.payments.map((payment: any) => <tr>
                          <th style={{ width: "13vw" }}>{payment_types[Number(payment.type) - 1]}</th>
                          <th style={{ width: "35vw" }}>{payment.amount}{payment.currency}</th>
                          <th style={{ width: "13vw" }}>{new Date(takeaway.createdAt).toLocaleTimeString()}</th>
                        </tr>)
                      }
                    </table>
                  </div>
                </td>
              </tr>
            </table>
            <div>
              <tr>
                <th style={{ width: "13vw", border: "1px solid" }}>{t("total")}</th>
                <th style={{ width: "35vw", border: "1px solid" }}>{takeaway?.payments.length} {t("unit-payment")}</th>
                <th style={{ width: "13vw", border: "1px solid" }}>{getTotalPayment()} TL</th>
              </tr>
            </div>

          </div>

        </div>

      </div>
      <div className='changePriceButtons'>
        <button style={{ background: "blue" }} onClick={()=>window.location.href="/takeaway/"}> {t("back-to-list")} </button>
        <button style={{ background: "green" }} onClick={() => Printer.printTakeaway(printData)}> {t("print")} </button>
      </div>
    </>
  )
}

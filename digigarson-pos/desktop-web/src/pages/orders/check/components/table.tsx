import React, {useContext, useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import ButtonBottom from "./butonBottom";
import "../check.css"
import { useTranslation } from "react-i18next";
import CustomerService from 'services/customer';
import Http from "services/http";
import Response from "services/response";
import OrderService from 'services/order'
import Swal from 'sweetalert2';

export default ({ props }: {
  props: any
}) => {
  const {
    currentTable,
    productsInCheck, setProductsInCheck,
    allchecked, productsInOrder, handleCheckAll,
    handleChecked,
    Fetchs, createUUID,
    payments, setPayments,
    coverList, setCoverList,
    discountList, setDiscountList,
    cash, setCash,
    totalAmount, setTotalAmount,
    productToBeSendFirst, setProductToBeSendFirst,
    customerId,
  } = props;
  
  const Services ={
    Customer: new CustomerService(useContext(Http.Context)!)
  }
  const Fetch ={
      Customer: new Response<any>(),
  }

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (customerId){
      return;
    }
    let temp: any[] = [];
    let sum = 0;
    Fetchs.Check.data?.orders.map((order: any) => {
      let o = Fetchs.Check.data?.paid_orders.find((element: any) => order.orderId == element.id)
      if (!o || o == undefined) {
        temp.push({ product: order, checked: false, uid: createUUID() });
      }
      sum+=order.price;
    });

    let discount = Array();
    Fetchs.Check.data?.discount.forEach((element: any) => {
      discount.push(element);
      if (element.type == 1) {
        sum -= element.amount;
      }
      else {
        sum *= (100 - element.amount) / 100;
      }
    });
    let cover = Array();
    Fetchs.Check.data?.cover.forEach((element: any) => {
      cover.push(element);
      sum += element.quantity * element.price;
    });
    sum -= Fetchs.Check.data?.paymentReceived.amount;

    setCoverList(cover);
    setDiscountList(discount);
    setTotalAmount(sum);
    setProductsInCheck(temp);
    setPayments(Fetchs.Check.data?.paymentReceived)
  }, [Fetchs.Check.data])

  useEffect(() => (!Fetch?.Customer?.data && Fetch?.Customer?.handle(Services.Customer.get()),undefined), [Fetch?.Customer?.data])
  useEffect(() => Fetch?.Customer?.data , [Fetch?.Customer?.data]);

  const getAddress = (id: any) => {
    if(customerId){
      let add = "", title = "", phone = "";
    Fetch?.Customer?.data?.map((customer: any) => {
      if(customer.id === id){
          add = customer?.address[0].address;
          title = customer?.address[0].title;
          phone = customer.gsm_no;
      }
    })
    let totalAddress = `Adres Başlığı: ${title}` +"\n"+ `Address: ${add}`;
    return totalAddress
    }

  }


  const getNewOrderOption = (index: any) => {
    let optionData = productsInOrder?.find((products: any) => products?.product._id === index)
    return optionData.optionNames?.map((a:any) => {
      return a.option + " - " + a.sub_options[0] + "</br>"
    }) 
  }
  function optionNewOrderPopup(t: any, id: any): void {
     if(!productsInOrder.optionNames){
      Swal.fire({
        icon:"error",
        title: t("no-option")
    })
     }
     else{
      productsInOrder && Swal.fire({
        title: `<b>Opsiyonlar</b>`,
        html: `
              <tr>
                <td>${getNewOrderOption(id)}</td>
              </tr>
  
            `,
        confirmButtonText: t("close"),
      })
     }
  }

  const getProductOption = (index: any) => {
    let optionData = productsInCheck?.find((products: any) => products?.product._id === index)
    return optionData.optionNames?.map((a:any) => {
      return a.option + " - " + a.sub_options[0] + "</br>"
    }) 
  }
  function optionProductPopup(t: any, id: any): void {
    if(!productsInCheck.optionNames){
      Swal.fire({
        icon:"error",
        title: t("no-option")
    })
    }
    else{
      productsInCheck && Swal.fire({
        title: `<b>Opsiyonlar</b>`,
        html: `
              <tr>
                <td>${getProductOption(id)}</td>
              </tr>
  
            `,
        confirmButtonText: t("close"),
      })
    }
  }

  const tableNewOrders = (pc: any) => {
    let price = Number(pc.product.prices[pc.priceIndex].price)
    let amount = Number(pc.product.prices[pc.priceIndex].amount)
    let total = price * amount
    return (
      <tr>
        <td><input type="checkbox" id={"checkbox-order_" + pc.product._id} checked={pc.checked} style={{ borderRadius: "3px" }} onChange={(event) => handleChecked(event, pc, "new")} /></td>
        <td className="tableProductCount">{pc.product.prices[pc.priceIndex].amount}</td>
        <td>{pc.product.title}</td>
        <td>{total} TL</td>
        <td><article onClick={() => optionNewOrderPopup(t, pc.product._id)}>...</article></td>
      </tr>
    )
  }

  //onclick = onClick={() => optionProductPopup(t, pc.product._id)}
  const tableProducts = (pc: any) => {
    return (
      <tr>
        <td><input type="checkbox" id={"checkbox-" + pc.product._id} checked={pc.checked} style={{ borderRadius: "3px" }} onChange={(event) => handleChecked(event, pc, "current")} /></td>
        <td className="tableProductCount">{pc.product.quantity}</td>
        <td>{pc.product.name}</td>
        <td>({pc.product.price}) TL</td>
        <td><article>...</article></td>
      </tr>
    )
  }
  const coverTable = (cover: any) => {
    return (
      <tr>
        <td></td>
        <td>{cover.quantity}</td>
        <td>{cover.title}</td>
        <td>{cover.price}</td>
      </tr>
    )
  }
  const discountTable = (discount: any) => {
    return (
      <tr>
        <td></td>
        <td></td>
        <td>{discount.amount}{discount.type == 0 ? "%" : "tl"} {t("discount-table")}</td>
        <td></td>
      </tr>
    )
  }
  return (
    <div className="tableContainer">
      <div className="titleinfo">
        <strong >{currentTable?.title}</strong>
        <span ><strong> {t("total")} : </strong>{Math.max(0,totalAmount)} TL</span>
      </div>
      <div className="Tablebox">

        <table className="adisyonTable">
          <thead>
            <tr>
              <th><input type="checkbox" style={{ borderRadius: "3px" }} checked={allchecked} onChange={(event) => handleCheckAll(event)} /></th>
              <th className="tableProductCount"> {t("quantity")}</th>
              <th>{t("name")}</th>
              <th>{t("price")}</th>
              <th>Opsiyonlar</th>
            </tr>
          </thead>
          <tbody >
            {
              coverList?.map((cover: any) => coverTable(cover))
            }
            {
              productsInCheck.map((pc: any) => tableProducts(pc))
            }
            {
              productToBeSendFirst?.map((pc: any) => tableNewOrders(pc))
            }
            {
              productToBeSendFirst.length > 0 ?
                <tr>
                  <th></th>
                  <th></th>
                  <th>-------------------------------------------</th>
                  <th></th>
                </tr> : null
            }
            {
              productsInOrder?.map((pc: any) => tableNewOrders(pc))
            }

            {
              discountList?.map((discount: any) => discountTable(discount))
            }
          </tbody>
        </table></div>
      <span> {getAddress(customerId)}</span>
      {!customerId && !currentTable.safeSales && <ButtonBottom props={props} />}
    </div>
  )
}

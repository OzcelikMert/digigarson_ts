import React, { useContext, useEffect, useState } from 'react'
import { MODAL } from "constants/modalTypes"
import { payment_types } from 'constants/paymentTypes';
import Response from 'services/response';
import Check from 'services/checks';
import Http from 'services/http';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function Updatecheck({ props }: { props: any }) {
  const { t, i18n } = useTranslation();
  const {
    checkID,
    setCurrentModal,
    createUUID,
  } = props;

  const formatPaymentsData = (payments: any[]) => {
    let data = Array();
    payments?.forEach((payment: any) => data.push({ payment: payment, uid: createUUID() }))
    return data;
  }

  const [oldCheck, setOldCheck] = useState<any>();
  const Service = new Check(useContext(Http.Context)!);
  const Fetch = new Response<any>();
  const Fetchs = {
    Check: {
        OLD: new Response<any>(),
    },
}
  const [rows, setRows] = useState<any>([])
  const [fetchComplete, setFetchComplete] = useState(false);

  useEffect(() => (!Fetch.data && Fetch.handle(Service.getOld(checkID)), undefined), [Fetch.data])
  useEffect(() => {
    if (Fetch.data && !fetchComplete) {
      setRows(formatPaymentsData(Fetch.data?.payments))
      setFetchComplete(true)
    }
  }, [Fetch.data])
  useEffect(() => (!Fetchs.Check.OLD.data && Fetchs.Check.OLD.handle(Service.getOld(checkID)), undefined), [Fetchs.Check.OLD.data])
  useEffect(() => Fetchs.Check.OLD.data && setOldCheck(Fetchs.Check.OLD.data), [Fetchs.Check.OLD.data])

  const getTotal = () =>{
    let sum = 0;
      oldCheck?.products.forEach((product: any) => sum += product.price)
      return sum;
  } 

  const getTotalPayment = (payment:any) => {
    let sum = 0;
   payment.forEach((payment: any) => payment.type == 14 ? undefined : sum += payment.amount)
    return sum;
}
  const save = () => {
    const data = {
      payments: rows.map((row: any) => ({
        type: Number(row.payment.type),
        amount: Number(row.payment.amount),
        currency: row.payment.currency,
        createdAt: new Date().toISOString(),
      }))
    }
    if(getTotal() < getTotalPayment(data.payments)){
      Swal.fire({
        title:t("update-check"),
        icon:"error"
      })
    }
    else if(getTotal() > getTotalPayment(data.payments)){
      Swal.fire({
        title:t("update-check-less"),
        icon:"error"
      })
    }
    else{
      Service.updateOld(checkID,data).then(()=>{
            Swal.fire({
              title: t("updated-ticket"),
              icon:"success",
              timer:2000
            }).then(()=>{
              cancel();
            })  
      })     
      .catch(()=>{
        Swal.fire({
          title: t("error"),
          icon: "error"
        })
      })
    }
  }


  const cancel = () => {
    setCurrentModal(MODAL.CALL_CHECK);
  }

  const deleteRow = (uid: any) => {
    setRows(rows.filter((row: any) => row.uid != uid))
  }

  const addRow = () => {
    setRows([...rows, {
      payment: {
        type: 1,
        amount: 0,
        currency: "TL",
      },
      uid: createUUID()
    }]);
  }

  const Payment = (paymentData: any) => {
    let uid = paymentData.payment.uid
    let payment = paymentData.payment.payment;

    
    const handlePriceChange = (value: any, uid: any) => {
      let payment = rows.find((row: any) => row.uid == uid);
      payment.payment.amount = value;
      setRows(rows)       
    }

    const handleTypeChange = (value: any) => {
      let payment = rows.find((row: any) => row.uid == uid);
      payment.payment.type = value;
      setRows(rows)
    }

    return <tr style={{ width: "100%" }} id={uid}>
      <td style={{ width: "20vw", textAlign: "center" }}>
        <select onChange={(event) => handleTypeChange(event.target.value)}  defaultValue={payment.type} >
          {
            payment_types.map((payment_type: any, i: number) => <option value={i + 1}> {payment_type} </option>)
          }
        </select>
      </td>
      <td style={{ width: "20vw", textAlign: "center" }}>
        <input min={0} type={"number"} defaultValue={payment.amount} onChange={(event) => handlePriceChange(event.target.value, uid)} />
      </td>
      <td style={{ width: "10vw", textAlign: "center" }}>{payment.currency}</td>
      <td style={{ width: "9vw", textAlign: "center" }}><button onClick={() => deleteRow(uid)} className="butn" style={{ background: "red" }}>{t("delete")}</button></td>
    </tr>
  }

  return (
    <>
      <div className='oldCheckContainer no-overflow'>
        <table cellSpacing="0" cellPadding="0" >
          <thead>
            <tr>
              <td>
                <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1" >
                  <tr style={{ color: "white", background: "grey", }}>
                    <th style={{ width: "20vw", textAlign: "center" }}>{t("type")}</th>
                    <th style={{ width: "20vw", textAlign: "center" }}>{t("amount")}</th>
                    <th style={{ width: "10vw", textAlign: "center" }}>{t("genus")}</th>
                    <th style={{ width: "9vw", textAlign: "center" }}>{t("action")}</th>
                  </tr>
                </table>
              </td>
            </tr>
          </thead>
          <tbody>
            <div style={{ height: "33vh", overflow: "auto" }}>
              <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1"  >
                {rows?.map((row: any) => <Payment payment={row} />)}
                <tr>
                  <th style={{ width: "20vw", textAlign: "center" }}></th>
                  <th style={{ width: "20vw", textAlign: "center" }}><button className='butn blue' onClick={() => addRow()}>{t("add")}</button></th>
                  <th style={{ width: "10vw", textAlign: "center" }}></th>
                  <th style={{ width: "9vw", textAlign: "center" }}></th></tr>
              </table>
            </div>
          </tbody>
        </table>
      </div>
      <div>
        <span style={{paddingLeft: 56, fontWeight: 600}}>{t("total-ticket-amount")}: {getTotal()}</span>
      </div>
      <div className='changePriceButtons'>
        <button style={{ background: "green" }} onClick={() => save()}> {t("submit")}</button>
        <button onClick={() => cancel()}>{t("cancel")}</button>
      </div>
    </>
  )
}

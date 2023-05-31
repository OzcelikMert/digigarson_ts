import { useContext, useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import Http from 'services/http'
import Takeaway from 'services/takeaway'
import Response from "services/response"
import Customer from 'services/customer'
import CourierService from 'services/couriers'
import FuzzySearch from 'fuzzy-search'
import IntlTelInput from 'react-intl-tel-input'
import { ICustomer, createCustomer, phone } from "services/interfaces/customer";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2'
import { payment_types } from 'constants/paymentTypes'

export default function () {
  //interfaces
  interface ISearchParameters {
    phone: phone | undefined,
    name: string | undefined,
    paid: number | undefined,
    dates: any,
  }
  let sum = 0;
  let count = 0;
  const { t, i18n } = useTranslation();
  // states
  const [takeaways, setTakeaways] = useState<any[]>()
  const [customers, setCustomers] = useState<any[]>([])
  const [couriers, setCouriers] = useState<any[]>([])
  const [searcParameters, setSearchParameters] = useState<ISearchParameters>({
    phone: undefined,
    name: undefined,
    paid: undefined,
    dates: { start: new Date().toLocaleDateString('en-CA'), end: new Date().toLocaleDateString('en-CA') },
  })
  const [mergedData, setMergedData] = useState<any[]>([])
  const [filteredList, setFilteredList] = useState<any[]>([])
  //constants
  const Services = {
    Takeaway: new Takeaway(useContext(Http.Context)!),
    Customer: new Customer(useContext(Http.Context)!),
    Couriers: new CourierService(useContext(Http.Context)!),
  }

  const Fetchs = {
    Takeaway: {
      All: new Response<any>(),
      Interval: new Response<any>(),
      Create: new Response<any>(),
      Pay: new Response<any>(),
    },
    Customer: new Response<any>(),
    Couriers: new Response<any>(),
  }

  let today = new Date().toLocaleDateString()

  //fetchs
  //Takeaway
  useEffect(() => ((!Fetchs.Takeaway.All.data && Fetchs.Takeaway.All.handle(Services.Takeaway.get())), undefined), [Fetchs.Takeaway.All.data])
  useEffect(() => Fetchs.Takeaway.All.data && setTakeaways(Fetchs.Takeaway.All.data), [Fetchs.Takeaway.All.data])
  //Customer
  useEffect(() => ((!Fetchs.Customer.data && Fetchs.Customer.handle(Services.Customer.get())), undefined), [Fetchs.Customer.data])
  useEffect(() => Fetchs.Customer.data && setCustomers(Fetchs.Customer.data), [Fetchs.Customer.data])
  //Couriers	
  useEffect(() => (!Fetchs.Couriers.data && Fetchs.Couriers.handle(Services.Couriers.get()), undefined), [Fetchs.Couriers.data])	
  useEffect(() => Fetchs.Couriers.data && setCouriers(Fetchs.Couriers.data), [Fetchs.Couriers.data])
  //mergeDatas
  useEffect(() => {
    if (Fetchs.Takeaway.All.data && Fetchs.Customer.data) {
      let mergedDataTemp: any = [];
      let startDate = searcParameters.dates.start;
      Fetchs.Takeaway.All.data.forEach((takeaway: any) => {
        const d = new Date(takeaway.createdAt).toLocaleDateString('en-CA');
        if (startDate > d){
          startDate = d;
        }
        let customer = Fetchs.Customer.data.find((customer: any) => customer.id == takeaway.customer.customer_id)
        mergedDataTemp.push({ ...takeaway, gsm_no: customer.gsm_no })
      });
      setMergedData(mergedDataTemp)
      setSearchParameters({...searcParameters,dates:{...searcParameters.dates, start:startDate}})
    }
  }, [Fetchs.Takeaway.All.data, Fetchs.Customer.data])
  //filterList
  useEffect(() => {
    let result = mergedData;
    result = filterByPhone(searcParameters?.phone?.number, result)
    result = filterByName(searcParameters?.name, result)
    result = filterByPaid(searcParameters?.paid, result)
    result = filterByDate(searcParameters?.dates, result)
    setFilteredList(result)
  }, [searcParameters])
  //functions
  const countTakeaway = () =>{	
    filteredList?.map((data: any) => {
        today === new Date(data?.createdAt).toLocaleDateString() ? sum = sum + 1 : ""
    })
    return sum;
  }

  const refresh = () =>{
    Fetchs.Customer.handle(Services.Customer.get());
    Fetchs.Takeaway.All.handle(Services.Takeaway.get());
  }
  const getCustomerByID = (id: string) => {
    return customers?.find((customer: any) => customer.id == id)
  }

  const filterByPhone = (value: any, arr: any[]) => {
    if (value == undefined) {
      return arr;
    }
    const searcher = new FuzzySearch(
      arr,
      ["gsm_no"],
      {
        caseSensitive: false
      })
    let result = searcher.search(value.replace(/\s/g, ''));
    return result;
  }

  const filterByName = (value: string | undefined, arr: any[]) => {
    if (value == undefined) {
      return arr;
    }
    const searcher = new FuzzySearch(
      arr,
      ["customer.full_name"],
      {
        caseSensitive: false
      })
    let result = searcher.search(value.replace(/\s/g, ''));
    return result;
  }

  const filterByPaid = (value: number | undefined, arr: any[]) => {
    if (value == 2 || !value) {
      return arr;
    }
    return arr.filter(({ is_it_paid }) => is_it_paid == (value==1))
  }

  const filterByDate = (dates: any, arr: any) => {
    let result = arr.filter((takeaway: any) => {
      const date = new Date(takeaway.createdAt).toLocaleDateString('en-CA')
      if (date >= dates.start && date <= dates.end) {
        return takeaway
      }
    })
    return result;
  }
  const selectCourier = (id:any) => {	
    let selectedCourier = Fetchs.Couriers.data?.find((courier:any) => courier._id == id)	
	
    if(selectedCourier?.title == undefined){	
       return "Kurye silinmiş";	
    }	
    else if(selectedCourier?.title == null)	
    {	
      return "a";	
    }	
    else{	
       return selectedCourier?.title;	
    }	
  }
  const handleClick = (takeaway: any) => {
    if(takeaway.is_it_paid){
      
    }
    else{
    Swal.fire({
        title: t("select-payment"),
        icon: "question",
        input: "select",
        inputOptions: 
        {
            1: t("credit-card"),
            2: t("cash"),
            3: t("app_payment"),
            6: t("tick-payment"),
            7: "Sodexo",
            8: "Smart",
            9: "Winwin",
            10: "Multinet",
            11: "Setcard",
            12: "Metropol",
            13: "Edended",
            14: "Bahşişler"
        },
        showCancelButton: true
    }).then((result:any)=>{
      if (result.dismiss == "cancel" || result.value === undefined) {
      } 
      else{
        let sum = 0;
        takeaway?.products?.forEach((product:any) => {
          sum += product.price
        });
        const data = {
          "payments": [
              {
                  "type": result.value,
                  "amount": sum,
                  "currency": "TL"
              }
          ]
        }
        Services.Takeaway.pay(takeaway._id, data)
        .then(() => {
            Swal.fire({
                title: t("payment-success"),
                icon: "success"
            })
          Fetchs.Takeaway.All.handle(Services.Takeaway.get())
        })
        .catch(() => {
            Swal.fire({
                title: t("error"),
                icon: "error"
            })
        });
      }
    })
  }
  }
  return <>
    <div className="takeaway-header">
      <div className="left">
        <div className="operations">
          <button>{t("close-tickets")}</button>
          <button>{t("cancel-selection")}</button>
          <button style={{ width: "12vw" }} onClick={() => window.location.href = `/takeaway/all-takeaway`}>{t("all-orders")}</button>
          <input
            type="date"
            max={new Date().toLocaleDateString('en-CA')}
            value={searcParameters.dates.start}
            onChange={(event: any) => setSearchParameters({ ...searcParameters, dates: { start: event.target.value, end: searcParameters.dates.end > event.target.value ? searcParameters.dates.end : event.target.value } })}
            className="datePicker" />
          <input
            type="date"
            min={searcParameters.dates.start}
            max={new Date().toLocaleDateString('en-CA')}
            value={searcParameters.dates.end}
            onChange={(event: any) => setSearchParameters({ ...searcParameters, dates: { ...searcParameters.dates, end: event.target.value } })}
            className="datePicker" />
          <button onClick={()=>refresh()}>{t("refresh")}</button>
        </div>
        <div className="search">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>{t("phone-number")}</th>
                <th>{t("name")}</th>
                <th>{t("payment-status")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <IntlTelInput
                    preferredCountries={['tr']}
                    format={true}
                    telInputProps={{
                      maxLength: 14,
                    }}
                    value={searcParameters?.phone?.number}
                    onPhoneNumberChange={(isValid, number, country) => {
                      setSearchParameters({ ...searcParameters, phone: { isValid, number, country } })
                    }}
                    style={{ color: "black", width: "100%", }}
                    inputClassName="telInput"
                  />
                </td>
                <td>
                  <input
                    onChange={(event: any) => setSearchParameters({...searcParameters, name:event.target.value})}
                    style={{ color: "black" }} />
                </td>
                <td>
                  <select defaultValue={2} style={{ color: "black", width: "100%", }} onChange={(event: any) => setSearchParameters({...searcParameters, paid:event.target.value})}>
                    <option value={2}>{t("all")}</option>
                    <option value={1}>{t("paid")}</option>
                    <option value={0}>{t("not-paid")}</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      <div className="right">
        <button className="col1-2" onClick={() => window.location.href = "/"}>{t("close")}</button>
        <button onClick={() => window.location.href = "/takeaway/customers"}>{t("new-order")}</button>
        <button onClick={() => window.location.href = "/"}>{t("customer-free-ticket")}</button>
      </div>
    </div>

    <div className="takeaway-body">
      <div style={{textAlign:"center"}}>	
        {t("total-takeaway-quantity")} {countTakeaway()}
      </div>
      <table>
        <thead>
          <tr>
            <th >{t("phone-number")}</th>
            <th >{t("name")}</th>
            <th >{t("courier-name")}</th>
            <th >{t("creation-date")}</th>
            <th >{t("paid")}</th>
            <th >{t("payment-type")}</th>
            <th >{t("check")}</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredList?.map((data: any) => {
              return today === new Date(data?.createdAt).toLocaleDateString() ? 
              <tr onClick={() => handleClick(data)} style={{cursor:"pointer"}}>
                <th >{data.gsm_no}</th>
                <th >{data.customer.full_name}</th>
                <th >{data.courier ? selectCourier(data.courier) : ""}</th>
                <th >{new Date(data.createdAt).toLocaleDateString('en-CA')} {new Date(data.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                })}</th>
                <th style={{ backgroundColor: data.is_it_paid ? "green" : "red" }} >{data.is_it_paid ? t("yes") : t("no")}</th>
                <th>{payment_types[Number(data.payments[0]?.type) - 1]}</th>
                <th><button onClick={() => window.location.href = `/takeaway/detail/${data._id}`}>{t("detail")}</button></th>
              </tr> : <tr></tr>
            })
          }
        </tbody>
      </table>
    </div>
  </>
}

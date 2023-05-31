
import Table from 'services/table'
import Http from 'services/http';
import Response from 'services/response';
import CheckService from 'services/checks'
import CService from 'services/category'
import PService from 'services/product'
import Order from 'services/order'
import CaseService from "services/case"
import { useContext, useEffect, useState } from 'react';
import { MODAL } from "constants/modalTypes"
import { useTranslation } from "react-i18next";
import './getcreditlist.css'
import FuzzySearch from 'fuzzy-search';
import TickService from 'services/tick'

export default function Getcreditlist({ props }: { props: any }) {
    const { t, i18n } = useTranslation();
    const {
        ticks, setCheckID, handleModal, setTicks,
    } = props;
    
    const ServiceTick = new TickService(useContext(Http.Context)!);

    const Fetchs = {
        Tick: new Response<any>(),
    }

    useEffect(() => (!Fetchs.Tick.data && Fetchs.Tick.handle(ServiceTick.get()), undefined), [Fetchs.Tick.data])
    useEffect(() => Fetchs.Tick.data && setTicks(Fetchs.Tick.data), [Fetchs.Tick.data])

    
    const [phoneNum, setPhoneNumber] = useState("");
    const update = (checkID: string, user: any) => {}

    const handleCheck = (checkID: any) => {
        setCheckID(checkID);
        handleModal(MODAL.OLD_CREDIT_CHECK);
    }
    
    const Ticks = (tick: any) => {
        tick = tick.tick;
        let sum = 0;
        let checkId = "";
        tick?.ticks?.forEach((payment: any) =>
            checkId = payment.checkId

        )

        tick?.ticks?.forEach((payment: any) => sum += payment.debt)
        return (
            tick?.ticks?.map((payment: any) =>
            <tr className='checkInList'>
                <th style={{ width: "10vw" }}>{tick.name}</th>
                <th style={{ width: "20vw" }}>{tick.phoneNum}</th>
                <th style={{ width: "20vw" }}>{payment.debt}</th>
                <th style={{ width: "19vw" }}>
                    <button style={{ background: "blue" }} onClick={() => handleCheck(payment.checkId)}>{t("detail")}</button>
                </th>
            </tr>
            )
        )
    }
    const searchCustomer = (event: any, type: string) => {
        if (type == "phoneNum") {
            setPhoneNumber(event.target.value);
        }
        const customerSearcher = new FuzzySearch(
            Fetchs.Tick.data,
            [type],
            {
                caseSensitive: false
            })
        const result = customerSearcher.search(event.target.value.trim());
        setTicks(result)
    }
    return (
        <>
            <div className="searchcost">
                <table>
                    <thead>
                        <tr>
                            <th>{t("phone-number")}</th>
                            <th>{t("name")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                ["phoneNum", "name"].map((type: string) => <td>
                                    <input style={{ color: "black", borderRadius: "16px" }} onChange={(event) => searchCustomer(event, type)} />
                                </td>)
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
            <table cellSpacing="0" cellPadding="0" >
                <thead>
                    <tr>
                        <td>
                            <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1" >
                                <tr style={{ color: "white", background: "grey", }}>

                                    <th style={{ width: "10vw" }}>{t("user")}</th>
                                    <th style={{ width: "20vw" }}>{t("phone-number")}</th>
                                    <th style={{ width: "20vw" }}>{t("total-ticks")}</th>
                                    <th style={{ width: "19vw" }}>{t("actions")}</th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <div style={{ height: "34vh", overflow: "auto" }}>
                        <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1"  >
                            {
                                ticks.map((tick: any) => <Ticks tick={tick} />)
                            }
                        </table>
                    </div>
                </tbody>
            </table>
            {/* <div className='changePriceButtons'>
        <button style={{ background: "green" }} onClick={() => console.log(myCase[0]?.checks)}> KAYDET </button>
        <button onClick={() => console.log(Context)}> İPTAL </button>
      </div> */}

        </>

    )

}

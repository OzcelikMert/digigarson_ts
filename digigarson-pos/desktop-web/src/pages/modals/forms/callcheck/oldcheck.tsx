import React, { useContext, useEffect, useState } from 'react'
import { MODAL } from "constants/modalTypes"
import { payment_types } from 'constants/paymentTypes';
import Response from 'services/response';
import Check from 'services/checks';
import Http from 'services/http';
import "./oldcheck.css"
import { useTranslation } from 'react-i18next';
export default function Oldcheck({ props }: { props: any }) {
    const {
        handleModal,
        checkID, table,
        setCurrentModal,
        handleUpdateOldCheck,
        oldCheckUser,
    } = props;
    const Services = {
        Check: new Check(useContext(Http.Context)!),
    };

    const Fetchs = {
        Check: {
            Get: new Response<any>(),
            OLD: new Response<any>(),
            PAY: new Response<any>()
        },
    }

    const [oldCheck, setOldCheck] = useState<any>();
    const { t, i18n } = useTranslation();

    useEffect(() => (!Fetchs.Check.OLD.data && Fetchs.Check.OLD.handle(Services.Check.getOld(checkID)), undefined), [Fetchs.Check.OLD.data])
    useEffect(() => Fetchs.Check.OLD.data && setOldCheck(Fetchs.Check.OLD.data), [Fetchs.Check.OLD.data])

    const getTotalPayment = () => {
        let sum = 0;
        oldCheck?.payments.forEach((payment: any) => payment.type==14?undefined:sum += payment.amount)
        return sum;
    }
    const getTotalOrders = () => {
        let sum = 0;
        oldCheck?.products.forEach((product: any) => sum += product.price)
        return sum;
    }
    const getProductCount = () => {
        let sum = 0;
        oldCheck?.products.forEach((product: any) => sum += product.quantity)
        return sum;
    }

    return (
        <>
        <div className='oldCheckContainer'>
            <table style={{ width: "90%", border: "1px solid" }} >
                <tr style={{ width: "50%", background: "grey", color: "white" }}  >
                    <th>
                        {t("user")}
                    </th>
                    <th>
                        {t("table")}
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
                        {oldCheckUser}
                    </th>
                    <th>
                        {table?.title}
                    </th>
                    <th>
                        {oldCheck?.is_it_paid ? t("paid") : t("not-paid")}
                    </th>
                    <th>
                        {new Date(oldCheck?.createdAt).toLocaleTimeString()}
                    </th>
                </tr>
            </table>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", height: "33vh" }}>

                <div>
                    <div style={{ textAlign: "center" }}>  <strong>{t("orders")}</strong>  </div>
                    <table style={{ width: "25vw", height: "15vh" }} cellSpacing="0" cellPadding="0" >
                        <tr>
                            <td>
                                <table style={{ width: "100%" }} cellSpacing="0" cellPadding="1" >
                                    <tr style={{ color: "white", background: "chocolate", }}>
                                        <th style={{ width: "3vw" }}>{t("number")}</th>
                                        <th style={{ width: "19vw" }}>{t("product-name")}</th>
                                        <th style={{ width: "3vw" }}>{t("price")}</th>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ height: "22vh", overflow: "auto" }}>
                                    <table cellSpacing="0" cellPadding="1"  >
                                        {
                                            oldCheck?.products?.map((product: any) => <tr>
                                                <th style={{ width: "3vw" }}>{product.quantity}</th>
                                                <th style={{ width: "19vw" }}>{product.productName}</th>
                                                <th style={{ width: "3vw" }}>{product.price}</th>
                                            </tr>)
                                        }

                                    </table>

                                </div>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <tr >
                            <th style={{ width: "5vw", border: "1px solid" }}>{t("total")}</th>
                            <th style={{ width: "15vw", border: "1px solid" }}>{getProductCount()} {t("number-product")}</th>
                            <th style={{ width: "5vw", border: "1px solid" }}>{getTotalOrders()} TL</th>
                        </tr>
                    </div>

                </div>

                <div style={{ marginLeft: "2px" }} >
                    <div style={{ textAlign: "center" }}>  <strong>{t("payments")}</strong>  </div>
                    <table style={{ width: "25vw" }} cellSpacing="0" cellPadding="0" >
                        <tr>
                            <td>
                                <table style={{ width: "100%" }} cellSpacing="0" cellPadding="1" >
                                    <tr style={{ color: "white", background: "green", }}>
                                        <th style={{ width: "7vw" }}>{t("type")}</th>
                                        <th style={{ width: "13vw" }}>{t("quantity")}</th>
                                        <th style={{ width: "5vw" }}>{t("creation-date")}</th>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ height: "22vh", overflow: "auto" }}>
                                    <table cellSpacing="0" cellPadding="1"  >
                                        {
                                            oldCheck?.payments.map((payment: any) => <tr>
                                                <th style={{ width: "5vw" }}>{payment_types[Number(payment.type) - 1]}</th>
                                                <th style={{ width: "15vw" }}>{payment.amount}{payment.currency}</th>
                                                <th style={{ width: "5vw" }}>{new Date(payment.createdAt).toLocaleTimeString()}</th>
                                            </tr>)
                                        }
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <tr >
                            <th style={{ width: "5vw", border: "1px solid" }}>{t("total")}</th>
                            <th style={{ width: "15vw", border: "1px solid" }}>{oldCheck?.payments.length} {t("unit-payment")}</th>
                            <th style={{ width: "5vw", border: "1px solid" }}>{getTotalPayment()} TL</th>
                        </tr>
                    </div>
                </div>

            </div>

        </div>
            <div className='changePriceButtons'>
                <button style={{ background: "blue" }} onClick={() => setCurrentModal(MODAL.CALL_CHECK)}> {t("back-tickets")} </button>
                <button style={{ background: "green" }} onClick={() => handleUpdateOldCheck(checkID)}> {t("update-tickets")} </button>
            </div>
        </>


    )
}

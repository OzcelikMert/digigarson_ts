
import Swal from 'sweetalert2';
import '../styles/tables.css'
import { DateTime } from './dateTime';

import {MODAL} from "../constants/modalTypes"
import { useTranslation } from "react-i18next";
import { useState } from 'react';

export default function Operations({ props }: { props: any }) {
    const {
        Context,
        myCase,
        caseHandler,
        handleModal,
        printReport,
        caseSale,
        setCurrentModal,
        setModalOpen,
        costs,
    } = props;
    const { t, i18n } = useTranslation();
    const [settingsOpen, setSettingsOpen] = useState(false);
    function caseStatePopup(t: any): void {
        myCase && Swal.fire({
            title: `<b>${t("case-status")}</b>`,
            html: `
                    <b>${t("tickets-paid")}</b>: ${myCase[0]?.checks.length}</br> 
                    <b>${t("opening-amount")}</b>: ${myCase[0]?.start_balance[0]?.amount} ${myCase[0].start_balance[0]?.currency}<br/>
                    <b>${t("total-amount")}</b>: ${getTotalAmount().toFixed(2)} TL</br> 
                    <b>${t("remaining-amount")}</b>: ${getTotalPayment().toFixed(2)} TL</br>
                    <b>Masraf</b>: ${getTotalCost()} TL
                        `,
            confirmButtonText: t("close"),
        });
    }
    const getTotalAmount = () => {
        let sum = 0;
        let sum_payment = 0;
        let start_balance = myCase[0]?.start_balance[0]?.amount;
        let today = new Date().toLocaleDateString()
        myCase[0]?.balance?.forEach((payment: any) => sum_payment += payment.amount);
        sum = start_balance + sum_payment
        return sum;
    }
    const getTotalPayment = () => {
        let sum = 0;
        let sum_payment = 0;
        let sum_cost = 0;
        let start_balance = myCase[0]?.start_balance[0]?.amount;
        let today = new Date().toLocaleDateString()
        myCase[0]?.balance?.forEach((payment: any) => sum_payment += payment.amount);
        costs?.forEach((cost:any) => {
            let costDate = new Date(cost?.createdAt).toLocaleDateString()
            if (today == costDate) {
                sum_cost += cost.expense_amount
            }
        });
        sum = start_balance + sum_payment - sum_cost
        return sum;
    }
    
    const getTotalCost = () => {
        let sum = 0;
        let today = new Date().toLocaleDateString()
        costs?.forEach((cost:any) => {
            let costDate = new Date(cost?.createdAt).toLocaleDateString()
            if (today == costDate) {
                sum += cost.expense_amount
            }
        });
        return sum;
    }

    const detailCreditProducts = () => {
        setCurrentModal(MODAL.GET_CREDIT_LIST);
        setModalOpen(true);
        return;
    } 

    const createBrowserWindow =(url : string ) => {
        window.require("electron").ipcRenderer.send("new",url)
      }
    
    const checkPerm = (permission : string) => {
        let p = false;
        Context.User.permissions.forEach((perm: string)=>{
            if(perm==permission){
                p= true;
                return;
            }
        })
        return p;
    }


    const handleNewTab = (perm: string) => {
        
        if(checkPerm(perm)){
            switch(perm){
                case "509":
                    createBrowserWindow("https://manager.digigarson.com/sign-in");
                    break;
                case "510":
                    createBrowserWindow("https://analysis.digigarson.com/sign-in");
                    break;
                default:
                    break;
            }
            
        }
        else{
            Swal.fire({
                icon:"error",
                title: t("not-permission")
            })
        }
    }

    return <section className="Operations">
        <div className="headerBarOperations">
            <div className="in">
                <div className="profile">
                    <div>
                        <span>{Context?.User.name}</span> <br />
                        <span>{Context?.User.lastname}</span>
                    </div>
                </div>
                <div className="date">
                    <DateTime />
                </div>
            </div>
        </div>
        <div className="Buttons">
            <article onClick={() => handleModal(MODAL.CALL_CHECK)}>{t("call-check")}</article>
            <article onClick={() => window.location.href = "/takeaway/"}>{t("take-away")}</article>
            <article onClick={() => caseStatePopup(t)}> {t("case-status")} </article>
            <article onClick={() => window.location.href="/table/"+caseSale._id}>{t("case-sale")}</article>
            <article style={{background:"blue"}} onClick={() => printReport("X")}>{t("x-report")}</article>
            <article onClick={() => caseHandler("close")}>{t("close-case")}</article>
            <article style={{ width: "40%"}} onClick={() => handleModal(MODAL.GET_CREDIT_LIST)}>{t("ticks")}</article>
            <article style={{ width: "40%"}} onClick={() => handleModal(MODAL.COST)}>{t("cost")}</article>
            <article style={{ width: "40%"}} onClick={() => handleNewTab("509")}>{t("manage")}</article>
            <article style={{ width: "40%"}} onClick={() => handleNewTab("510")}>{t("analysis")}</article>
            <article style={{ width: "80%", background: settingsOpen ? "green" : "slategrey" }} onClick={() => setSettingsOpen(!settingsOpen)}>{t("settings")}</article>
            {
                settingsOpen ?
                    <>
                        <article style={{ width: "70%", background: "slategrey" }} onClick={() => handleModal(MODAL.PRINTER_SETTING)}
                            data-toggle="modal"
                            data-target="#globalModal"
                        >{t("printer-setting")}</article>



                        <article style={{ width: "70%", background: localStorage.getItem("language") == "en" ? "green" : "slategrey" }} onClick={() => (localStorage.setItem("language", "en"), i18n.changeLanguage("en"))}>{t("english")}</article>
                        <article style={{ width: "70%", background: localStorage.getItem("language") == "tr" ? "green" : "slategrey" }} onClick={() => (localStorage.setItem("language", "tr"), i18n.changeLanguage("tr"))}>{t("turkish")}</article>
                    </> : null
            }
        </div>
        <div className="bButtons">
            <article onClick={() => { Context?.signOut(); }}>{t("sign-out")}</article>
        </div>
    </section>;
}
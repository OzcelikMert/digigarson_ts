
import Table from 'services/table'
import Http from 'services/http';
import Response from 'services/response';
import CheckService from 'services/checks'
import CService from 'services/category'
import PService from 'services/product'
import Order from 'services/order'
import CaseService from "services/case"
import { useContext, useEffect, useState } from 'react';
import {MODAL} from "constants/modalTypes"
import { useTranslation } from 'react-i18next';

export default function Callcheck({ props }: { props: any }) {
  const {
    Context,
    checkID, setCheckID,
    oldCheckUser, setOldCheckUser,
    handleModal,
    myCase,
    allTables, setTable, handleUpdateOldCheck
  } = props;

  const [alltablesnew, setalltablesnew] = useState<any[]>(allTables);

  const { t, i18n } = useTranslation();

  const [slice, setSlice] = useState(20);

  const update = (checkID:string, user:any) =>{
    setOldCheckUser(user)
    handleUpdateOldCheck(checkID)
  }

  const handleCheck = (checkID:any, table:any, user:any) => {
    setOldCheckUser(user)
    setTable(table);
    setCheckID(checkID);
    handleModal(MODAL.OLD_CHECK);
  }
  const Checks = (check: any) => {
    
    let table = alltablesnew?.find((table: any) => table._id == check.check.table);
    return <tr className='checkInList'>
      <th style={{ width: "10vw" }}>{check.check?.user}</th>
      <th style={{ width: "10vw" }}>{table?.title}</th>
      <th style={{ width: "20vw" }}>{new Date(check.check.createdAt).toLocaleTimeString()}</th>
      <th style={{ width: "19vw" }}>
        <button style={{background:"blue"}} onClick={() => handleCheck(check.check.id, table, check.check?.user)}>{t("go-ticket")}</button>
        <button onClick={() => update(check.check.id, check.check?.user)}>{t("update-product")}</button>
      </th>
    </tr>
  }

  return (
    <>
      <table cellSpacing="0" cellPadding="0" >
        <thead>
          <tr>
            <td>
              <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1" >
                <tr style={{ color: "white", background: "grey", }}>
                  <th style={{ width: "10vw" }}>{t("user")}</th>
                  <th style={{ width: "10vw" }}>{t("table")}</th>
                  <th style={{ width: "20vw" }}>{t("creation-date")}</th>
                  <th style={{ width: "19vw" }}>{t("actions")}</th>
                </tr>
              </table>
            </td>
          </tr>
        </thead>
        <tbody>
          <div style={{ height: "41vh", overflow: "auto" }}>
            <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1"  >
              {
                myCase[0]?.checks?.slice(0,Math.min(slice,myCase[0]?.checks.length)).map((check: any) => <Checks check={check} />)
              }
            </table>
            {
              slice<myCase[0]?.checks.length?
                <tr style={{ border: "none" }} className='checkInList'>
                  <th style={{ width: "20vw" }}></th>
                  <th style={{ width: "20vw", display:"flex", flexDirection:"row" }}> 
                    <button style={{ background: "blue", height:"fit-content" }} onClick={() => setSlice(slice + 20)}> {t("show-more")} </button>
                    <button style={{ background: "green", height: "fit-content" }} onClick={() => setSlice(myCase[0]?.checks.length)}> {t("show-all")} </button>
                  </th>
                  <th style={{ width: "19vw" }}>
                  </th>
                </tr>:null
            }
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

import FuzzySearch from "fuzzy-search";
import { useContext, useEffect, useState } from "react";
import { MODAL } from "constants/modalTypes";
import Swal from "sweetalert2";
import './cost.css'
import { useTranslation } from "react-i18next";
import { payment_types } from "constants/paymentTypes"
import Http from "../../../../services/http";
import CostS from '../../../../services/cost';
import Response from '../../../../services/response';

export default function Cost({ props }: { props: any }) {

    const [title, setTitle] = useState("");
    let today = new Date().toLocaleDateString()
    const { t, i18n } = useTranslation();
    const {
        currentTable, setCurrentModal,
        tobepaid, calculator, totalAmount, setTotalAmount, costs, setCosts, ticks, setTicks,
        closeModal,
    } = props;

    const Services = {
        Cost: new CostS(useContext(Http.Context)!)
    }

    const Fetchs = {
        Cost: new Response<any>()
    }

    useEffect(() => ((!Fetchs.Cost.data && Fetchs.Cost.handle(Services.Cost.get()), undefined)), [Fetchs.Cost.data])
    useEffect(() => Fetchs.Cost.data && setCosts(Fetchs.Cost.data), [Fetchs.Cost.data])

    const createCost = () => {
        setCurrentModal(MODAL.CREATE_COST);
    }
    const searchCost = (event: any, type: string) => {	
        const costSearcher = new FuzzySearch(	
            Fetchs.Cost.data,	
            [type],	
            {	
                caseSensitive: false	
            })	
        const result = costSearcher.search(event.target.value.trim());	
        setCosts(result)	
    }
    return (
        <div className="Home-cost">
            <div className="show-all">
                <div className="company-operations-cost">
                        <button onClick={() => createCost()}>{t("add-cost")}</button>
                </div>
                <div className="search-cost">		
                    <table>	
                        <thead>	
                            <tr>	
                                <th>{t("description")}</th>	
                                <th>{t("price")}</th>	
                            </tr>	
                        </thead>	
                        <tbody>	
                            <tr>	
                                {	
                                    ["title", "expense_amount"].map((type: string) => <td>	
                                        <input style={{ color: "black", borderRadius: "16px" }} onChange={(event) => searchCost(event, type)} />	
                                    </td>)	
                                }	
                            </tr>	
                        </tbody>	
                    </table>	
                </div>	
                <div className="show-costs">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "17vw" }}>{t("explanation")}</th>
                                <th style={{ width: "14vw" }}>{t("payment-type")}</th>
                                <th style={{ width: "10vw" }}>{t("price")}</th>
                                <th style={{ width: "15vw" }}>{t("date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                                costs && costs.map((cost: any) => 
                                    today === new Date(cost?.createdAt).toLocaleDateString() ? 
                                    <tr style={{ color: "black" }}>
                                        
                                        <th style={{ width: "17vw" }}>{cost.title }</th>
                                        <th style={{ width: "14vw" }}>{payment_types[cost.expense_type - 1]}</th>
                                        <th style={{ width: "10vw" }}>{cost.expense_amount} {cost.currency}</th>
                                        <th style={{ width: "15vw" }}>{new Date(cost?.createdAt).toLocaleDateString()}</th>
                                    </tr> : <tr></tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

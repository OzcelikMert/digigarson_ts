import FuzzySearch from "fuzzy-search";
import { useEffect, useState } from "react";
import Modals from 'pages/modals';
import { MODAL } from "constants/modalTypes";
import Swal from "sweetalert2";
import './getcustomer.css'
import { useTranslation } from "react-i18next";

export default function Getcustomer({ props }: { props: any }) {

    const { t, i18n } = useTranslation();
    const {
        currentTable, setCurrentModal,
        tobepaid, calculator, totalAmount, setTotalAmount, ticks, setTicks,
        closeModal,
        Services,
        Fetchs
    } = props;

    const [phoneNum, setPhoneNumber] = useState("");
    const payData: any[] = [];


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

    const createcreditCustomer = () => {
        setCurrentModal(MODAL.CREATE_CREDIT_CUSTOMER);
    }



    tobepaid.forEach((element: any) => {
        payData.push({ id: element.product.orderId, name: element.product.name, price: element.product.price, quantity: element.product.quantity });
    });
    const handleClick = (tick: any) => {
        const data = {
            "orders": payData,
            "payments": [
                {
                    "type": 6,
                    "amount": calculator,
                    "currency": "TL",
                    "tickId": tick._id,
                }
            ],
            "discount": [
                {
                    "type": tick.discount[0].type,
                    "amount": tick.discount[0].price
                }
            ]
        }



        Services.Check.pay(currentTable._id, data)
            .then(() => {
                Swal.fire({
                    title: t("add-success"),
                    icon: "success"
                })
                // setTotalAmount(totalAmount + (calculator - ((calculator * tick.discount[0].price) / 100)) - calculator)
                closeModal();
            })
            .catch(() => {
                Swal.fire({
                    title: t("error"),
                    icon: "error"
                })
            });

    }
    return (
        <div className="Home-tick">
            <div className="search-show-tick">
                <div className="searchtick">
                    <table>
                        <thead>
                            <tr>
                                <th>{t("phone-number")}</th>
                                <th>{t("name")}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {
                                    ["phoneNum", "name"].map((type: string) => <td>
                                        <input style={{ color: "black", borderRadius: "16px" }} onChange={(event) => searchCustomer(event, type)} />
                                    </td>)
                                }
                                <td className="customer-operations-tick"><button onClick={() => createcreditCustomer()}>{t("new-ticks-customer")}</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="showtick">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "17vw" }}>{t("phone-number")}</th>
                                <th style={{ width: "20vw" }}>{t("name")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ticks && ticks.map((tick: any) =>
                                    <tr onClick={() => handleClick(tick)} style={{ color: "black" }}>
                                        <th style={{ width: "17vw" }}>{tick.phoneNum}</th>
                                        <th style={{ width: "20vw" }}>{tick.name}</th>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

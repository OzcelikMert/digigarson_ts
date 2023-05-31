import { useEffect, useState } from "react";
import { MODAL } from "constants/modalTypes";
import Swal from "sweetalert2";
import './abc.css'
import { useTranslation } from "react-i18next";

export default function Abc({ props }: { props: any }) {

    const { t, i18n } = useTranslation();
    const {
        currentTable,
        productsInCheck,
        productsInOrder, setProductsInOrder,
        closeModal,
        BranchContext,
        Services,
    } = props;

    const [changedPriceList, setChangedPriceList] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    useEffect(() => productsInCheck && setProducts(formatData(productsInCheck, true)), [productsInCheck])
    useEffect(() => productsInOrder && setOrders(formatData(productsInOrder, false)), [productsInOrder])

    const formatData = (arr: any[], isOldOrder:boolean) => {
        let data = Array();
        arr.forEach((element: any) => {
            data.push({ pinc: element, input: false, isOldOrder:isOldOrder })
        });
        return data;
    }

    const save = () => {
        let newOrders = Array();
        changedPriceList.forEach((element: any) => {
            if(element.isOldOrder){
                const data = {
                    quantity: element.pinc.product.quantity,
                    price: element.price
                }
                Services.Order.updateProduct(element.pinc.product.orderId, currentTable._id, data)
            }
            else{
                element.pinc.product.prices[element.pinc.priceIndex].price = element.price;
                newOrders.push(element.pinc);
            }
        })
        setProductsInOrder(newOrders)
        setChangedPriceList([])
        closeModal()
    }

    const handlePriceChange = (event: any, element: any) => {
        let temp = changedPriceList.find((cpt: any) => cpt.pinc.uid == element.pinc.uid);
        if (temp) {
            temp.price = event.target.value;
            setChangedPriceList(changedPriceList);
        }
        else {
            setChangedPriceList([...changedPriceList, { price: event.target.value, pinc: element.pinc, isOldOrder: element.isOldOrder }])
        }
        
    }

    const cancel = () => {
        closeModal()
    }
    return (
        <>
            <table cellSpacing="0" cellPadding="0" >
                <tr>
                    <td>
                        <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1" >
                            <tr style={{ color: "white", background: "grey", }}>
                                <th style={{width:"34vw"}}>{t("product")}</th>
                                <th style={{width:"5vw"}}>Fiyatı</th>
                                <th style={{width:"20vw"}}>{t("change-price")}</th>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style={{ width: "59vw", height: "35vh", overflow: "auto" }}>
                            <table cellSpacing="0" cellPadding="1"  >
                                {
                                   products?.map((element: any) => {
                                    if (!element.pinc.checked) {
                                        return;
                                    }
                                    return <tr>
                                        <td style={{ width: "34vw",textAlign:"center" }}>{element.pinc.product.name}</td>
                                        <td style={{ width: "5vw", textAlign:"center" }}>{element.pinc.product.price} TL</td>
                                        <td style={{ width: "20vw", textAlign: "center" }}>
                                            <input onChange={(event) => handlePriceChange(event, element)} style={{ width: "40%" }} />
                                        </td>
                                    </tr>
                                    })
                                    
                                }
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
            <div className='changePriceButtons'>
                <button style={{ background: "green" }} onClick={() => save()}> {t("submit")} </button>
                <button onClick={() => cancel()}> {t("cancel-ticket")} </button>
            </div>
        </>
    )
}

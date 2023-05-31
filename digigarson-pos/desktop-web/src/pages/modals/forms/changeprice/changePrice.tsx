import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

export default function ChangePrice({ props }: { props: any }) {
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
    const handleChange = (event: any, product: any) => {
        product.priceIndex = event.target.value;
    }
    const { t, i18n } = useTranslation();
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

    const cancel = () => {
        throw new Error('Function not implemented.');
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
    return (
        <>
            <table cellSpacing="0" cellPadding="0" >
                <tr>
                    <td>
                        <table style={{ width: "59vw" }} cellSpacing="0" cellPadding="1" >
                            <tr style={{ color: "white", background: "grey", }}>
                                <th>{t("product")}</th>
                                <th>{t("price")}</th>
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
                                            <td style={{ width: "30vw" }}>{element.pinc.product.name}</td>
                                            <td style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                                {
                                                    element.input ?
                                                        <input onChange={(event) => handlePriceChange(event, element)} style={{ width: "80%" }} />
                                                        : <select defaultValue={element.pinc.product.price} onChange={(event: any) => handlePriceChange(event, element)} style={{ minWidth: "15vw" }}>
                                                            {BranchContext[0].products.find((product: any) => product._id == element.pinc.product.productId)?.prices?.map((price: any, i: number) => {
                                                                return <option value={price.price} >{price.price_name} {price.price} TL</option>
                                                            })}
                                                        </select>

                                                }
                                                <button className='butn blue' onClick={() => { element.input = !element.input; setProducts(products) }}>{element.input ? t("prices") : t("new-prices")}</button>

                                            </td>
                                        </tr>
                                    })
                                }
                                {/* {
                                    orders?.map((element: any) => {
                                        if (!element.pinc.checked) {
                                            return;
                                        }
                                        return <tr>
                                            <td style={{ width: "30vw" }}>{element.pinc.product.title}</td>
                                            <td style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                                {
                                                    element.input ?
                                                        <input onChange={(event) => handlePriceChange(event, element)} style={{ width: "80%" }} />
                                                        : <select onChange={(event: any) => handleChange(event, element.pinc)} style={{ minWidth: "15vw" }}>
                                                            {BranchContext[0].products.find((product: any) => product._id == element.pinc.product._id)?.prices?.map((price: any, i: number) => {
                                                                return <option value={i} >{price.price_name} {price.price} tl</option>
                                                            })}
                                                        </select>
                                                }
                                                <button className='butn blue' onClick={() => { element.input = !element.input; setProducts(products) }}>{element.input ? "Fiyatlar" : "Yeni Fiyat"}</button>
                                            </td>
                                        </tr>
                                    })
                                } */}
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



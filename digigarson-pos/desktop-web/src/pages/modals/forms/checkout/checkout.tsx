import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Http from "services/http";
import Swal from 'sweetalert2'
import Checks from "services/checks"
import Response from "services/response"
import Printer from "services/printer"
import { MODAL } from 'constants/modalTypes';
import { useTranslation } from "react-i18next";


export default ({ props }: { props: any }) => {
    const [paymentsInOrder, setPaymentsInOrder] = useState<any[]>([]);
    const { t, i18n } = useTranslation();
    const {
        paidOrders, setPaidOrders,
        manuallyPaid, setManuallyPaid,
        tobepaid, setToBePaid,
        check, setCheck,
        setModalOpen, setCurrentModal,
        totalAmount, setTotalAmount,
        calculator, setCalculator,
        productName, closeModal, currentTable,
        cash, setChash,
        setProductsInCheck,
        syncCheck, ticks,
        Fetchs,
        Services,
        time, setTime,
        payments, setPayments,
        id
    } = props;

    const [coma, setComa] = useState(false);
    const [personCount, setPersonCount] = useState(1);
    useEffect(() => {
        if (check?.length < 1) {
            setCalculator(totalAmount);
        }
    }, [check])
    function removeInCheck(uid: any) {
        let chk = check?.filter((p: any) => p.uid != uid);
        setCheck(chk);
    }
    function removeInToBePaid(uid: any) {
        let chk = tobepaid?.filter((p: any) => p.uid != uid);
        if (chk?.length < 1) {
            setCalculator(0);
        }
        setToBePaid(chk);
    }
    function updateToBePaid(product: any) {
        if (calculator > 0 && tobepaid?.length < 1) {
            Swal.fire({
                title: t("not-select-product"),
                icon: "error"
            })
            return;
        }
        else if (payments?.length > 0) {
            Swal.fire({
                title: t("product-info"),
                icon: "info"
            })
            return;
        }
        let sum = calculator;
        sum += product.product.price;
        setCalculator(sum);
        let po = JSON.parse(JSON.stringify(tobepaid));
        if (po?.length < 1 || !po) {

            po = [product];
        }
        else {
            po.push(product);
        }
        setToBePaid(po);
        removeInCheck(product.uid)
    }
    function updateCheck(product: any) {
        let sum = 0;
        tobepaid.forEach((tbp: any) => {
            if (tbp.uid != product.uid) {
                sum += tbp.product.price;
            }
        })
        setCalculator(sum)
        let po = check;
        if (po?.length < 1 || !po) {

            po = [product];
        }
        else {
            po.push(product);
        }
        setCheck(po)
        removeInToBePaid(product.uid)
    }
    function handlePayment(type: number): void {
        if(type==6){
            setCurrentModal(MODAL.GET_CUSTOMER);
            setCheck([]);
            return
        }
        if (calculator == 0) {
            Swal.fire({
                title: t("amount-payable"),
                icon: "error"
            })
            return;
        }
        if (personCount > 1) {
            const data = {
                "orders": Array(),
                "payments": [
                    {
                        "type": type,
                        "amount": calculator,
                        "currency": "TL"
                    }
                ]
            }

            Services.Check.pay(currentTable._id, data)
                .then(() => setTotalAmount(totalAmount - calculator))
                .catch(() => {
                    Swal.fire({
                        title: t("error"),
                        icon: "error"
                    })
                })
            if (totalAmount - calculator > 0) {
                return;
            }
            else {
                setCalculator(0);
                closeModal();
                Swal.fire({
                    title: t("paid-succes"),
                    icon: "success",
                }).then(() => {
                    if(currentTable.safeSales){
                        window.location.href="/table/" + currentTable._id 

                    }
                    else{
                        window.location.href="/"
                    }
                })
                return;
            }
        }
        if (!tobepaid || tobepaid.length < 1) {
            let tip = false;
            const data = {
                "orders": Array(),
                "payments": [
                    {
                        "type": type,
                        "amount": calculator,
                        "currency": "TL"
                    }
                ]
            }
            setManuallyPaid(data)
            if (totalAmount < calculator) {
                data.payments[0].amount = totalAmount;
                Swal.fire({
                    icon: "question",
                    title: t("money-back"),
                    showCancelButton:true,
                    confirmButtonText:t("yes"),
                    cancelButtonText:t("no"),
                }).then((result: any) => {
                    if (result.isConfirmed) {
                        //para üstü calculator-totalamount

                        Services.Check.pay(currentTable._id, data)
                            .then(() => {
                                setCalculator(0);
                                syncCheck()
                            })
                            .catch(() => {
                                Swal.fire({
                                    title: t("error"),
                                    icon: "error"
                                })
                            })
                    }
                    else {
                        //tip calculator-totalamount
                        tip=true;
                        const tipData = {
                            "orders": Array(),
                            "payments": [
                                {
                                    "type": 14,
                                    "amount": calculator - totalAmount,
                                    "currency": "TL"
                                }
                            ]
                        }
                        Services.Check.pay(currentTable._id, tipData).then(() => {
                            Services.Check.pay(currentTable._id, data)
                                .then(() => {
                                    setCalculator(0);
                                    closeModal();
                                    Swal.fire({
                                        title: t("paid-succes"),
                                        icon: "success",
                                    }).then(() => {
                                        if(currentTable.safeSales){
                                            window.location.href="/table/" + currentTable._id 
            
                                        }
                                        else{
                                            window.location.href="/"
                                        }
                                    })
                                })
                                .catch(() => {
                                    Swal.fire({
                                        title: t("error"),
                                        icon: "error"
                                    })
                                })
                        })
                            .catch(() => {
                                Swal.fire({
                                    title: t("error"),
                                    icon: "error"
                                })
                            })
                    }
                })

            }
            else if (totalAmount == calculator) {
                Services.Check.pay(currentTable._id, data)
                    .then(() => {
                        setCalculator(0);
                        closeModal();
                        Swal.fire({
                            title: t("paid-succes"),
                            icon: "success",
                        }).then(() => {
                            if(currentTable.safeSales){
                                window.location.href="/table/" + currentTable._id 

                            }
                            else{
                                window.location.href="/"
                            }
                        })
                    })
                    .catch(() => {
                        Swal.fire({
                            title: t("error"),
                            icon: "error"
                        })
                    })
            }
            else{
                Services.Check.pay(currentTable._id, data)
                    .then(() => {
                        setCalculator(0);
                        syncCheck()
                    })
                    .catch(() => {
                        Swal.fire({
                            title: t("error"),
                            icon: "error"
                        })
                    })
            }
            return;
        }
        let po = paidOrders;
        if (po?.length < 1 || !po) {

            po = tobepaid;
        }
        else {
            po = po.concat(tobepaid)
        }
        setPaidOrders(po);
        const payData: any[] = [];
        tobepaid.forEach((element: any) => {
            payData.push({ id: element.product.orderId, price: element.product.price, quantity: element.product.quantity });
        });
        const data = {
            "orders": payData,
            "payments": [
                {
                    "type": type,
                    "amount": calculator,
                    "currency": "TL"
                }
            ]
        }
        Services.Check.pay(currentTable._id, data)
            .then(() => {
                Swal.fire({
                    title: t("receipt-question"),
                    icon: "question",
                    showConfirmButton: true,
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        Printer.printCheck({ ...Fetchs.Check.data, orders: tobepaid.map((paid: any) => paid.product) });
                    }
                    if (check?.length < 1 || totalAmount <= 0) {
                        setComa(false);
                        closeModal();
                        Swal.fire({
                            title: t("paid-succes"),
                            icon: "success",
                        }).then(() => {
                            if(currentTable.safeSales){
                                window.location.href="/table/" + currentTable._id 

                            }
                            else{
                                window.location.href="/"
                            }
                        })
                    }

                })

                setToBePaid([])
            })
            .catch(() => {
                Swal.fire({
                    title: t("error"),
                    icon: "error"
                })
            })

        if (time == 0) {
            setProductsInCheck(check)
        }
    }

    const splitByPerson = () => {
        Swal.fire({
            title: t("split-question"),
            icon: "question",
            input: "number",
            inputValue: "1",
            inputAttributes: {
                min: "1",

            }
        }).then((result) => {
            if (result.isConfirmed) {
                setPersonCount(result.value);
                setCalculator(totalAmount / result.value);
            }
        })
    }

    function handleCalculator(value: number | string): void {
        if (tobepaid?.length > 0) {
            Swal.fire({
                title: t("first-pay"),
                icon: "warning"
            })
            return;
        }
        switch (value) {
            case "C":
                setCalculator(0);
                setComa(false)
                setChash(false);
                break;
            case "floor":
                setCalculator(calculator | 0)
                break;
            case "byPerson":
                splitByPerson();
                break;
            case "00":
                if (coma) {
                }
                else {
                    setCalculator(calculator * 100);
                }
                break;
            case ",":
                setComa(true);
                break;
            case "%":
                setCurrentModal(MODAL.DISCOUNT);
                setModalOpen(true)
                break;
            case "split":
                break;
            case "Servis":
                break;
            default:

                setChash(true);
                if (coma) {
                    let arr = calculator.toString().split(".");
                    let sum = Number(value) / Math.pow(10, (arr.length))
                    setCalculator(sum + calculator);
                }
                else {
                    setCalculator(calculator * 10 + Number(value));
                }

                break;
        }
    }
    function handleSelectAll(): void {
        let tbp = [...tobepaid]
        check.forEach((element: any) => {
            tbp.push(element);
        });
        setToBePaid(tbp);
        setCalculator(totalAmount);
        setCheck([]);
    }

    return (
        <div className="checkout">
            <div>
                {t("collections")}
                <div className="product">
                    <div className="amount">
                        <span>{t("quantity")}</span>
                    </div>
                    <div className="product">
                        <span>{t("product")}</span>
                    </div>
                    <div className="price">
                        <span>{t("price")}</span>
                    </div>
                </div>
                <div className="collectionTable">

                    {paidOrders && paidOrders.map((product: any) => {
                        if (!product) return
                        return (
                            <div className="product list">
                                <div className="amount">
                                    <span>{product.product.quantity}</span>
                                </div>
                                <div className="product">
                                    <span>{productName(product.product.productId)}</span>
                                </div>
                                <div className="price">
                                    <span>{product.product.price}</span>
                                </div>
                            </div>
                        )
                    }
                    )}
                    {/* {	
                        manuallyPaid && manuallyPaid?.map((payment:any)=>{	
                            if (!payment) return	
                            return (	
                                <div className="product list">	
                                    <div className="amount">	
                                        <span>{}</span>	
                                    </div>	
                                    <div className="product">	
                                        <span>{productName()}</span>	
                                    </div>	
                                    <div className="price">	
                                        <span>{}</span>	
                                    </div>	
                                </div>	
                            )	
                        })	
                    } */}
                </div>
                {t("all-products")}
                <div className="product">
                    <div className="amount">
                        <span>{t("quantity")}</span>
                    </div>
                    <div className="product">
                        <span>{t("product")}</span>
                    </div>
                    <div className="price">
                        <span>{t("price")}</span>
                    </div>
                </div>
                <div className="collectionTable">
                    {check && check
                        .map((p_in_check: any) => {
                            return (
                                <div onClick={() => updateToBePaid(p_in_check)} className="product list">
                                    <div className="amount">
                                        <span>{p_in_check.product.quantity}</span>
                                    </div>
                                    <div className="product">
                                        <span>{p_in_check.product.name}</span>
                                    </div>
                                    <div className="price">
                                        <span>{p_in_check.product.price}</span>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className="middle">
            {t("payment")}
                <div className="table">
                    <div className="product">
                        <div className="amount">
                            <span>{t("quantity")}</span>
                        </div>
                        <div className="product">
                            <span>{t("product")}</span>
                        </div>
                        <div className="price">
                            <span>{t("price")}</span>
                        </div>
                    </div>
                    <div className="collectionTable currentlypaying">
                        {tobepaid?.map((product: any) =>
                            <div onClick={() => updateCheck(product)} className="product list">
                                <div className="amount">
                                    <span>{product.product.quantity}</span>
                                </div>
                                <div className="product">
                                    <span>{productName(product.product.productId)}</span>
                                </div>
                                <div className="price">
                                    <span>{product.product.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="calculator">
                    <div onClick={() => handleCalculator(1)}>1</div>
                    <div onClick={() => handleCalculator(2)}>2</div>
                    <div onClick={() => handleCalculator(3)}>3</div>

                    <div className="rightbuttons" onClick={() => handleCalculator("C")}>C</div>

                    <div onClick={() => handleCalculator(4)}>4</div>
                    <div onClick={() => handleCalculator(5)}>5</div>
                    <div onClick={() => handleCalculator(6)}>6</div>

                    <div className="rightbuttons" onClick={() => handleCalculator("floor")}>{t("ball")}</div>

                    <div onClick={() => handleCalculator(7)}>7</div>
                    <div onClick={() => handleCalculator(8)}>8</div>
                    <div onClick={() => handleCalculator(9)}>9</div>

                    <div className="rightbuttons" onClick={() => handleSelectAll()}>{t("all")}</div>

                    <div onClick={() => handleCalculator("00")}>00</div>
                    <div onClick={() => handleCalculator(0)}>0</div>
                    <div onClick={() => handleCalculator(",")}>,</div>

                    <div className="rightbuttons" onClick={() => handleCalculator("byPerson")}>1/{t("person")}</div>

                    <div onClick={() => handleCalculator("%")} className="bottom discount">% {t("discount")}</div><div className="bottom print" onClick={_ => handlePrint()}>{t("print")}</div>
                    {/* <div onClick={() => handleCalculator("Servis")} className="bottom service">Servis Ücret</div>
                    <div onClick={() => handleCalculator("split")} className="bottom split">Parçalı Ödeme</div>  */}
                </div>
            </div>
            <div>
                <div className="totals">
                    <div className="total">
                        <div>{t("total-amount")}:</div>
                        <div className="price">{totalAmount} TL</div>
                    </div>
                    <div className="total">
                        <div>{t("amount-paid")}:</div>
                        <div className="price">{calculator}  TL</div>
                    </div>
                    <div className="total">
                        <div>{t("remaining-amount")}:</div>
                        <div className="price">{totalAmount - calculator > 0 ? totalAmount - calculator : 0} TL</div>
                    </div>
                </div>
                <div className="payment">
                    <div onClick={() => handlePayment(2)}>{t("cash")}</div>
                    <div onClick={() => handlePayment(1)}>{t("credit-card")}</div>
                    <div onClick={() => handlePayment(6)}>{t("ticks")}</div>
                    <div onClick={() => handlePayment(11)}>SetCard</div>
                    <div onClick={() => handlePayment(7)}>Sodexo</div>
                    <div onClick={() => handlePayment(10)}>Multinet</div>
                    <div onClick={() => handlePayment(8)}>Smart</div>
                    <div onClick={() => handlePayment(12)}>Metropol</div>
                    <div onClick={() => handlePayment(1)}>Yemeksepeti Online</div>
                    <div onClick={() => handlePayment(1)}>Trendyol Yemek</div>
                </div>
            </div>
        </div>
    )
}

const paidOrderProduct = (p: any) => {
    throw new Error("Function not implemented.");
}

function handleAddToPaid(orderId: any): void {
    throw new Error("Function not implemented.");
}








function handlePrint(): void {
    throw new Error("Function not implemented.");
}

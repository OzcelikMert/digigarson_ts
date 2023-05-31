import { Row, Col, Button, Typography, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa'
import Branch from 'services/branch';
import Authenticate from 'services/authenticate';
import Modals from 'pages/modals';
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';




export default ({ props }: {
    props: any
}) => {
    const { t, i18n } = useTranslation();
    const {
        multiplier, setMultiplier,
        productsInOrder,
        handleCategorySearchChange,
        handleProductChange, productSearchText,
        currentTable, selectedCourier
    } = props;
    const [user, setUser] = useState<any>();
    const Context = useContext(Authenticate.Context)!;
    var [date, setDate] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }

    });
    useEffect(() => Context && setUser(Context.User), [Context])
    const [val, setVal] = useState(1);
    const [op, setOp] = useState("C");
    function handleMultiplier(value: any): void {
        switch (value) {
            case "X":
                setOp(value);
                break;
            case "C":
                setMultiplier(1);
                setVal(1);
                setOp(value);
                break;
            default:
                if (op == "X") {
                    setMultiplier(multiplier * value);
                }
                else {
                    setMultiplier(value);
                }
                setOp("C");
                break;
        }
    }
    function handleReturn(): void {

        if(currentTable.safeSales&&currentTable.orders.length>0){
             Swal.fire({
                icon:"warning",
                title: t("payment-cashier"),
            })
            return;
        }

        if (productsInOrder?.length>0){
            Swal.fire({
                icon:"question",
                title: t("product-return"),
                showCancelButton:true
            }).then((result:any)=>{
                if(result.isConfirmed){
                   window.location.href = "/"; 
                }
            })
        }
        else{
            window.location.href = "/";
        }
    }

    return (
        <>
            <div className='row'>
                <div className='col'>
                    <Button
                        onClick={() => handleReturn()}
                        className="dg-back-button"
                        type="primary"
                        icon={<ArrowLeftOutlined />} />
                    <Button className="dg-title-explain" type="primary" >{user?.name}</Button>
                </div>
                <div className='col'>
                    <Button onClick={() => handleMultiplier(2)} className="dg-nonepad">2</Button>
                    <Button onClick={() => handleMultiplier(3)} className="dg-nonepad">3</Button>
                    <Button onClick={() => handleMultiplier(4)} className="dg-nonepad">4</Button>
                    <Button onClick={() => handleMultiplier(5)} className="dg-nonepad">5</Button>
                    <Button onClick={() => handleMultiplier("X")} className="dg-nonepad dg-nonepad-op">X</Button>
                    <Button onClick={() => handleMultiplier("C")} className="dg-nonepad dg-nonepad-del">C</Button>
                    <Button className="dg-nonepadNumber dg-nonepad dg-nonepad-sum ">{multiplier}</Button>

                </div>
                <div className='col' style={{width:"35%"}}>
                    <Input disabled className="dg-date" placeholder={date.toLocaleDateString() + "   | " + date.toLocaleTimeString()} />
                </div>
            </div>
            <div className='row'>
                <div className='col' style={{ display: "block" }}>
                    <div className='adisyon-label'>
                        <div className='label-text'>{t("ticket")}</div>
                    </div>
                </div>
                <div className='col' style={{ display: "block" }}>
                    <div className='adisyon-label'>
                        <div className='label-text'>{selectedCourier==-1?t("courier-name"):t("product-name")}</div>
                        <div className='searchbar'>
                            <button className='searchbar-button'><FaSearch /></button>
                            <input
                                value={productSearchText}
                                onClick={(event) => productOnclick(event)}
                                onChange={(event) => handleProductChange(event.target.value)}
                                className="searchbar-input"
                                placeholder={t("search")}
                            />
                        </div>
                    </div>

                </div>
                <div className='col' style={{ display: "block", width: "35%" }}>
                    <div className='adisyon-label'>
                        <div className='label-text'>{t("categories")}</div>
                        <div className='searchbar'>
                            <button className='searchbar-button'><FaSearch /></button>
                            <input
                                className="searchbar-input"
                                onChange={(event) => handleCategorySearchChange(event.target.value)}
                                placeholder={t("search")}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}






function productOnclick(event: any): void {
    throw new Error("Function not implemented.");
}





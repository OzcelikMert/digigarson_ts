import React, { useEffect, useState } from 'react';
import './styles/modal.css';
import './forms/checkout/checkout.css'
import { useTranslation } from "react-i18next";
// forms
import Checkout from "./forms/checkout/checkout"
import OptionMenu from './forms/optionmenu/optionmenu';
import Discount from './forms/discount';
import Cover from "./forms/cover"
import PrinterSettings from './printerSettings';
import ChangePrice from './forms/changeprice/changePrice';
import Callcheck from './forms/callcheck/callcheck';
import Oldcheck from './forms/callcheck/oldcheck';
import Updatecheck from './forms/callcheck/updatecheck';
import Createcustomer from './forms/createcustomer/createcustomer';
import Getcustomer from './forms/getcustomer/getcustomer';
import Createcourier from './forms/createcourier/createcourier';
import Deletecourier from './forms/deletecourier/deletecourier';
import Createcreditcustomer from './forms/createcreditcustomer/createcreditcustomer';
import Getcreditlist from './forms/getcreditlist/getcreditlist';
import Oldcreditcheck from './forms/callcheck/oldcreditcheck';
import Cost from './forms/cost/cost';
import Createcost from './forms/createcost/createcost';
import Abc from './forms/abc/abc';


const Modals = ({ props }: { props: any }) => {
    const { t, i18n } = useTranslation();
    const [modalState, setModalState] = useState<any>()
    const {
        modalOpen,
        closeModal,
        currentModal,

    } = props;



    const forms = {
        checkout:<Checkout props={props} />,
        optionmenu:<OptionMenu props={props} />,
        discount:<Discount props={props} />,
        cover:<Cover props={props} />,
        printersettings:<PrinterSettings />,
        changeprice:<ChangePrice props={props} />,
        callcheck:<Callcheck props={props} />,
        oldcheck:<Oldcheck props={props} />,
        updateoldcheck:<Updatecheck props={props} />,
        createcustomer:<Createcustomer props={props} />,
        getcustomer:<Getcustomer props={props} />,
        createcourier:<Createcourier props={props} />,
        deletecourier:<Deletecourier props={props} />,
        createcreditcustomer:<Createcreditcustomer props={props} />,
        getcreditlist: <Getcreditlist props={props}/>,
        oldcreditcheck:<Oldcreditcheck props={props}/>,
        cost: <Cost props={props}/>,
        createcost: <Createcost props={props}/>,
        abc: <Abc props={props}/>
    }
    return <>
        <div
            className={modalOpen ? "modalCover open" : "modalCover"}
            onClick={() => closeModal()}
        />
        <div
            className={modalOpen ? "modalContainer open" : "modalContainer close"}
            style={currentModal.dimensions}
        >
            <div className="modalHeader">
                <div className="title">{t(currentModal.form)}</div>
                <div className="close" onClick={() => closeModal()}><strong>X</strong></div>
            </div>
            <div className="modalBody">
                {forms[currentModal.form as keyof typeof forms]}
            </div>
        </div>
    </>
}

export default Modals;



import './createcustomer.css'
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { createCustomer } from 'services/interfaces/customer';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
export default function Createcustomer({ props }: { props: any }) {
    const { t, i18n } = useTranslation();
    const {
        customer, setCustomer,
        modalOpen, setModalOpen,
        phone, setPhone,
        closeModal,
        currentModal,
        Services, Fetchs,
    } = props;
    const handleChange = (value: string, type: string) => {
        switch (type) {
            case "title":
                customer.title = value;
                break;
            case "address-title":
                customer.address[0].title = value;
                break;
            case "address":
                customer.address[0].address = value;
                break;
            case "description":
                customer.description = value;
                break;
            case "credit":
                customer.credit_amount = value;
                break;
            default:
                break;
        }
        setCustomer(customer);
    }
    const handleSave = () => {
            const data = customer;
        if(data.description.replace(/\s/g, '').length < 3)
        {
            Swal.fire({
                icon: "error",
                title: t("error-customer-description")
            })
        }
        else if(data.title.replace(/\s/g, '').length > 0 && data.description.replace(/\s/g, '').length > 0 && data.address[0].address.replace(/\s/g, '').length > 0 && data.address[0].title.replace(/\s/g, '').length > 0) {
            if (phone.isValid) {
                data.gsm_no = phone.number.replace(/\s/g, '');
                Services.Customer.create(data)
                closeModal()
                 Swal.fire({
                    icon: "success",
                    title: t("customer-success")
                })
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: t("valid-phone")
                })
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: t("fill-fields")
            })
        }
    }
    const handleCancel = () => {

        Swal.fire({
            icon: "question",
            title: t("cancel-question"),
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                closeModal()
            }
        })
    }
    return (
        <div className="create-customer">
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("phone")}</div>
                <div style={{ width: "80%" }}>
                    <IntlTelInput
                        preferredCountries={['tr']}
                        format={true}
                        telInputProps={{
                            maxLength: 14,
                        }}
                        value={phone?.number}
                        onPhoneNumberChange={(isValid, number, country) => {
                            setPhone({ isValid, number, country })
                        }}
                        style={{ color: "black", width: "100%" }}
                    />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("customer-name")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "title"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("customer-loan")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        min={0}
                        type={"number"}
                        onChange={(event) => (handleChange(event?.target.value, "credit"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("address-title")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "address-title"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("address")}</div>
                <div style={{ width: "80%" }}>
                    <textarea
                        style={{ width: "100%" }}
                        onChange={(event) => (handleChange(event?.target.value, "address"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("note")}</div>
                <div style={{ width: "80%" }}>
                    <textarea
                        style={{ width: "100%" }}
                        onChange={(event) => (handleChange(event?.target.value, "description"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div onClick={() => handleSave()} style={{ height: "6vh", fontSize: "large" }} className='butn green'>{t("submit")}</div>
                <div onClick={() => handleCancel()} style={{ height: "6vh", fontSize: "large" }} className='butn red'>{t("cancel")}</div>
            </div>
        </div>
    )
}



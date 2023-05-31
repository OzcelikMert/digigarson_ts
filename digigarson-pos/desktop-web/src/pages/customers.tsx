import FuzzySearch from "fuzzy-search";
import { useContext, useEffect, useState } from "react";
import Modals from 'pages/modals';
import {  MODAL } from "constants/modalTypes";
import { useTranslation } from "react-i18next";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import {ICustomer, createCustomer, phone} from "services/interfaces/customer";
import CustomerService from 'services/customer'
import Http from "services/http";
import Response from "services/response";
import Branch from "services/branch";
import Printer from "services/printer"
import '../styles/customers.css'
import Swal from "sweetalert2";
export default function () {    
    const { t, i18n } = useTranslation();
    const [customerBranch, setCustomerBranch] = useState<ICustomer>()
    const [customers, setCustomers] = useState<any[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<any>()
    const [addressIndex, setAddressIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentModal, setCurrentModal] = useState(MODAL.CREATE_CUSTOMER)
    const [name, setName] = useState("");
    const [customer, setCustomer] = useState<createCustomer>({
        currency: 'TL',
        credit_amount: 0,
        description: '',
        title: '',
        address: [
            {
                address: "",
                title: ""
            }
        ],
        gsm_no: 0
    });
    const [phone, setPhone] = useState<phone>();
    const Services ={
        Customer: new CustomerService(useContext(Http.Context)!),
    }
    const Fetchs ={
        Customer: new Response<any>(),
    }
    

    useEffect(() => (!Fetchs.Customer.data && Fetchs.Customer.handle(Services.Customer.get()),undefined), [Fetchs.Customer.data])
    useEffect(() => Fetchs.Customer.data && setCustomers(Fetchs.Customer.data), [Fetchs.Customer.data]);

    const searchCustomer = (value: any, type: string) => {
        const customerSearcher = new FuzzySearch(
            Fetchs.Customer.data,
            [type],
            {
                caseSensitive: false
            })
        const step1 = customerSearcher.search(value.trim());
        if(type == "title"){
            type ="gsm_no"
            value = phone?.number;
        }
        else{
            type = "title";
            value = name;
        }
        const customerSearcher2 = new FuzzySearch(
            step1,
            [type],
            {
                caseSensitive: false
            })
        const result = customerSearcher2.search(value.trim());
        setCustomers(result)
    }
    const createCustomer = () => {
        setCurrentModal(MODAL.CREATE_CUSTOMER);
        setModalOpen(true);
    }
    function findCheck(): void {
        throw new Error("Function not implemented.");
    }

    function customerPopup(t: any, id:any): void {
        let customer = Fetchs.Customer.data.find((customer:any)=>customer.id == id)
        customer && Swal.fire({
            title: `<b>${t("case-status")}</b>`,
            html: `
                    <b>${t("customer-name")}</b>: ${customer.title}<br/>
                    <b>${t("address")}</b>: ${customer.address[0].address} - ${customer.address[0].title}</br> 
                    <b>${t("creation-date")}</b>: ${new Date(customer.createdAt).toLocaleDateString('en-CA')}</br>
                    <b>${t("customer-loan")}</b>: ${customer.credit_amount} ${customer.currency}<br/>
                    <b>${t("description")}</b>: ${customer.description}<br/>
                    <b>${t("phone-number")}</b>: ${customer.gsm_no}<br/>
                        `,
            confirmButtonText: t("close"),
        });
    }
    function getAccount(): void {
        throw new Error("Function not implemented.");
    }

    function edit(): void {
        throw new Error("Function not implemented.");
    }

    function callerList(): void {
        throw new Error("Function not implemented.");
    }

    const printData = {    
        name: selectedCustomer?.title,
        description: selectedCustomer?.description,
        customerCredit: selectedCustomer?.credit_amount + selectedCustomer?.currency,
        branch: selectedCustomer?.branchName || "Digigarson",
        address : selectedCustomer?.address?.map((a:any) => {
            return a.address
        }),
        title: selectedCustomer?.address?.map((a:any) => {
            return a.title
        }),
    };

    const closeModal = () => {
        setModalOpen(false);
        setCustomer({
            currency: 'TL',
            credit_amount: 0,
            description: '',
            title: '',
            address: [
                {
                    address: "",
                    title: ""
                }
            ],
            gsm_no: 0
        })
        setPhone({
            isValid: false,
            number: "",
            country: {}
        })
        Fetchs.Customer.handle(Services.Customer.get());
    }
    const props = {
        customer, setCustomer,
        modalOpen, setModalOpen,
        phone, setPhone,
        closeModal,
        currentModal,
        Services, Fetchs
    }
    return <>
        {modalOpen && <Modals props={props} />}
        <div className="Home">
            <div className="search-show">
                <div className="search">
                    <table>
                        <thead>
                            <tr>
                                <th>{t("phone-number")}</th>
                                <th>{t("name")}</th>
                                {/* <th>Adres</th>
                                <th>Adisyon</th>
                                <th>Müşteri No</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {
                                    ["gsm_no", "title"].map((type: string) => <td>
                                        {
                                            type=="gsm_no"?
                                                <IntlTelInput
                                                    preferredCountries={['tr']}
                                                    format={true}
                                                    telInputProps={{
                                                        maxLength: 14,
                                                    }}
                                                    value={phone?.number}
                                                    onPhoneNumberChange={(isValid, number, country) => {
                                                        setPhone({isValid,number,country})
                                                        searchCustomer(number,type)
                                                    }}
                                                    style={{ color: "black", width:"100%"}}
                                                    inputClassName="telInput"
                                                />
                                            : <input style={{ color: "black" }} onChange={(event) => {setName(event.target.value);searchCustomer(event.target.value, type)}} />
                                        }
                                    </td>)
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="show">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "8vw" }}>{t("phone-number")}</th>
                                <th style={{ width: "7vw" }}>{t("name")}</th>
                                <th style={{ width: "50vw" }}>{t("adress")}</th>
                                <th style={{ width: "7vw" }}>{t("note")}</th>
                                <th style={{ width: "8vw" }}>{t("customer-number")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customers.map((customer: any) => {
                                    if (customer.address.length > 1) {
                                        return <>
                                            {
                                                customer.address.map((address: any, index: number) => <tr style={customer.id == selectedCustomer?.id && index == addressIndex ? { background: "blue" } : undefined} onClick={() => { setSelectedCustomer(customer); setAddressIndex(index) }}>
                                                    <th style={{ width: "10vw" }}>{customer.gsm_no}</th>
                                                    <th style={{ width: "10vw" }}>{customer.title}</th>
                                                    <th style={{ width: "40vw" }}>{address.address}</th>
                                                    <th style={{ width: "10vw" }}>{customer.description}</th>
                                                    <th style={{ width: "10vw" }}>{customer.id}</th>
                                                </tr>)
                                            }
                                        </>
                                    }
                                    else {
                                        return <tr style={customer.id == selectedCustomer?.id ? { background: "blue" } : undefined} onClick={() => { setSelectedCustomer(customer); setAddressIndex(0) }}>
                                            <th style={{ width: "10vw" }}>{customer.gsm_no}</th>
                                            <th style={{ width: "10vw" }}>{customer.title}</th>
                                            <th style={{ width: "40vw" }}>{customer.address[0].address}</th>
                                            <th style={{ width: "10vw" }}>{customer.description}</th>
                                            <th style={{ width: "10vw" }}>{customer.id}</th>
                                        </tr>
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="customer-operations">
                <button disabled={!selectedCustomer} onClick={() => window.location.href = "/takeaway/order/"+selectedCustomer.id}>{t("choose-customer")}</button>
                <button disabled={selectedCustomer} onClick={() => createCustomer()}>{t("new-customer")}</button>
                <button disabled={true} onClick={() => findCheck()}>{t("find-ticket")}</button>
                <button disabled={!selectedCustomer} onClick={() => customerPopup(t,selectedCustomer?.id)}>{t("customer-account")}</button>
                <button disabled={!selectedCustomer} onClick={() => Printer.printCustomer(printData)}>{t("customer-print")}</button>
                <button disabled={!selectedCustomer} onClick={() => edit()}>{t("edit-customer")}</button>
                <button disabled={selectedCustomer} onClick={() => callerList()}>{t("caller-list")}</button>
                <button disabled={!selectedCustomer} onClick={() => { setSelectedCustomer(false), setAddressIndex(0) }}>{t("clear-selection")}</button>
                <button disabled={false} onClick={() => window.location.href = "/takeaway"}>{t("back")}</button>
                <button disabled={false} onClick={() => window.location.href = "/"}>{t("close")}</button>
            </div>
        </div>
    </>
}



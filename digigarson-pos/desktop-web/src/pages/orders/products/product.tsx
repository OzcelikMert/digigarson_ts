
import { EditOutlined } from '@ant-design/icons';

import "./products.css"
import { MODAL } from "constants/modalTypes";

export default ({props, product}:{props:any, product: { title: string; prices: any; } }) => {
    const {title, prices} = product
    const {
        productsInOrder, setProductsInOrder,
        multiplier, setMultiplier,
        setCurrentModal, setModalOpen,
        createUUID, BranchContext,
        optionList, setOptionList,
        clickedProduct, setClickedProduct,
        totalAmount, setTotalAmount,
        currentTable, customerId
     } = props;

    function productHandleClick( product: any) {
        let forced=false;
        if (product.sale_type==5){
            handleNoteClick(product)
            return;
        }
        product.options.forEach((option:any) => {
            if (option.is_forced_choice){
                handleNoteClick(product)
                forced=true;
                return;
            }
        });
        if(forced){
            return;
        }
        let pro = JSON.parse(JSON.stringify(product));
        pro.prices[0].amount *= multiplier;
        let chk = [...productsInOrder]
        chk.push({ product: pro, checked: false, uid: createUUID(), priceIndex: 0, options: Array() })
        if (currentTable?.safeSales||customerId||!customerId){
            setTotalAmount(totalAmount+product.prices[0].price*multiplier)
        }
        setProductsInOrder(chk);
        setMultiplier(1);
    }

    function handleNoteClick(product:any){
        let options = Array();
        BranchContext[0].options.forEach((option:any)=>{
            let opt = (product.options.find((op: any) => op.option_id == option._id));
            if (opt){
                options.push({ option: option, is_forced_choice:opt.is_forced_choice});
            }
        })
        setOptionList(options)
        setClickedProduct(product)
        setCurrentModal(MODAL.OPTION)
        setModalOpen(true)
    }
    return (
        <div className="productBox" >
            <div
                onClick={() => productHandleClick(product)}
                className="productMiddle"
                >
                <div className="productName">
                    <span>
                        {title}
                    </span>
                </div>
                <div className="productPrice">
                    <span>
                        {prices[0].price}
                    </span>
                </div>
            </div>
            <div 
                onClick={() => handleNoteClick(product)}
                className="productSpecial">
                <EditOutlined />
            </div>
        </div>
    )
}
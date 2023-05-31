import Category from "./orders/category/category";
import Check from "./orders/check";
import Navbar from "./orders/navbar";
import Products from "./orders/products/products";

export default function () {
  const props = {};
  return (
    <div style={{ position: "absolute", top: "0", width: "100%" }}>
      <Navbar props={props} />
      <div className='row'>
        <div id="account" className='col'>
          <Check props={props} />
        </div>
        <div id="products" className='col'>
          <Products props={props} />
        </div>
        <div id="btnCategory" style={{ display: "block", width: "35%" }} className='col'>
          <Category props={props} />
        </div>
      </div>

    </div>
  )
}

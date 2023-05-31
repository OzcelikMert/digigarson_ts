import { EditOutlined } from "@ant-design/icons";
import "./products.css";
import { Component, useContext } from "react";

type PageState = {};

type PageProps = {
    title: string,
    price: any,
    currency: string,
    onClick: any
    onClickNote: any
};

class Product extends Component<PageProps, PageState> {
  render() {
    return (
      <div className="productBox">
          <div onClick={this.props.onClick} className="productMiddle">
              <div className="productName">
                  <span>{this.props.title}</span>
              </div>
              <div className="productPrice">
                  <span>{this.props.price} {this.props.currency}</span>
              </div>
          </div>
          <div onClick={this.props.onClickNote} className="productSpecial">
              <EditOutlined/>
          </div>
      </div>
    );
  }
}

export default Product;

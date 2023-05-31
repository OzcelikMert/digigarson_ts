import  { Component } from "react";
import "./category.css";
import { PagePropCommonDocument } from "../../../../../modules/views/pages/pageProps";

type PageState = {};

type PageProps = {
    categoryId: string,
    isSelected: boolean,
    title: string
    onClick: any
} & PagePropCommonDocument;

class Category extends Component<PageProps, PageState> {
  render() {
    return (
        <button
            onClick={this.props.onClick}
            id={this.props.categoryId}
            style={{backgroundColor: this.props.isSelected ? "green" : "hsl(3, 81%, 46%)"}}
        >
            {this.props.title}
        </button>
    );
  }
}

export default Category;

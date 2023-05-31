import React, { useContext, useEffect, useState } from "react"

import "./products.css"
import Branch from 'services/branch';
import FuzzySearch from "fuzzy-search";
import Product from './product'



export default ({ props }: { props: any }) => {
    const {
        category, productSearchText, productsFromCategory, setProductsFromCategory,
        products, setProducts,
        BranchContext 
    } = props;


    useEffect(() => (setProductsFromCategory(BranchContext[0]?.products.filter((p: any) => category == "all" ? p : p.category == category))), [BranchContext, category])
    const productSearcher = new FuzzySearch(
        productsFromCategory,
        ["title"],
        {
            caseSensitive: false
        });
    useEffect(() => {
        if (productSearchText.length > 0 || productSearchText == "") {
            const result = productSearcher.search(productSearchText);
            setProducts(result);
        }
        else {
            setProducts(productsFromCategory)
        }
    }, [productSearchText, productsFromCategory])

    return (
        <div className="productsContainer">
            {products?.map((product: any) => <Product props={props} product={product} />)}
        </div>
    )
}
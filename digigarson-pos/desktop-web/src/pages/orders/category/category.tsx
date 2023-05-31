import React, { useEffect, useState } from 'react';
import "./category.css"
import { useTranslation } from "react-i18next";



export default ({ props }: { props:any }) => {
    const {
        categories, selectedCategory, handleCategoryClick    }=props;

    const Category = (categoryName: string, categoryId: string) => {
        const categoryColor = categoryId === selectedCategory ? "green" : "hsl(3, 81%, 46%)"
        return (
            <button
                onClick={(event) => handleCategoryClick(event)}
                id={categoryId}
                style={{ backgroundColor: categoryColor }}
            >{categoryName}</ button>
        )
    }

    const { t, i18n } = useTranslation();
    return (
        <div className="categoryButton">
            <button
                onClick={(event) => handleCategoryClick(event)}
                id={"all"}
                style={{ backgroundColor: selectedCategory == "all" ? "green" : "hsl(3, 81%, 46%)" }}>

                    {t("all")}
            </ button>
            {
                categories.map((c: any) => Category(c.title, c.id))
            }
        </div>
    )
}


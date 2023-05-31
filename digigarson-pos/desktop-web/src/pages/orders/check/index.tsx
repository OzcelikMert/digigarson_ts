import React, { useState, useEffect, useContext } from 'react';
import ButtonRight from './components/buttonRight'
import Table from './components/table';

export default ({ props }: {props: any
}) => {
    const {
        selectCurrentCategory,
        BranchContext,
    } = props;


    useEffect(() => BranchContext[0] && selectCurrentCategory(BranchContext[0]?.categories[0]?._id), [BranchContext[0]])


    return (
        <div className="adisyonContainer">
            <Table props={props} />
            <ButtonRight props={props} />
        </div>
    )
}
import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findChecks } from "../../service/check.service";
import { findCases } from "../../service/case.service";
import { findTables } from "../../service/table.service";
import {findOneBranch} from "../../service/branch.service";
import Table from "../../model/table.model";
import Check from '../../model/check.model';

const groupByDay = (data: any[]) => {
    let dates: any[] = data.map((x: any) => x.createdAt.toLocaleDateString())
    let uniqueDates = Array.from(new Set(dates))
    return uniqueDates
}
// @desc    get Product Based Report
// @route   GET /v1/report/productbased
// @access  Public
// Ürün Bazlı Satış Raporu
export async function getProductBasedReportHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _mongoQuery = get(req, "params._mongoQuery");
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"));
    let branch: any = await findOneBranch({ _id: branchId });
    if(!branch) return res.status(404).send({success: false, message: 'Branch not found'});
    let report: any[] = [];
    if(branch.subbranch.length == 0){
        var records: any = await findChecks({..._mongoQuery, branch: branchId});
        var orderRecords: any = await Table.find({
            branch: branchId,
            busy: true,
            'orders.createdAt': {
                $gte: _mongoQuery.createdAt['$gte'],
                $lt: _mongoQuery.createdAt['$lt']
            }
        }).populate('orders.productId').populate({
            path:'orders.productId',
            populate: {
                path: 'category'
            }   
        }).select('_id orders');
        if(!records && !orderRecords) return res.status(404).send({success: false, message: 'No orders or checks found.'});
        var products: any[] = [];
        orderRecords.map((o: any) => o.orders.map((p: any) => products.push(p)));
        for(let indexDay of groupByDay(products)) {
            const pLabel = indexDay;
            var pData: any = products?.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                return {
                    name: x.productName,
                    quantity: x.quantity,
                    price: x.price,
                    createdAt: x.createdAt,
                    categoryId: x.productId?.category?._id,
                    categoryTitle: x.productId?.category?.title,
                    categoryImage: x.productId?.category?.image,
                    isPaid: false
                }
            });
            report.push({label:pLabel, data:pData});
        }

        for (let indexDay of groupByDay(records)) {
            const label = indexDay;
          
            let data = records?.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                return x.products.map((y: any) => (
                { 
                    name: y.productName, 
                    quantity: y.quantity, 
                    price: y.price, 
                    createdAt: x.createdAt, 
                    categoryId: y?.productId?.category?._id, 
                    categoryTitle: y?.productId?.category?.title,
                    categoryImage: y?.productId?.category?.image,
                    isPaid: true,
                }));
            });

            const result = data.reduce((prev: any, next: any) => {
                next.map((n: any) => {
                    let exist = prev.find((b: any) => b.name == n.name)
                    if (!exist) prev.push(n)
                    else {
                        exist.quantity += n.quantity
                        exist.price += n.price
                    }
                })
                return prev
            }, [])
            report.push({ label, result })  
            }  
    }
    if(branch.subBranch.length !== 0){
        for(let e of [...branch.subBranch, branchId]){
            let branch: any = await findOneBranch({ _id: e })
            let readyReport: any = {title: branch.title, data: []};
            let records: any = await findChecks({..._mongoQuery, branch: e})
            var orderRecords: any = await Table.find({
                branch: e,
                busy: true,
                'orders.createdAt': {
                    $gte: _mongoQuery.createdAt['$gte'],
                    $lt: _mongoQuery.createdAt['$lt']
                }
            }).populate('orders.productId').populate({
                path:'orders.productId',
                populate: {
                    path: 'category'
                }   
            }).select('_id orders');
            var products: any[] = [];
            orderRecords.map((o: any) => o.orders.map((p: any) => products.push(p)));
            for(let indexDay of groupByDay(products)) {
                const pLabel = indexDay;
                var pData: any = products?.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                    return {
                        name: x.productName,
                        quantity: x.quantity,
                        price: x.price,
                        createdAt: x.createdAt,
                        categoryId: x.productId?.category?._id,
                        categoryTitle: x.productId?.category?.title,
                        categoryImage: x.productId?.category?.image,
                        isPaid: false
                    }
                });
                report.push({label:pLabel, data:pData});
            }
                for (let indexDay of groupByDay(records)) {
                    const label = indexDay;
                    let data = records?.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                        return x.products.map((y: any) => (
                            {   
                                name: y.productName,
                                quantity: y.quantity,
                                price: y.price,
                                createdAt: x.createdAt,
                                categoryId: y?.productId?.category?._id, 
                                categoryTitle: y?.productId?.category?.title,
                                categoryImage: y?.productId?.category?.image,
                                isPaid: true
                            }));
                    });
                    const result = data.reduce((prev: any, next: any) => {
                        next.map((n: any) => {
                            let exist = prev.find((b: any) => b.name == n.name)
                            if (!exist) prev.push(n)
                            else {
                                exist.quantity += n.quantity
                                exist.price += n.price
                            }
                        })
                        return prev
                        }, [])
                        readyReport.data.push({ label, result })  
                    }  
                    report.push(readyReport)  
                }
    }
    res.json({ success: true, report })
}
// @desc    get Case Based Report
// @route   GET /v1/report/casebased
// @access  Public
// Günlük Ciro Raporu
export async function getCaseBasedReportHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _mongoQuery = get(req, "params._mongoQuery")
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
    let branch: any = await findOneBranch({ _id: branchId })
    let report: any[] = [];
    if(branch.subBranch === []){
    let records: any = await findCases({..._mongoQuery, branch: branchId, is_open:false})
        for (let indexDay of groupByDay(records)) {
            const label = indexDay;
            let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                return x.balance
            })
            const result = data.reduce((prev: any, next: any) => {
                next.map((n: any) => {
                    let exist = prev.find((b: any) => b.type == n.type && b.currency == n.currency)
                    if (!exist) prev.push(n)
                    else {
                        exist.amount += n.amount
                    }
                })
                return prev
            }, [])
            report.push({ label, result })
        }
    }
    if(branch.subBranch !== []){
        for(let e of [...branch.subBranch, branchId]){
            let branch: any = await findOneBranch({ _id: e })
            let readyReport: any = {title: branch.title, data: []};
            let records: any = await findCases({..._mongoQuery, branch: e, is_open:false})
            for (let indexDay of groupByDay(records)) {
                const label = indexDay;
                let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                    return x.balance
                })
                const result = data.reduce((prev: any, next: any) => {
                    next.map((n: any) => {
                        let exist = prev.find((b: any) => b.type == n.type && b.currency == n.currency)
                        if (!exist) prev.push(n)
                        else {
                            exist.amount += n.amount
                        }
                    })
                    return prev
                }, [])
                readyReport.data.push({ label, result })
            }
                report.push(readyReport)  
                }
    }
    return res.json({ success: true, report })
}
// @desc    get Table Based Report
// @route   GET /v1/report/tablebased
// @access  Public
// Masa performansı Raporu
export async function getTableBasedReportHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _mongoQuery = get(req, "params._mongoQuery")
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
    let branch: any = await findOneBranch({ _id: branchId })
    let report: any[] = [];
    if(branch.subBranch === []){
    let records: any = await findChecks({..._mongoQuery, branch: branchId, table:{'$exists':true}})
    for (let indexDay of groupByDay(records)) {
        const label = indexDay;
        let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
            return String(x.table)
        })
        const result = data.reduce((prev: any, next: any) => {
                let exist = prev.find((b: any) => b.table == next)
                if (!exist) prev.push({table:next,quantity:1})
                else {
                    exist.quantity += 1
                }
            return prev
        }, [])
        report.push({ label, result })
    } 
    }
    if(branch.subBranch !== []){
        for(let e of [...branch.subBranch, branchId]){
            let branch: any = await findOneBranch({ _id: e })
            let readyReport: any = {title: branch.title, data: []};
            let records: any = await findChecks({..._mongoQuery, branch: branch._id, table:{'$exists':true}})
            for (let indexDay of groupByDay(records)) {
                const label = indexDay;
                let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
                    return String(x.table)
                })
                const result = data.reduce((prev: any, next: any) => {
                        let exist = prev.find((b: any) => b.table == next)
                        if (!exist) prev.push({table:next,quantity:1})
                        else {
                            exist.quantity += 1
                        }
                    return prev
                }, [])
                readyReport.data.push({ label, result })
            } 
            report.push(readyReport)  
        }
    }
    return res.json({ success: true, report })
}
// @desc    get Waiter Based Report
// @route   GET /v1/report/workerbased
// @access  Public
// Çalışan performansı Raporu
export async function getWorkerBasedReportHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _mongoQuery = get(req, "params._mongoQuery")
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
    let report: any[] = [];
    let records: any = await findChecks({..._mongoQuery,branch: branchId,order_type:1,user:{'$exists':true}})
    let branch: any = await findOneBranch({ _id: branchId })
    for (let indexDay of groupByDay(records)) {
        const label = indexDay;
        let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
            return ({user:String(x.user),payments:x.payments,products:x.products})
        })
        const result = data.reduce((prev: any, next: any) => {
                let exist = prev.find((b: any) => b.user == next.user)
                if(!exist){
                    prev.push({
                        user:next.user,
                        payments:next.payments.reduce((p:any,n:any)=>{
                            let existPayment = p.find((b: any) => b.currency == n.currency)
                            if(!existPayment)p.push({currency:n.currency,amount:n.amount})
                            else existPayment.amount+=n.amount
                            return p
                        },[]),
                        products:next.products.reduce((p:any,n:any)=>{
                            let existProducts = p.find((b: any) => b.name == n.productName)
                            if(!existProducts)p.push({name:n.productName,quantity:n.quantity})
                            else existProducts.quantity+=n.quantity
                            return p
                        },[]),
                        quantity:1
                    })
                }else{
                    exist.quantity+=1;
                    next.payments.forEach((n:any)=>{
                        let existPayment = exist.payments.find((b: any) => b.currency == n.currency)
                        if(!existPayment)exist.payments.push({currency:n.currency,amount:n.amount})
                        else existPayment.amount+=n.amount
                    })
                    next.products.forEach((n:any)=>{
                        let existProducts = exist.products.find((b: any) => b.name == n.productName)
                        if(!existProducts)exist.products.push({name:n.productName,quantity:n.quantity})
                        else existProducts.quantity+=n.quantity
                    });

                    
                }
                return prev
                },[])
                      
        report.push({ label, result })
    }
    return res.json({ success: true, report })
}

// @desc    get Order Type Based Report
// @route   GET /v1/report/ordertypebased
// @access  Public
// Sipariş tipi bazlı Raporu
export async function getOrderTypeBasedReportHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _mongoQuery = get(req, "params._mongoQuery")
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
    let report: any[] = [];
    let branch: any = await findOneBranch({ _id: branchId })
    if(branch.subBranch === []){
    let records: any = await findChecks({..._mongoQuery, branch: branchId, table:{'$exists':true}})
    for (let indexDay of groupByDay(records)) {
        const label = indexDay;
        let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
            return ({order_type:String(x.order_type),payments:x.payments})
        })
        const result = data.reduce((prev: any, next: any) => {
                let exist = prev.find((b: any) => b.type == next.ordertype)
                if (!exist) prev.push({
                    order_type:next.order_type,
                    payments:next.payments.reduce((p:any,n:any)=>{
                        let existPayment = p.find((b: any) => b.currency == n.currency)
                        if(!existPayment)p.push({currency:n.currency,amount:n.amount})
                        else existPayment.amount+=n.amount
                        return p
                    },[]),
                    quantity:1
                })
                else {
                    next.payments.forEach((n:any)=>{
                        let existPayment = exist.payments.find((b: any) => b.currency == n.currency)
                        if(!existPayment)exist.payments.push({currency:n.currency,amount:n.amount})
                        else existPayment.amount+=n.amount
                    })
                    exist.quantity+=1
                }
            
            return prev
        }, [])
        report.push({ label, result })
    }
    }
    if(branch.subBranch !== []){
        for(let e of [...branch.subBranch, branchId]){
        let branch: any = await findOneBranch({ _id: e })
        let readyReport: any = {title: branch.title, data: []};
        let records: any = await findChecks({..._mongoQuery, branch: branch._id, table:{'$exists':true}})
    for (let indexDay of groupByDay(records)) {
        const label = indexDay;
        let data = records.filter((x: any) => x.createdAt.toLocaleDateString() == indexDay).map((x: any) => {
            return ({order_type:String(x.order_type),payments:x.payments})
        })
        const result = data.reduce((prev: any, next: any) => {
                let exist = prev.find((b: any) => b.type == next.ordertype)
                if (!exist) prev.push({
                    order_type:next.order_type,
                    payments:next.payments.reduce((p:any,n:any)=>{
                        let existPayment = p.find((b: any) => b.currency == n.currency)
                        if(!existPayment)p.push({currency:n.currency,amount:n.amount})
                        else existPayment.amount+=n.amount
                        return p
                    },[]),
                    quantity:1
                })
                else {
                    next.payments.forEach((n:any)=>{
                        let existPayment = exist.payments.find((b: any) => b.currency == n.currency)
                        if(!existPayment)exist.payments.push({currency:n.currency,amount:n.amount})
                        else existPayment.amount+=n.amount
                    })
                    exist.quantity+=1
                }
            
            return prev
        }, [])
        readyReport.data.push({ label, result })
    }
            report.push(readyReport)  
        }
    }
    return res.json({ success: true, report })
}
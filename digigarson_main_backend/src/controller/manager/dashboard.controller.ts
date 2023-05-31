import { get, omit } from "lodash";
import { Request, Response } from "express";
import { getIncome, getChecksCount, getBusyRate, getProfit,getTopSellingProductsonChecks, getLastUpdatedTables, getLastChecks, getOrdersTraffic } from "../../service/managerdashboard.service";
import { ObjectId } from 'bson'

// @desc    get Income
// @route   GET /v1/manager/dashboard/income
// @access  Public
//manager olarak görev yapan branchin günlük cirosunu hesaplar.
export async function getIncomeHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getIncome(
        {
            branch: new ObjectId(branchId), updatedAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })
    return res.json({ success: true, data })
}

// @desc    get Profit
// @route   GET /v1/manager/dashboard/profit
// @access  Public
//manager olarak görev yapan branchin günlük gelir - gider = kâr hesaplar.
export async function getProfitHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getProfit(
        {
            branch: new ObjectId(branchId), updatedAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })
    return res.json({ success: true, data })
}


// @desc    get Checkscount
// @route   GET /v1/manager/dashboard/checkscount
// @access  Public
//manager olarak görev yapan branchin günlük adisyonunu toplar.
export async function getChecksCountHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getChecksCount({
        branch: new ObjectId(branchId)
        , updatedAt: {
            $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
            $lt: new Date(Date.now() - 60000) // 1 minute ago
        }
    })
    return res.json({ success: true, data })
}

//manager olarak görev yapan branchin masaların dolu boş oranını getirir
export async function getBusyRateHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getBusyRate(
        {
            branch: new ObjectId(branchId)

        })
    return res.json({ success: true, data })
}


// @desc    get Last Orders
// @route   GET /v1/manager/dashboard/lastorders
// @access  Public
//manager olarak görev yapan branchin son siparişlerini gösterir.
export async function getLastOrders(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let checks = await getLastChecks(
        {
            branch: new ObjectId(branchId), createdAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })

    let tables = await getLastUpdatedTables(
        {
            branch: new ObjectId(branchId), updatedAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })
    return res.json({ success: true, checks, tables })
}



// @desc    get Last Orders
// @route   GET /v1/manager/dashboard/lastorders
// @access  Public
//manager olarak görev yapan branchin son siparişlerini gösterir.
export async function getTopSellingProductsHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getTopSellingProductsonChecks(
        {
            branch: new ObjectId(branchId), createdAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })
    data = data.sort((a,b)=>b.count-a.count)

    return res.json({ success: true, data})
}

// @desc    get Orders Traffic
// @route   GET /v1/manager/dashboard/orderstraffic
// @access  Public
//manager olarak görev yapan branchin sipariş kanallarını.
export async function getOrdersTrafficHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");

    let data = await getOrdersTraffic(
        {
            branch: new ObjectId(branchId), createdAt: {
                $gte: new Date(new Date().setHours(0,0,0,0)), // 0:0:0 of today
                $lt: new Date(Date.now() - 60000) // 1 minute ago
            }
        })
    return res.json({ success: true, data})
}


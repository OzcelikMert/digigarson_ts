import {
    DocumentDefinition,
    FilterQuery,
    QueryOptions,
} from "mongoose";
import
{
    TableModel as Table,
    TableCover as Cover,
    TableDiscount as Discount,
    CheckModel as Check,
    TableDocument,
    TableOrdersDocument as OrdersDocument,
    CheckDocument
} from "../model/"



//yeni sipariş oluşturur.
export async function createNewOrder(input: DocumentDefinition<OrdersDocument>, tableId: string, order_type: number) {
    return Table.updateOne({ _id: tableId }, {
        '$set': {
            orders: input,
            cancelled_orders: [],
            paid_orders: [],
            payments: [],
            busy: true,
            order_type,
            logs: [],
            discount: [],
            cover: [],
        }
    })
}


//eve teslim sipariş oluşturur.
export async function createNewHomeDeliveryOrder(input: DocumentDefinition<OrdersDocument>, branch: string, caseId: string,  user: any,customer: any,courier: any) {
    return Check.create({
        branch,
        products: input,
        order_type: 3,
        payment: [],
        logs: [],
        discount: [],
        is_it_paid: false,
        customer,
        user,
        caseId,
        courier
    })
}



//yeni sipariş ekler.
export async function addNewOrder(input: DocumentDefinition<OrdersDocument>, tableId: string) {
    return Table.updateOne({ _id: tableId }, { "$push": { "orders": { "$each": input } } })
}
//siparişi günceller.
export async function updateOrder(input: DocumentDefinition<OrdersDocument>, tableId: string, orderId: string) {
    return Table.updateOne({ _id: tableId }, { "$push": { "orders": { "$each": input } } })
}

//siparişi siler.
export async function deleteOrder(tableId: string, orderId: string) {
    return Table.findByIdAndUpdate(tableId, {
        '$pull': {
            'orders': { '_id': orderId }
        }
    });
}


//siparişi çağırır ve değişiklik yapar.
export async function updateCancelledOrder(input: DocumentDefinition<OrdersDocument>, tableId: string) {
    return Table.updateOne({ _id: tableId }, {
        '$set': {
            paid_orders: input
        }
    })
}

export async function updateAddOrder(Id: any, tableId: string, isBusy: boolean) {
  return (isBusy == false) ?
   Table.updateOne({ _id: tableId },{"$push": {"orders":Id}, '$set': { "busy": true, "order_type": 1}}):
   Table.updateOne({ _id: tableId },{"$push": {"orders":Id}})
}

//siparişi bulur.
export function findOrder(
    query: FilterQuery<TableDocument>,
    options: QueryOptions = { lean: true }
) {
    return Table.findOne(query, { orders: 1, _id: 0 }, options);
}

// masaya iskonto ekler
export function applyTableDiscount(input: Discount, tableId: string
) {
    return Table.updateOne({ _id: tableId }, { "$push": { "discount": input } })
}


// masaya iskonto ekler
export function applyTableCover(input: Cover, tableId: string
) {
    return Table.updateOne({ _id: tableId }, { "$push": { "cover": input } })
}


export async function isPrintUpdate(tableId: string){
    return Table.updateOne({_id: tableId},
        {
            '$set': {"orders.$[].isPrint": true}
        });
}
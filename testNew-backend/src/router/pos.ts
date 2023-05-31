import { Router } from "express";
import { createBranchCrewSessionHandler } from "../controller/session.controller";
import { transferTableHandler } from "../controller/waiter/table.controller";
import { accessPermissions, advancedResults, requiresUser, validateRequest } from "../middleware";
import { createCrewSessionSchema } from "../schema/user.schema";
import { getCheckSchema, getOldCheckSchema, updateOldCheckSchema } from "../schema/check.schema";
import { createCaseSchema } from "../schema/case.schema";
import { createTablePaySchema, createCheckPaySchema } from "../schema/pay.schema";
import { transferTableSchema } from "../schema/table.schema";
import paymentTotalCheck from "../middleware/pos/paymentTotalCheck";
import { updateOrderHandler, addProductOrderHandler, createOrderHandler, deleteOrderHandler } from "../controller/waiter/order.controller";
import { checkTable, checkProducts, checkBranchCustomerDelivery } from "../middleware/orders";
import { createExpenseSchema } from "../schema/expense.schema";
import { createBranchCustomerSchema } from "../schema/branchcustomer.schema";
import { createIngredientSchema } from "../schema/ingredient.schema";
import reportAdvancedResult from "../middleware/reportAdvancedResult";
import { getLangHandler } from "../controller/manager/lang.controller";
import { createCourierSchema, deleteCourierSchema, getCourierSchema, updateCourierSchema } from "../schema/courier.schema";
import { callerIdSchema, createCallerSchema, updateCallerSchema } from "../schema/callerId.schema";
import Controller from "../controller/pos";
import {createServeSchema} from "../schema/serve.schema";
import OrderSchema from "../schema/order.schema";
import Branchtick from "../controller/pos/branchticks.conttroller";

const pos = Router();

// Sign In
pos.post("/signin", [validateRequest(createCrewSessionSchema)], createBranchCrewSessionHandler);

// Get My Branch
pos.get('/mybranch', Controller.Branch.get);



// Get All Section 
pos.route('/sections')
    .get(Controller.Section.get)
pos.route('/sections/:sectionId')
    // get Section by tables
    .get(Controller.Section.IdByTable)


// Get Branch All Table 
pos.route('/tables')
    // Get Section
    .get(Controller.Table.get)


pos.route('/tables/:tableId')
    // get Tables Id
    .get(Controller.Table.getOne)
    .put([validateRequest(OrderSchema.tableRequired), requiresUser, accessPermissions], Controller.Table.Update.IsPrint)

pos.route('/tables/transfer')
    // transfer Table 
    .post([validateRequest(transferTableSchema), requiresUser, accessPermissions], transferTableHandler)

pos.route('/orders')
    // get all table orders
    .get(Controller.Order.get)
pos.route('/orders/:tableId')
    // get order
    .get(Controller.Order.getOne)
    // create new Order
    .post([validateRequest(OrderSchema.create), requiresUser, accessPermissions, checkTable, checkProducts], createOrderHandler)
    // adding product in Order
    .put([validateRequest(OrderSchema.add), requiresUser, accessPermissions, checkTable, checkProducts], addProductOrderHandler)

pos.route('/order_status/:tableId/:order_status')
    .put(Controller.Order.Update.Status)

pos.route('/order_confirmation_status/:tableId/:order_confirmation_status')
    .put(Controller.Order.Update.Confirmation)

pos.route('/orders/:tableId/:orderId')
    // update product in order
    .put([validateRequest(OrderSchema.update), requiresUser, accessPermissions], updateOrderHandler)
    // delete product in Order
    .delete([validateRequest(OrderSchema.delete), requiresUser, accessPermissions], deleteOrderHandler)
//Move TableRouter
pos.route('/order/move/:tableId/:MtableId')
    .post(Controller.Order.Update.moveProducts)

// Adrese Teslim Siparişi Oluşturma

pos.route('/home-delivery')
    // Create new home delivery order
    .post([validateRequest(OrderSchema.HomeDelivery.create), requiresUser, accessPermissions, checkBranchCustomerDelivery, checkProducts], Controller.Order.HomeDelivery.create)
    // Get home delivery orders
    .get([requiresUser, accessPermissions, advancedResults], Controller.Order.HomeDelivery.get)

pos.route('/home-delivery/:checkId/pay')
    // Create new home delivery order
    .post([validateRequest(createCheckPaySchema), requiresUser, accessPermissions], Controller.Pay.homeHandler)

/*pos.route('/home-delivery/:checkId/:courierId/courier')
    // Create new home delivery order
    .post([validateRequest(createCheckPaySchema), requiresUser, accessPermissions], payHomeDeliveryChecksHandler)
*/

// Get Check - Adisyon
pos.route('/checks/:tableId')
    .get([validateRequest(getCheckSchema), requiresUser, accessPermissions],Controller.Check.get)

// Get old Check - Adisyon
pos.route('/checks/old/:checkId')
    .get([validateRequest(getOldCheckSchema), requiresUser, accessPermissions],Controller.Check.getOld)
    .put([validateRequest(updateOldCheckSchema), requiresUser, accessPermissions],Controller.Check.updateOld)

// payHandler, Ödeme yap.
pos.route('/checks/:tableId/pay')
    .post([validateRequest(createTablePaySchema), requiresUser, accessPermissions, paymentTotalCheck],Controller.Pay.handler)

pos.route('/checks/:branchTickId/ticks')
    .put( Controller.Branchtick.PayHandler)


// Kasa işlemleri
pos.route('/cases')
    .get( Controller.Case.get)
    .post([validateRequest(createCaseSchema), requiresUser, accessPermissions], Controller.Case.create);

pos.get('/cases/close',  Controller.Case.close)

// Get All Category 
pos.route('/categories')
    // Get Categories
    .get( Controller.Category.getCategoryHandler)


// Get All Product
pos.route('/categories/:categoryId')
    // Get Category by Id
    .get( Controller.Category.getProductsByCategoryId)

// Get Product
pos.route('/products')
    // Get Product by Id
    .get( Controller.Product.getAll)
// Get Product
pos.route('/products/:productId')
    // Get Product by Id
    .get( Controller.Product.getOne)

//Get - Post Expenses
pos.route('/expenses')
    .get(Controller.Expense.get)
    .post([validateRequest(createExpenseSchema), requiresUser, accessPermissions], Controller.Expense.create);

// POST - Apply Discount
pos.route('/orders/:tableId/discount')
    .post([validateRequest(OrderSchema.Apply.Discount), requiresUser, accessPermissions], Controller.Order.Apply.Discount)

// POST - Apply Cover
pos.route('/orders/:tableId/cover')
    .post([validateRequest(OrderSchema.Apply.Discount), requiresUser, accessPermissions], Controller.Order.Apply.Cover)

//Get - Post Customers
pos.route('/branchcustomers')
    .get( Controller.BranchCustomer.getHandler)
    .post([validateRequest(createBranchCustomerSchema), requiresUser, accessPermissions], Controller.BranchCustomer.createHandler);

//Get - Post Couriers
pos.route('/couriers')
    .get(Controller.Courier.get)
    .post([validateRequest(createCourierSchema), requiresUser, accessPermissions], Controller.Courier.create);
pos.route('/couriers/:courierId')
    // get Courier by Id
    .get([validateRequest(getCourierSchema), requiresUser, accessPermissions], Controller.Courier.getOne)
    .put([validateRequest(updateCourierSchema), requiresUser, accessPermissions], Controller.Courier.update)
    .delete([validateRequest(deleteCourierSchema), requiresUser, accessPermissions], Controller.Courier.delete)

//Get - Post İngredients
pos.route('/ingredients')
    .get(Controller.Ingredient.get)
    .post([validateRequest(createIngredientSchema), requiresUser, accessPermissions], Controller.Ingredient.create);

//Get - Post Serves
pos.route('/serves')
    .get(Controller.Serve.get)
    .post([validateRequest(createServeSchema), requiresUser, accessPermissions], Controller.Serve.create);

pos.route('/report/z-report/:caseId')
    .get(Controller.Report.zreport)

pos.route('/isprint/:tableId')
    .put(Controller.Order.Update.Isprint);

pos.route('/services/:serviceId')
    .put(Controller.Service.update)
pos.route('/services')
    .get(Controller.Service.get)
pos.route('/ticks')
    .post(Controller.Branchtick.create)
    .get(Controller.Branchtick.get)

// GetLang
pos.get('/lang', [requiresUser, accessPermissions, reportAdvancedResult], getLangHandler)

pos.route("/callerId")
    .post([validateRequest(createCallerSchema), requiresUser, accessPermissions], Controller.CallerId.create)
    .get( Controller.CallerId.get)
pos.route("/callerId/:callerId")
    .get([validateRequest(callerIdSchema), requiresUser, accessPermissions], Controller.CallerId.getOne)
    .put([validateRequest(updateCallerSchema), requiresUser, accessPermissions], Controller.CallerId.update)
    .delete([validateRequest(callerIdSchema), requiresUser, accessPermissions], Controller.CallerId.delete)

export default pos;
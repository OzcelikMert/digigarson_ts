import { Router } from "express";
import { createBranchCrewSessionHandler } from "../controller/session.controller";
import { getSectionsHandler, getTablesHandler } from "../controller/pos/section.controller";
import { getBranchTablesHandler, getTablesByIdHandler, updateTableIsPrint } from "../controller/pos/table.controller";
import { transferTableHandler } from "../controller/waiter/table.controller";
import { accessPermissions, advancedResults, requiresUser, validateRequest } from "../middleware";
import { createCrewSessionSchema } from "../schema/user.schema";
import { applyCover, applyDiscount, createHomeDeliveryOrderHandler, getHomeDeliveryOrdersHandler, getOrderHandler, getTableOrdersByWaiterId, moveProducts, updateConfirmation,
    UpdateIsPrintHomeDeliveryOrder, UpdateIsPrintOrder, updateStatus } from "../controller/pos/order.controller";
import { getCheckSchema, getOldCheckSchema, updateHomeDeliveryIsPrintSchema, updateOldCheckSchema } from "../schema/check.schema";
import { getCheckHandler, getOldCheckHandler, updateOldCheckHandler } from "../controller/pos/check.controller";
import { getMyBranchHandler } from "../controller/pos/branch.controller";
import { closeCaseHandler, createCaseHandler, getCaseHandler } from "../controller/pos/case.controller";
import { createCaseSchema } from "../schema/case.schema";
import { createTablePaySchema, createCheckPaySchema } from "../schema/pay.schema";
import { transferTableSchema, getTableSchema } from "../schema/table.schema";
import { payHandler, payHomeDeliveryChecksHandler } from "../controller/pos/pay.controller";
import paymentTotalCheck from "../middleware/pos/paymentTotalCheck";
import { getCategoryHandler, getProductsHandler } from "../controller/pos/category.controller";
import { getProductHandler } from "../controller/pos/product.controller";
import { createOrderSchema, updateOrderSchema, deleteOrderSchema, applyDiscountSchema, applyCoverSchema, createHomeDeliveryOrderSchema, tableRequired, updateOrderIsPrintSchema } from "../schema/order.schema";
import { updateOrderHandler, addProductOrderHandler, createOrderHandler, deleteOrderHandler } from "../controller/waiter/order.controller";
import { checkTable, checkProducts, checkBranchCustomerDelivery } from "../middleware/orders";
import { createExpenseSchema, deleteExpenseSchema } from "../schema/expense.schema";
import { createBranchCustomerSchema, updateBranchCustomerSchema} from "../schema/branchcustomer.schema";
import { createIngredientSchema } from "../schema/ingredient.schema";
import { createExpenseHandler, getExpenseHandler, deleteExpenseHandler } from "../controller/pos/expense.controller";
import { createBranchCustomerHandler,updateBranchCustomerHandler, getBranchCustomerHandler } from "../controller/pos/branchcustomer.controller";
import { createIngredientHandler, getIngredientHandler } from "../controller/pos/ingredient.controller";
import { createServeHandler, getServeHandler } from "../controller/pos/serve.controller";
import { createServeSchema } from "../schema/serve.schema";
import { getCaseReportHandler } from "../controller/pos/report.controller";
import { findAllservices, updateService } from "../controller/pos/service.controller";
import { createnewTicks, getOneTick, getTicksList, getTickCustomerListWithoutTicks, ticksPayHandler, getTickCustomerTicks } from "../controller/pos/branchticks.conttroller";
import reportAdvancedResult from "../middleware/reportAdvancedResult";
import { getLangHandler } from "../controller/manager/lang.controller";
import { createCourierSchema, deleteCourierSchema, getCourierSchema, updateCourierSchema } from "../schema/courier.schema";
import { createCourierHandler, deleteCourierHandler, getCourierByIdHandler, getCourierHandler, updateCourierHandler } from "../controller/pos/courier.controller";
import { createCallerHandler, deleteCallerHandler, getCallerHandler, getOneCallerHandler, updateCallerHandler } from "../controller/pos/callerId.controller";
import { callerIdSchema, createCallerSchema, updateCallerSchema } from "../schema/callerId.schema";
import {restaurant} from "../controller/integrations/getir.controller"

const pos = Router();

// Sign In
pos.post("/signin", [validateRequest(createCrewSessionSchema)], createBranchCrewSessionHandler);

// Get My Branch
pos.get('/mybranch', [requiresUser, accessPermissions], getMyBranchHandler);

// Get All Section 
pos.route('/sections')
    // Get Section
    .get([requiresUser, accessPermissions], getSectionsHandler)

pos.route('/sections/:sectionId')
    // get Section by tables
    .get([requiresUser, accessPermissions], getTablesHandler)

// Get Branch All Table 
pos.route('/tables')
    // Get Section
    .get([requiresUser, accessPermissions], getBranchTablesHandler)


pos.route('/tables/:tableId')
    // get Tables Id
    .get([validateRequest(tableRequired), requiresUser, accessPermissions], getTablesByIdHandler)
    .put([validateRequest(tableRequired), requiresUser, accessPermissions], updateTableIsPrint)

pos.route('/tables/transfer')
    // transfer Table 
    .post([validateRequest(transferTableSchema), requiresUser, accessPermissions], transferTableHandler)

pos.route('/orders')
    // get all table orders
    .get([requiresUser, accessPermissions], getTableOrdersByWaiterId)

pos.route('/orders/:tableId')
    // get order
    .get([requiresUser, accessPermissions], getOrderHandler)
    // create new Order
    .post([validateRequest(createOrderSchema), requiresUser, accessPermissions, checkTable, checkProducts], createOrderHandler)
    // adding product in Order
    .put([validateRequest(createOrderSchema), requiresUser, accessPermissions, checkTable, checkProducts], addProductOrderHandler)

pos.route('/order_status/:tableId/:order_status')
    .put([requiresUser, accessPermissions], updateStatus)

pos.route('/order_confirmation_status/:tableId/:order_confirmation_status')
    .put([requiresUser, accessPermissions], updateConfirmation)

pos.route('/orders/:tableId/:orderId')
    // update product in order
    .put([validateRequest(updateOrderSchema), requiresUser, accessPermissions], updateOrderHandler)
    // delete product in Order
    .delete([validateRequest(deleteOrderSchema), requiresUser, accessPermissions], deleteOrderHandler)
//Move TableRouter
pos.route('/order/move/:tableId/:MtableId')
    .put([requiresUser, accessPermissions], moveProducts)

// Adrese Teslim Siparişi Oluşturma

pos.route('/home-delivery')
    // Create new home delivery order
    .post([validateRequest(createHomeDeliveryOrderSchema), requiresUser, accessPermissions, checkBranchCustomerDelivery, checkProducts], createHomeDeliveryOrderHandler)
    // Get home delivery orders
    .get([requiresUser, accessPermissions, advancedResults], getHomeDeliveryOrdersHandler)

pos.route('/home-delivery/:checkId/pay')
    // Create new home delivery order
    .post([validateRequest(createCheckPaySchema), requiresUser, accessPermissions], payHomeDeliveryChecksHandler)

pos.route('/home-delivery/:checkId/:courierId/courier')
    // Create new home delivery order
    .post([validateRequest(createCheckPaySchema), requiresUser, accessPermissions], payHomeDeliveryChecksHandler)

pos.route('/home-delivery/:checkId/isprint')
    // Create new home delivery order
    .put([validateRequest(updateHomeDeliveryIsPrintSchema), requiresUser, accessPermissions], UpdateIsPrintHomeDeliveryOrder)


// Get Check - Adisyon
pos.route('/checks/:tableId')
    .get([validateRequest(getCheckSchema), requiresUser, accessPermissions], getCheckHandler)

// Get old Check - Adisyon
pos.route('/checks/old/:checkId')
    .get([validateRequest(getOldCheckSchema), requiresUser, accessPermissions], getOldCheckHandler)
    .put([validateRequest(updateOldCheckSchema), requiresUser, accessPermissions], updateOldCheckHandler)

// payHandler, Ödeme yap.
pos.route('/checks/:tableId/pay')
    .post([validateRequest(createTablePaySchema), requiresUser, accessPermissions, paymentTotalCheck], payHandler)

// Kasa işlemleri
pos.route('/cases')
    .get([requiresUser, accessPermissions], getCaseHandler)
    .post([validateRequest(createCaseSchema), requiresUser, accessPermissions], createCaseHandler);

pos.route('/cases/close')
    .put([requiresUser, accessPermissions], closeCaseHandler)

// Get All Category 
pos.route('/categories')
    // Get Categories
    .get([requiresUser, accessPermissions], getCategoryHandler)


// Get All Product
pos.route('/categories/:categoryId')
    // Get Category by Id
    .get([requiresUser, accessPermissions], getProductsHandler)


// Get Product
pos.route('/products/:productId')
    // Get Product by Id
    .get([requiresUser, accessPermissions], getProductHandler)

//Get - Post Expenses
pos.route('/expenses')
    .get([requiresUser, accessPermissions], getExpenseHandler)
    .post([validateRequest(createExpenseSchema), requiresUser, accessPermissions], createExpenseHandler);

pos.route('/expenses/:expenseId')
    .delete([validateRequest(deleteExpenseSchema), requiresUser, accessPermissions], deleteExpenseHandler);

// POST - Apply Discount
pos.route('/orders/:tableId/discount')
    .post([validateRequest(applyDiscountSchema), requiresUser, accessPermissions], applyDiscount)

// POST - Apply Cover
pos.route('/orders/:tableId/cover')
    .post([validateRequest(applyCoverSchema), requiresUser, accessPermissions], applyCover)

//Get - Post Customers
pos.route('/branchcustomers')
    .get([requiresUser, accessPermissions], getBranchCustomerHandler)
    .post([validateRequest(createBranchCustomerSchema), requiresUser, accessPermissions], createBranchCustomerHandler)
pos.route('/branchcustomers/:customerId')
    .put([validateRequest(updateBranchCustomerSchema), requiresUser, accessPermissions], updateBranchCustomerHandler)
//Get - Post Couriers
pos.route('/couriers')
    .get([requiresUser, accessPermissions], getCourierHandler)
    .post([validateRequest(createCourierSchema), requiresUser, accessPermissions], createCourierHandler);
pos.route('/couriers/:courierId')
    // get Courier by Id
    .get([validateRequest(getCourierSchema), requiresUser, accessPermissions], getCourierByIdHandler)
    .put([validateRequest(updateCourierSchema), requiresUser, accessPermissions], updateCourierHandler)
    .delete([validateRequest(deleteCourierSchema), requiresUser, accessPermissions], deleteCourierHandler)

//Get - Post İngredients
pos.route('/ingredients')
    .get([requiresUser, accessPermissions], getIngredientHandler)
    .post([validateRequest(createIngredientSchema), requiresUser, accessPermissions], createIngredientHandler);

//Get - Post Serves
pos.route('/serves')
    .get([requiresUser, accessPermissions], getServeHandler)
    .post([validateRequest(createServeSchema), requiresUser, accessPermissions], createServeHandler);

pos.route('/report/z-report/:caseId')
    .get([requiresUser, accessPermissions], getCaseReportHandler)

pos.route('/isprint/:tableId')
    .put([validateRequest(updateOrderIsPrintSchema), requiresUser, accessPermissions], UpdateIsPrintOrder);

pos.route('/services/:serviceId')
    .put([requiresUser, accessPermissions], updateService)
pos.route('/services')
    .get([requiresUser, accessPermissions], findAllservices)

pos.route('/ticks')
    .post([requiresUser, accessPermissions], createnewTicks)
    .put([requiresUser, accessPermissions], ticksPayHandler)    
    .get([requiresUser, accessPermissions], getTickCustomerListWithoutTicks)

pos.route('/ticks/:tickCustomerId')
    .get([requiresUser, accessPermissions], getTickCustomerTicks)

// Çoklu dil dosyasını çek
pos.get('/lang', [requiresUser, accessPermissions, reportAdvancedResult], getLangHandler)

pos.route("/callerId")
    .post([validateRequest(createCallerSchema), requiresUser, accessPermissions], createCallerHandler)
    .get([requiresUser, accessPermissions], getCallerHandler)
pos.route("/callerId/:callerId")
    .get([validateRequest(callerIdSchema), requiresUser, accessPermissions], getOneCallerHandler)
    .put([validateRequest(updateCallerSchema), requiresUser, accessPermissions], updateCallerHandler)
    .delete([validateRequest(callerIdSchema), requiresUser, accessPermissions], deleteCallerHandler)
pos.route("/zones").get(restaurant.zones)
pos.route("/restaurant").get(restaurant.restaurants)
pos.route("/optionproducts").get(restaurant.restaurantOptionsAndProduct)
pos.route("/menu").get(restaurant.menu)
export default pos;
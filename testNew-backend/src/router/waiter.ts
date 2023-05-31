import { Router } from "express";
import { getSectionsHandler, getTablesHandler } from "../controller/waiter/section.controller";
import { getTablesByIdHandler, transferTableHandler, updateTableIsPrint } from "../controller/waiter/table.controller";
import { accessPermissions, requiresUser, validateRequest } from "../middleware";
import { createCrewSessionSchema } from "../schema/user.schema";
import OrderSchema from "../schema/order.schema";
import { checkTable, checkProducts } from "../middleware/orders";
import { addProductOrderHandler, createOrderHandler, deleteOrderHandler, updateOrderHandler } from "../controller/waiter/order.controller";
import { getCategoryHandler, getProductsHandler } from "../controller/waiter/category.controller";
import { getProductHandler } from "../controller/waiter/product.controller";
import Order  from "../controller/pos/order.controller";
import { transferTableSchema } from "../schema/table.schema";
import { createBranchCrewSessionHandler } from "../controller/session.controller";
import { getLangHandler } from "../controller/manager/lang.controller";
import reportAdvancedResult from "../middleware/reportAdvancedResult";
import Controller from "../controller/pos";

const waiter = Router();

// Sign In
waiter.post("/signin", [validateRequest(createCrewSessionSchema)], createBranchCrewSessionHandler);


// Get All Category 
waiter.route('/category')
    // Get Category
    .get([requiresUser, accessPermissions], getCategoryHandler)


// Get All Product
waiter.route('/category/:categoryId')
    // Get Category
    .get([requiresUser, accessPermissions], getProductsHandler)


// Get Product
waiter.route('/product/:productId')
    // Get Category
    .get([requiresUser, accessPermissions], getProductHandler)


// Get All Section 
waiter.route('/sections')
    // Get Section
    .get([requiresUser, accessPermissions], getSectionsHandler)


waiter.route('/sections/:sectionId')
    // get Section by tables
    .get([requiresUser, accessPermissions], getTablesHandler)


waiter.route('/tables/:tableId')
    // get Tables Id
    .get([requiresUser, accessPermissions], getTablesByIdHandler)
    .put([validateRequest(OrderSchema.tableRequired), requiresUser, accessPermissions], updateTableIsPrint)

waiter.route('/tables/transfer')
    // transfer Table 
    .post([validateRequest(transferTableSchema), requiresUser, accessPermissions], transferTableHandler)

waiter.route('/orders')
    // get all table orders
    .get([requiresUser, accessPermissions], Order.getOne)

waiter.route('/orders/:tableId')
    // get order
    .get([requiresUser, accessPermissions], )
    // create new Order
    .post([validateRequest(OrderSchema.create), requiresUser, accessPermissions, checkTable, checkProducts], createOrderHandler)
    // adding product in Order
    .put([validateRequest(OrderSchema.update), requiresUser, accessPermissions, checkTable, checkProducts], addProductOrderHandler)

waiter.route('/orders/:tableId/:orderId')
    // update product in order
    .put([validateRequest(OrderSchema.update), requiresUser, accessPermissions], updateOrderHandler)
    // delete product in Order
    .delete([validateRequest(OrderSchema.delete), requiresUser, accessPermissions], deleteOrderHandler)


//get my branch
waiter.get('/mybranch', [requiresUser, accessPermissions], Controller.Branch.get)

// Çoklu dil dosyasını çek
waiter.get( '/lang', [requiresUser, accessPermissions, reportAdvancedResult], getLangHandler)


export default waiter;

import { Router } from "express";
import { ValidationError } from "yup";
import { getMyLocationHandler } from "../controller/app/branch.controller";
import { getCategoryByIdHandler, getCategoryHandler } from "../controller/app/category.controller";
import { getCheckHandler } from "../controller/app/check.controller";
import { getOptionsByHandler } from "../controller/app/options.controller";
import { addProductOrderHandler, createOrderHandler, getAllServices, getOrderHandler } from "../controller/app/order.controller";
import { pastOrderHander } from "../controller/app/pastOrder.controller";
import { payAppHandler } from "../controller/app/pay.controller";
import { getProductHandler, getBranchByIdHandler } from "../controller/app/product.controller";
import { getTablesByIdHandler } from "../controller/app/table.controller";
import { createUserHandler, updateUserHandler, updateUserPasswordHandler } from "../controller/app/user.controller";
import { createUserSessionHandler } from "../controller/session.controller";
import { accessPermissions, requiresUser, validateRequest } from "../middleware";
import { checkProducts, checkTable } from "../middleware/orders";
import paymentTotalCheck from "../middleware/pos/paymentTotalCheck";
import { getCheckSchema } from "../schema/check.schema";
import { addOrderSchema, createOrderSchema } from "../schema/order.schema";
import { createTablePaySchema } from "../schema/pay.schema";
import {
    createUserSchema,
    createUserSessionSchema,
    updateUserPasswordSchema,
    updateUserSchema
} from "../schema/user.schema";
import {createServiceSchema} from "../schema/service.schema";
import {createNewServices} from "../controller/app/service.controller"
import { getDiscountHandler } from "../controller/app/userdiscount.controller";
import reportAdvancedResult from "../middleware/reportAdvancedResult";
import { getLangHandler } from "../controller/app/lang.controller";
const app = Router();

// Sign Up
app.route("/signup")
    .post([validateRequest(createUserSchema)], createUserHandler);

// Sign In
app.route("/signin")
    .post([validateRequest(createUserSessionSchema)], createUserSessionHandler);

// Get All Category
app.route("/category/getallcategory/:branchId/:langType")
    .get(getCategoryHandler);

// Get All Options
app.route("/options/getalloptions/:branchId")
    .get(getOptionsByHandler);

// Get Category By Id
app.route("/category/getallproducts/:categoryId/:langType")
    .get(getCategoryByIdHandler);

app.route("/product/getallproducts/:branchId/:langType")
    .get(getBranchByIdHandler);

// Get Product
app.route("/product/:productId")
    .get(getProductHandler);


app.get("/orders/:tableId", requiresUser, getOrderHandler)

// Get branch services 
app.route('/services/:branchId')
    .get(getAllServices)
    .post([validateRequest(createServiceSchema), requiresUser], createNewServices)


// get table by id
app.route('/table/:tableId')
    .get(getTablesByIdHandler)
    
// get user discount
app.route('/userdiscount')
.get(getDiscountHandler)

// Çoklu dil dosyasını çek
app.get( '/lang/:branchId', getLangHandler)

app.route('/orders/:branchId/:tableId')
    // create new Order
    .post([validateRequest(createOrderSchema), requiresUser, checkTable, checkProducts], createOrderHandler)
    // adding product in Order
    .put([validateRequest(addOrderSchema), requiresUser, checkTable, checkProducts], addProductOrderHandler)

// Get App Check - Adisyon
app.route('/checks/:tableId')
    .get([validateRequest(getCheckSchema), requiresUser], getCheckHandler)

// App payHandler, Ödeme yap.
app.route('/checks/:tableId/pay')
    .post([validateRequest(createTablePaySchema), requiresUser, paymentTotalCheck], payAppHandler)

// Get my Past Order 
app.route('/myorders/mypastorders')
    .get([requiresUser], pastOrderHander)

// Scan QR Code 
app.route('/:branchId/:tableId')
    .get(getMyLocationHandler)

// User information update
app.route('/users/update')
    .put([validateRequest(updateUserSchema), requiresUser], updateUserHandler)

// User password update
app.route('/users/update/password')
    .put([validateRequest(updateUserPasswordSchema), requiresUser], updateUserPasswordHandler)




export default app;
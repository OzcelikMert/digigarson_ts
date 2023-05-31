import { Router } from "express";

/// Controller
import { getMyBranchHandler, getBranchByIdHandler, createQrCodeHandler, editWorkingHours, editMinOrders, addUserServices, updateUserServices, getirSigIn } from "../controller/manager/branch.controller";
import { createCategoryHandler, getCategoryHandler, getCategoryByIdHandler, updateCategoryHandler, deleteCategoryHandler } from "../controller/manager/category.controller";
import { createProductHandler, getProductHandler, getProductByIdHandler, updateProductHandler, deleteProductHandler, FavoritesAndOpportunity } from "../controller/manager/product.controller";
import { createSectionHandler, getSectionByIdHandler, getSectionHandler, updateSectionHandler, deleteSectionHandler } from "../controller/manager/section.controller";
import { createTableHandler, getTableByIdHandler, getTableHandler, updateTableHandler, deleteTableHandler, setTableSafeSales, createMultiTable, } from "../controller/manager/table.controller";
import { createOptionHandler, getOptionByIdHandler, getOptionHandler, updateOptionHandler, deleteOptionHandler, } from "../controller/manager/option.controller";
import { createManageSessionHandler } from "../controller/session.controller";
import { createExpenseHandler, deleteExpenseHandler, getExpenseByIdHandler, getExpenseHandler, updateExpenseHandler } from "../controller/manager/expense.controller";
import { createServeHandler, getServeHandler } from "../controller/pos/serve.controller";
import { deleteServeHandler, getServeByIdHandler, updateServeHandler } from "../controller/manager/serve.controller";
import { getIncomeHandler, getChecksCountHandler, getBusyRateHandler, getProfitHandler, getLastOrders, getTopSellingProductsHandler, getOrdersTrafficHandler } from "../controller/manager/dashboard.controller";
import { findallCheck, findCaseById, findCheckById, getallCases } from "../controller/manager/cases.controller";
import { createDiscountHandler, deleteDiscountHandler, getDiscountHandler, updateDiscountHandler } from "../controller/manager/userdiscount.controller";
import { CreateLangHandler, deleteLangHandler, getLangHandler } from "../controller/manager/lang.controller";
import { createBranchUserHandler, getBranchCrewUserHandler, getBranchCrewUsersHandler, setCrewMemberUserPermissions, deleteBranchCrewUserHandler, updateBranchCrewUserHandler } from "../controller/manager/user.controller";
import { createCustomerHandler, deleteCustomerHandler, getCustomerByIdHandler, getCustomerHandler, updateCustomerHandler } from "../controller/manager/customer.controller";
import { getProductBasedReportHandler, getCaseBasedReportHandler, getOrderTypeBasedReportHandler, getTableBasedReportHandler, getWorkerBasedReportHandler } from "../controller/manager/report.controller";

// Middleware
import { validateRequest, accessPermissions, advancedResults, requiresUser } from "../middleware";
import reportAdvancedResult from "../middleware/reportAdvancedResult";
import validateFavoriteAndOpportunity from "../middleware/product";
/// Schema
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "../schema/category.schema";
import { createProductSchema, updateProductSchema, deleteProductSchema } from "../schema/product.schema";
import { createQrcodeSchema } from "../schema/qrcode.schema";
import { createSectionSchema, deleteSectionSchema, updateSectionSchema } from "../schema/section.schema";
import { createTableSchema, updateTableSchema, deleteTableSchema, multiTableSchema } from "../schema/table.schema";
import { createOptionSchema, updateOptionSchema, deleteOptionSchema } from "../schema/option.schema";
import { createExpenseSchema, deleteExpenseSchema, updateExpenseSchema } from "../schema/expense.schema";

import {
    createCrewSchema,
    createUserSessionSchema,
    updateCrewSchema,
    deleteCrewSchema
} from "../schema/user.schema";
import { createBranchCustomerSchema, deleteBranchCustomerSchema, updateBranchCustomerSchema } from "../schema/branchcustomer.schema";
import { addUserServicesSchema, editMininumOrdersSchema, editWorkingSchema } from "../schema/branch.schema";
import { createServeSchema, deleteServeSchema, updateServeSchema } from "../schema/serve.schema";
import { crewMemberSetPermissionSchema } from "../schema/branchManageUser.schema";
import { createDiscountSchema } from "../schema/userdiscount.schema";
import { createLangSchema, deleteLangSchema, updateLangSchema } from "../schema/lang.schema";
import { createCourierHandler, deleteCourierHandler, getCourierByIdHandler, getCourierHandler, updateCourierHandler } from "../controller/manager/courier.controller";
import { createCourierSchema, deleteCourierSchema, updateCourierSchema } from "../schema/courier.schema";




const manager = Router();

// Sign In
manager.post("/signin", [validateRequest(createUserSessionSchema)], createManageSessionHandler);

// Sign In
manager.post("/getirsigin", getirSigIn);

// Get My Branch
manager.get('/branches', [requiresUser, accessPermissions], getMyBranchHandler);
manager.route('/branches/:branchId')
    .get([requiresUser, accessPermissions], getBranchByIdHandler);


// Category

manager.route('/category')
    // Create Category
    .post([validateRequest(createCategorySchema), requiresUser, accessPermissions], createCategoryHandler)
    .get([requiresUser, accessPermissions, advancedResults], getCategoryHandler)


manager.route('/category/:categoryId')
    // get Category by Id
    .get(getCategoryByIdHandler)
    .put([validateRequest(updateCategorySchema), requiresUser, accessPermissions], updateCategoryHandler)
    .delete([validateRequest(deleteCategorySchema), requiresUser, accessPermissions], deleteCategoryHandler)


// Product

manager.route('/product')
    // Create Product
    .post([validateRequest(createProductSchema), requiresUser, accessPermissions], createProductHandler)
    .get([requiresUser, accessPermissions, advancedResults], getProductHandler)


manager.route('/product/:productId')
    // get Product by Id
    .get(getProductByIdHandler)
    .put([validateRequest(updateProductSchema), requiresUser, accessPermissions], updateProductHandler)
    .delete([validateRequest(deleteProductSchema), requiresUser, accessPermissions], deleteProductHandler)



// Section 
manager.route('/section')
    // Create Section
    .post([validateRequest(createSectionSchema), requiresUser, accessPermissions], createSectionHandler)
    .get([requiresUser, accessPermissions, advancedResults], getSectionHandler)


manager.route('/section/:sectionId')
    // get Section by Id
    .get(getSectionByIdHandler)
    .put([validateRequest(updateSectionSchema), requiresUser, accessPermissions], updateSectionHandler)
    .delete([validateRequest(deleteSectionSchema), requiresUser, accessPermissions], deleteSectionHandler)

// Table
manager.route('/table')
    // Create Table
    .post([validateRequest(createTableSchema), requiresUser, accessPermissions], createTableHandler)
    .get([requiresUser, accessPermissions, advancedResults], getTableHandler)
manager.route('/createmultitable')
    .post([validateRequest(multiTableSchema), requiresUser, accessPermissions], createMultiTable)

manager.route('/table/:tableId')
    // get Table by Id
    .get(getTableByIdHandler)
    .put([validateRequest(updateTableSchema), requiresUser, accessPermissions], updateTableHandler)
    .delete([validateRequest(deleteTableSchema), requiresUser, accessPermissions], deleteTableHandler)

manager.route('/safesales/:tableId')
    .put([requiresUser, accessPermissions], setTableSafeSales)

// Options
manager.route('/options')
    // Create Option
    .post([validateRequest(createOptionSchema), requiresUser, accessPermissions], createOptionHandler)
    .get([requiresUser, accessPermissions, advancedResults], getOptionHandler)


manager.route('/options/:optionId')
    // get Option by Id
    .get(getOptionByIdHandler)
    .put([validateRequest(updateOptionSchema), requiresUser, accessPermissions], updateOptionHandler)
    .delete([validateRequest(deleteOptionSchema), requiresUser, accessPermissions], deleteOptionHandler)



//Expenses
manager.route('/expenses')
    // Create Expense
    .post([validateRequest(createExpenseSchema), requiresUser, accessPermissions], createExpenseHandler)
    .get([requiresUser, accessPermissions, advancedResults], getExpenseHandler)


manager.route('/expenses/:expenseId')
    // get Expense by Id
    .get(getExpenseByIdHandler)
    .put([validateRequest(updateExpenseSchema), requiresUser, accessPermissions], updateExpenseHandler)
    .delete([validateRequest(deleteExpenseSchema), requiresUser, accessPermissions], deleteExpenseHandler)

//Customers
manager.route('/branchcustomers')
    // Create Customer
    .post([validateRequest(createBranchCustomerSchema), requiresUser, accessPermissions], createCustomerHandler)
    .get([requiresUser, accessPermissions, advancedResults], getCustomerHandler)


manager.route('/branchcustomers/:customerId')
    // get Customer by Id
    .get(getCustomerByIdHandler)
    .put([validateRequest(updateBranchCustomerSchema), requiresUser, accessPermissions], updateCustomerHandler)
    .delete([validateRequest(deleteBranchCustomerSchema), requiresUser, accessPermissions], deleteCustomerHandler)


//Couriers
manager.route('/couriers')
    // Create Courier
    .post([validateRequest(createCourierSchema), requiresUser, accessPermissions], createCourierHandler)
    .get([requiresUser, accessPermissions, advancedResults], getCourierHandler)


manager.route('/couriers/:courierId')
    // get Courier by Id
    .get(getCourierByIdHandler)
    .put([validateRequest(updateCourierSchema), requiresUser, accessPermissions], updateCourierHandler)
    .delete([validateRequest(deleteCourierSchema), requiresUser, accessPermissions], deleteCourierHandler)


//Serves
manager.route('/serves')
    // Create Serve
    .post([validateRequest(createServeSchema), requiresUser, accessPermissions], createServeHandler)
    .get([requiresUser, accessPermissions, advancedResults], getServeHandler)

// Discount
manager.route("/userdiscount/:discountId")
    .post([validateRequest(createDiscountSchema), requiresUser, accessPermissions], createDiscountHandler)
    .get([requiresUser, accessPermissions], getDiscountHandler)
    .put([requiresUser, accessPermissions], updateDiscountHandler)
    .delete([requiresUser, accessPermissions], deleteDiscountHandler)

manager.route('/serves/:serveId')
    // get Serve by Id
    .get(getServeByIdHandler)
    .put([validateRequest(updateServeSchema), requiresUser, accessPermissions], updateServeHandler)
    .delete([validateRequest(deleteServeSchema), requiresUser, accessPermissions], deleteServeHandler)





// QR CODE

manager.post('/qrcode', [validateRequest(createQrcodeSchema), requiresUser, accessPermissions], createQrCodeHandler)


// Crew Member
manager.route('/members')
    .post([validateRequest(createCrewSchema), requiresUser, accessPermissions], createBranchUserHandler)
    .get([requiresUser, accessPermissions, advancedResults], getBranchCrewUsersHandler);

manager.route('/members/:crewMemberUserId').
    get([requiresUser, accessPermissions], getBranchCrewUserHandler)
    .delete([validateRequest(deleteCrewSchema), requiresUser, accessPermissions], deleteBranchCrewUserHandler)
    .put([validateRequest(updateCrewSchema), requiresUser, accessPermissions], updateBranchCrewUserHandler)


manager.post('/members/:crewMemberUserId/setpermissions', [validateRequest(crewMemberSetPermissionSchema), requiresUser], setCrewMemberUserPermissions)




//Cases
manager.get('/cases', [requiresUser], getallCases)
manager.get('/case/:caseId', [requiresUser], findCaseById)

//Checks
manager.get('/check/:checkId', [requiresUser], findCheckById)
manager.get('/checks/:caseId', [requiresUser], findallCheck)


/// Dashboard
manager.get('/dashboard/income', [requiresUser, accessPermissions], getIncomeHandler)
manager.get('/dashboard/checkscount', [requiresUser, accessPermissions], getChecksCountHandler)
manager.get('/dashboard/tablebusyrate', [requiresUser, accessPermissions], getBusyRateHandler)
manager.get('/dashboard/profit', [requiresUser, accessPermissions], getProfitHandler)
manager.get('/dashboard/lastorders', [requiresUser, accessPermissions], getLastOrders)
manager.get('/dashboard/topsellingproducts', [requiresUser, accessPermissions], getTopSellingProductsHandler)
manager.get('/dashboard/orderstraffic', [requiresUser, accessPermissions], getOrdersTrafficHandler)


/// Report
manager.get('/report/productbased', [requiresUser, accessPermissions, reportAdvancedResult], getProductBasedReportHandler);
manager.get('/report/casebased', [requiresUser, accessPermissions, reportAdvancedResult], getCaseBasedReportHandler);
manager.get('/report/tablebased', [requiresUser, accessPermissions, reportAdvancedResult], getTableBasedReportHandler);
manager.get('/report/workerbased', [requiresUser, accessPermissions, reportAdvancedResult], getWorkerBasedReportHandler);
manager.get('/report/ordertypebased', [requiresUser, accessPermissions, reportAdvancedResult], getOrderTypeBasedReportHandler);


// Edit Working Hours
manager.route('/branches/workinghours')
    .post([validateRequest(editWorkingSchema), requiresUser, accessPermissions], editWorkingHours)


// Edit Working Hours
manager.route('/branches/minimumorderrequirements')
    .post([validateRequest(editMininumOrdersSchema), requiresUser, accessPermissions], editMinOrders)


// Edit Working Hours
manager.route('/branches/userservices')
    .post([validateRequest(addUserServicesSchema), requiresUser, accessPermissions], addUserServices)

manager.put("/branches/userservices/:serviceId", [validateRequest(addUserServicesSchema), requiresUser, accessPermissions], updateUserServices)


manager.route('/lang')
    .post([requiresUser, accessPermissions], CreateLangHandler)
    .get([requiresUser, accessPermissions, reportAdvancedResult], getLangHandler)

manager.route('/lang/:h_type/:id')
    .delete([validateRequest(deleteLangSchema), requiresUser, accessPermissions], deleteLangHandler)
//.put([validateRequest(updateLangSchema), requiresUser, accessPermissions], updateLangHandler)


//Product Favorite And Opportunity
manager.put("/product/:operation/:productid/:action", [requiresUser, accessPermissions], FavoritesAndOpportunity)


export default manager;


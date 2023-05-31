import { Router } from "express";
import { createManageSessionHandler } from "../controller/session.controller";
import { accessPermissions, advancedResults, requiresUser, validateRequest } from "../middleware";
import { createUserSessionSchema } from "../schema/user.schema";
import { createInvoiceHandler, deleteInvoiceHandler, getInvoiceByIdHandler, getInvoiceHandler, updateInvoiceHandler } from "../controller/analysis/invoice.controller";
import { createInvoiceSchema, deleteInvoiceSchema, updateInvoiceSchema } from "../schema/invoice.schema";
import { createAnalysisCustomerHandler, deleteAnalysisCustomerHandler, getAnalysisCustomerByIdHandler, getAnalysisCustomerHandler, updateAnalysisCustomerHandler } from "../controller/analysis/analysis.customer.controller";
import { createAnalysisCustomerSchema, deleteAnalysisCustomerSchema, updateAnalysisCustomerSchema } from "../schema/analysis.customer.schema";
import { createWarehouseSchema, deleteWarehouseSchema, updateWarehouseSchema } from "../schema/warehouse.schema";
import { createWarehouseHandler, deleteWarehouseHandler, getWarehouseByIdHandler, getWarehouseHandler, updateWarehouseHandler } from "../controller/analysis/warehouse.controller";
import { createIngredientHandler, deleteIngredientHandler, getIngredientByIdHandler, getIngredientHandler, updateIngredientHandler } from "../controller/analysis/ingredient.controller";
import { createIngredientSchema, deleteIngredientSchema, updateIngredientSchema } from "../schema/ingredient.schema";
import { createSemiIngredientHandler, deleteSemiIngredientHandler, getSemiIngredientByIdHandler, getSemiIngredientHandler, updateSemiIngredientHandler } from "../controller/analysis/semiingredient.controller";
import { createSemiIngredientSchema, deleteSemiIngredientSchema, updateSemiIngredientSchema } from "../schema/semiingredient.schema";
import { createBankHandler, getBankHandler } from "../controller/analysis/bank.controller";
import { createAnalysisCaseHandler, getAnalysisCaseByIdHandler, getAnalysisCaseHandler, updateAnalysisCaseHandler } from "../controller/analysis/analysis.case.controller";
import { createBankSchema } from "../schema/bank.schema";
import { createAnalysisCaseSchema, deleteAnalysisCaseSchema, updateAnalysisCaseSchema } from "../schema/analysis.case.schema";
import { createCurrentHandler, deleteCurrentHandler, getCurrentByIdHandler, getCurrentHandler, updateCurrentHandler } from "../controller/analysis/current.controller";
import { createCurrentSchema, deleteCurrentSchema, updateCurrentSchema } from "../schema/current.schema";
import { createAnalysisMoneyInflowSchema } from "../schema/analysis.moneyinflow.schema";
import { createAnalysisMoneyInflowHandler, getAnalysisMoneyInflowHandler } from "../controller/analysis/analysis.moneyinflow.controller";
import { createAnalysisMoneyOutHandler, getAnalysisMoneyOutHandler } from "../controller/analysis/analysis.moneyout.controller";
import { createAnalysisMoneyOutSchema } from "../schema/analysis.moneyout.schema";
import { createAnalysisBillInflowHandler, getAnalysisBillInflowHandler } from "../controller/analysis/analysis.billinflow.controller";
import { createAnalysisBillInflowSchema } from "../schema/analysis.billinflow.schema";
import { createAnalysisBillOutHandler, getAnalysisBillOutHandler } from "../controller/analysis/analysis.billout.controller";
import { createAnalysisBillOutSchema } from "../schema/analysis.billout.schema";
import { createAnalysisCheckInflowHandler, getAnalysisCheckInflowHandler } from "../controller/analysis/analysis.checkinflow.controller";
import { createAnalysisCheckInflowSchema } from "../schema/analysis.checkinflow.schema";
import { createAnalysisCheckOutHandler, getAnalysisCheckOutHandler } from "../controller/analysis/analysis.checkout.controller";
import { createAnalysisCheckOutSchema } from "../schema/analysis.checkout.schema";
import { getProductHandler } from "../controller/analysis/analysis.product.controller";
import { createReceiptSchema, deleteReceiptSchema, getReceiptSchema, updateReceiptSchema } from "../schema/receipt.schema";
import { createReceiptHandler, deleteReceiptHandler, getReceiptByBranchHandler, getReceiptHandler, updateReceiptHandler } from "../controller/analysis/receipt.controller";

const accounting = Router();


// giriş yapmak için gereken yolları yönlendirmeleri yapar.
// Sign In
accounting.post("/signin", [validateRequest(createUserSessionSchema)], createManageSessionHandler);





//Invoices
accounting.route('/invoices')
    // Create Invoice
    .post([validateRequest(createInvoiceSchema), requiresUser, accessPermissions], createInvoiceHandler)
    .get([requiresUser, accessPermissions, advancedResults], getInvoiceHandler)


accounting.route('/invoices/:invoiceId')
    // get Invoice by Id
    .get(getInvoiceByIdHandler)
    .put([validateRequest(updateInvoiceSchema), requiresUser, accessPermissions], updateInvoiceHandler)
    .delete([validateRequest(deleteInvoiceSchema), requiresUser, accessPermissions], deleteInvoiceHandler)

//AnalysisCustomers
accounting.route('/analysiscustomers')
    // Create AnalysisCustomer
    .post([validateRequest(createAnalysisCustomerSchema), requiresUser, accessPermissions], createAnalysisCustomerHandler)
    .get([requiresUser, accessPermissions, advancedResults], getAnalysisCustomerHandler)


accounting.route('/analysiscustomers/:analysiscustomerId')
    // get AnalysisCustomer by Id
    .get(getAnalysisCustomerByIdHandler)
    .put([validateRequest(updateAnalysisCustomerSchema), requiresUser, accessPermissions], updateAnalysisCustomerHandler)
    .delete([validateRequest(deleteAnalysisCustomerSchema), requiresUser, accessPermissions], deleteAnalysisCustomerHandler)

//Warehouses
accounting.route('/warehouses')
    // Create Warehouse
    .post([validateRequest(createWarehouseSchema), requiresUser, accessPermissions], createWarehouseHandler)
    .get([requiresUser, accessPermissions, advancedResults], getWarehouseHandler)


accounting.route('/warehouses/:warehouseId')
    // get Warehouse by Id
    .get(getWarehouseByIdHandler)
    .put([validateRequest(updateWarehouseSchema), requiresUser, accessPermissions], updateWarehouseHandler)
    .delete([validateRequest(deleteWarehouseSchema), requiresUser, accessPermissions], deleteWarehouseHandler)


//Ingredients
accounting.route('/ingredients')
    // Create Ingredient
    .post([validateRequest(createIngredientSchema), requiresUser, accessPermissions], createIngredientHandler)
    .get([requiresUser, accessPermissions, advancedResults], getIngredientHandler)


accounting.route('/ingredients/:ingredientId')
    // get Ingredient by Id
    .get(getIngredientByIdHandler)
    .put([validateRequest(updateIngredientSchema), requiresUser, accessPermissions], updateIngredientHandler)
    .delete([validateRequest(deleteIngredientSchema), requiresUser, accessPermissions], deleteIngredientHandler)


// SemiIngredients
accounting.route('/semiingredients')
    // Create SemiIngredient
    .post([validateRequest(createSemiIngredientSchema), requiresUser, accessPermissions], createSemiIngredientHandler)
    .get([requiresUser, accessPermissions, advancedResults], getSemiIngredientHandler)


accounting.route('/semiingredients/:semiIngredientId')
    // get SemiIngredient by Id
    .get(getSemiIngredientByIdHandler)
    .put([validateRequest(updateSemiIngredientSchema), requiresUser, accessPermissions], updateSemiIngredientHandler)
    .delete([validateRequest(deleteSemiIngredientSchema), requiresUser, accessPermissions], deleteSemiIngredientHandler)

// Currents
accounting.route('/currents')
    // Create Current
    .post([validateRequest(createCurrentSchema), requiresUser, accessPermissions], createCurrentHandler)
    .get([requiresUser, accessPermissions, advancedResults], getCurrentHandler)


accounting.route('/currents/:currentId')
    // get Current by Id
    .get(getCurrentByIdHandler)
    .put([validateRequest(updateCurrentSchema), requiresUser, accessPermissions], updateCurrentHandler)
    .delete([validateRequest(deleteCurrentSchema), requiresUser, accessPermissions], deleteCurrentHandler)


// Analiz Kasa işlemleri
accounting.route('/analysiscases')
    .get([requiresUser, accessPermissions], getAnalysisCaseHandler)
    .post([validateRequest(createAnalysisCaseSchema), requiresUser, accessPermissions], createAnalysisCaseHandler);

accounting.route('/analysiscases/:analysiscaseId')
    // get AnalysisCase by Id
    .get(getAnalysisCaseByIdHandler)
    .put([validateRequest(updateAnalysisCaseSchema), requiresUser, accessPermissions], updateAnalysisCaseHandler)
//.delete([validateRequest(deleteAnalysisCaseSchema), requiresUser, accessPermissions], deleteAnalysisCaseHandler)
// Analiz Banka işlemleri
accounting.route('/banks')
    .get([requiresUser, accessPermissions], getBankHandler)
    .post([validateRequest(createBankSchema), requiresUser, accessPermissions], createBankHandler);

// Analiz Yeni Para Girişi işlemleri
accounting.route('/analysismoneyinflows')
    .get([requiresUser, accessPermissions], getAnalysisMoneyInflowHandler)
    .post([validateRequest(createAnalysisMoneyInflowSchema), requiresUser, accessPermissions], createAnalysisMoneyInflowHandler);

// Analiz Yeni Para Çıkışı işlemleri
accounting.route('/analysismoneyouts')
    .get([requiresUser, accessPermissions], getAnalysisMoneyOutHandler)
    .post([validateRequest(createAnalysisMoneyOutSchema), requiresUser, accessPermissions], createAnalysisMoneyOutHandler);

// Analiz Yeni senet Girişi işlemleri
accounting.route('/analysisbillinflows')
    .get([requiresUser, accessPermissions], getAnalysisBillInflowHandler)
    .post([validateRequest(createAnalysisBillInflowSchema), requiresUser, accessPermissions], createAnalysisBillInflowHandler);

// Analiz Yeni senet Çıkışı işlemleri
accounting.route('/analysisbillouts')
    .get([requiresUser, accessPermissions], getAnalysisBillOutHandler)
    .post([validateRequest(createAnalysisBillOutSchema), requiresUser, accessPermissions], createAnalysisBillOutHandler);

// Analiz Yeni çek Girişi işlemleri
accounting.route('/analysischeckinflows')
    .get([requiresUser, accessPermissions], getAnalysisCheckInflowHandler)
    .post([validateRequest(createAnalysisCheckInflowSchema), requiresUser, accessPermissions], createAnalysisCheckInflowHandler);

// Analiz Yeni çek Çıkışı işlemleri
accounting.route('/analysischeckouts')
    .get([requiresUser, accessPermissions], getAnalysisCheckOutHandler)
    .post([validateRequest(createAnalysisCheckOutSchema), requiresUser, accessPermissions], createAnalysisCheckOutHandler);

accounting.route('/products')
    .get([requiresUser, accessPermissions, advancedResults], getProductHandler)

// Reçete ekleme, güncelleme, çekme ve silme.
accounting.route('/receipt')
    .post([validateRequest(createReceiptSchema), requiresUser, accessPermissions], createReceiptHandler)
    .get([ requiresUser, accessPermissions], getReceiptByBranchHandler)

accounting.route('/receipt/:receiptId')
    .get([validateRequest(getReceiptSchema), requiresUser, accessPermissions], getReceiptHandler)
    .put([validateRequest(updateReceiptSchema), requiresUser, accessPermissions], updateReceiptHandler)
    .delete([validateRequest(deleteReceiptSchema), requiresUser, accessPermissions], deleteReceiptHandler)

export default accounting;


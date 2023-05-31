export default {
  'POST|/v1/superadmin/signin': 0, // adminLogin @PRIVATE
  'POST|/v1/superadmin/regionalmanager': 0, // createRegionalManager  @PRIVATE
  'GET|/v1/superadmin/branch': 0, // getAllBranches  @PRIVATE
  'POST|/v1/superadmin/branch': 0, // createBranch  @PRIVATE
  'GET|/v1/superadmin/branch/:branchId': 0, // getBranchById  @PRIVATE
  'PUT|/v1/superadmin/branch/:branchId': 0, //update branch @PRIVATE
  'POST|/v1/superadmin/branchpayment': 0, //create branch payment @PRIVATE,
  'GET|/v1/superadmin/branchpayment/:branchId': 0, //get branch payment @PRIVATE,
  'PUT|/v1/superadmin/branchpayment/:branchId': 0, //add branch payment @PRIVATE,
  'POST|/v1/superadmin/branchmanagers': 0, // createBranchManager  @PRIVATE
  'GET|/v1/superadmin/branchmanagers': 0, // getAllBranchManagers  @PRIVATE
  'GET|/v1/superadmin/branchmanagers/:id': 0, // get Branch Manager  @PRIVATE
  'GET|/v1/superadmin/admins/:id': 0, // get Admin User  @PRIVATE
  'GET|/v1/superadmin/users': 0, // get All Users  @PRIVATE
  'GET|/v1/superadmin/branchcrewusers': 0, // get All Branch Crew Users  @PRIVATE
  'GET|/v1/superadmin/branchcrewusers/:id': 0, // get branch crew user @PRIVATE
  'POST|/v1/superadmin/users': 0, // create User  @PRIVATE
  'GET|/v1/superadmin/admins': 0, // get Admin Users  @PRIVATE
  'POST|/v1/superadmin/admins': 0, // create Admin User  @PRIVATE
  'GET|/v1/superadmin/users/:userId': 0, // get User by Id  @PRIVATE
  'POST|/v1/superadmin/country': 0, // creatCountry  @PRIVATE
  'GET|/v1/superadmin/country': 0, // getAllCountry  @PRIVATE
  'DELETE|/v1/superadmin/country/:countryId': 0, // delete Country  @PRIVATE
  'POST|/v1/superadmin/city': 0, // createCity  @PRIVATE
  'DELETE|/v1/superadmin/city/:cityId': 0, // delete City  @PRIVATE
  'GET|/v1/superadmin/city': 0, // getAllCity  @PRIVATE
  'POST|/v1/superadmin/district': 0, // creatDistrict  @PRIVATE
  'GET|/v1/superadmin/district': 0, // getAllDistrict  @PRIVATE
  'DELETE|/v1/superadmin/district/:districtId': 0, // delete City  @PRIVATE
  'POST|/v1/superadmin/adduserpermmission': 0, //add user permission @PRIVATE
  'GET|/v1/superadmin/dashboard/basic': 0, //get admin dashboard @PRIVATE
  'PUT|/v1/superadmin/updatemanagebranch/:branchId': 0,
  'PUT|/v1/superadmin/branch/subbranch': 0,

  ///// BRANCH MANAGER
  'POST|/v1/manager/signin': 300, // managerLogin @PRIVATE
  'GET|/v1/manager/branches': 300, // get branches @PRIVATE 
  'GET|/v1/manager/branches/:branchId': 300, // get one branch @PRIVATE 
  'POST|/v1/manager/category': 300, // create Category  @PRIVATE 
  'POST|/v1/manager/expenses': 300, // create Expense  @PRIVATE 
  'POST|/v1/manager/branchcustomers': 300, // create Customer  @PRIVATE 
  'POST|/v1/manager/serves': 300, // create Serve  @PRIVATE 
  'GET|/v1/manager/category': 300, // Get All Category  @PRIVATE 
  'GET|/v1/manager/expenses': 300, // Get All Expense  @PRIVATE
  'GET|/v1/manager/branchcustomers': 300, // Get All Customer  @PRIVATE
  'GET|/v1/manager/serves': 300, // Get All Serve  @PRIVATE
  'POST|/v1/manager/product': 300, // create Product  @PRIVATE 
  'GET|/v1/manager/product': 300, // Get All Product  @PRIVATE 
  'POST|/v1/manager/section': 300, // create Section  @PRIVATE 
  'GET|/v1/manager/section': 300, // get All Section  @PRIVATE 
  'POST|/v1/manager/table': 300, // create Table  @PRIVATE 
  'GET|/v1/manager/table': 300, // get All Table  @PRIVATE 
  'PUT|/v1/manager/table/:tableId': 300, // update Table  @PRIVATE 
  'POST|/v1/manager/createmultitable':300, // Create Multi Table @PRIVATE
  'DELETE|/v1/manager/table/:tableId': 300, // delete Table  @PRIVATE
  'POST|/v1/manager/options': 300, // create Option  @PRIVATE 
  'GET|/v1/manager/options': 300, // get All Option  @PRIVATE 
  'PUT|/v1/manager/options/:optionId': 300, // update Option  @PRIVATE 
  'DELETE|/v1/manager/options/:optionId': 300, // delete Option  @PRIVATE 
  'PUT|/v1/manager/category/:categoryId': 300, // update Category  @PRIVATE 
  'PUT|/v1/manager/expenses/:expenseId': 300, // update Expense  @PRIVATE 
  'PUT|/v1/manager/branchcustomers/:customerId': 300, // update Customer  @PRIVATE 
  'PUT|/v1/manager/serves/:serveId': 300, // update Serve  @PRIVATE 
  'DELETE|/v1/manager/category/:categoryId': 300, // delete Category  @PRIVATE 
  'DELETE|/v1/manager/expenses/:expenseId': 300, // delete Expense  @PRIVATE 
  'DELETE|/v1/manager/branchcustomers/:customerId': 300, // delete Customer  @PRIVATE 
  'DELETE|/v1/manager/serves/:serveId': 300, // delete Serve  @PRIVATE 
  'PUT|/v1/manager/section/:sectionId': 300, // update Section  @PRIVATE 
  'DELETE|/v1/manager/section/:sectionId': 300, // delete Section  @PRIVATE 
  'PUT|/v1/manager/product/:productId': 300, // update Product  @PRIVATE 
  'DELETE|/v1/manager/product/:productId': 300, // delete Product  @PRIVATE 
  'PUT|/v1/manager/product/:operation/:productid/:action': 300,
  'POST|/v1/manager/qrcode': 300, // create QR Code  @PRIVATE 
  'POST|/v1/manager/members': 300, // create QR Code  @PRIVATE 
  'POST|/v1/manager/branches/workinghours': 300, // add working hour  @PRIVATE
  'POST|/v1/manager/branches/minimumorderrequirements': 300, // min order requirement  @PRIVATE
  'POST|/v1/manager/branches/userservices': 300, // add user services  @PRIVATE
  'PUT|/v1/manager/branches/userservices/:serviceId': 300, // update user services  @PRIVATE
  'GET|/v1/manager/members': 300, // Get Members  @PRIVATE 
  'GET|/v1/manager/members/:crewMemberUserId': 300, // Get Member by Id  @PRIVATE 
  'PUT|/v1/manager/members/:crewMemberUserId': 300, // Update Member by Id  @PRIVATE 
  'DELETE|/v1/manager/members/:crewMemberUserId': 300, // Delete Member by Id  @PRIVATE 
  'GET|/v1/manager/members/:crewMemberUserId/setpermissions': 300, // Get Member by Id  @PRIVATE 
  'GET|/v1/manager/dashboard/income': 300, // getProfitHandler  @PRIVATE 
  'GET|/v1/manager/dashboard/checkscount': 300, // get Checks Count @PRIVATE 
  'GET|/v1/manager/dashboard/tablebusyrate': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/dashboard/profit': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/dashboard/lastorders': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/dashboard/topsellingproducts': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/dashboard/orderstraffic': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/report/productbased': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/report/casebased': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/report/tablebased': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/report/workerbased': 300, // get BusyRate @PRIVATE 
  'GET|/v1/manager/report/ordertypebased': 300, // get BusyRate @PRIVATE 
  'PUT|/v1/manager/safesales/:tableId': 300, // SetSafeSales  @PRIVATE 
  'GET|/v1/manager/couriers': 300, // get Couriers  @PRIVATE
  'GET|/v1/manager/couriers/:courierId': 300, // get by Courier Id  @PRIVATE
  'POST|/v1/manager/couriers': 300, // create Courier  @PRIVATE
  'PUT|/v1/manager/couriers/:courierId': 300, // update Courier  @PRIVATE
  'DELETE|/v1/manager/couriers/:courierId': 300, // update Courier  @PRIVATE
  'GET|/v1/manager/cases': 300, //Get All case  @PRIVATE
  'GET|/v1/manager/case/:caseId': 300, //Get All case  @PRIVATE
  'GET|/v1/manager/check/:checkId': 300, //get CheckBy id @PRIVATE 
  'GET|/v1/manager/checks/:caseId': 300, //get CheckBy id @PRIVATE 
  'POST|/v1/manager/userdiscount/:discountId': 300, // create user discount
  'GET|/v1/manager/userdiscount/:discountId': 300, // get user discount
  'PUT|/v1/manager/userdiscount/:discountId': 300, // update user discount
  'DELETE|/v1/manager/userdiscount/:discountId': 300, //delete user discount
  'POST|/v1/manager/lang': 300, //create language locales
  'GET|/v1/manager/lang': 300, //get language locales
  'PUT|/v1/manager/lang/:h_type/:id': 300, //update language locales
  'DELETE|/v1/manager/lang/:h_type/:id': 300, //delete language locales
  //// WAITER
  'POST|/v1/waiter/signin': 400, // waiterLogin  @PRIVATE 
  'GET|/v1/waiter/mybranch': 400, // get my branch @PRIVATE
  'GET|/v1/waiter/category': 400, // getCategorySection  @PRIVATE
  'GET|/v1/waiter/category/:categoryId': 400, // getAllCategoryId  @PRIVATE
  'GET|/v1/waiter/product/:productId': 400, // getProductById  @PRIVATE
  'GET|/v1/waiter/sections': 400, // getAllSection  @PRIVATE
  'GET|/v1/waiter/sections/:sectionId': 400, // getAllTable  @PRIVATE
  'GET|/v1/waiter/tables/:tableId': 400, // getAllTableId  @PRIVATE
  'PUT|/v1/waiter/tables/:tableId': 400, // updateTableIsPrint  @PRIVATE
  'POST|/v1/waiter/tables/transfer': 405, // transfer Table  @PRIVATE
  'GET|/v1/waiter/orders/:tableId': 400, // get order  @PRIVATE
  'GET|/v1/waiter/orders': 400, // get all tables order  @PRIVATE
  'POST|/v1/waiter/orders/:tableId': 401, // create order  @PRIVATE
  'PUT|/v1/waiter/orders/:tableId': 402, // add product in order  @PRIVATE
  'PUT|/v1/waiter/orders/:tableId/:orderId': 403, // update order @PRIVATE
  'DELETE|/v1/waiter/orders/:tableId/:orderId': 404, // delete order @PRIVATE
  'GET|/v1/waiter/lang': 400, //get language locales
  /// POS
  'POST|/v1/pos/signin': 500, // posLogin  @PRIVATE
  'GET|/v1/pos/mybranch': 500, // get My Branch @PRIVATE 
  'GET|/v1/pos/sections': 500, // getAllSection  @PRIVATE
  'GET|/v1/pos/categories': 500, // get Categories  @PRIVATE
  'GET|/v1/pos/categories/:categoryId': 500, // get Products by Category Id  @
  'POST|/v1/pos/couriers': 500, // create Courier  @PRIVATE
  'GET|/v1/pos/couriers': 500, // get Couriers  @PRIVATE
  'GET|/v1/pos/couriers/:courierId': 500, // get by Courier Id  @PRIVATE
  'PUT|/v1/pos/couriers/:courierId': 500, // update Courier  @PRIVATE
  'DELETE|/v1/pos/couriers/:courierId': 500, // delete Courier  @PRIVATE
  'GET|/v1/pos/products/:productId': 500, // get Category by Id  @PRIVATE
  'GET|/v1/pos/sections/:sectionId': 500, // getAllTable  @PRIVATE
  'GET|/v1/pos/tables': 500, // get branch all table  @PRIVATE
  'GET|/v1/pos/tables/:tableId': 500, // getAllTableId  @PRIVATE
  'PUT|/v1/pos/tables/:tableId': 500, // updateTableIsPrint  @PRIVATE
  'POST|/v1/pos/tables/transfer': 508, // transfer Table  @PRIVATE
  'POST|/v1/pos/home-delivery': 500, //create home delivery order  @PRIVATE
  'GET|/v1/pos/home-delivery': 500, //get home delivery orders  @PRIVATE
  'POST|/v1/pos/home-delivery/:checkId/pay': 500, //home delivery order payment  @PRIVATE
  'PUT|/v1/pos/home-delivery/:checkId/isprint': 500, //isPrint Update @PRIVATE
  'GET|/v1/pos/checks/:tableId': 500, // get Check  @PRIVATE
  'GET|/v1/pos/checks/old/:checkId': 500, // get Old Check  @PRIVATE
  'PUT|/v1/pos/checks/old/:checkId': 500, // Update Old Check  @PRIVATE
  'POST|/v1/pos/checks/:tableId/pay': 507, // payment  @PRIVATE
  'PUT|/v1/pos/checks/:branchTickId/ticks': 500, // veresiye ödeme
  'GET|/v1/pos/cases': 500, // get My Case  @PRIVATE
  'POST|/v1/pos/cases': 500, // create Case  @PRIVATE
  'GET|/v1/pos/expenses': 500, // get My Expense  @PRIVATE
  'POST|/v1/pos/expenses': 500, // create Expense  @PRIVATE
  'DELETE|/v1/pos/expenses/:expenseId': 500, // delete Expense  @PRIVATE
  'GET|/v1/pos/branchcustomers': 500, // get My Customer  @PRIVATE
  'POST|/v1/pos/branchcustomers': 500, // create Customer  @PRIVATE
  'PUT|/v1/pos/branchcustomers/:customerId': 500, // update Customer  @PRIVATE 


  'GET|/v1/pos/ingredients': 500, // get My Ingredient  @PRIVATE
  'POST|/v1/pos/ingredients': 500, // create Ingredient @PRIVATE
  'GET|/v1/pos/serves': 500, // get My Serve  @PRIVATE
  'POST|/v1/pos/serves': 500, // create Serve @PRIVATE
  'PUT|/v1/pos/cases/close': 500, // close Case  @PRIVATE
  'GET|/v1/pos/orders/:tableId': 500, // get order  @PRIVATE
  'GET|/v1/pos/orders': 500, // get all tables order  @PRIVATE
  'POST|/v1/pos/orders/:tableId': 501, // create order  @PRIVATE
  'PUT|/v1/pos/orders/:tableId': 502, // add product in order  @PRIVATE
  'PUT|/v1/pos/orders/:tableId/:orderId': 503, // update order @PRIVATE
  'DELETE|/v1/pos/orders/:tableId/:orderId': 504, // delete order @PRIVATE
  'POST|/v1/pos/orders/:tableId/discount': 505, // apply table discount @PRIVATE
  'POST|/v1/pos/orders/:tableId/cover': 506, // apply table discount @PRIVATE
  'GET|/v1/pos/report/z-report/:caseId': 500, // get case z-report @PRIVATE
  'PUT|/v1/pos/isprint/:tableId': 500, //isPrint Update @PRIVATE
  'PUT|/v1/pos/order/move/:tableId/:MtableId': 506, //Move Products @PRIVATE
  'GET|/v1/pos/services': 500, // Get All services
  'PUT|/v1/pos/services/:serviceId': 500, // Get All services
  'POST|/v1/pos/ticks': 500, //Create branch ticks @PRIVATE
  'GET|/v1/pos/ticks': 500,//Get branchTick @PRIVATE
  'GET|/v1/pos/ticks/:tickCustomerId': 500,//Get branchTick @PRIVATE
  'PUT|/v1/pos/:tickId/ticks': 500, //tick add cost @PRIVATE
  'GET|/v1/pos/lang': 500, // Get Lang Locales
  'POST|/v1/pos/callerId': 500, // Post caller
  'GET|/v1/pos/callerId': 500, // Get callers
  'GET|/v1/pos/callerId/:callerId': 500, // Get Caller by id
  'PUT|/v1/pos/callerId/:callerId': 500, // Update Caller
  'DELETE|/v1/pos/callerId/:callerId': 500, // Delete Caller

  /// ACCOUNTING
  'POST|/v1/accounting/signin': 600, // accounting signin @PRIVATE 
  'POST|/v1/accounting/analysiscustomers': 600, // create AnalysisCustomer  @PRIVATE 
  'GET|/v1/accounting/analysiscustomers': 600, // Get All AnalysisCustomer   @PRIVATE 
  'PUT|/v1/accounting/analysiscustomers/:analysiscustomerId': 600, // update AnalysisCustomer   @PRIVATE 
  'DELETE|/v1/accounting/analysiscustomers/:analysiscustomerId': 600, // delete AnalysisCustomer  @PRIVATE 
  'POST|/v1/accounting/currents': 600, // create Current  @PRIVATE 
  'GET|/v1/accounting/currents': 600, // Get All Current   @PRIVATE 
  'PUT|/v1/accounting/currents/:currentId': 600, // update Current   @PRIVATE 
  'DELETE|/v1/accounting/currents/:currentId': 600, // delete Current @PRIVATE 
  'POST|/v1/accounting/analysiscases': 600, // create AnalysisCase @PRIVATE 
  'GET|/v1/accounting/analysiscases': 600, // Get All AnalysisCase  @PRIVATE 
  'PUT|/v1/accounting/analysiscases/:analysiscaseId': 600, // update AnalysisCase  @PRIVATE 
  'DELETE|/v1/accounting/analysiscases/:analysiscaseId': 600, // delete AnalysisCase  @PRIVATE 
  'POST|/v1/accounting/invoices': 600, // create Invoice  @PRIVATE 
  'GET|/v1/accounting/invoices': 600, // Get All nvoice  @PRIVATE 
  'PUT|/v1/accounting/invoices/:invoiceId': 600, // update Invoice  @PRIVATE 
  'DELETE|/v1/accounting/invoices/:invoiceId': 600, // delete Invoice  @PRIVATE 
  'POST|/v1/accounting/warehouses': 600, // create Invoice  @PRIVATE 
  'GET|/v1/accounting/warehouses': 600, // Get All nvoice  @PRIVATE 
  'PUT|/v1/accounting/warehouses/:warehouseId': 600, // update Invoice  @PRIVATE 
  'DELETE|/v1/accounting/warehouses/:warehouseId': 600, // delete Invoice  @PRIVATE 
  'POST|/v1/accounting/ingredients': 600, // create Ingredient  @PRIVATE 
  'GET|/v1/accounting/ingredients': 600, // Get All Ingredient  @PRIVATE
  'PUT|/v1/accounting/ingredients/:ingredientId': 600, // update Ingredient  @PRIVATE 
  'DELETE|/v1/accounting/ingredients/:ingredientId': 600, // delete Ingredient  @PRIVATE 
  'POST|/v1/accounting/semiingredients': 600, // create SemiIngredient  @PRIVATE 
  'GET|/v1/accounting/semiingredients': 600, // Get All SemiIngredient  @PRIVATE
  'PUT|/v1/accounting/semiingredients/:semiIngredientId': 600, // update SemiIngredient  @PRIVATE 
  'DELETE|/v1/accounting/semiingredients/:semiIngredientId': 600, // delete SemiIngredient  @PRIVATE
  'POST|/v1/accounting/banks': 600, // create Bank  @PRIVATE 
  'GET|/v1/accounting/banks': 600, // Get All Banks  @PRIVATE
  'POST|/v1/accounting/analysismoneyinflows': 600, // create Analysis Money Inflow  @PRIVATE 
  'GET|/v1/accounting/analysismoneyinflows': 600, // Get All Analysis Money İnflows  @PRIVATE
  'POST|/v1/accounting/analysismoneyouts': 600, // create Analysis Money Out  @PRIVATE 
  'GET|/v1/accounting/analysismoneyouts': 600, // Get All Analysis Money Outs  @PRIVATE
  'POST|/v1/accounting/analysisbillinflows': 600, // create Analysis Bill Inflow  @PRIVATE 
  'GET|/v1/accounting/analysisbillinflows': 600, // Get All Analysis Bill İnflows  @PRIVATE
  'POST|/v1/accounting/analysisbillouts': 600, // create Analysis Bill Out  @PRIVATE 
  'GET|/v1/accounting/analysisbillouts': 600, // Get All Analysis Bill Outs  @PRIVATE
  'POST|/v1/accounting/analysischeckinflows': 600, // create Analysis Check Inflow  @PRIVATE 
  'GET|/v1/accounting/analysischeckinflows': 600, // Get All Analysis Check İnflows  @PRIVATE
  'POST|/v1/accounting/analysischeckouts': 600, // create Analysis Check Out  @PRIVATE 
  'GET|/v1/accounting/analysischeckouts': 600, // Get All Analysis Check Outs  @PRIVATE
  'GET|/v1/accounting/products': 600, // Get All Product  @PRIVATE
  'POST|/v1/accounting/receipt': 600, // Create receipt
  'GET|/v1/accounting/receipt': 600, // Get Receipt By Branch receipt
  'GET|/v1/accounting/receipt/:receiptId': 600, // Get receipt
  'PUT|/v1/accounting/receipt/:receiptId': 600, // Update receipt
  'DELETE|/v1/accounting/receipt/:receiptId': 600, // Delete receipt
  
  /// KITCHEN
  'POST|/v1/kitchen/signin': 700, // kitchen signin @PRIVATE 

  /// APP
  'POST|/v1/app/:branchId/:tableId/order': 1000, //create order @public
  'PUT|/v1/app/:branchId/:tableId/order': 1000, //addind product in order @public
  'GET|/v1/app/checks/:tableId': 1000, // get App Check  @PRIVATE
  'POST|/v1/app/checks/:tableId/pay': 1000, // App payment  @PRIVATE
  'GET|/v1/app/myorders/mypastorders': 1000, // Get My Past Order
  'GET|/v1/app/userdiscount': 1000, // Get user Discount
  'GET|/v1/app/lang/:branchId': 1000 // Get Language Locales
};

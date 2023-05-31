import { Router } from "express";

import {
    createUserHandler,
    getAllUsersHandler,
    getAllBranchManagersHandler,
    getUserHandler,
    addPermission,
    getBranchManageHandler,
    getAllAdminUsersHandler,
    getAdminUserHandler,
    getAllBranchCrewUsersHandler,
    getBranchCrewUserHandler
} from "../controller/superadmin/user.controller";

import {
    createUserSessionSchema,
    createUserOnAdminSchema,
} from "../schema/user.schema";


import { createBranchSchema, updateBranchSchema } from "../schema/branch.schema";
import { validateRequest, requiresUser, accessPermissions } from "../middleware";
import { createAdminSessionHandler } from "../controller/session.controller";
import {  addBranchPaymentHandler, createBranchHandler, createBranchPaymentHandler, getAllBranchHandler, getBranchHandler, getBranchPaymentHandler, updateBranchHandler, updateManagebranch, updateSubBranch} from "../controller/superadmin/branch.controller";
import { createCountrySchema } from "../schema/country.schema";
import { createCountryHandler, getAllCountryHandler, deleteCountryHandler } from "../controller/superadmin/country.controller";
import { createCitySchema } from "../schema/city.schema";
import { createCityHandler, getAllCityHandler, deleteCityHandler } from "../controller/superadmin/city.controller";
import { createDistrictHandler, getAllDistrictHandler, deleteDistrictHandler } from "../controller/superadmin/district.controller";
import { createDistrictSchema } from "../schema/district.schema";
import advancedResults from "../middleware/advancedResults";
import { createBranchPaymentSchema, updateBranchPaymentSchema } from "../schema/branchPayments.schema";
import { getDashboardShortHandler } from "../controller/superadmin/dashboard.controller";

const superadmin = Router();

// Sign In
superadmin.post("/signin", [validateRequest(createUserSessionSchema)], createAdminSessionHandler);

// Users
superadmin.route("/users")
    .get([requiresUser, accessPermissions, advancedResults], getAllUsersHandler)
superadmin.route('/users/:userId')
    // Get User by Id
    .get([requiresUser, accessPermissions], getUserHandler)

// Branchmanagers
superadmin.route("/branchmanagers")
    .post([validateRequest(createUserOnAdminSchema), requiresUser, accessPermissions], createUserHandler)
    // Get All Users
    .get([requiresUser, accessPermissions, advancedResults], getAllBranchManagersHandler)

superadmin.route("/branch/subbranch")
.put([requiresUser, accessPermissions], updateSubBranch)

superadmin.route('/branchmanagers/:id')
    // Get User by Id
    .get([requiresUser, accessPermissions], getBranchManageHandler)

// Admins
superadmin.route("/admins")
    .post([validateRequest(createUserOnAdminSchema), requiresUser, accessPermissions], createUserHandler)
    // Get All Users
    .get([requiresUser, accessPermissions, advancedResults], getAllAdminUsersHandler)

superadmin.route('/admins/:id')
    // Get User by Id
    .get([requiresUser, accessPermissions], getAdminUserHandler)





// Branch Crew Users
superadmin.route("/branchcrewusers")
    .get([requiresUser, accessPermissions, advancedResults], getAllBranchCrewUsersHandler)

superadmin.route('/branchcrewusers/:id')
    // Get User by Id
    .get([requiresUser, accessPermissions], getBranchCrewUserHandler)



// Branch

superadmin.route("/branch")
    // Create Branch
    .post([validateRequest(createBranchSchema), requiresUser, accessPermissions], createBranchHandler)
    // Get Branches
    .get([requiresUser, accessPermissions, advancedResults], getAllBranchHandler)


superadmin.route("/branch/:branchId")
    // Get Branches
    .get([requiresUser, accessPermissions], getBranchHandler)
    // Update Branch
    .put([validateRequest(updateBranchSchema), requiresUser, accessPermissions], updateBranchHandler)


superadmin.route("/branchpayment")
    // Create Branch Payment
    .post([validateRequest(createBranchPaymentSchema), requiresUser, accessPermissions], createBranchPaymentHandler)


superadmin.route("/branchpayment/:branchId")
    // Get Branch Payment
    .get([requiresUser, accessPermissions], getBranchPaymentHandler)
    // Add Branch Payment
    .put([validateRequest(updateBranchPaymentSchema), requiresUser, accessPermissions], addBranchPaymentHandler)





// Country
superadmin.route("/country")
    // Create Country
    .post([validateRequest(createCountrySchema), requiresUser, accessPermissions], createCountryHandler)
    // Get Countrys
    .get([requiresUser, accessPermissions, advancedResults], getAllCountryHandler)


superadmin.route("/country/:countryId")
    // Delete Country 
    .delete([requiresUser, accessPermissions], deleteCountryHandler)


// City
superadmin.route("/city")
    // Create City
    .post([validateRequest(createCitySchema), requiresUser, accessPermissions], createCityHandler)
    // Get Citys
    .get([requiresUser, accessPermissions, advancedResults], getAllCityHandler)

superadmin.route("/city/:cityId")

    // Delete City 
    .delete([requiresUser, accessPermissions], deleteCityHandler)

// District
superadmin.route("/district")
    // Create District
    .post([validateRequest(createDistrictSchema), requiresUser, accessPermissions], createDistrictHandler)
    // Get District
    .get([requiresUser, accessPermissions, advancedResults], getAllDistrictHandler)

superadmin.route("/district/:districtId")
    // Delete District 
    .delete([requiresUser, accessPermissions], deleteDistrictHandler)

superadmin.route("/adduserpermmission")
    // Add user permission
    .post([requiresUser, accessPermissions], addPermission)

superadmin.get("/dashboard/basic", [requiresUser, accessPermissions], getDashboardShortHandler)

superadmin.put("/updatemanagebranch/:branchId",[requiresUser, accessPermissions], updateManagebranch );


export default superadmin;
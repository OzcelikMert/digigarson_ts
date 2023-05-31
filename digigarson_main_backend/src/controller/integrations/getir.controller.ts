import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import Getir from "../../service/getir.service";
import {findBranch, getirSetToken} from "../../service/branch.service";
import getirRoute from "../../statics/getirRoute";
import config from '../../../config/default';
const restaurant = {
   //GET Funcitons
   zones: async function (req: Request, res: Response){
      let token = get(req, "body.token")
       let query:any = await Getir.Get(token, getirRoute.zones.path)
       res.send(query)
   },
   restaurants: async function (req: Request, res: Response){
      let token = get(req, "body.token")
      let query:any = await Getir.Get(token, getirRoute.restaurants.path)
      res.send(query)
   },
   restaurantOptionsAndProduct: async function (req: Request, res: Response){
      let token = get(req, "body.token")
      let query:any = await Getir.Get(token, getirRoute.optionProducts.path)
      res.send(query)
   },
   //restaurant menu
   menu: async function (req: Request, res: Response){
      let token = get(req, "body.token")
      let query:any = await Getir.Get(token, getirRoute.menu.path)
      res.send(query)
   },
   //restaurant menu
   restaurantPaymentMethod: function (req: Request, res: Response){

   },
   courier: function (req: Request, res: Response){

   },
   paymentMethods: function(req: Request, res: Response){

   },
   //Put Functions
   status: function(req: Request, res: Response){

   },
   averagePrepationtime: function(req: Request, res: Response){

   },
   deliveryDuration: function(req: Request, res: Response){

   },
   workingHours: function(req: Request, res: Response){

   }
}

const foodOrders = {
   //:path /food-orders
   //POST Functions
   report: function (req: Request, res: Response){
   // @desc    Get restaurant food orders report
   // @route   GET :path/report
   
   },
   getByfoodOrderId: function(req: Request, res: Response){
   // @desc    get food order
   // @route   GET path/{foodOrderId}
   // @access PRIVATE

   },
   activeFoodOrders: function(req: Request, res: Response){
   // @desc    get active food order
   // @route   GET path/active
   // @access  PRIVATE

   }
}
export{
   restaurant, foodOrders
}
import {
    DocumentDefinition,
    FilterQuery,
    ObjectId,
  } from "mongoose";
  import service, { ServiceDocument } from "../model/services.model";
  
  
  
  //Servis ekler.
  export function createservice(input: DocumentDefinition<ServiceDocument>) {
    try {
      return service.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  
  //Servisleri bulur.
  export function findservices(branch: ObjectId) {
    return service.find({branch:branch, isConfirm: false});
  }

  export function updateServiceConfrim(ServiceId: string, confirmedUser: any){
      return service.updateOne({_id: ServiceId}, {
          '$set': {
              isConfirm: true,
              confirmedUser: confirmedUser
          }
      })
  }

  //bulur ve değişiklik yapar.
  export function findAndUpdate(query: FilterQuery<ServiceDocument>) {
    return service.findOneAndUpdate(query, {  });
  }  
  
  
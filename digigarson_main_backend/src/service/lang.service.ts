import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import Lang, { LangDocument } from "../model/lang.model";
import { get , set} from "lodash";

export function createLang(input: DocumentDefinition<LangDocument>) {
  return Lang.create(input);
};

export function findLang(query: FilterQuery<LangDocument>) {
  return Lang.findOne(query);
};

export function updateLang(
  query: FilterQuery<LangDocument>,
  update: UpdateQuery<LangDocument>
) {
  return Lang.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });

};

export function updatelangLocale(
  branchId: any,
  itemId: any,
  value: any,
  ){

  return Lang.updateOne(
    { branch: branchId},
    { 
    "$set": {[`items.$[outer].locale`]: value } 
    },
    { 
  "arrayFilters": [{ "outer.itemId": itemId }]
  },
  )
}

export function deletelangLocale(query: FilterQuery<LangDocument>, itemId: any){
  return Lang.findOneAndUpdate(query,
      { 
      "$pull": {[`items.$[outer].locale`]: [] } 
      },
      { 
    "arrayFilters": [{ "outer.itemId": itemId }]
    }
  )
}

export function findOneInLang(query: FilterQuery<LangDocument>) {
  return Lang.findOne(query);
};

export function addToLang(branchId: any, input: any) {
  return Lang.updateOne(
    { branch: branchId },
    input 
  )
};

export function deleteById(query: any) {
return Lang.deleteOne(query)
};



export async function filterlang(items: any, lang: any, type: number, langType: string){
    let newItems: any[] = [];
    // getItem Type
    function filterType(element: any, index: any, array: any){  
       return (element.type == type);  
      }
    function filterLang(element: any, index: any, array: any){  
       return (element.lang == langType);   
      }
    // Driver code

 var value = await lang.items.filter(filterType);

 await items.map(async (itemsData: any )=> {
    let lang: any = await value.find((element: any) => element.itemId == itemsData._id)
    if(lang){
      var newItemsData: any = itemsData;
      var newLang = await lang.locale.filter(filterLang)
      if(newLang.length !== 0){
      set(newItemsData, 'title', newLang[0].title);
      (type == 1) ? set(newItemsData, 'description', newLang[0].description): "";
    await  newItems.push(newItemsData);
   }
  else{
     await newItems.push(itemsData);
      }
  }
  else{
    await newItems.push(itemsData);
  }
  });

  return newItems;
}
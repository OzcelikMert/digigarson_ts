import { GlobalBranchDataDocument } from "modules/config/global/branch";
import { GlobalBranchDataSetDocument } from "modules/config/global/branch";

let GlobalBranchData: GlobalBranchDataDocument = {
  categories: [
    {
      _id: "",
      is_sub_category: false,
      image: "",
      title: "",
      branch: "",
      slug: "",
      parent_category: "",
    },
  ],
  products: [
    {
      _id: "",
      active_list: [0],
      options: [
        {
          option_id: "",
          is_forced_choice: false,
        },
      ],
      prices: [
        {
          order_type: [0],
          _id: "",
          price_name: "",
          currency: "",
          vat_rate: 0,
          amount: 0,
          price: 0,
          createdAt: "",
          updatedAt: "",
        },
      ],
      end_time: "",
      start_time: "",
      image: "",
      branch: "",
      category: "",
      description: "",
      title: "",
      sale_type: 0,
      stock_code: "",
      favorite: false,
      opportunity: false,
    },
  ],
  sections: [
    {
      _id: "",
      title: "",
    },
  ],
  tables: [],
  options: [
    {
      _id: "",
      items: [
        {
          price: 0,
          amount: 0,
          _id: "",
          item_name: "",
        },
      ],
      state: 0,
      choose_limit: 0,
      type: 0,
      special_name: "",
      name: "",
      branch: "",
    },
  ],
};

function setGlobalBranchData(data: GlobalBranchDataSetDocument) {
  Object.assign(GlobalBranchData, data);
}

function getGlobalBranchData(): GlobalBranchDataDocument {
  return GlobalBranchData;
}

export { setGlobalBranchData, getGlobalBranchData };

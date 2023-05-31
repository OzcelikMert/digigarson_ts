import Settings from "../settings/settings";
import PrintKitchen from "./printKitchen";

export default class KitchenByGroup {
  static printKitchenByGroup(check: any) {
    const Groups = Settings.Groups.map((group) => ({
      ...group,
      products: check.orders.filter((order: any) =>
        group.categories.includes(order.category)
      ),
      firstProducts: check.firstOrders?.filter((order: any) =>
          group.categories.includes(order.category)
      ),
    }));
    Groups.length
      ? Groups.forEach(
          (data) =>
            data.products.length &&
            PrintKitchen.printKitchen(
              {
                ...check,
                orders: data.products,
                firstOrders: data.firstProducts,
              },
              data.printer
            )
        )
      : PrintKitchen.printKitchen(check);
  }
}

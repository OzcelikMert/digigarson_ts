import Services from "../../../../services/index";
import Swal from "sweetalert2";
import Printer from "../../printers/index";
import GlobalStates from "config/global/states";

const printReport = (type: string, t: any) => {
  if (GlobalStates.MyCase[0].balance.length > 0) {
    let response = Services.Get.case(GlobalStates.MyCase[0]?._id);
    if (response.status) {
      Printer.Report.printReport(response.data, type);
    }
    return;
  }
  Swal.fire({
    icon: "info",
    title: t("not-report"),
  });
};

export default printReport;

import Swal from "sweetalert2";

const inactiveButton = (t: any) => {
  Swal.fire({
    title: t("disable-feature"),
    icon: "error",
  });
};

export default inactiveButton;

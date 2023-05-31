import GlobalStates from "config/global/states";

const checkForOpenTable = () => {
  let retunValue = false;
  GlobalStates.AllTables?.forEach((table: any) => {
    if (table.busy) {
      retunValue = true;
      return;
    }
  });
  return retunValue;
};

export default checkForOpenTable;

export default class DateFormat {
  static formatDate(date: Date) {
    const y = "0" + date.getHours();
    const z = "0" + date.getMinutes();
    const s = "0" + date.getSeconds();
    const h = "0" + date.getDate();
    const ano = date.getFullYear().toString().substr(-2);
    const ms = date.getMonth();

    return (
      y.substr(-2) +
      ":" +
      z.substr(-2) +
      ":" +
      s.substr(-2) +
      " -  " +
      h.substr(-2) +
      "/" +
      ms +
      "/" +
      ano
    );
  }
}

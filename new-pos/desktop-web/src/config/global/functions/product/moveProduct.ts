const moveProduct = (router: any, products:any[], selectedProductId:string[], tableid: any) => {
  console.log(router)
  let productsToBeMoved = products.filter(
    (product) => selectedProductId?.includes(product.uid)
  );
  console.log("productsToBeMoved",productsToBeMoved)  
  const data = productsToBeMoved.map((product: any) => product.product);
  console.log(data)
  
  window.localStorage.setItem("productsToBeMoved", JSON.stringify(data));
  router.navigate("/moveproduct/" + tableid, {
    replace: true,
  });
};

export default moveProduct;

import fetch from 'node-fetch';

// @ts-ignore
import config from '../../config/default';

const Getir = {
  Post: async function(headers: any, body:any, route: string) {
    
    let res: any[]= [];
    const response = await fetch(`${config.getirApiUrl}${route}`, {headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },method: 'POST', body:JSON.stringify(body)});
    const data = await response.json();

    return data;
    },
  Get: function(){

    },  
  Put: function(){

    },
};
export default Getir;
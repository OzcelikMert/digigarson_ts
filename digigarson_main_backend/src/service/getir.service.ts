import fetch from 'node-fetch';

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
  Get: async function(token: any, route: string,body?:any,) {
    let res: any[]= [];
    const response = await fetch(`${config.getirApiUrl}${route}`, {headers: {
      "token": token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      },
        method: 'GET',
      });
    const data = await response.json();
    return data;
    },  
  Put:async function(headers: any, body:any, route: string) {
    
    let res: any[]= [];
    const response = await fetch(`${config.getirApiUrl}${route}`, {headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },method: 'POST', body:JSON.stringify(body)});
    const data = await response.json();

    return data;
    },
};
export default Getir;
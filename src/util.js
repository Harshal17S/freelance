import axios from "axios";
let domain = window.location.href.indexOf('localhost') > 0 ?'https://menuapi.kickorder.net':window.location.origin;
//let configUrl="https://menuapi.xmedia-solutions.net/api/configs";

export const getParameterByName = (e,t=window.location.href)=>{
    e=e.replace(/[[\]]/g,"$&");
    var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);
    return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null
  }

  const p = new Promise((response, rej) => {
    let config =localStorage.getItem("configs") ?JSON.parse(localStorage.getItem("configs")):null;
    if(!config){
     axios.get(`https://menuapi.${domain.split(".")[1]}.${domain.split(".")[2]}/api/configs`)
    //axios.get(configUrl)
     .then(res=>{
          console.log(res.data[0]);
          let data = res&&res.data.length?res.data[0]:null;
          //data.baseURL= window.location.href.indexOf('localhost') > 0? 'https://inventory-service-gthb.onrender.com': data.baseURL;
        localStorage.setItem("configs",JSON.stringify(data));
           config = data;
          response(config);
      });
  }else{
    response(config);
  }
  });
  
  //getConfigs().then((res)=> console.log(res));
  
  
export default await p;
export const merchantCode=getParameterByName('merchantCode');

   
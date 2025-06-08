
// ?serve_url=https://apps.digitallive24.com&orderId=6465f467efcb0e1354ea64a2




const getParameterByName = (e, t = window.location.href) => {
    e = e.replace(/[\[\]]/g, "\\$&"); var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
    return n ? n[2] ? decodeURIComponent(n[2].replace(/\+/g, " ")) : "" : null;
}
const baseURL = getParameterByName('serve_url');
const userId = getParameterByName("userid");
const sok_url = getParameterByName("sok_url");
const orderId = getParameterByName("orderId");
const currency = getParameterByName("currency");
const restaurant = getParameterByName("restaurant");
const cgst = getParameterByName("cgst");
const nssi = getParameterByName("nssi");
const invoice = getParameterByName("invoice");

let curSymbol = currency.toLocaleUpperCase() === "INR" ? "₹" : "$";
console.log(sok_url);

document.getElementById("sok").href=sok_url.replace(/~/g,"&");
let orderDetails = [];
console.log(baseURL + '/api/orders/' + orderId);
const data = axios.get(baseURL + '/api/orders/' + orderId)
    .then((res) => {
        orderDetails = res.data;
        apiData();
    }
    );

    
function apiData() {
    console.log(orderDetails);


    let orderHtml = document.getElementById('orderDetails');
    setTimeout(() => changeStatus(orderDetails), 1)
    return (
        orderHtml.innerHTML = `
        <h2 style="text-align: center;">Token #${orderDetails.number}</h2>
                    <div style='display:flex; justify-content:center; align-items:center;'>
                     <span id="status_chip">preparing</span>
                     </div>
        <p style="text-align: center; font-size:16px; font-weight:bold;">YOU ORDER SUMMARY </p>
        <p style="text-align: center;">------------------------------------------------</p>
        <div style="text-align: center; font-weight:bold; line-height:8px;"> 
            <p>Restaurant Name: ${restaurant}</p>
            <p>CGST: ${cgst}</p>
            <p style='display:none;'>NSSI: ${nssi}</p>
        </div>
        <div  style='display:flex; justify-content:center; align-items:center;font-size:18px; margin:15px;' ><span>Invoice#:${invoice} &nbsp;&nbsp;Date:<span style='font-size:15px;'>${moment(orderDetails.createdAt).format("Do MMMM YYYY h:mm a")}</span></span></div>
        
        <table style='font-size:18px;line-height:15px;' align='center' height='auto' width='350px'>
            <thead align='center'>
            <tr>
            <th align='start'>Items</th>
            <th>Quantity</th>
            <th>Amount</th>
            </tr>
            <tr>
                <td colspan='4'><p style="text-align: center; margin:0px;">---------------------------------------------------------</p></td>
            </tr>
            </thead>
            <tbody align='center'>
            ${orderDetails.orderItems.map((item) => {
            return (
                `<tr>
                         <td align='start'>${item.name}</td>
                         <td>${item.quantity}</td>
                         <td> ${curSymbol} ${item.price}</td>
                         <td>${item && item.status.toUpperCase() === "READY" ? `<input type='checkbox' style="height: 20px;width: 20px;accent-color: #08eb0875;" checked/>`: ""} </td>
                        </tr>
                        `)
        })}
            <tr>
                <td colspan='4'><p style="text-align: center; margin:0px;">---------------------------------------------------------</p></td>
            </tr>
            <tr>
                <td colSpan='2' align='end'><b>Amount :</b></td>
            <td align='center'> ${curSymbol} ${orderDetails.totalPrice - orderDetails.taxPrice}</td>
            </tr>
            <tr>
            <td colSpan='2' align='end'><b>CGST:</b></td>
            <td align='center'>${curSymbol} ${orderDetails.taxPrice}</td>
            </tr>
            </tbody>
        </table>
            <p style="text-align: center; margin:0px;">-----------------------------------------------------------------</p>
        <h1 align='center' style='margin-bottom:38px;'>Total Amount: ${curSymbol} ${orderDetails.totalPrice}</h1>
        
        `
    )
}



function changeStatus(orderDetails) {

    let status_chip = document.getElementById('status_chip');
    if (orderDetails.isCanceled) {
        status_chip.innerHTML = 'Canceled';
        status_chip.style.backgroundColor = 'red';
    }
    else if (orderDetails.isDelivered) {
        status_chip.innerHTML = 'Delivered';
        status_chip.style.backgroundColor = "blue";
    }
    else if (orderDetails.isReady) {
        clearInterval(refresh);
        status_chip.innerHTML = 'Ready';
        status_chip.style.backgroundColor = "#2cff00";
    }
    else {
        console.log("in progress");
    }
}



let refresh = setInterval(() => {
    getReload();
    console.log("wed refresh");
}, 60000);

function getReload() {
    location.reload();

}

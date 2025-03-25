// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.emqx.io");

const broker = "wss://broker.emqx.io:8084/mqtt"; // WebSocket version
const client = mqtt.connect(broker);
// client.on("connect", () => {
// console.log("Connected to MQTT Broker");
//   client.subscribe("presence", (err) => {
//     if (!err) {
//       client.publish("mozanio", "on");
//     }
//   });
// });

// client.on("message", (topic, message) => {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });

function connectToMqttServer()
{
    client.on("connect", () => {
        console.log("Connected to MQTT Broker");
        //   client.subscribe("presence", (err) => {
            
        //   });
        });
}

function handleBtn()
{
    let on_off_btn = document.getElementsByClassName("btn-control-machine");
    let pair_key;
    on_off_btn[0].addEventListener('click', event =>{
        console.log("On")
        let myJsonObj;
        myJsonObj = {
            "power": "on"
        };
        let topic = "mozanio/" + pair_key + "/power"
        client.publish(topic, "on");
        // if (!err) {
        // }
    })
    on_off_btn[1].addEventListener('click', event =>{
        console.log("Off")
        let myJsonObj;
        myJsonObj = {
            "power": "off"
        };
        let topic = "mozanio/" + pair_key + "/power"
        client.publish(topic, "off");
    })
    let data_btn_control = document.getElementsByClassName("btn-control-param-machine");
    let i = 0;
    data_btn_control[0].addEventListener('click', event=>{
        i = !i
        if(i == true)
        {
            data_btn_control[0].innerHTML = "Change";
            document.getElementsByClassName("control-param")[0].disabled = true;
            pair_key = document.getElementsByClassName("control-param")[0].value;
            console.log(pair_key);
        }
        else
        {
            data_btn_control[0].innerHTML = "Set";
            document.getElementsByClassName("control-param")[0].disabled = false;
        }
    })
    data_btn_control[1].addEventListener('click', event=>{
        let myJsonObj;
            myJsonObj = {
                    "temp": document.getElementsByClassName("control-param")[1].value
                };
        let topic = "mozanio/" + pair_key + "/temp1"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
    data_btn_control[2].addEventListener('click', event=>{
        let myJsonObj;
            myJsonObj = {
                    "temp": document.getElementsByClassName("control-param")[2].value
                };
        let topic = "mozanio/" + pair_key + "/temp2"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
}

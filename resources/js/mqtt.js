// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.emqx.io");
let pair_key;

const broker = "wss://broker.emqx.io:8084/mqtt"; // WebSocket version
const client = mqtt.connect(broker);
let subTopic;
            // client.on("connect", () => {
// console.log("Connected to MQTT Broker");
//   client.subscribe("presence", (err) => {
//     if (!err) {
//       client.publish("mozanio", "on");
//     }
//   });
// });


client.on("message", (subTopic, message) => {
    // message is Buffer
    console.log(subTopic.toString());
    console.log(message.toString());
    let topic_str = subTopic.toString();
    // Split the string by "/"
    const topic = topic_str.split("/");

    // Output the result
    console.log(topic);

    let msg_str = message.toString();
    const msg_data = {};
    msg_str.trim().split("\n").forEach(line => {
    let [key, value] = line.split(":");
    msg_data[key.trim()] = value.trim();
});
    if(topic[3] == "machineStatus")
    {
        let dev_status = document.getElementsByClassName("dev-value-display");
        let state_change_color = 1;
        // console.log(msg_data.rel)
        if(msg_data.rel == state_change_color)
        {
            dev_status[1].style.color = "red"
        }
        else
        {
            dev_status[1].style.color = "green"

        }
        if(msg_data.tempS == state_change_color)
        {
            dev_status[2].style.color = "red"
        }
        else
        {
            dev_status[2].style.color = "green"

        }
        if(msg_data.bump_state == state_change_color)
        {
            dev_status[3].style.color = "red"
        }
        else
        {
            dev_status[3].style.color = "green"

        }
        if(msg_data.tempS == state_change_color)
        {
            dev_status[4].style.color = "red"
        }
        else
        {
            dev_status[4].style.color = "green"

        }
        dev_status[5].innerHTML = msg_data.t_pv
        dev_status[6].innerHTML = msg_data.t_sp
    }
    if(topic == "errorList")
    {

    }
// Output the result
// console.log(parsedData);
// console.log(parsedData.pwr);
    // client.end();
});

function connectToMqttServer()
{
    client.on("connect", () => {
        console.log("Connected to MQTT Broker");
        // if(pair_key != "")
        // {
            
        // }
        });
    // client.on("message", (subTopic, message) => {
    //         // message is Buffer
    //         console.log(message.toString());
    //         client.end();
    //     });
        
}

function handleBtn()
{
    let on_off_btn = document.getElementsByClassName("btn-control-machine");
    on_off_btn[0].addEventListener('click', event =>{
        console.log("On")
        let myJsonObj;
        myJsonObj = {
            "power": "on"
        };
        let topic = "mozanio/web_to_dev/" + pair_key + "/power"
        client.publish(topic, JSON.stringify(myJsonObj));
        // if (!err) {
        // }
    })
    on_off_btn[1].addEventListener('click', event =>{
        console.log("Off")
        let myJsonObj;
        myJsonObj = {
            "power": "off"
        };
        let topic = "mozanio/web_to_dev/" + pair_key + "/power"
        client.publish(topic, JSON.stringify(myJsonObj));
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
            subTopic = "mozanio/dev_to_web/" + pair_key + "/#";
                client.subscribe(subTopic, (err) => {
                if (!err) {
                    console.log(`📡 Subscribed to: ${subTopic}`);
                } else {
                    console.error("❌ Subscription error:", err);
                }
            });
            document.getElementById("device-id").innerHTML = pair_key;
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
        let topic = "mozanio/web_to_dev/" + pair_key + "/temp1"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
    data_btn_control[2].addEventListener('click', event=>{
        let myJsonObj;
            myJsonObj = {
                    "temp": document.getElementsByClassName("control-param")[2].value
                };
        let topic = "mozanio/web_to_dev/" + pair_key + "/temp2"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
}

// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.emqx.io");
let pair_key;

const broker = "wss://broker.emqx.io:8084/mqtt"; // WebSocket version
// const client = mqtt.connect(broker);
let client;
let subTopic;
            // client.on("connect", () => {
// console.log("Connected to MQTT Broker");
//   client.subscribe("presence", (err) => {
//     if (!err) {
//       client.publish("mozanio", "on");
//     }
//   });
// });


// client.on("message", (subTopic, message) => {
//     // message is Buffer
//     console.log(subTopic.toString());
//     console.log(message.toString());
//     let topic_str = subTopic.toString();
//     // Split the string by "/"
//     const topic = topic_str.split("/");

//     // Output the result
//     console.log(topic);

//     let msg_str = message.toString();
//     const msg_data = {};
//     msg_str.trim().split("\n").forEach(line => {
//     let [key, value] = line.split(":");
//     msg_data[key.trim()] = value.trim();
// });
//     if(topic[3] == "machineStatus")
//     {
//         let dev_status = document.getElementsByClassName("dev-value-display");
//         let state_change_color = 0;
//         // console.log(msg_data.rel)
//         if(msg_data.pid_clock == state_change_color)
//         {
//             dev_status[0].style.color = "red"
//         }
//         else
//         {
//             dev_status[0].style.color = "green"
//         }
//         if(msg_data.rel == state_change_color)
//         {
//             dev_status[1].style.color = "red"
//         }
//         else
//         {
//             dev_status[1].style.color = "green"

//         }
//         if(msg_data.tempS == state_change_color)
//         {
//             dev_status[2].style.color = "red"
//         }
//         else
//         {
//             dev_status[2].style.color = "green"

//         }
//         if(msg_data.bump_state == state_change_color)
//         {
//             dev_status[3].style.color = "red"
//         }
//         else
//         {
//             dev_status[3].style.color = "green"

//         }
//         if(msg_data.tempS == state_change_color)
//         {
//             dev_status[4].style.color = "red"
//         }
//         else
//         {
//             dev_status[4].style.color = "green"

//         }
//         dev_status[5].innerHTML = msg_data.t_pv
//         dev_status[6].innerHTML = msg_data.t_sp
//     }
//     if(topic == "errorList")
//     {

//     }
// // Output the result
// // console.log(parsedData);
// // console.log(parsedData.pwr);
//     // client.end();
// });
let first_get_enb_boiler = 0;
let boiler1_enb = true, boiler2_enb = true;
let has_error = 0;
function connectToMqttServer()
{
    client = mqtt.connect(broker);
    client.on("connect", () => {
        console.log("Connected to MQTT Broker");
        // if(pair_key != "")
        // {
            
        // }
        });

    client.subscribe(subTopic, (err) => {
        if (!err) {
            console.log(`📡 Subscribed to: ${subTopic}`);
        } else {
            console.error("❌ Subscription error:", err);
        }
    });

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
            let state_change_color = 0;
            // console.log(msg_data.rel)
            if(msg_data.pid_clock == state_change_color)
            {
                dev_status[0].style.color = "red"
            }
            else
            {
                dev_status[0].style.color = "green"
            }
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
            if(msg_data.heat == state_change_color)
            {
                dev_status[5].style.color = "red"
            }
            else
            {
                dev_status[5].style.color = "green"
    
            }
            dev_status[4].innerHTML = msg_data.bump_val
            dev_status[6].innerHTML = msg_data.t_pv
            dev_status[7].innerHTML = msg_data.t_sp
            dev_status[8].innerHTML = msg_data.t_pv2
            dev_status[9].innerHTML = msg_data.t_sp2
            let dev_info = document.getElementsByClassName("dev-info-display");
            if(first_get_enb_boiler == 0)
            {
                let myJsonObj;
                myJsonObj = {
                        "boiler_enb": 6
                    };
                let topic = "mozanio/web_to_dev/" + pair_key + "/boiler_enb"
                client.publish(topic, JSON.stringify(myJsonObj));
                dev_info[3].src = `https://www.google.com/maps?q=${msg_data.map}&output=embed`

            }
            first_get_enb_boiler = 1;

            dev_info[0].innerHTML = msg_data.IP;
            dev_info[1].innerHTML = msg_data.ssid;
            dev_info[2].innerHTML = msg_data.pairKey;
            // dev_info[3].innerHTML = msg_data.map;

        }
        if(topic[3] == "errorList")
        {
            const errorValues = msg_str
                .trim()
                .split("\n")
                .map(line => Number(line.split(": ")[1])) // Extract numbers
                .filter(value => value !== 0); // Keep only non-zero values

                // Output results
                console.log(errorValues);
                if(errorValues.length != 0)
                {
                    if(has_error == 0)
                    {
                        alert(`Error found:  ${errorValues[0]}`);
                        has_error = 1;
                    }
                }
                else
                {
                    has_error = 0;
                }
        }
    // Output the result
    // console.log(parsedData);
    // console.log(parsedData.pwr);
        // client.end();
    });
        
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
        this.clicked = ! this.clicked
        console.log(this.clicked)
        if(i == true)
        {
            data_btn_control[0].innerHTML = "Change";
            document.getElementsByClassName("control-param")[0].disabled = true;
            pair_key = document.getElementsByClassName("control-param")[0].value;
            console.log(pair_key);
            subTopic = "mozanio/dev_to_web/" + pair_key + "/#";
            document.getElementById("device-id").innerHTML = pair_key;
            
            connectToMqttServer();
        }
        else
        {
            data_btn_control[0].innerHTML = "Set";
            document.getElementsByClassName("control-param")[0].disabled = false;
            client.end();
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
    let checkbox_control = document.getElementsByClassName("checkbox-control-machine")
    checkbox_control[0].addEventListener('change', event=>{
        boiler1_enb = ! boiler1_enb;
        let data_enb_boiler = (boiler2_enb << 2) + (boiler1_enb << 1);
        // console.log(data_enb_boiler);
        let myJsonObj;
        myJsonObj = {
                "boiler_enb": data_enb_boiler
            };
        let topic = "mozanio/web_to_dev/" + pair_key + "/boiler_enb"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
    checkbox_control[1].addEventListener('change', event=>{
        boiler2_enb = ! boiler2_enb;
        let data_enb_boiler = (boiler2_enb << 2) + (boiler1_enb << 1);
        // console.log(data_enb_boiler);
        let myJsonObj;
        myJsonObj = {
                "boiler_enb": data_enb_boiler
            };
        let topic = "mozanio/web_to_dev/" + pair_key + "/boiler_enb"
            client.publish(topic, JSON.stringify(myJsonObj));
    })
}

// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.emqx.io");
let pair_key;

const broker = "wss://broker.emqx.io:8084/mqtt"; // WebSocket version
// const client = mqtt.connect(broker);
let client;
let subTopic;

let first_get_enb_boiler = 0;
let boiler1_enb = true, boiler2_enb = true;
let has_error = 0;
let dev_test_index = 0;
function connectToMqttServer()
{
    client = mqtt.connect(broker);
    client.on("connect", () => {
        console.log("Connected to MQTT Broker");
        });

    client.subscribe(subTopic, (err) => {
        if (!err) {
            console.log(`📡 Subscribed to: ${subTopic}`);
            let myJsonObj;
            myJsonObj = {
                    "cmd": "get_schedule"
                };
            let topic = "mozanio/web_to_dev/" + pair_key + "/get_schedule"
            client.publish(topic, JSON.stringify(myJsonObj));
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
        try
        {
    
            msg_str.trim().split("\n").forEach(line => {
            let [key, value] = line.split(":");
            msg_data[key.trim()] = value.trim();
        });
        }
        catch(err)
        {

        }        
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
        if(topic[3] == "manual_test")
        {
            let btn_test_manual = document.getElementsByClassName("btn-test-manual")
            for(let j = 0; j < btn_test_manual.length; j ++)
            {
                btn_test_manual[j].disabled = false;
                console.log("disabled")
            }
            let checked_device = JSON.parse(msg_str);
            let status_test_manual = document.getElementsByClassName("status-test-manual");
            if(checked_device.manual_test != 0)
            {
                console.log(Math.log2(checked_device.manual_test>>8));
                dev_test_index = Math.log2(checked_device.manual_test>>8);
                status_test_manual[dev_test_index].style.color = "red";
            }
            else
            {
                status_test_manual[dev_test_index].style.color = "green";
            }
            
        }
        if(topic[3] == "get_schedule")
        {
            let history_schedule = JSON.parse(msg_str);
            handle_history_schedule(history_schedule)
        }
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


function handle_test_manual()
{
    let btn_test_manual = document.getElementsByClassName("btn-test-manual")
    for(let i = 0; i < btn_test_manual.length; i++)
    {
        btn_test_manual[i].addEventListener('click', event => {
            console.log(`send: ${0x01 <<i}`)
            dev_test_index = i;
            document.getElementsByClassName("status-test-manual")[i].style.color = "yellow";
            let myJsonObj;
            myJsonObj = {
                    "manual_test": 0x01 << i
                };
            let topic = "mozanio/web_to_dev/" + pair_key + "/manual_test"
            client.publish(topic, JSON.stringify(myJsonObj));
            for(let j = 0; j < btn_test_manual.length; j ++)
            {
                btn_test_manual[j].disabled = true;
            }
        }
        )
    }
}

let cellCount = [];
function handle_history_schedule(Schedule)
{
    let history_table_row = document.getElementsByClassName("history-schedule-table-row");
    let newCell;
    // console.log(Schedule.Wed)
    if(Schedule.Mon !== undefined)
    {
        let rowDoW = history_table_row[0];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i =0; i < Schedule.Mon.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Mon[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[0];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Tue !== undefined)
    {
        let rowDoW = history_table_row[1];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Tue.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Tue[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[1];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Wed !== undefined)
    {
        let rowDoW = history_table_row[2];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Wed.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Wed[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[2];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Thu !== undefined)
    {
        let rowDoW = history_table_row[3];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Thu.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Thu[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[3];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Fri !== undefined)
    {
        let rowDoW = history_table_row[4];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Fri.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Fri[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[4];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Sat !== undefined)
    {
        let rowDoW = history_table_row[5];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Sat.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Sat[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[5];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
    if(Schedule.Sun !== undefined)
    {
        let rowDoW = history_table_row[6];
        if(rowDoW.children.length > 4)
        {
            for(let i = rowDoW.children.length - 1; i > 3; i --)
            {
                rowDoW.removeChild(rowDoW.children[i]);
            }
        }
        for(let i = 0; i < Schedule.Sun.length; i++)
        {
            if (rowDoW.children.length < 5 + 4)
            {
                newCell = document.createElement("td");
                newCell.innerHTML = `|${Schedule.Sun[i]}`;
                rowDoW.appendChild(newCell);
            }
        }
    }
    else
    {
        let rowDoW = history_table_row[6];
        let cells = rowDoW.children; 
        if(cells.length > 4)
        {
            for(let i = cells.length-1; i > 3; i --)
            {
                rowDoW.removeChild(cells[i]);
            }
        }
    }
}

function handle_schedule_buttons()
{
    let btn_set_schedule = document.getElementsByClassName("btn-set-schedule-on");
    for(let i = 0; i < btn_set_schedule.length; i++)
    {
        btn_set_schedule[i].addEventListener("click", event => {
            let myJsonObj ={
                "DaysOfWeek": i,
                "Start": document.getElementsByClassName("start-time-input")[i].value,
                "Stop": document.getElementsByClassName("stop-time-input")[i].value
            }
            let topic = "mozanio/web_to_dev/" + pair_key + "/set_schedule"
            client.publish(topic, JSON.stringify(myJsonObj));

            console.log(JSON.stringify(myJsonObj));
        });
    }

    let btn_del_schedule = document.getElementsByClassName("btn-set-schedule-off");
    for(let i = 0; i < btn_del_schedule.length; i++)
    {
        btn_del_schedule[i].addEventListener("click", event => {
            let myJsonObj ={
                "DaysOfWeek": i,
            }
            let topic = "mozanio/web_to_dev/" + pair_key + "/del_schedule"
            client.publish(topic, JSON.stringify(myJsonObj));

            console.log(JSON.stringify(myJsonObj));
        });
    }
}


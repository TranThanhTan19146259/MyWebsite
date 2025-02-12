let radio_select_protocol = 0;

function generate_json_network()
{
    let protocol_input = document.getElementsByClassName("protocol-input");
    let checkMode =0;

    if(radio_select_protocol == 0)
    {
        let myObj = {
        protocol: 0,
        serverName: protocol_input[0].value,
        timeSend: parseInt(protocol_input[1].value)
        };
        console.log(JSON.stringify(myObj));// DEBUG
        return JSON.stringify(myObj);
    }
    else if (radio_select_protocol == 1)
    {
        let myObj = {
        protocol: 1,
        broker: protocol_input[2].value,
        port: parseInt(protocol_input[3].value),
        username: protocol_input[4].value,
        password: protocol_input[5].value,
        timeSend: parseInt(protocol_input[6].value)
        };
        console.log(JSON.stringify(myObj));// DEBUG
        return JSON.stringify(myObj);
    }
    else
    {
        let myObj = {
        protocol: 2,
        serverName: protocol_input[5].value
        };
        console.log(JSON.stringify(myObj));// DEBUG
        return JSON.stringify(myObj);
    }
    // switch(radio_select_protocol) {
    //     case 0:
    //       // code block
    //         let myObj = {
    //         protocol: "http",
    //         serverName: protocol_input[0].value
    //         };
    //         console.log(JSON.stringify(myObj));// DEBUG
    //         // return JSON.stringify(myObj);
    //         break;
    //     case 1:
    //         let myObj = {
    //             protocol: "http",
    //             serverName: protocol_input[0].value
    //             };
    //             console.log(JSON.stringify(myObj));// DEBUG
    //             return JSON.stringify(myObj);
    //       // code block
    //       break;
    //     case 2:
    //         // code block
    //     break;
    //   }
    // for(let i =0;i<select_protocol.length;i++)
    // {
    //     select_protocol[i].addEventListener('change', function() {
    //     if (this.checked) {
    //         checkMode = i;
    //         console.log(checkMode);
    //     } 
    //     });
    // }
    // console.log("")
    // console.log(radio_select_protocol);
    // console.log(checkMode);
    return checkMode;
}

function send_data_network_config()
{
    let jsonData = generate_json_network();
    postRequestHttp(baseUrl,"network_tab","",jsonData, (dataResponse) =>{
        console.log(dataResponse);
    });
}


function change_protocol_mode()
{
    let select_protocol = document.getElementsByClassName("radio-select-protocol");
    let main_content = document.getElementsByClassName("protocol-select");
    let protocol_input = document.getElementsByClassName("protocol-input");
    for(let i =0;i<select_protocol.length;i++)
    {
        select_protocol[i].addEventListener('change', function() {
            for (let i =0;i<select_protocol.length;i++)
            {
                protocol_input[i].value = "";
                main_content[i].classList.remove("active-content");
            }
            if (this.checked) {
                radio_select_protocol = i;
                // console.log(radio_select_protocol);
                main_content[i].classList.add("active-content");
            } 
          });
    }

}

function generate_json_alarm()
{
    let alarm_input = document.getElementsByClassName("settings-tab-input-alarm");
    let myObj = {
        Ax: parseFloat(alarm_input[0].value),
        Ay: parseFloat(alarm_input[2].value),
        Az: parseFloat(alarm_input[4].value),
        Vx: parseFloat(alarm_input[1].value),
        Vy: parseFloat(alarm_input[3].value),
        Vz: parseFloat(alarm_input[5].value),
        Temp_warn:parseFloat(alarm_input[6].value), 
        Temp_crit:parseFloat(alarm_input[7].value),
        Curr_crit:parseFloat(alarm_input[8].value)    
    };
    console.log(JSON.stringify(myObj));// DEBUG
    return JSON.stringify(myObj);
}

function send_data_alarm_config()
{
    let jsonData = generate_json_alarm();
    postRequestHttp(baseUrl,"alarm_tab","",jsonData, (dataResponse) =>{
        console.log(dataResponse);
    });
}

function generate_alarm_data_content(jsonData)
{
    let allDataSettings = document.getElementsByClassName("settings-tab-input-alarm");
    const obj = JSON.parse(jsonData);
    allDataSettings[0].value = obj.Ax;
    allDataSettings[1].value = obj.Ay;
    allDataSettings[2].value = obj.Az;
    allDataSettings[3].value = obj.Vx;
    allDataSettings[4].value = obj.Vy;
    allDataSettings[5].value = obj.Vz;
    allDataSettings[6].value = obj.Temp_warn;
    allDataSettings[7].value = obj.Temp_crit;
    allDataSettings[8].value = obj.Curr_crit;
}


function get_data_alarm_config()
{
    getRequestHttp(baseUrl,"get_alarm_data","", (dataResponse) =>{
        console.log(dataResponse);
        generate_alarm_data_content(dataResponse);
    });
}
function generate_json_setting()
{
    let allDataSettings_AP = document.getElementsByClassName("settings-tab-input-ap");
    let allDataSettings_STA = document.getElementsByClassName("settings-tab-input-sta");
    let checkBox = document.getElementsByClassName("slider")[0];
    let state_ap_sta;
    if (checkBox.checked)
    {
        state_ap_sta = 1;
        let myObj = {
            mode_AP_STA: state_ap_sta,
            ssid: allDataSettings_STA[0].value,
            password: allDataSettings_STA[1].value
        };
        console.log(JSON.stringify(myObj));// DEBUG
        return JSON.stringify(myObj);
    }
    else 
    {
        state_ap_sta = 0;
        let myObj = {
            mode_AP_STA: state_ap_sta,
            ssid: allDataSettings_AP[0].value,
            password: allDataSettings_AP[1].value
        };
        console.log(JSON.stringify(myObj));// DEBUG
        return JSON.stringify(myObj);
    }
    
}


function send_data_settings_config()
{
    let jsonData = generate_json_setting();
    postRequestHttp(baseUrl, "setting_tab","",jsonData,(dataResponse) => {
        console.log(dataResponse); //debug load data from server
        // generate_content_netWorkConfig_tab(dataResponse);
    });

}




function change_wifi_mode()
{
    let allDataSettings_AP = document.getElementsByClassName("settings-tab-input-ap");
    let allDataSettings_STA = document.getElementsByClassName("settings-tab-input-sta");
    document.getElementsByClassName("slider")[0].addEventListener('change', function() {
        const main_content = document.getElementsByClassName("wifi-config");
        if (this.checked) {
            console.log("Checkbox is checked..");
            allDataSettings_STA[0].value = "";
            allDataSettings_STA[1].value = "";
            allDataSettings_STA[2].value = "";
            main_content[1].classList.add("active-content");
            main_content[0].classList.remove("active-content");
        } else {
            allDataSettings_AP[0].value = "";
            allDataSettings_AP[1].value = "";
            allDataSettings_AP[2].value = "";
            main_content[0].classList.add("active-content");
            main_content[1].classList.remove("active-content");
            console.log("Checkbox is not checked..");
        }
      });
}
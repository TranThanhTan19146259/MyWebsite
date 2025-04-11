function generatePage()
{
    // console.log(baseUrl)
    // alert('test!!!');
    // change_protocol_mode();
    // change_wifi_mode();
    generate_content();
    // get_data_mpu();
    // get_data_alarm_config();
    // connectToMqttServer();
    handleBtn();
    handle_test_manual();
    handle_schedule_buttons();
    // handle_history_schedule();
    let checkbox_control = document.getElementsByClassName("checkbox-control-machine")
    checkbox_control[0].checked = true;
    checkbox_control[1].checked = true;
}



function reset_device()
{
    getRequestHttp(baseUrl,"rs_device","",(dataResponse) =>{
        console.log(dataResponse);
        if(dataResponse == "OK") alert("Device reseted!!!");
    });
}

function generate_content()
{
    const select_tab = document.getElementsByClassName("select-tab");
    const main_content = document.getElementsByClassName("main-content");
    // for (let i = 0; i < select_tab.length; i++) {
    //     // select_tab[i].classList.remove("active");
    //     main_content[i].style.display = "none";
    // }
    for(let i=0;i<select_tab.length;i++)
    {
        select_tab[i].addEventListener("click", function(){
            for (let i = 0; i < select_tab.length; i++) {
                select_tab[i].classList.remove("active");
                main_content[i].classList.remove("active-content");
            }
            if (!select_tab[i].classList.contains("active"))
            {
                select_tab[i].classList.add("active");
                main_content[i].classList.add("active-content");
            }
        })
    }
}



// function getReqHttp(url, endpoint,)






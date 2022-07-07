$('#main-form').submit((event)=>{
    event.preventDefault();
    let amount = event.target['input-amount'].value;
    let currency = event.target['currency'].value;
    let direction = event.target['currency-direction'].value;
    let when = event.target['when'].value;

    $('#invalid-message').hide();

    if(when == ""){//if not set, used today's date{
        let today = new Date();
        when = today.toISOString().split('T')[0];
    }

    if(amount == ""){
        $('#invalid-message').text (`Please set the amount`);
        $('#invalid-message').show();
        return;
    }

    const url = `https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=95932927-c8bc-4e7a-b484-68a66a24edfe&filters[end_of_day]=${when}`
    
    $.get(url,{}
    ,(response)=>{
        if(response.success){
            //get the rate

            if(response.result.total ==0 ){
                $('#invalid-message').text (`No available rate on ${when}`);
                $('#invalid-message').show();
            }
            else{
                let rate = response.result.records[0][`${currency.toLocaleLowerCase()}_sgd`];
                if(!rate){
                    rate = response.result.records[0][`${currency.toLocaleLowerCase()}_sgd_100`];
    
                    if(rate){
                        rate /= 100;
                    }
                }
    
                if(!rate){
                    $('#invalid-message').text (`No available rate for ${currency} and SGD`);
                    $('#invalid-message').show();
                }else{
                    let result = 0;
                    if(direction == 'from'){
                        result = parseInt(amount) * rate;
                    }
                    else{
                        result = parseInt(amount)/rate;
                    }

                    event.target['output-amount'].value = result;
                }
                
            }

           

        }
    })
})
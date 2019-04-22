config_list = {
    yifan: {
        poolId: 'us-east-1_gg5BKuPZb',
        poolClientId: '4flovep5or8jn6ioahagihurp2',
        identityPoolId: 'us-east-1:094b02ca-c329-416a-9ddc-98ce893c9ad7',
        region: 'us-east-1',
        LF0InvokeUrl: 'https://1g9ztlf09a.execute-api.us-east-1.amazonaws.com/prod/chatbot',
        LF0Method1: 'POST'

    },
    xinyue: {
        poolId: 'us-west-2_hafasfNuZ',
        poolClientId: '21allbiqnj59ib2pubp2ue2bpr',
        identityPoolId: 'us-west-2:86121d75-b9c1-4998-a4c6-5197181250bd',
        region: 'us-west-2',
        LF0InvokeUrl: 'https://b8jzj8m47l.execute-api.us-west-2.amazonaws.com/prod/chatbot',
        LF0Method1: 'POST'
    }
};

// Change Here!
current_config = config_list['xinyue'];


window.appconfig = {
    cognito: {
        // Cognito User Pool
        userPoolId: current_config.poolId,
        userPoolClientId: current_config.poolClientId,
        identityPool: current_config.identityPoolId,
        region: current_config.region
    },
    api: {
        // url of API Gateway Deployment 
        LF0URL: current_config.LF0InvokeUrl,
        LF0Method1: current_config.LF0Method1
    }
};



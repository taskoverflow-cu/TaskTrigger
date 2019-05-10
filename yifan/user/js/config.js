config_list = {
    tasktrigger: {
        poolId: 'us-east-1_4pgPaolIC',
        poolClientId: '2j7b8ui0m88c453ich2vd8hckc',
        identityPoolId: 'us-east-1:094b02ca-c329-416a-9ddc-98ce893c9ad7',
        region: 'us-east-1',
    }
};

// Change Here!
current_config = config_list['tasktrigger'];

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
        // LF0URL: current_config.LF0InvokeUrl,
        // LF0Method1: current_config.LF0Method1
    }
};



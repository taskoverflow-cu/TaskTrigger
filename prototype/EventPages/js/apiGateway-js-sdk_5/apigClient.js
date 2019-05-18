/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    var invokeUrl = 'https://nc2630k8b3.execute-api.us-east-1.amazonaws.com/Test_041519';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.calendarCreateEventPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarCreateEventPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/create-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarCreateEventPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarCreateEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarCreateEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/create-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarCreateEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarDeleteEventDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarDeleteEventDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/delete-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarDeleteEventDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarDeleteEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarDeleteEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/delete-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarDeleteEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarEditEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarEditEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/edit-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarEditEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarEditEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarEditEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/edit-event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarEditEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarRecommendationGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var calendarRecommendationGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/recommendation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarRecommendationGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarRecommendationPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarRecommendationPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/recommendation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarRecommendationPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.calendarRecommendationOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var calendarRecommendationOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/calendar/recommendation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(calendarRecommendationOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverAddEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverAddEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverAddEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverAddEventPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverAddEventPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverAddEventPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverAddEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverAddEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverAddEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapAddEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapAddEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapAddEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapAddEventPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverMapAddEventPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapAddEventPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapAddEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapAddEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/add_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapAddEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapRemoveEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapRemoveEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapRemoveEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapRemoveEventDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverMapRemoveEventDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapRemoveEventDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapRemoveEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapRemoveEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapRemoveEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapSearchEventGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverMapSearchEventGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapSearchEventGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapSearchEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapSearchEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapSearchEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverMapSearchEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverMapSearchEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/map/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverMapSearchEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverRemoveEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverRemoveEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverRemoveEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverRemoveEventDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverRemoveEventDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverRemoveEventDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverRemoveEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverRemoveEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/remove_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverRemoveEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverSearchEventGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var discoverSearchEventGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverSearchEventGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverSearchEventPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverSearchEventPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverSearchEventPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.discoverSearchEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var discoverSearchEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/discover/search_event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(discoverSearchEventOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendAddFriendUid1Uid2Post = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uid2', 'uid1'], ['body']);
        
        var friendAddFriendUid1Uid2PostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/add-friend/{uid1}/{uid2}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uid2', 'uid1'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendAddFriendUid1Uid2PostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendAddFriendUid1Uid2Options = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var friendAddFriendUid1Uid2OptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/add-friend/{uid1}/{uid2}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendAddFriendUid1Uid2OptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendListFriendPageLimitUidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['limit', 'uid', 'page'], ['body']);
        
        var friendListFriendPageLimitUidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/list-friend/{page}/{limit}/{uid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['limit', 'uid', 'page'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendListFriendPageLimitUidGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendListFriendPageLimitUidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var friendListFriendPageLimitUidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/list-friend/{page}/{limit}/{uid}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendListFriendPageLimitUidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendRemoveFriendUid1Uid2Delete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uid2', 'uid1'], ['body']);
        
        var friendRemoveFriendUid1Uid2DeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/remove-friend/{uid1}/{uid2}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uid2', 'uid1'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendRemoveFriendUid1Uid2DeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.friendRemoveFriendUid1Uid2Options = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var friendRemoveFriendUid1Uid2OptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/friend/remove-friend/{uid1}/{uid2}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(friendRemoveFriendUid1Uid2OptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userGetByEmailEmailGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['email'], ['body']);
        
        var userGetByEmailEmailGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/user/get-by-email/{email}').expand(apiGateway.core.utils.parseParametersToObject(params, ['email'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userGetByEmailEmailGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userGetByEmailEmailOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userGetByEmailEmailOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user/get-by-email/{email}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userGetByEmailEmailOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userGetByUidUidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uid'], ['body']);
        
        var userGetByUidUidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/user/get-by-uid/{uid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userGetByUidUidGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userGetByUidUidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userGetByUidUidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user/get-by-uid/{uid}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userGetByUidUidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userSearchUserPageLimitSearchkeyGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['limit', 'page', 'searchkey'], ['body']);
        
        var userSearchUserPageLimitSearchkeyGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/user/search-user/{page}/{limit}/{searchkey}').expand(apiGateway.core.utils.parseParametersToObject(params, ['limit', 'page', 'searchkey'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userSearchUserPageLimitSearchkeyGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userSearchUserPageLimitSearchkeyOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userSearchUserPageLimitSearchkeyOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user/search-user/{page}/{limit}/{searchkey}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userSearchUserPageLimitSearchkeyOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};

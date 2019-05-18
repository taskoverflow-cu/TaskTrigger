$(function(){
    /* Some wrapper function, used to operate with RDS */
    
    /**
     * Wrapper function, besides signIn for cognito userpool, it also retrieve currentUser information
     */
    var apigClient = apigClientFactory.newClient();

    // =========================================================calendar=========================================================
    window.test_calendarRecommendationPut = function(){
    	apigClient.calendarRecommendationPut({}, {
			  "messages": [
			    {
			      "user_id": 23,
			      "min_start_time": "1557489600",
			      "max_end_time": "1557525600",
			      "duration": "3600",
			      "time_rigidity": 0,
			      "participants_email": [
			        "zhou.zhuang.farrell@gmail.com", 
			        "125140762@qq.com"
			      ]
			    }
			  ]
    	}).then(function(result){console.log(result);})
    }

    // =========================================================discover=========================================================
    window.test_discoverSearchEventPut = function(){
    	apigClient.discoverSearchEventPut({}, {
			  "messages": [
			    {
			      "user_id": "20",
			      "visibility": "1",
			      "time_leftbound":  "1557111500",
			      "time_rightbound": "1557119000",
			      "event_location": "string",
			      "longitude": "-70.5",
			      "latitude": "40.40",
			      "radius": "100000",
			      "offset": 0,
			      "limit": 100
			    }
			  ]
    	}).then(function(result){console.log(result);})
    } 

    window.test_discoverAddEventPut = function(uid, eid){
    	console.log(uid, eid)
    	apigClient.discoverAddEventPut({}, {
			  "messages": [
			    {
			      "user_id": uid,
			      "event_id": eid
			    }
			  ]
    	}).then(function(result){console.log(result);})
    }

    window.test_discoverRemoveEventPut = function(uid, eid){
    	apigClient.discoverRemoveEventPut({}, {
			  "messages": [
			    {
			      "user_id": uid,
			      "event_id": eid
			    }
			  ]
    	}).then(function(result){console.log(result);})
    }

    window.test_discoverMapSearchEventPut = function(email){
    	apigClient.discoverMapSearchEventPut({}, {
			  "messages": [
			    {
			      "user_id": "20",
			      "visibility": "1",
			      "time_leftbound":  "1557111500",
			      "time_rightbound": "1557119000",
			      "event_location": "string",
			      "longitude": "-70.5",
			      "latitude": "40.40",
			      "radius": "100000",
			      "offset": 0,
			      "limit": 100
			    }
			  ]
    	}).then(function(result){console.log(result);})
    } 

    window.test_discoverMapAddEventPut = function(email){
    	apigClient.discoverMapAddEventPut({}, {
			  "messages": [
			    {
			      "user_id": 0,
			      "event_id": 0
			    }
			  ]
    	}).then(function(result){console.log(result);})
    }

    window.test_discoverMapRemoveEventPut = function(email){
    	apigClient.discoverMapRemoveEventPut({}, {
			  "messages": [
			    {
			      "user_id": 0,
			      "event_id": 0
			    }
			  ]
    	}).then(function(result){console.log(result);})
    }   

    // =========================================================friend=========================================================
    window.test_friendAddFriendUid1Uid2Post = function(uid1, uid2){
    	apigClient.friendAddFriendUid1Uid2Post({
	      "uid1": uid1,
	      "uid2": uid2
			}, {}).then(function(result){console.log(result);})
    }

    window.test_friendListFriendPageLimitUidGet = function(limit, uid, page){
    	apigClient.friendListFriendPageLimitUidGet({
	      "limit": limit,
	      "uid": uid,
	      "page": page
			}, {}).then(function(result){console.log(result);})
    }

    window.test_friendRemoveFriendUid1Uid2Delete = function(uid1, uid2){
    	apigClient.friendRemoveFriendUid1Uid2Delete({
	      "uid1": uid1,
	      "uid2": uid2
			}, {}).then(function(result){console.log(result);})
    }

    // =========================================================user=========================================================
    window.test_userGetByEmailEmailGet = function(email){
    	apigClient.userGetByEmailEmailGet({
	      "email": email,
			}, {}).then(function(result){console.log(result);})
    }

    window.test_userGetByUidUidGet = function(id){
    	apigClient.userGetByUidUidGet({
	      "uid": id,
			}, {}).then(function(result){console.log(result);})
    }

    // NOT WORKING
    window.test_userSearchUserPageLimitSearchkeyGet = function(limit, page, searchkey){
    	// limit: number of items each page
    	// page: current page index
    	// searchkey: user name or email
    	apigClient.userSearchUserPageLimitSearchkeyGet({
	      "limit": limit,
	      "page": page,
	      "searchkey": searchkey
			}, {}).then(function(result){console.log(result);})
    }
  })
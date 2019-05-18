	$(function(){
    /* Some wrapper function, used to operate with RDS */
    
    /**
     * Wrapper function, besides signIn for cognito userpool, it also retrieve currentUser information
     */
    var apigClient = apigClientFactory.newClient();

    // =========================================================calendar=========================================================
    window.test_calendarCreateEventPost = function(userid, eventname) {
    	apigClient.calendarCreateEventPost({}, {
					"user_id": userid,
					"event": {
						"event_name": eventname,
						"visibility": "1",
						// "latitude": latitude,		// optional
						// "longitude": longitude,	// optional
						"start_time": 1557489600,	// optional
						"end_time": 1557921600, 		// optional
					},
					"participant_emails" : [
						"zhou.zhuang.farrell@gmail.com"
					] 	   // optional
    	}).then(function(result){console.log(result);})
    }

    window.test_calendarDeleteEventPut = function(eventid) {
    	apigClient.calendarDeleteEventPut({}, {
    		"event_id": eventid
    	}).then(function(result){console.log(result);})
    }

    window.test_calendarEditEventPut = function(eventid, userid, eventname) {
    	apigClient.calendarEditEventPut({}, {
					"event_id":  eventid,
					"user_id":  userid,
					"event": {
						"event_name": eventname,
						// "latitude": latitude,		// optional
						// "longitude": longitude,	// optional
						},
					"participant_emails": [] 	   // optional
    	}).then(function(result){console.log(result);})
    }

    window.test_calendarGetEventGet = function(user_id) {
    	apigClient.calendarGetEventGet({
    		"user_id": user_id
    	}, {}).then(function(result){console.log(result);})
    }

    window.test_calendarInvitationsAcceptInvitationPost = function(userid, event_invitation_id) {
    	apigClient.calendarInvitationsAcceptInvitationPost({}, {
				"event_invitation_id": event_invitation_id,
				"user_id":  userid
    	}).then(function(result){console.log(result);})
    }

    window.test_calendarInvitationsGetInvitationGet = function(user_id) {
    	apigClient.calendarInvitationsGetInvitationGet({
    		"user_id": user_id
    	}, {}).then(function(result){console.log(result);})
    }

    window.test_calendarInvitationsIgnoreInvitationPost = function(userid, event_invitation_id) {
    	apigClient.calendarInvitationsIgnoreInvitationPost({}, {
				"event_invitation_id": event_invitation_id,
				"user_id":  userid
    	}).then(function(result){console.log(result);})
    }

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
			      "user_id": "23",		// Only used with visibility 1/2
			      "visibility": "4",	// must
			      // "time_leftbound":  "1557111500",
			      // "time_rightbound": "1557119000",
			      // "event_location": "string",
			      // "longitude": "-70.5",
			      // "latitude": "40.40",
			      // "radius": "100000",		// must appear with coordinates, default=3
    				// "event_name": "a",
    				// "event_keywords": "string",
			      "offset": 0,				// must
			      "limit": 100				// must
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
    window.test_friendIsFriendUid1Uid2Get = function(uid1, uid2){
    	apigClient.friendIsFriendUid1Uid2Get({
	      "uid1": uid1,
	      "uid2": uid2
			}, {}).then(function(result){console.log(result);})
    }

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

    window.test_friendrequestAnswerRequestRequestidStatePost = function(state, requestid) {
    	apigClient.friendrequestAnswerRequestRequestidStatePost({
	      "state": state,
	      "requestid": requestid
			}, {}).then(function(result){console.log(result);})
    }

    window.test_friendrequestListRequestPageLimitUidStateGet = function(uid) {
    	apigClient.friendrequestListRequestPageLimitUidStateGet({
	      "limit": 999,
	      "page": 1,
	      "state": 1,
	      "uid": uid
			}, {}).then(function(result){console.log(result);})
    }

    window.test_friendrequestSendRequestUid1Uid2Post = function(uid1, uid2) {
    	apigClient.friendrequestSendRequestUid1Uid2Post({
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
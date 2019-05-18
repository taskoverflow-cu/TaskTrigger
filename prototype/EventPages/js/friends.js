var user;

$(function(){
    (function() {
        user = userGetCurrentUser();
        if (user == null || user == undefined)
            window.location.href = "portal.html";
        console.log(user);
    }());

	(function() {
		// populate #friend-list with friends, hide #notification-list
		$('#button-friends').on('click', function() {
			$(this).addClass('active');
			$('#button-notifications').removeClass('active');
			$('#search-list').hide();
			$('#notification-list').hide();
			$('#friend-list').empty().show();

			apigClient.friendListFriendPageLimitUidGet({
	      "limit": 1000,
	      "uid": user['user_id'],
	      "page": 1
			}, {}).then(function(friends){
				if (friends['data'].length == 0) {
					$('#friend-list').append(
						$('<li/>').attr('class', 'list-group-item friends-item').css('clear', 'none').append(
								"you have no friend"
							)
					)
					return;
				}
				for (var i = 0; i < friends['data'].length; i++) {
					var target = JSON.parse(friends['data'][i]);
					var target_email = target['email']
					var target_id = target['user_id']
					var target_name = target['username']

					var li = $('<li/>').attr('class', 'list-group-item friends-item').css('clear', 'none');
					var container = $('<div/>').attr('class', 'row w-100').appendTo(li);
					var img = $('<div/>').attr('class', 'col-12 col-sm-2 col-md-2 px-0').append(
							$('<img/>').attr('src', DEFAULT_USER_AVATAR)
									   .attr('alt', target_name)
									   .attr('class', 'mx-auto d-block img-fluid')
									   .css('width', '80px').css('height', '80px')
						).appendTo(container);
					var textContainer = $('<div/>').attr('class', 'col-12 col-md-6 text-sm-left').append(
							$('<label/>').attr('class', 'name lead').append(target_name)
						).append(
							$('<br>')
						).append(
							$('<span/>').attr('class', 'fa fa-envelope fa-fw text-muted').attr('data-toggle', 'tooltip')
						).append(
							$('<span/>').attr('class', 'text-muted small text-truncate').append(target_email)
						).appendTo(container);

					var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
							$('<a/>').attr('class', 'btn btn-primary btn-right button-remove-request').append("Remove Friend")
						).appendTo(container);
					$('#friend-list').append(li);

					$('.button-remove-request').on('click', function() {
						console.log('you clicked on remove friend request');
						var parent = $(this).closest('div');
						parent.find('.button-remove-request').remove();
						parent.append(
								$('<a/>').attr('class', 'btn btn-light disabled')
										 .append(
										 	$('<i/>').attr('class', 'fas fa-user-plus').css('color', 'green')
										 )
							  ).append(
							  	'Removed'
							  );
						apigClient.friendRemoveFriendUid1Uid2Delete({
				      "uid1": user['user_id'],
				      "uid2": target_id
						}, {}).then(function(result){console.log(result);})
					});
				}
			});
		});


		// populate #notification-list with notifications, hide #friend-list
		$('#button-notifications').on('click', function() {
			$(this).addClass('active');
			$('#button-friends').removeClass('active');
			$('#serach-list').hide();
			$('#friend-list').hide();
			$('#notification-list').empty().show();

			apigClient.friendrequestListRequestPageLimitUidStateGet({
	      "limit": 1000,
	      "state": 1,
	      "uid": user['user_id'],
	      "page": 1
			}, {}).then(function(requests){
				if (requests['data'].length == 0) {
					$('#notification-list').append(
						$('<li/>').attr('class', 'list-group-item friends-item').css('clear', 'none').append(
								"you have no friend request"
							)
					)
					return;
				}
				requests = requests['data']
				for (var i = 0; i < requests.length; i++) {
					var request = JSON.parse(requests[i]);
					var request_id = request['request_id'];
					var uid_src = request['request_user_id'];
					var uid_dst = request['accept_user_id'];
					var request_time = request['request_time']
					console.log(uid_src)

					apigClient.userGetByUidUidGet({
			      "uid": uid_src,
					}, {}).then(function(user_info){
						var src_email = user_info['data']['email'];
						var src_id = user_info['data']['user_id'];
						var src_name = user_info['data']['username'];

						var li = $('<li/>').attr('class', 'list-group-item').attr('id', request_id);
						var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

						var img = $('<div/>').attr('class', 'col-12 col-md-2 px-0').append(
								$('<img/>').attr('src', DEFAULT_USER_AVATAR)
										   .attr('alt', src_name)
										   .attr('class', 'rounded-circle mx-auto d-block img-fluid')
							).appendTo(container);

						var textContainer = $('<div/>').attr('class', 'col col-md-6 text-sm-left').css('clear', 'none').append(
								$('<label/>').attr('class', 'name lead').append(src_name)
							).append(
								$('<br>')
							).append(
								$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip')
							).append(
								$('<span/>').attr('class', 'text-muted small text-truncate').append(src_email)
							).appendTo(container);

						var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
								$('<a/>').attr('class', 'btn btn-primary button-left button-confirm-request').css("margin-right", "4%").append("confirm")
							).append(
								$('<a/>').attr('class', 'btn btn-danger button-left button-ignore-request').append("ignore")
							).appendTo(container);
						$('#notification-list').append(li);

						$('.button-confirm-request').on('click', function() {
							console.log('you clicked on confirm');
							var parent = $(this).closest('.controls');
							parent.find('.button-confirm-request').remove();
							parent.find('.button-ignore-request').remove();
							parent.append(
									$('<a/>').attr('class', 'btn btn-light disabled')
											 .append(
											 	$('<i/>').attr('class', 'fas fa-check').css('color', 'green')
											 )
								  ).append(
								  	'Friends'
								  );
							// TODO api, confirm request
							console.log(li.attr('id'));
				    	apigClient.friendrequestAnswerRequestRequestidStatePost({
								"requestid": li.attr('id'),
								"state":  2
				    	}, {}).then(function(result1){
				    		apigClient.friendAddFriendUid1Uid2Post({
						      "uid1": user['user_id'],
						      "uid2": src_id
								}, {}).then(function(result2){console.log(result2);})
				    	})
						});

						$('.button-ignore-request').on('click', function() {
							console.log('you clicked on ignore');
							var parent = $(this).closest('div');
							parent.find('.button-confirm-request').remove();
							parent.find('.button-ignore-request').remove();
							parent.append(
									$('<a/>').attr('class', 'btn btn-light disabled')
											 .append(
											 	$('<i/>').attr('class', 'fas fa-times').css('color', 'red')
											 )
								  ).append(
								  	'Ignored'
								  );
							// TODO api, ignore request
				    	apigClient.friendrequestAnswerRequestRequestidStatePost({
								"requestid": li.attr('id'),
								"state":  3
				    	}, {}).then(function(result){console.log(result);})
						});
					});
				}
			});
		});

		$('#friend-request-input').on('change', function() {
			var target_email = $('#friend-request-input').val();	//TODO
			// TODO call api, search username

			$('#button-friends').removeClass('active');
			$('#button-notifications').removeClass('active');
			$('#friend-list').hide();
			$('#notification-list').hide();
			$('#search-list').empty().show();

			apigClient.userGetByEmailEmailGet({
	      "email": target_email,
			}, {}).then(function(search_result){
				if (search_result['data']['reason'] != null || search_result['data']['reason'] != undefined) {
					$('#search-list').append(
							$('<li/>').attr('class', 'list-group-item').append("no results found")
						);
					return;
				}
				console.log(search_result)
				var target_email = search_result['data']['email'];
				var target_id = search_result['data']['user_id'];
				var target_name = search_result['data']['username'];
				console.log(target_id);

				var li = $('<li/>').attr('class', 'list-group-item');
				var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

				var img = $('<div/>').attr('class', 'col-12 col-md-2 px-0').append(
						$('<img/>').attr('alt', target_name)
								   .attr('src', DEFAULT_USER_AVATAR)	
								   .attr('class', 'rounded-circle mx-auto d-block img-fluid')
					).appendTo(container);

				var textContainer = $('<div/>').attr('class', 'col col-md-6 text-sm-left').css('clear', 'none').append(
						$('<label/>').attr('class', 'name lead').append(target_name)
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-envelope fa-fw text-muted').attr('data-toggle', 'tooltip')
					).append(
						$('<span/>').attr('class', 'text-muted small text-truncate').append(target_email)
					).appendTo(container);

	    	apigClient.friendIsFriendUid1Uid2Get({
		      "uid1": user['user_id'],
		      "uid2": target_id
				}, {}).then(function(result){
					if (!result['data']['result'] && target_id != user['user_id']) {
						var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
							$('<a/>').attr('class', 'btn btn-primary btn-right button-send-request').append("Add Friend")
						).appendTo(container);
					}

					$('#search-list').append(li);
					$('.button-send-request').on('click', function() {
						console.log('you clicked on send friend request');
						var parent = $(this).closest('div');
						parent.find('.button-send-request').remove();
						parent.append(
								$('<a/>').attr('class', 'btn btn-light disabled')
										 .append(
										 	$('<i/>').attr('class', 'fas fa-user-plus').css('color', 'green')
										 )
							  ).append(
							  	'Request Sent'
							  );
						apigClient.friendrequestSendRequestUid1Uid2Post({
				      "uid1": user['user_id'],
				      "uid2": target_id
						}, {}).then(function(result){console.log(result);})
					});
				})
			});
		});

		$('#button-friends').click();
    }());

	(function() {
		
	}());
});
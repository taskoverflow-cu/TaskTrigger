var friends = [
	{
		"name": "Mike Anamendolla",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}, 
	{
		"name": "Seth Frazier ",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'seth.ana@example.com'
	}, 
	{
		"name": "Rosemary Porter",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	},
	{
		"name": "Mike Anamendolla",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}, 
	{
		"name": "Seth Frazier ",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'seth.ana@example.com'
	}, 
	{
		"name": "Rosemary Porter",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}
];

var requests = [
	{
		"name": "Peppa Pig",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}, 
	{
		"name": "George Pig",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'seth.ana@example.com'
	}, 
	{
		"name": "Suzzy Sheep",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	},
	{
		"name": "Peppa Pig",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}, 
	{
		"name": "George Pig",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'seth.ana@example.com'
	}, 
	{
		"name": "Suzzy Sheep",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}
];

var search_result = [
	{
		"name": "Search result1",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'seth.ana@example.com'
	}, 
	{
		"name": "Search result2",
		"imgsrc": './img/zhenzhang.png',
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"email": 'mike.ana@example.com'
	}
];

$(function(){
	(function() {
		// populate #friend-list with friends, hide #notification-list
		$('#button-friends').on('click', function() {
			$(this).addClass('active');
			$('#button-notifications').removeClass('active');
			$('#search-list').hide();
			$('#notification-list').hide();
			$('#friend-list').empty().show();
			for (var i = 0; i < friends.length; i++) {
				var li = $('<li/>').attr('class', 'list-group-item friends-item').css('clear', 'none');
				var container = $('<div/>').attr('class', 'row w-100').appendTo(li);
				var img = $('<div/>').attr('class', 'col-12 col-sm-6 col-md-2 px-0').append(
						$('<img/>').attr('src', friends[i]['imgsrc'])
								   .attr('alt', friends[i]['name'])
								   .attr('class', 'mx-auto d-block img-fluid')
					).appendTo(container);
				var textContainer = $('<div/>').attr('class', 'col-12 col-md-8 text-sm-left').append(
						$('<label/>').attr('class', 'name lead').append(friends[i]['name'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', friends[i]['addr'])
					).append(
						$('<span/>').attr('class', 'text-muted').append(friends[i]['addr'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', friends[i]['phoneNum'])
					).append(
						$('<span/>').attr('class', 'text-muted small').append(friends[i]['phoneNum'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip')
					).append(
						$('<span/>').attr('class', 'text-muted small text-truncate').append(friends[i]['email'])
					).appendTo(container);
				$('#friend-list').append(li);
			}
		});


		// populate #notification-list with notifications, hide #friend-list
		$('#button-notifications').on('click', function() {
			$(this).addClass('active');
			$('#button-friends').removeClass('active');
			$('#serach-list').hide();
			$('#friend-list').hide();
			$('#notification-list').empty().show();
			
			for (var i = 0; i < requests.length; i++) {
				var li = $('<li/>').attr('class', 'list-group-item');
				var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

				var img = $('<div/>').attr('class', 'col-12 col-md-2 px-0').append(
						$('<img/>').attr('src', requests[i]['imgsrc'])
								   .attr('alt', requests[i]['name'])
								   .attr('class', 'rounded-circle mx-auto d-block img-fluid')
					).appendTo(container);

				var textContainer = $('<div/>').attr('class', 'col col-md-6 text-sm-left').css('clear', 'none').append(
						$('<label/>').attr('class', 'name lead').append(requests[i]['name'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', requests[i]['addr'])
					).append(
						$('<span/>').attr('class', 'text-muted').append(requests[i]['addr'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', requests[i]['phoneNum'])
					).append(
						$('<span/>').attr('class', 'text-muted small').append(requests[i]['phoneNum'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip')
					).append(
						$('<span/>').attr('class', 'text-muted small text-truncate').append(requests[i]['email'])
					).appendTo(container);

				var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
						$('<a/>').attr('class', 'btn btn-primary button-left button-confirm-request').css("margin-right", "4%").append("confirm")
					).append(
						$('<a/>').attr('class', 'btn btn-danger button-left button-ignore-request').append("ignore")
					).appendTo(container);
				$('#notification-list').append(li);
			}

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
			});
		});

		$('#button-search').on('click', function() {
			var target_username = $('#friend-request-input').val();
			// TODO call api, search username

			$('#button-friends').removeClass('active');
			$('#button-notifications').removeClass('active');
			$('#friend-list').hide();
			$('#notification-list').hide();
			$('#search-list').empty().show();
			
			for (var i = 0; i < search_result.length; i++) {
				var li = $('<li/>').attr('class', 'list-group-item');
				var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

				var img = $('<div/>').attr('class', 'col-12 col-md-2 px-0').append(
						$('<img/>').attr('src', requests[i]['imgsrc'])
								   .attr('alt', requests[i]['name'])
								   .attr('class', 'rounded-circle mx-auto d-block img-fluid')
					).appendTo(container);

				var textContainer = $('<div/>').attr('class', 'col col-md-6 text-sm-left').css('clear', 'none').append(
						$('<label/>').attr('class', 'name lead').append(requests[i]['name'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', requests[i]['addr'])
					).append(
						$('<span/>').attr('class', 'text-muted').append(requests[i]['addr'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', requests[i]['phoneNum'])
					).append(
						$('<span/>').attr('class', 'text-muted small').append(requests[i]['phoneNum'])
					).append(
						$('<br>')
					).append(
						$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip')
					).append(
						$('<span/>').attr('class', 'text-muted small text-truncate').append(requests[i]['email'])
					).appendTo(container);

				var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
						$('<a/>').attr('class', 'btn btn-primary btn-right button-send-request').append("Add Friend")
					).appendTo(container);
				$('#search-list').append(li);
			}

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
				// TODO api, send request
			});
		});

		$('#button-friends').click();
    }());

	(function() {
		
	}());
});
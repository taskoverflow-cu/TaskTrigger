window.onload=function(){
	$(document).ready(function() {
		var friends = [
			{
				"name": "Mike Anamendolla",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/m101.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}, 
			{
				"name": "Seth Frazier ",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w102.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'seth.ana@example.com'
			}, 
			{
				"name": "Rosemary Porter",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w103.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			},
			{
				"name": "Mike Anamendolla",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/m101.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}, 
			{
				"name": "Seth Frazier ",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w102.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'seth.ana@example.com'
			}, 
			{
				"name": "Rosemary Porter",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w103.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}
		]

		// populate #friend-list with friends, hide #notification-list
		$('#button-friends').on('click', function() {
			$(this).addClass('active');
			$('#button-notifications').removeClass('active');
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


		var requests = [
			{
				"name": "Peppa Pig",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/m104.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}, 
			{
				"name": "George Pig",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w105.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'seth.ana@example.com'
			}, 
			{
				"name": "Suzzy Sheep",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w106.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			},
			{
				"name": "Peppa Pig",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/m104.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}, 
			{
				"name": "George Pig",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w105.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'seth.ana@example.com'
			}, 
			{
				"name": "Suzzy Sheep",
				"imgsrc": 'http://demos.themes.guide/bodeo/assets/images/users/w106.jpg',
				"addr": '5842 Hillcrest Rd',
				"phoneNum": '(870) 288-4149',
				"email": 'mike.ana@example.com'
			}
		]

		// populate #notification-list with notifications, hide #friend-list
		$('#button-notifications').on('click', function() {
			$(this).addClass('active');
			$('#button-friends').removeClass('active');
			$('#friend-list').hide();
			$('#notification-list').empty().show();
			
			for (var i = 0; i < requests.length; i++) {
				var li = $('<li/>').attr('class', 'list-group-item notification-item');
				var container = $('<div/>').attr('class', 'row w-100').attr('id', 'notification-'+i).appendTo(li);

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

				var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle').append(
						$('<a/>').attr('id', 'button-confirm-request').attr('class', 'btn btn-success').on('click', function() {
							console.log('you clicked on confirm');
							$(this).closest('li').animate({
								margin: '0px',
								padding: '0px',
								height: '0px'
							}, 500, function() {
								$(this).remove();
								if ($('.notification-item').length == 0) {
									var li = $('<li/>').attr('class', 'list-group-item notification-item');
									var container = $('<div/>').attr('class', 'row w-100').attr('id', 'notification-'+i).append(
											$('<div/>').css('text-align', 'center').append('No more requests')
										).appendTo(li);
									$('#notification-list').append(li);
								}
							});
							$('#alert-text').empty().append("Confirmed friend request from " + $(this).closest('li').find('.name')[0].textContent);
							$('#alert').fadeTo(2000, 500).slideUp(500);
							// TODO send confirmation to backend
						}).append(
							"confirm"
						)
					).append(
						$('<a/>').attr('id', 'button-ignore-request').attr('class', 'btn btn-danger').on('click', function() {
							console.log('you clicked on ignore');
							$(this).closest('li').animate({
								margin: '0px',
								padding: '0px',
								height: '0px'
							}, 500, function() {
								$(this).remove();
								console.log($('.notification-item').length);
								if ($('.notification-item').length == 0) {
									var li = $('<li/>').attr('class', 'list-group-item notification-item');
									var container = $('<div/>').attr('class', 'row w-100').attr('id', 'notification-'+i).append(
											$('<div/>').css('text-align', 'center').append('No more requests')
										).appendTo(li);
									$('#notification-list').append(li);
								}
							});
							$('#alert-text').empty().append("Ignored friend request from " + $(this).closest('li').find('.name')[0].textContent);
							$('#alert').fadeTo(2000, 500).slideUp(500);
						}).append(
							"ignore"
						)
					).append(
						$('<div/>').attr('class', 'spinner-border').attr('role', 'status').append(
								$('<span/>').attr('class', 'sr-only').append('Loading...')
							)
					).appendTo(container);
				$('#notification-list').append(li);
			}
		});

		$('#button-friends').click();
    });
}
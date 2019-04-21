var events = [
	{
		"name": "Java Night",
			"host": "Dr. Zhuang",
		"imgsrc": 'img/java-bordered-turquoise.png',
			"description": "Come and have fun with Java and prestigious Dr.Zhuang!",
		"addr": '5842 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '7:00 pm, Today'
	},
	{
		"name": "Hackathon with Assemblies",
			"host": "Mr. Yang",
		"imgsrc": 'img/exhaustedprogrammer.jpg',
			"description": "True man only useth assemblies - Socrates",
		"addr": '234 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '9:00 pm, Tomorrow'
	},
	{
		"name": "Drink until Overflow",
			"host": "Mr. Jia",
		"imgsrc": 'img/red-white-wine.jpg',
			"description": "True man never overflowth - Plato",
		"addr": '22 Hillcrest Rd',
		"phoneNum": '(870) 288-4149',
		"time": '11:00 pm, Feb 30th'
	}
]


$(function() {
	(function() {
		// location = xxx, starts_at = xxx, ends_at = xxx
		// TODO api, get events
		$('#event-list').empty().show();
		for (var i = 0; i < events.length; i++) {
			var li = $('<li/>').attr('class', 'list-group-item');
			var container = $('<div/>').attr('class', 'row w-100').appendTo(li);

			var img = $('<div/>').attr('class', 'col-12 col-sm-6 col-md-2 px-0')
													 .attr('id','imgDiv').append(
					$('<img/>').attr('src', events[i]['imgsrc'])
								 .attr('alt', events[i]['name'])
								 .attr('class', 'rounded-circle mx-auto d-block img-fluid')
				).appendTo(container);

			var textContainer = $('<div/>').attr('class', 'col-md-6 text-sm-left').append(
					$('<span/>').attr('class', 'float-right pulse')
				).append(
					$('<label/>').attr('class', 'name lead').append(events[i]['name'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'far fa-chess-king fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['host'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['host'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-calendar-alt fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['time'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['time'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-map-marker fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['addr'])
				).append(
					$('<span/>').attr('class', 'text-muted').append(events[i]['addr'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-phone fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['phoneNum'])
				).append(
					$('<span/>').attr('class', 'text-muted small').append(events[i]['phoneNum'])
				).append(
					$('<br>')
				).append(
					$('<span/>').attr('class', 'fa fa-info-circle fa-fw text-muted').attr('data-toggle', 'tooltip').attr('data-original-title', events[i]['description'])
				).append(
					$('<span/>').attr('class', 'text-muted small').append(events[i]['description'])
				).appendTo(container);

			var statusControl = $('<div/>').attr('class', 'col col-md-4 button-col-middle controls').append(
					$('<a/>').attr('class', 'btn btn-primary button-add-to-calendar').attr('id', 'button-add-event').append('Add to Calendar')
				).appendTo(container);

			$('#event-list').append(li);
	    }

		$('.button-add-to-calendar').on('click', function() {
			console.log('you clicked on add to calendar');
			var parent = $(this).closest('.controls');
			parent.find('.button-add-to-calendar').remove();
			parent.append(
					$('<a/>').attr('class', 'btn btn-light disabled')
							 .append(
							 	$('<i/>').attr('class', 'fas fa-check').css('color', 'green')
							 )
				  ).append(
				  	'Added'
				  );
			// TODO api, confirm request
		});
	}());

	(function() {
		$('.date')
	}());
})
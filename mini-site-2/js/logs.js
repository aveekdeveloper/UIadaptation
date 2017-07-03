var logs = {
	logs : [],
	userIpAddress : undefined,
	siteName : "mini-site-1",
	pageName : "",
	action : '',

	initialize : function() {
		var URL = window.location.href ;
		var urlElements = URL.split('/') ;
		for (var i=0; i < urlElements.length; i++) {
			if (urlElements[i].startsWith('mini-site')) {
				logs.siteName = urlElements[i] ;
				// console.log('siteName=' + logs.siteName);
				if (i+1 < urlElements.length) {
					logs.pageName = (((urlElements[i+1]).split('#'))[0]).split('?')[0].replace('.html', '') + (i+2 < urlElements.length ? '/' + (((urlElements[i+2]).split('#'))[0]).split('?')[0].replace('.html', '') : '');
				}
				// console.log('pageName=' + logs.pageName);
			}
		}
		if (URL.indexOf('?') > -1) {
			var urlParameters = URL.split('?')[1].split('&') ;
			for (var i=0; i<urlParameters.length; i++) {
				if (urlParameters[i].startsWith('action')) {
					logs.action = urlParameters[i].split('=')[1];
					// console.log(urlParameters[i]);
				}
			}
		}
		$.getJSON("http://jsonip.com?callback=?", function (data) {
			logs.userIpAddress = data.ip;
			// console.log('logs.userIpAddress=' + logs.userIpAddress);
			logs.bindLog();
			$( window ).unload(function() {
				logs.sendLog("close", '') ;
			});
			logs.sendLog("open", '') ;
		});
	},

	bindLog : function() {
		$('a').bind(						'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
		$('img').bind(						'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
		$('option').bind(					'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
		$('checkbox').bind(					'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
		$('button').bind(					'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
		$('input[type="checkbox"]').bind(	'click', function() { logs.sendLog("click", logs.chainElements($(this), true)) ; });
	},

	sendLog : function(eventName, object) {
		// console.log(JSON.stringify(log));
		var date	= new Date();
		$.ajax({
			type: "POST",
			url: "/userX/ajax/saveLog2.php",
			data :	'siteName=' + logs.siteName +
					'&pageName=' + logs.pageName +
					'&action=' + logs.action +
					'&userIpAdress=' + logs.userIpAddress +
					'&event=' + eventName +
					'&object=' + object +
					'&year=' + date.getFullYear() +
					'&month=' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) +
					'&day=' + (date.getDate() < 10 ? '0' : '') + date.getDate() +
					'&hour=' + (date.getHours() < 10 ? '0' : '') + date.getHours() +
					'&minutes=' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
					'&seconds=' +(date.getSeconds() < 10 ? '0' : '') +  date.getSeconds()
		}) ;
	},

	chainElements($element, isLeaf) {
		// console.log($element[0].tagName + ' id=' + $element.attr('id') + ' class=' + $element.attr('class') + ' data-group=' + $element.attr('data-group'));
		var name = '' ;
		if ($element[0].tagName == 'BUTTON' || $element[0].tagName == 'A' || $element[0].tagName == 'OPTION') {
			name = $element.html();
		} else if ($element[0].tagName == 'INPUT') {
			name = $element.next().html();
		} else if ($element[0].tagName == 'IMG') {
			name = $element.attr("src");
		}
		// console.log('\t1' + name);
		if (name==undefined || name === '') {
			name = $element.attr('id') ;
		}
		// console.log('\t2' + name);
		if (name==undefined || name === '') {
			name = $element.attr('data-group');
		}
		// console.log('\t3' + name);
		if (name==undefined || name === '') {
			name = $element.attr('class');
		}
		// console.log('\t4' + name);
		if ($element.parent().length > 0 && $element.parent()[0].nodeName !== 'HTML') {
			return logs.chainElements($element.parent(), false) + (name == undefined ? '' : name + (isLeaf ? '' : ' > '));
		}
		return (name == undefined ? '' : name + (isLeaf ? '' : ' > ')) ;
	}
}

$(document).ready(function(){
	logs.initialize();
});

var $container;
var filters = {};
var limite = 3;
var sessionStorageSiteNum = "site2" ;

$(document).ready(function () {
	// store filter for each group
	// sessionStorage.clear() ;

	$container = $('.isotope').isotope({
		itemSelector: '.element-item',
		layoutMode: 'fitRows',
		getSortData: {
			name: '.name',
			number: '.avis parseInt',
			prixcroissant: function (itemElem) {
				var avis = $(itemElem).find('.prix').text();
				return avis;
			},
			prixdecroissant: function (itemElem) {
				var avis = $(itemElem).find('.prix').text();
				return avis;
			}
		},
		sortAscending: {
			name: true,
			prixcroissant: true,
			prixdecroissant: false,
			number: false
		}
	});

	// filter functions
	var filterFns = {
		// show if number is greater than 50
		numberGreaterThan50: function () {
			var number = $(this).find('.number').text();
			return parseInt(number, 10) > 50;
		},
	};

	// bind sort a click
	$("#sorts select").change(function (event) {
		sessionStorage.setItem(sessionStorageSiteNum + 'sort', $('#sorts option:selected').attr('data-sort-by'));
		$container.isotope({sortBy: $('#sorts option:selected').attr('data-sort-by')});
	});

	// // change is-checked class on buttons
	// $('.group').each(function (i, Group) {
		// var $Group = $(Group);
		// $Group.on('click', 'a', function () {
			// $Group.find('.is-checked').removeClass('is-checked');
			// $(this).addClass('is-checked');
		// });
	// });

	// ECE Gestion des coches sur les cases du filtre
	$('#options input[type="checkbox"]').bind('change', function () {
		sessionStorage.setItem(sessionStorageSiteNum + $(this).attr('id'), $(this).is(':checked')) ;
		manageCheckbox($(this));
		var comboFilter = getComboFilter(filters);
		$container.isotope({filter: comboFilter});
	});

	/*
	 * Pour afficher la division qui doit être visible à l'ouverture de la page.
	 */
	$("input[type=checkbox].compare").bind('click', function() { compareChecked(); countChecked(); });

	if (sessionStorage.length > 0) {
		if ((sessionStorageSiteNum + 'sort') in sessionStorage) {
			$('#sorts option[data-sort-by="' + sessionStorage.getItem(sessionStorageSiteNum + 'sort') + '"').prop('selected', true);
			$container.isotope({sortBy: sessionStorage.getItem(sessionStorageSiteNum + 'sort')});
		}
		for (key in sessionStorage) {
			if (key != sessionStorageSiteNum + 'sort') {
				$checkbox = $('#' + key.replace(sessionStorageSiteNum, '')) ;
				if ($checkbox.length > 0) {
					// console.log('\tApply filter on ' + key + ' = ' + sessionStorage.getItem(key)) ;
					$checkbox.prop('checked', sessionStorage.getItem(key) == 'true') ;
					manageCheckbox($checkbox);
					var comboFilter = getComboFilter(filters);
					$container.isotope({filter: comboFilter});
				}
			}
		}
		// console.log(filters);
	}
	
	// Bouton "voir tout"
	$('#reinitFiltre').bind('click', function() {
		$('#options input[type="checkbox"]').prop('checked', false) ;
		$('#options input.all').click();
	});
});

function manageCheckbox($checkbox) {
	// create array for filter group, if not there yet
	var group = $checkbox.parents('.option-set').attr('data-group');
	if (!filters[ group ]) {
		filters[ group ] = [];
	}

	// reset filter group if the all box was checked
	var isAll = $checkbox.hasClass('all');
	// console.log('\tall=' + isAll);
	if (isAll) {
		if ($checkbox.is(':checked')) {
			// console.log('\\ttreset group ' + group);
			delete filters[ group ];
		}
	}

	// adds/removes box to/from filter
	sessionStorage.setItem(sessionStorageSiteNum + $checkbox.attr('id'), $checkbox.is(':checked')) ;
	var index = $.inArray($checkbox.val(), filters[ group ]);
	if ($checkbox.is(':checked')) {
		$checkbox.siblings(isAll ? 'input' : 'input.all').each( function() {
			$(this).prop('checked', false);
			sessionStorage.setItem(sessionStorageSiteNum + $(this).attr('id'), false) ;
		}) ;
		// add filter to group if box is checked
		if (!isAll && index === -1) {
			// console.log('\t\tadds ' + $checkbox.val() + ' to ' + group) ;
			filters[ group ].push($checkbox.val());
		}
	} else {
		if (!isAll && index > -1) {
			// remove filter from group
			filters[ group ].splice(index, 1);
			// if user uncheckes the last checked box, check the "all" checkbox
			if ($checkbox.siblings(':checked').length == 0) {
				$checkbox.siblings('input.all').prop('checked', true);
				sessionStorage.setItem(sessionStorageSiteNum + $checkbox.siblings('input.all').attr('id'), true) ;
			}
		}
	}
	// console.log('Ville : ' + filters[ 'ville' ]);
	// console.log('Formule : ' + filters[ 'formule' ]);
	// console.log('Activite : ' + filters[ 'activite' ]);
	// console.log('Etoile : ' + filters[ 'etoile' ]);
}

function getComboFilter(filters) {
	var i = 0;
	var comboFilters = [];
	var message = [];
	for (var prop in filters) {
		message.push(filters[ prop ].join(' '));
		var filterGroup = filters[ prop ];
		// skip to next filter group if it doesn't have any values
		if (!filterGroup.length) {
			continue;
		}
		if (i === 0) {
			// copy to new array
			comboFilters = filterGroup.slice(0);
		} else {
			var filterSelectors = [];
			// copy to fresh array
			var groupCombo = comboFilters.slice(0); // [ A, B ]
			// merge filter Groups
			for (var k = 0, len3 = filterGroup.length; k < len3; k++) {
				for (var j = 0, len2 = groupCombo.length; j < len2; j++) {
					filterSelectors.push(groupCombo[j] + filterGroup[k]); // [ 1, 2 ]
				}

			}
			// apply filter selectors to combo filters for next group
			comboFilters = filterSelectors;
		}
		i++;
	}
	var comboFilter = comboFilters.join(', ');
	return comboFilter;
}

function countChecked() {
	var n = $("input:checked.compare").length;
	if (n <= limite) {
		$("div.compare_txt").text(n + (n <= 1 ? " séjour séléctionné" : " séjours séléctionnés"));
	}
	else {
		alert('Vous ne pouvez comparer que ' + limite + ' sejours !');
		$(this).attr("checked", false);
	}
};

function compareChecked() {
	var n = $("input:checked.compare").length;
	if ($(n >= 1)) {
		$(".compare").on('click', 'button', function () {
			$("#filtre").css("display", "none");
			$("div.retour").css("display", "block");
			$(".ajouter").css("display", "block");
			$(".isotope").css({
				"width": "100%",
				"height": "auto"
			});

			$("input[type=checkbox].compare").change(function () {
				if ($(this).is(":checked")) {
					console.log($(this).parent(".element-item"));
					$(this).parent(".element-item").css("display", "block").addClass("changecompare").removeClass("element-item");
				} else {
					$(this).parent(".element-item").css("display", "none");
				}
			});
			$("input[type=checkbox].compare").change();
		});
	}
};


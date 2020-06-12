var tf;

function createHeccStandardsTable(heccData){
	var filtersConfig = {
	  // instruct TableFilter location to import ressources from
	  base_path: '/wp-content/plugins/hecc_standards_plugin/inc/tablefilter/',
	  paging: {
          results_per_page: ['Records: ', [10, 25, 50, 100]]
        },
         state: {
          types: ['local_storage'],
          filters: true,
          page_number: true,
          page_length: true,
          sort: true
        },
         extensions:[{
            name: 'sort',
        }]
	  // col_1: 'select',
	  // col_2: 'select',
	  // col_3: 'select',
	  // alternate_rows: true,
	  // rows_counter: true,
	  // btn_reset: true,
	  // loader: true,
	  // mark_active_columns: true,
	  // highlight_keywords: true,
	  // no_results_message: true,
	  // col_types: [
	  //   'string', 'string', 'number',
	  //   'number', 'number', 'number',
	  //   'number', 'number', 'number'
	  // ],
	  // custom_options: {
	  //   cols: [3],
	  //   texts: [
	  //     [
	  //       '0 - 25 000',
	  //       '100 000 - 1 500 000'
	  //     ]
	  //   ],
	  //   values: [
	  //     [
	  //       '>0 && <=25000',
	  //       '>100000 && <=1500000'
	  //     ]
	  //   ],
	  //   sorts: [false]
	  // },
	  // col_widths: [
	  //   '150px', '100px', '100px',
	  //   '70px', '100px', '70px',
	  //   '70px', '60px', '60px'
	  // ],
	  // extensions: [{
	  //   name: 'sort',
	  //   images_path: 'https://unpkg.com/tablefilter@latest/dist/tablefilter/style/themes/'
	  // }]
	};
	console.log('in function');
	if(undefined !== heccData){
		console.log(heccData);

		filter_data = populateTable(heccData);

		// if($('#standards-filters').length ){
			$('#hecc_standards_module').prepend('<div id="standards-filters"></div>');
			$('#standards-filters').append(createFilters(filter_data));
			$('#standards-filters').append('<div class="input-container"><p>Include Programs Without Currently Open Opportunities.</p><label class="switch"><input type="checkbox" checked><span class="slider round"></span></label></div>')

		// }

		if(document.getElementById('standards-table') ){
			console.log('found #standards-table');
			tf = new TableFilter('standards-table', filtersConfig);
		    tf.init();
		    console.log('tableFilter init');
		    setInitialFilterValues(); 
		}
		
	}
}

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

function get_areas(area_list){
	areas = area_list.unique().sort();
	area_text = '';
	if (areas.length < 1){
		area_text = 'No Active Areas';
	} else if (areas.length == 1){
		area_text = 'Area ' + areas[0];
	} else if (areas.length == 2){
		area_text = 'Areas ' + areas[0] + ' & ' + areas[1];
	} else if (areas.length > 2 && areas.length < 7){
		// area_text = 'Areas ';
		for (var i = 0; i <= areas.length - 2; i++) {
			area_text += areas[i] + ', ';
		}
		area_text = 'Areas ' + area_text.substring(0, area_text.length - 2) + ' & ' + areas[areas.length - 1];
	}
	else if (areas.length >= 7){
		area_text = 'Statewide';
	}
	return area_text;
}

function populateTable(heccData){
	if(heccData['standards'] !== undefined){
		
		occupation_list = [];
		area_list = [];
		for (var i = 0 ; i <= heccData['standards'].length - 1; i++) {

			area_list = [];
			line = heccData['standards'][i];
			county_list = '';
      
			// console.log(' counties length =' + line["counties"]);
			for (var key in line["counties"] ) {
				county_list += line["counties"][key]['county_text'] + ', ';
				// console.log(line["counties"][key] + ', ');
			}
			for (var key in line["counties"] ) {
				if(undefined !== line["counties"][key]['area']){
					area_list.push( line["counties"][key]['area']);
				}
				// console.log(line["counties"][key] + ', ');
			}
			// area_text = ;
			
			$('#standards-table tbody').append(
					'<tr data-ma="'+line["ma"]+'">'+
						'<td>'+line["ma"]+'</td>'+
						// '<td>'+line["symbol"]+'</td>'+
						// '<td>'+line["suffix"]+'</td>'+
						// '<td>'+line["job_title"]+'</td>'+
						// '<td>'+line["seq"]+'</td>'+
						'<td data-occupation="'+line["state_title"]+'">'+line["state_title"]+'</td>'+
						'<td data-committee="'+line["committee"]+'">'+line["committee"]+'</td>'+
						// '<td>'+line["trade_name"]+'</td>'+
						// '<td>'+line["opening_date"]+'</td>'+
						// '<td>'+line["closing_date"]+'</td>'+
						// '<td>'+county_list.substring(0, county_list.length - 2)+'</td>'+
						'<td class="area" data-area="'+area_list+'">'+get_areas(area_list)+'</td>'+
					'</tr>'
				);
			if(undefined !== line["ma"] && undefined !== line['state_title']){
				// if(undefined == occupation_list[line["ma"]]){
				// 	occupation_list[line["ma"]] = [];
				// }
				occupation_list.push( line["state_title"] );
			}
			if(undefined !== line["ma"] && '' !== county_list){
				// if(undefined == area_list[line["ma"]]){
				// 	area_list[line["ma"]] = [];
				// }
				area_list.push(county_list);
			}
		}
		// createFilters(occupation_list);
		// createFilters(area_list);
		setMapMarkers();
		return filter_data = {'Occupation' : occupation_list, 'Area' : [1,2,3,4,5,6,7]};
	}
}

function createFilters(data){
	filters_html = '';
	if(undefined !== data){
		for (var key in data) {
		  if (data.hasOwnProperty(key)){
	  		    // console.log(key + ' = ' + data[key]  );
	  		    filters_html += '<div class="input-container"><p>Search by ' + key + '</p>';
	  		    filters_html += '<select name="'+key+'" value="" onchange="getFilterValues()">';
	  		    filters_html += '<option value="0">All '+ key +'s</option>';
	  		    for (var i = 0; i <= data[key].length - 1; i++) {
	  		    	 filters_html += '<option value="'+data[key][i]+'">'+data[key][i]+'</option>';
	  		    }
	  		   
	  		    filters_html += '</select></div>';
	  		}
		}
	}
	return filters_html;

}


function resetFilters(){
	$('#standards-filters select').val(0);
	tf.setFilterValue('1', '*');
	tf.setFilterValue('3', '*');
	tf.filter();
	setMapMarkers();
	window.history.replaceState('', '', updateURLParameter(window.location.href, "occupation", "0"));
	window.history.replaceState('', '', updateURLParameter(window.location.href, "area", "0"));
}
function getFilterValues(){
	filterTerms = [];
	$('#standards-filters').find('select').each(function(){
		console.log($(this).attr('name') + ' = ' + $(this).val());
		filterTerms[$(this).attr('name')] = $(this).val();
	});
	filterListings(filterTerms);
}

function filterListings(filterTerms){
	console.log(filterTerms);
  if(filterTerms.Occupation !== "0") {
    tf.setFilterValue('1', '='+filterTerms.Occupation);
    window.history.replaceState('', '', updateURLParameter(window.location.href, "occupation", filterTerms.Occupation));

  } else {
    tf.setFilterValue('1', '*');
    window.history.replaceState('', '', updateURLParameter(window.location.href, "occupation", 0));
  }
  if(filterTerms.Area !== "0") {
    tf.setFilterValue('3', '*'+filterTerms.Area);
    window.history.replaceState('', '', updateURLParameter(window.location.href, "area", filterTerms.Area));

  } else {
    tf.setFilterValue('3', '*');
    window.history.replaceState('', '', updateURLParameter(window.location.href, "area", 0));
  }
  tf.filter();
  setMapMarkers();
}


/**
 * http://stackoverflow.com/a/10997390/11236
 */
function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
   `` }
   	if (paramVal == null){
   		paramVal = 0;
   	}
    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function getUrlParameter(name) {
    console.log('url parameter: '+ name);
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '0' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function setInitialFilterValues(){
	filterTerms = [];
	filterTerms.Area = getUrlParameter('area');
	filterTerms.Occupation = getUrlParameter('occupation');
	if(undefined !== filterTerms.Area && '' !== filterTerms.Area && filterTerms.Area !== null && filterTerms.Area !== '0' && filterTerms.Area !== 'null'){
		$('#standards-filters select[name="Area"]').val(filterTerms.Area);
	} else {
		$('#standards-filters select[name="Area"]').val(0);
		filterTerms.Area = '0';
	}
	if(undefined !== filterTerms.Occupation && '' !== filterTerms.Occupation && filterTerms.Occupation !== null && filterTerms.Occupation !== '0' && filterTerms.Occupation !== 'null'){
		$('#standards-filters select[name="Occupation"]').val(filterTerms.Occupation);
	} else {
		$('#standards-filters select[name="Occupation"]').val(0);
		filterTerms.Occupation = '0';
	}
	filterListings(filterTerms);
}

// areas = {
// 	'1' : {'Clackamas','Clatsop','Columbia','Hood River','Multnomah','Tillamook','Washington','Yamhill'},
// 	'2' : {'Benton','Lincoln','Linn','Marion','Polk'},
// 	'3' : {'Lane'},
// 	'4' : {'Coos','Curry','Douglas'},
// 	'5' : {'Jackson','Josephine','Klamath','Lake'},
// 	'6' : {'Baker','Gilliam','Malheur','Morrow','Sherman','Umatilla','Union','Wallowa','Wasco'},
// 	'7' : {'Crook','Deschutes','Grant','Harney','Jefferson','Wheeler'}
// }





// loop through markers and add them to the list of occupations. occupation['bricklayer'] = ['ma#123','ma#456']
// to allow quick sort of markers











// Initialize and add the map, 
function createInfobox(data){
	var content = '<div id="infobox'+data['ma']+'">'+
		'<p>MA# '+data['ma']+'<br>'+
			'<strong>'+data['committee']+'</strong>'+
			// '<br>'+PRINTABLE_ADDRESS+'<br>'+
			// '<br>'+OCCUPATIONS FOR THIS COMMITTEE+'<br>'+
			'<br>'+
			'<a target="_blank" href="https://oregonapprenticeship.org/open-opportunities?ma='+data['ma']+'">View Opportunities</a>'+
			'</p>'+
	'</div>';
	return content;
}

function initMap() {
	var infoWindows = [];
    var gmarkers = [];
    var polygons = [];
 
    var centerMark = { lat: parseFloat(44.059635), lng: parseFloat(-121.314647) };


    var map = new google.maps.Map(document.getElementById("standards-map"), {
        zoom: 7,
        center: centerMark,
        
    });

    var boundaries = {
  "areas": [
    {
      "name": "Area 1",
      "color": "#e028ca",
      "counties": [
        {
          "name": "Clackamas",
          "boundaries": [
            {
              "lng": -121.701557,
              "lat": 45.230198
            },
            {
              "lng": -121.714672,
              "lat": 45.212181
            },
            {
              "lng": -121.749311,
              "lat": 45.201737
            },
            {
              "lng": -121.745966,
              "lat": 45.186272
            },
            {
              "lng": -121.726835,
              "lat": 45.160288
            },
            {
              "lng": -121.711058,
              "lat": 45.15111
            },
            {
              "lng": -121.706005,
              "lat": 45.131922
            },
            {
              "lng": -121.692519,
              "lat": 45.117628
            },
            {
              "lng": -121.665417,
              "lat": 45.119274
            },
            {
              "lng": -121.652179,
              "lat": 45.086388
            },
            {
              "lng": -121.659355,
              "lat": 45.066511
            },
            {
              "lng": -121.68431,
              "lat": 45.067782
            },
            {
              "lng": -121.718798,
              "lat": 45.050102
            },
            {
              "lng": -121.718592,
              "lat": 45.038079
            },
            {
              "lng": -121.74758,
              "lat": 45.033365
            },
            {
              "lng": -121.769843,
              "lat": 45.039938
            },
            {
              "lng": -121.781471,
              "lat": 45.034032
            },
            {
              "lng": -121.780878,
              "lat": 45.015206
            },
            {
              "lng": -121.805051,
              "lat": 45.01131
            },
            {
              "lng": -121.802086,
              "lat": 44.978341
            },
            {
              "lng": -121.790215,
              "lat": 44.956502
            },
            {
              "lng": -121.798278,
              "lat": 44.938202
            },
            {
              "lng": -121.759785,
              "lat": 44.93954
            },
            {
              "lng": -121.743683,
              "lat": 44.92084
            },
            {
              "lng": -121.746883,
              "lat": 44.91414
            },
            {
              "lng": -121.713982,
              "lat": 44.906139
            },
            {
              "lng": -121.734167,
              "lat": 44.885782
            },
            {
              "lng": -122.395327,
              "lat": 44.885734
            },
            {
              "lng": -122.395861,
              "lat": 44.901832
            },
            {
              "lng": -122.414816,
              "lat": 44.903969
            },
            {
              "lng": -122.441605,
              "lat": 44.903943
            },
            {
              "lng": -122.480643,
              "lat": 44.921775
            },
            {
              "lng": -122.508396,
              "lat": 44.919805
            },
            {
              "lng": -122.53515,
              "lat": 44.936464
            },
            {
              "lng": -122.571047,
              "lat": 44.984984
            },
            {
              "lng": -122.59271,
              "lat": 44.989337
            },
            {
              "lng": -122.596216,
              "lat": 45.019928
            },
            {
              "lng": -122.658664,
              "lat": 45.035968
            },
            {
              "lng": -122.667342,
              "lat": 45.04487
            },
            {
              "lng": -122.705561,
              "lat": 45.059429
            },
            {
              "lng": -122.749606,
              "lat": 45.107199
            },
            {
              "lng": -122.788386,
              "lat": 45.130129
            },
            {
              "lng": -122.776852,
              "lat": 45.153277
            },
            {
              "lng": -122.756995,
              "lat": 45.172761
            },
            {
              "lng": -122.745417,
              "lat": 45.216243
            },
            {
              "lng": -122.752007,
              "lat": 45.230029
            },
            {
              "lng": -122.738988,
              "lat": 45.259532
            },
            {
              "lng": -122.821057,
              "lat": 45.274049
            },
            {
              "lng": -122.849723,
              "lat": 45.259654
            },
            {
              "lng": -122.867816,
              "lat": 45.259585
            },
            {
              "lng": -122.868009,
              "lat": 45.317376
            },
            {
              "lng": -122.846515,
              "lat": 45.317191
            },
            {
              "lng": -122.846241,
              "lat": 45.346184
            },
            {
              "lng": -122.743741,
              "lat": 45.33201
            },
            {
              "lng": -122.744065,
              "lat": 45.433283
            },
            {
              "lng": -122.648725,
              "lat": 45.432718
            },
            {
              "lng": -122.660979,
              "lat": 45.457819
            },
            {
              "lng": -122.641413,
              "lat": 45.458702
            },
            {
              "lng": -122.64158,
              "lat": 45.46149
            },
            {
              "lng": -121.822,
              "lat": 45.460222
            },
            {
              "lng": -121.820394,
              "lat": 45.461666
            },
            {
              "lng": -121.806848,
              "lat": 45.454326
            },
            {
              "lng": -121.80594,
              "lat": 45.435472
            },
            {
              "lng": -121.775182,
              "lat": 45.402668
            },
            {
              "lng": -121.722935,
              "lat": 45.394057
            },
            {
              "lng": -121.699615,
              "lat": 45.378996
            },
            {
              "lng": -121.702958,
              "lat": 45.330335
            },
            {
              "lng": -121.679473,
              "lat": 45.295422
            },
            {
              "lng": -121.696808,
              "lat": 45.258017
            },
            {
              "lng": -121.682607,
              "lat": 45.228988
            },
            {
              "lng": -121.701557,
              "lat": 45.230198
            }
          ]
        },
        {
          "name": "Clatsop",
          "boundaries": [
            {
              "lng": -123.96934,
              "lat": 45.783197
            },
            {
              "lng": -123.961544,
              "lat": 45.837101
            },
            {
              "lng": -123.962736,
              "lat": 45.869974
            },
            {
              "lng": -123.96763,
              "lat": 45.907807
            },
            {
              "lng": -123.979501,
              "lat": 45.930389
            },
            {
              "lng": -123.99304,
              "lat": 45.938842
            },
            {
              "lng": -123.993703,
              "lat": 45.946431
            },
            {
              "lng": -123.969991,
              "lat": 45.969139
            },
            {
              "lng": -123.957438,
              "lat": 45.974469
            },
            {
              "lng": -123.941831,
              "lat": 45.97566
            },
            {
              "lng": -123.937471,
              "lat": 45.977306
            },
            {
              "lng": -123.927891,
              "lat": 46.009564
            },
            {
              "lng": -123.92933,
              "lat": 46.041978
            },
            {
              "lng": -123.933366,
              "lat": 46.071672
            },
            {
              "lng": -123.947531,
              "lat": 46.116131
            },
            {
              "lng": -123.95919,
              "lat": 46.141675
            },
            {
              "lng": -123.974124,
              "lat": 46.168798
            },
            {
              "lng": -123.996766,
              "lat": 46.20399
            },
            {
              "lng": -124.010344,
              "lat": 46.223514
            },
            {
              "lng": -124.024305,
              "lat": 46.229256
            },
            {
              "lng": -124.011355,
              "lat": 46.236223
            },
            {
              "lng": -124.001998,
              "lat": 46.237316
            },
            {
              "lng": -123.998052,
              "lat": 46.235327
            },
            {
              "lng": -123.988429,
              "lat": 46.224132
            },
            {
              "lng": -123.990117,
              "lat": 46.21763
            },
            {
              "lng": -123.987196,
              "lat": 46.211521
            },
            {
              "lng": -123.982149,
              "lat": 46.209662
            },
            {
              "lng": -123.961739,
              "lat": 46.207916
            },
            {
              "lng": -123.950148,
              "lat": 46.204097
            },
            {
              "lng": -123.927038,
              "lat": 46.191617
            },
            {
              "lng": -123.912405,
              "lat": 46.17945
            },
            {
              "lng": -123.9042,
              "lat": 46.169293
            },
            {
              "lng": -123.891186,
              "lat": 46.164778
            },
            {
              "lng": -123.854801,
              "lat": 46.157342
            },
            {
              "lng": -123.842849,
              "lat": 46.160529
            },
            {
              "lng": -123.841521,
              "lat": 46.169824
            },
            {
              "lng": -123.863347,
              "lat": 46.18235
            },
            {
              "lng": -123.866643,
              "lat": 46.187674
            },
            {
              "lng": -123.864209,
              "lat": 46.189527
            },
            {
              "lng": -123.838801,
              "lat": 46.192211
            },
            {
              "lng": -123.821834,
              "lat": 46.190293
            },
            {
              "lng": -123.793936,
              "lat": 46.196283
            },
            {
              "lng": -123.759976,
              "lat": 46.2073
            },
            {
              "lng": -123.736747,
              "lat": 46.200687
            },
            {
              "lng": -123.71278,
              "lat": 46.198751
            },
            {
              "lng": -123.706667,
              "lat": 46.199665
            },
            {
              "lng": -123.67538,
              "lat": 46.212401
            },
            {
              "lng": -123.673831,
              "lat": 46.215418
            },
            {
              "lng": -123.666751,
              "lat": 46.218228
            },
            {
              "lng": -123.65539,
              "lat": 46.217974
            },
            {
              "lng": -123.636474,
              "lat": 46.214359
            },
            {
              "lng": -123.6325,
              "lat": 46.216681
            },
            {
              "lng": -123.626247,
              "lat": 46.226434
            },
            {
              "lng": -123.625219,
              "lat": 46.233868
            },
            {
              "lng": -123.622812,
              "lat": 46.23664
            },
            {
              "lng": -123.613459,
              "lat": 46.239228
            },
            {
              "lng": -123.605487,
              "lat": 46.2393
            },
            {
              "lng": -123.60019,
              "lat": 46.234814
            },
            {
              "lng": -123.586205,
              "lat": 46.228654
            },
            {
              "lng": -123.548194,
              "lat": 46.248245
            },
            {
              "lng": -123.547659,
              "lat": 46.259109
            },
            {
              "lng": -123.538092,
              "lat": 46.26061
            },
            {
              "lng": -123.526391,
              "lat": 46.263404
            },
            {
              "lng": -123.516188,
              "lat": 46.266153
            },
            {
              "lng": -123.501245,
              "lat": 46.271004
            },
            {
              "lng": -123.479644,
              "lat": 46.269131
            },
            {
              "lng": -123.474844,
              "lat": 46.267831
            },
            {
              "lng": -123.468743,
              "lat": 46.264531
            },
            {
              "lng": -123.447592,
              "lat": 46.249832
            },
            {
              "lng": -123.427629,
              "lat": 46.229348
            },
            {
              "lng": -123.430847,
              "lat": 46.181827
            },
            {
              "lng": -123.371433,
              "lat": 46.146372
            },
            {
              "lng": -123.363636,
              "lat": 46.146324
            },
            {
              "lng": -123.366034,
              "lat": 46.039933
            },
            {
              "lng": -123.358334,
              "lat": 46.039833
            },
            {
              "lng": -123.36039,
              "lat": 45.874836
            },
            {
              "lng": -123.358746,
              "lat": 45.836534
            },
            {
              "lng": -123.360962,
              "lat": 45.779669
            },
            {
              "lng": -123.484872,
              "lat": 45.779913
            },
            {
              "lng": -123.4849,
              "lat": 45.775427
            },
            {
              "lng": -123.63363,
              "lat": 45.773276
            },
            {
              "lng": -123.719288,
              "lat": 45.77315
            },
            {
              "lng": -123.719334,
              "lat": 45.783326
            },
            {
              "lng": -123.96934,
              "lat": 45.783197
            }
          ]
        },
        {
          "name": "Columbia",
          "boundaries": [
            {
              "lng": -123.363636,
              "lat": 46.146324
            },
            {
              "lng": -123.332335,
              "lat": 46.146132
            },
            {
              "lng": -123.301034,
              "lat": 46.144632
            },
            {
              "lng": -123.280166,
              "lat": 46.144843
            },
            {
              "lng": -123.251233,
              "lat": 46.156452
            },
            {
              "lng": -123.231196,
              "lat": 46.16615
            },
            {
              "lng": -123.213054,
              "lat": 46.172541
            },
            {
              "lng": -123.166414,
              "lat": 46.188973
            },
            {
              "lng": -123.115904,
              "lat": 46.185268
            },
            {
              "lng": -123.105021,
              "lat": 46.177676
            },
            {
              "lng": -123.051064,
              "lat": 46.153599
            },
            {
              "lng": -123.041297,
              "lat": 46.146351
            },
            {
              "lng": -123.03382,
              "lat": 46.144336
            },
            {
              "lng": -123.022147,
              "lat": 46.13911
            },
            {
              "lng": -123.009436,
              "lat": 46.136043
            },
            {
              "lng": -123.004233,
              "lat": 46.133823
            },
            {
              "lng": -122.962681,
              "lat": 46.104817
            },
            {
              "lng": -122.904119,
              "lat": 46.083734
            },
            {
              "lng": -122.884478,
              "lat": 46.06028
            },
            {
              "lng": -122.878092,
              "lat": 46.031281
            },
            {
              "lng": -122.856158,
              "lat": 46.014469
            },
            {
              "lng": -122.837638,
              "lat": 45.98082
            },
            {
              "lng": -122.813998,
              "lat": 45.960984
            },
            {
              "lng": -122.806193,
              "lat": 45.932416
            },
            {
              "lng": -122.81151,
              "lat": 45.912725
            },
            {
              "lng": -122.798091,
              "lat": 45.884333
            },
            {
              "lng": -122.785026,
              "lat": 45.867699
            },
            {
              "lng": -122.785515,
              "lat": 45.850536
            },
            {
              "lng": -122.785696,
              "lat": 45.844216
            },
            {
              "lng": -122.795963,
              "lat": 45.825024
            },
            {
              "lng": -122.795605,
              "lat": 45.81
            },
            {
              "lng": -122.769532,
              "lat": 45.780583
            },
            {
              "lng": -122.761451,
              "lat": 45.759163
            },
            {
              "lng": -122.760108,
              "lat": 45.734413
            },
            {
              "lng": -122.762182,
              "lat": 45.728598
            },
            {
              "lng": -122.784555,
              "lat": 45.721431
            },
            {
              "lng": -122.928961,
              "lat": 45.721502
            },
            {
              "lng": -122.928464,
              "lat": 45.736076
            },
            {
              "lng": -122.990146,
              "lat": 45.736571
            },
            {
              "lng": -122.990086,
              "lat": 45.750998
            },
            {
              "lng": -123.031869,
              "lat": 45.751466
            },
            {
              "lng": -123.030996,
              "lat": 45.779199
            },
            {
              "lng": -123.360962,
              "lat": 45.779669
            },
            {
              "lng": -123.358746,
              "lat": 45.836534
            },
            {
              "lng": -123.36039,
              "lat": 45.874836
            },
            {
              "lng": -123.358334,
              "lat": 46.039833
            },
            {
              "lng": -123.366034,
              "lat": 46.039933
            },
            {
              "lng": -123.363636,
              "lat": 46.146324
            }
          ]
        },
        {
          "name": "Hood River",
          "boundaries": [
            {
              "lng": -121.922236,
              "lat": 45.649083
            },
            {
              "lng": -121.908267,
              "lat": 45.654399
            },
            {
              "lng": -121.900858,
              "lat": 45.662009
            },
            {
              "lng": -121.901855,
              "lat": 45.670716
            },
            {
              "lng": -121.867167,
              "lat": 45.693277
            },
            {
              "lng": -121.820055,
              "lat": 45.704649
            },
            {
              "lng": -121.811304,
              "lat": 45.706761
            },
            {
              "lng": -121.735104,
              "lat": 45.694039
            },
            {
              "lng": -121.707358,
              "lat": 45.694809
            },
            {
              "lng": -121.668362,
              "lat": 45.705082
            },
            {
              "lng": -121.631167,
              "lat": 45.704657
            },
            {
              "lng": -121.533106,
              "lat": 45.726541
            },
            {
              "lng": -121.522392,
              "lat": 45.724677
            },
            {
              "lng": -121.499153,
              "lat": 45.720846
            },
            {
              "lng": -121.462849,
              "lat": 45.701367
            },
            {
              "lng": -121.441045,
              "lat": 45.69727
            },
            {
              "lng": -121.440612,
              "lat": 45.519301
            },
            {
              "lng": -121.482525,
              "lat": 45.519619
            },
            {
              "lng": -121.481527,
              "lat": 45.258279
            },
            {
              "lng": -121.696808,
              "lat": 45.258017
            },
            {
              "lng": -121.679473,
              "lat": 45.295422
            },
            {
              "lng": -121.702958,
              "lat": 45.330335
            },
            {
              "lng": -121.699615,
              "lat": 45.378996
            },
            {
              "lng": -121.722935,
              "lat": 45.394057
            },
            {
              "lng": -121.775182,
              "lat": 45.402668
            },
            {
              "lng": -121.80594,
              "lat": 45.435472
            },
            {
              "lng": -121.806848,
              "lat": 45.454326
            },
            {
              "lng": -121.820394,
              "lat": 45.461666
            },
            {
              "lng": -121.863178,
              "lat": 45.492711
            },
            {
              "lng": -121.86945,
              "lat": 45.514257
            },
            {
              "lng": -121.906742,
              "lat": 45.520497
            },
            {
              "lng": -121.916862,
              "lat": 45.543576
            },
            {
              "lng": -121.901866,
              "lat": 45.556172
            },
            {
              "lng": -121.918483,
              "lat": 45.586384
            },
            {
              "lng": -121.922236,
              "lat": 45.649083
            }
          ]
        },
        {
          "name": "Multnomah",
          "boundaries": [
            {
              "lng": -122.762182,
              "lat": 45.728598
            },
            {
              "lng": -122.772511,
              "lat": 45.699637
            },
            {
              "lng": -122.774511,
              "lat": 45.680437
            },
            {
              "lng": -122.76381,
              "lat": 45.657138
            },
            {
              "lng": -122.738109,
              "lat": 45.644138
            },
            {
              "lng": -122.713309,
              "lat": 45.637438
            },
            {
              "lng": -122.691008,
              "lat": 45.624739
            },
            {
              "lng": -122.675008,
              "lat": 45.618039
            },
            {
              "lng": -122.643907,
              "lat": 45.609739
            },
            {
              "lng": -122.602606,
              "lat": 45.607639
            },
            {
              "lng": -122.581406,
              "lat": 45.60394
            },
            {
              "lng": -122.548149,
              "lat": 45.596768
            },
            {
              "lng": -122.523668,
              "lat": 45.589632
            },
            {
              "lng": -122.492259,
              "lat": 45.583281
            },
            {
              "lng": -122.479315,
              "lat": 45.579761
            },
            {
              "lng": -122.474659,
              "lat": 45.578305
            },
            {
              "lng": -122.453891,
              "lat": 45.567313
            },
            {
              "lng": -122.438674,
              "lat": 45.563585
            },
            {
              "lng": -122.410706,
              "lat": 45.567633
            },
            {
              "lng": -122.391802,
              "lat": 45.574541
            },
            {
              "lng": -122.380302,
              "lat": 45.575941
            },
            {
              "lng": -122.352802,
              "lat": 45.569441
            },
            {
              "lng": -122.331502,
              "lat": 45.548241
            },
            {
              "lng": -122.294901,
              "lat": 45.543541
            },
            {
              "lng": -122.266701,
              "lat": 45.543841
            },
            {
              "lng": -122.262625,
              "lat": 45.544321
            },
            {
              "lng": -122.248993,
              "lat": 45.547745
            },
            {
              "lng": -122.2017,
              "lat": 45.564141
            },
            {
              "lng": -122.183695,
              "lat": 45.577696
            },
            {
              "lng": -122.14075,
              "lat": 45.584508
            },
            {
              "lng": -122.129548,
              "lat": 45.582945
            },
            {
              "lng": -122.12949,
              "lat": 45.582967
            },
            {
              "lng": -122.126197,
              "lat": 45.582573
            },
            {
              "lng": -122.126197,
              "lat": 45.582617
            },
            {
              "lng": -122.112356,
              "lat": 45.581409
            },
            {
              "lng": -122.101675,
              "lat": 45.583516
            },
            {
              "lng": -122.044374,
              "lat": 45.609516
            },
            {
              "lng": -122.022571,
              "lat": 45.615151
            },
            {
              "lng": -122.00369,
              "lat": 45.61593
            },
            {
              "lng": -121.983038,
              "lat": 45.622812
            },
            {
              "lng": -121.979797,
              "lat": 45.624839
            },
            {
              "lng": -121.963547,
              "lat": 45.632784
            },
            {
              "lng": -121.955734,
              "lat": 45.643559
            },
            {
              "lng": -121.951838,
              "lat": 45.644951
            },
            {
              "lng": -121.935149,
              "lat": 45.644169
            },
            {
              "lng": -121.922236,
              "lat": 45.649083
            },
            {
              "lng": -121.918483,
              "lat": 45.586384
            },
            {
              "lng": -121.901866,
              "lat": 45.556172
            },
            {
              "lng": -121.916862,
              "lat": 45.543576
            },
            {
              "lng": -121.906742,
              "lat": 45.520497
            },
            {
              "lng": -121.86945,
              "lat": 45.514257
            },
            {
              "lng": -121.863178,
              "lat": 45.492711
            },
            {
              "lng": -121.820394,
              "lat": 45.461666
            },
            {
              "lng": -121.822,
              "lat": 45.460222
            },
            {
              "lng": -122.64158,
              "lat": 45.46149
            },
            {
              "lng": -122.641413,
              "lat": 45.458702
            },
            {
              "lng": -122.660979,
              "lat": 45.457819
            },
            {
              "lng": -122.648725,
              "lat": 45.432718
            },
            {
              "lng": -122.744065,
              "lat": 45.433283
            },
            {
              "lng": -122.743809,
              "lat": 45.440429
            },
            {
              "lng": -122.743904,
              "lat": 45.442774
            },
            {
              "lng": -122.743633,
              "lat": 45.442959
            },
            {
              "lng": -122.743608,
              "lat": 45.447667
            },
            {
              "lng": -122.743807,
              "lat": 45.447902
            },
            {
              "lng": -122.74381,
              "lat": 45.452021
            },
            {
              "lng": -122.743613,
              "lat": 45.454868
            },
            {
              "lng": -122.743862,
              "lat": 45.519515
            },
            {
              "lng": -122.764458,
              "lat": 45.529727
            },
            {
              "lng": -122.784876,
              "lat": 45.534014
            },
            {
              "lng": -122.784771,
              "lat": 45.548422
            },
            {
              "lng": -122.80561,
              "lat": 45.548439
            },
            {
              "lng": -122.805611,
              "lat": 45.562739
            },
            {
              "lng": -122.826411,
              "lat": 45.562838
            },
            {
              "lng": -122.826666,
              "lat": 45.577484
            },
            {
              "lng": -122.847026,
              "lat": 45.577504
            },
            {
              "lng": -122.846709,
              "lat": 45.591856
            },
            {
              "lng": -122.867641,
              "lat": 45.591918
            },
            {
              "lng": -122.867379,
              "lat": 45.606274
            },
            {
              "lng": -122.887992,
              "lat": 45.606401
            },
            {
              "lng": -122.887872,
              "lat": 45.620637
            },
            {
              "lng": -122.90899,
              "lat": 45.620701
            },
            {
              "lng": -122.909131,
              "lat": 45.633629
            },
            {
              "lng": -122.929222,
              "lat": 45.633969
            },
            {
              "lng": -122.928961,
              "lat": 45.721502
            },
            {
              "lng": -122.784555,
              "lat": 45.721431
            },
            {
              "lng": -122.762182,
              "lat": 45.728598
            }
          ]
        },
        {
          "name": "Tillamook",
          "boundaries": [
            {
              "lng": -124.004598,
              "lat": 45.044959
            },
            {
              "lng": -124.004386,
              "lat": 45.046197
            },
            {
              "lng": -124.004668,
              "lat": 45.048167
            },
            {
              "lng": -124.00977,
              "lat": 45.047266
            },
            {
              "lng": -124.017991,
              "lat": 45.049808
            },
            {
              "lng": -124.015851,
              "lat": 45.064759
            },
            {
              "lng": -124.012163,
              "lat": 45.076921
            },
            {
              "lng": -124.006057,
              "lat": 45.084736
            },
            {
              "lng": -124.004863,
              "lat": 45.084232
            },
            {
              "lng": -123.989529,
              "lat": 45.094045
            },
            {
              "lng": -123.975425,
              "lat": 45.145476
            },
            {
              "lng": -123.968187,
              "lat": 45.201217
            },
            {
              "lng": -123.972919,
              "lat": 45.216784
            },
            {
              "lng": -123.962887,
              "lat": 45.280218
            },
            {
              "lng": -123.964169,
              "lat": 45.317026
            },
            {
              "lng": -123.972899,
              "lat": 45.33689
            },
            {
              "lng": -123.978671,
              "lat": 45.338854
            },
            {
              "lng": -124.007756,
              "lat": 45.336813
            },
            {
              "lng": -124.007494,
              "lat": 45.33974
            },
            {
              "lng": -123.979715,
              "lat": 45.347724
            },
            {
              "lng": -123.973398,
              "lat": 45.354791
            },
            {
              "lng": -123.965728,
              "lat": 45.386242
            },
            {
              "lng": -123.960557,
              "lat": 45.430778
            },
            {
              "lng": -123.964074,
              "lat": 45.449112
            },
            {
              "lng": -123.972953,
              "lat": 45.467513
            },
            {
              "lng": -123.976544,
              "lat": 45.489733
            },
            {
              "lng": -123.970794,
              "lat": 45.493507
            },
            {
              "lng": -123.96634,
              "lat": 45.493417
            },
            {
              "lng": -123.957568,
              "lat": 45.510399
            },
            {
              "lng": -123.947556,
              "lat": 45.564878
            },
            {
              "lng": -123.956711,
              "lat": 45.571303
            },
            {
              "lng": -123.951246,
              "lat": 45.585775
            },
            {
              "lng": -123.939005,
              "lat": 45.661923
            },
            {
              "lng": -123.939448,
              "lat": 45.708795
            },
            {
              "lng": -123.943121,
              "lat": 45.727031
            },
            {
              "lng": -123.946027,
              "lat": 45.733249
            },
            {
              "lng": -123.968563,
              "lat": 45.757019
            },
            {
              "lng": -123.982578,
              "lat": 45.761815
            },
            {
              "lng": -123.981864,
              "lat": 45.768285
            },
            {
              "lng": -123.969459,
              "lat": 45.782371
            },
            {
              "lng": -123.96934,
              "lat": 45.783197
            },
            {
              "lng": -123.719334,
              "lat": 45.783326
            },
            {
              "lng": -123.719288,
              "lat": 45.77315
            },
            {
              "lng": -123.63363,
              "lat": 45.773276
            },
            {
              "lng": -123.4849,
              "lat": 45.775427
            },
            {
              "lng": -123.484872,
              "lat": 45.779913
            },
            {
              "lng": -123.360962,
              "lat": 45.779669
            },
            {
              "lng": -123.360977,
              "lat": 45.708716
            },
            {
              "lng": -123.484799,
              "lat": 45.709131
            },
            {
              "lng": -123.48472,
              "lat": 45.679313
            },
            {
              "lng": -123.464287,
              "lat": 45.679514
            },
            {
              "lng": -123.464528,
              "lat": 45.665027
            },
            {
              "lng": -123.443492,
              "lat": 45.665127
            },
            {
              "lng": -123.444041,
              "lat": 45.650775
            },
            {
              "lng": -123.423,
              "lat": 45.650695
            },
            {
              "lng": -123.423246,
              "lat": 45.636165
            },
            {
              "lng": -123.380468,
              "lat": 45.6357
            },
            {
              "lng": -123.380475,
              "lat": 45.620929
            },
            {
              "lng": -123.340758,
              "lat": 45.621698
            },
            {
              "lng": -123.341024,
              "lat": 45.607495
            },
            {
              "lng": -123.299441,
              "lat": 45.607306
            },
            {
              "lng": -123.299165,
              "lat": 45.592995
            },
            {
              "lng": -123.320262,
              "lat": 45.593077
            },
            {
              "lng": -123.319726,
              "lat": 45.578524
            },
            {
              "lng": -123.361131,
              "lat": 45.578916
            },
            {
              "lng": -123.360974,
              "lat": 45.549861
            },
            {
              "lng": -123.40232,
              "lat": 45.550069
            },
            {
              "lng": -123.401727,
              "lat": 45.535477
            },
            {
              "lng": -123.42254,
              "lat": 45.53541
            },
            {
              "lng": -123.422355,
              "lat": 45.521118
            },
            {
              "lng": -123.442733,
              "lat": 45.521198
            },
            {
              "lng": -123.441626,
              "lat": 45.491298
            },
            {
              "lng": -123.460875,
              "lat": 45.491594
            },
            {
              "lng": -123.463792,
              "lat": 45.448135
            },
            {
              "lng": -123.485624,
              "lat": 45.447895
            },
            {
              "lng": -123.486142,
              "lat": 45.433607
            },
            {
              "lng": -123.464932,
              "lat": 45.43384
            },
            {
              "lng": -123.463278,
              "lat": 45.216269
            },
            {
              "lng": -123.78441,
              "lat": 45.216034
            },
            {
              "lng": -123.784794,
              "lat": 45.076315
            },
            {
              "lng": -123.724213,
              "lat": 45.076098
            },
            {
              "lng": -123.725389,
              "lat": 45.043987
            },
            {
              "lng": -124.004598,
              "lat": 45.044959
            }
          ]
        },
        {
          "name": "Washington",
          "boundaries": [
            {
              "lng": -122.764458,
              "lat": 45.529727
            },
            {
              "lng": -122.743862,
              "lat": 45.519515
            },
            {
              "lng": -122.743613,
              "lat": 45.454868
            },
            {
              "lng": -122.74381,
              "lat": 45.452021
            },
            {
              "lng": -122.743807,
              "lat": 45.447902
            },
            {
              "lng": -122.743608,
              "lat": 45.447667
            },
            {
              "lng": -122.743633,
              "lat": 45.442959
            },
            {
              "lng": -122.743904,
              "lat": 45.442774
            },
            {
              "lng": -122.743809,
              "lat": 45.440429
            },
            {
              "lng": -122.744065,
              "lat": 45.433283
            },
            {
              "lng": -122.743741,
              "lat": 45.33201
            },
            {
              "lng": -122.846241,
              "lat": 45.346184
            },
            {
              "lng": -122.846515,
              "lat": 45.317191
            },
            {
              "lng": -122.868009,
              "lat": 45.317376
            },
            {
              "lng": -122.908866,
              "lat": 45.317128
            },
            {
              "lng": -122.908737,
              "lat": 45.346185
            },
            {
              "lng": -122.970407,
              "lat": 45.346375
            },
            {
              "lng": -122.970306,
              "lat": 45.360746
            },
            {
              "lng": -122.991522,
              "lat": 45.361002
            },
            {
              "lng": -122.991479,
              "lat": 45.375472
            },
            {
              "lng": -123.011124,
              "lat": 45.376462
            },
            {
              "lng": -123.011451,
              "lat": 45.390904
            },
            {
              "lng": -123.031976,
              "lat": 45.390453
            },
            {
              "lng": -123.03201,
              "lat": 45.404839
            },
            {
              "lng": -123.114409,
              "lat": 45.40428
            },
            {
              "lng": -123.11445,
              "lat": 45.418886
            },
            {
              "lng": -123.135227,
              "lat": 45.418888
            },
            {
              "lng": -123.135329,
              "lat": 45.433302
            },
            {
              "lng": -123.464932,
              "lat": 45.43384
            },
            {
              "lng": -123.486142,
              "lat": 45.433607
            },
            {
              "lng": -123.485624,
              "lat": 45.447895
            },
            {
              "lng": -123.463792,
              "lat": 45.448135
            },
            {
              "lng": -123.460875,
              "lat": 45.491594
            },
            {
              "lng": -123.441626,
              "lat": 45.491298
            },
            {
              "lng": -123.442733,
              "lat": 45.521198
            },
            {
              "lng": -123.422355,
              "lat": 45.521118
            },
            {
              "lng": -123.42254,
              "lat": 45.53541
            },
            {
              "lng": -123.401727,
              "lat": 45.535477
            },
            {
              "lng": -123.40232,
              "lat": 45.550069
            },
            {
              "lng": -123.360974,
              "lat": 45.549861
            },
            {
              "lng": -123.361131,
              "lat": 45.578916
            },
            {
              "lng": -123.319726,
              "lat": 45.578524
            },
            {
              "lng": -123.320262,
              "lat": 45.593077
            },
            {
              "lng": -123.299165,
              "lat": 45.592995
            },
            {
              "lng": -123.299441,
              "lat": 45.607306
            },
            {
              "lng": -123.341024,
              "lat": 45.607495
            },
            {
              "lng": -123.340758,
              "lat": 45.621698
            },
            {
              "lng": -123.380475,
              "lat": 45.620929
            },
            {
              "lng": -123.380468,
              "lat": 45.6357
            },
            {
              "lng": -123.423246,
              "lat": 45.636165
            },
            {
              "lng": -123.423,
              "lat": 45.650695
            },
            {
              "lng": -123.444041,
              "lat": 45.650775
            },
            {
              "lng": -123.443492,
              "lat": 45.665127
            },
            {
              "lng": -123.464528,
              "lat": 45.665027
            },
            {
              "lng": -123.464287,
              "lat": 45.679514
            },
            {
              "lng": -123.48472,
              "lat": 45.679313
            },
            {
              "lng": -123.484799,
              "lat": 45.709131
            },
            {
              "lng": -123.360977,
              "lat": 45.708716
            },
            {
              "lng": -123.360962,
              "lat": 45.779669
            },
            {
              "lng": -123.030996,
              "lat": 45.779199
            },
            {
              "lng": -123.031869,
              "lat": 45.751466
            },
            {
              "lng": -122.990086,
              "lat": 45.750998
            },
            {
              "lng": -122.990146,
              "lat": 45.736571
            },
            {
              "lng": -122.928464,
              "lat": 45.736076
            },
            {
              "lng": -122.928961,
              "lat": 45.721502
            },
            {
              "lng": -122.929222,
              "lat": 45.633969
            },
            {
              "lng": -122.909131,
              "lat": 45.633629
            },
            {
              "lng": -122.90899,
              "lat": 45.620701
            },
            {
              "lng": -122.887872,
              "lat": 45.620637
            },
            {
              "lng": -122.887992,
              "lat": 45.606401
            },
            {
              "lng": -122.867379,
              "lat": 45.606274
            },
            {
              "lng": -122.867641,
              "lat": 45.591918
            },
            {
              "lng": -122.846709,
              "lat": 45.591856
            },
            {
              "lng": -122.847026,
              "lat": 45.577504
            },
            {
              "lng": -122.826666,
              "lat": 45.577484
            },
            {
              "lng": -122.826411,
              "lat": 45.562838
            },
            {
              "lng": -122.805611,
              "lat": 45.562739
            },
            {
              "lng": -122.80561,
              "lat": 45.548439
            },
            {
              "lng": -122.784771,
              "lat": 45.548422
            },
            {
              "lng": -122.784876,
              "lat": 45.534014
            },
            {
              "lng": -122.764458,
              "lat": 45.529727
            }
          ]
        },
        {
          "name": "Yamhill",
          "boundaries": [
            {
              "lng": -123.724213,
              "lat": 45.076098
            },
            {
              "lng": -123.784794,
              "lat": 45.076315
            },
            {
              "lng": -123.78441,
              "lat": 45.216034
            },
            {
              "lng": -123.463278,
              "lat": 45.216269
            },
            {
              "lng": -123.464932,
              "lat": 45.43384
            },
            {
              "lng": -123.135329,
              "lat": 45.433302
            },
            {
              "lng": -123.135227,
              "lat": 45.418888
            },
            {
              "lng": -123.11445,
              "lat": 45.418886
            },
            {
              "lng": -123.114409,
              "lat": 45.40428
            },
            {
              "lng": -123.03201,
              "lat": 45.404839
            },
            {
              "lng": -123.031976,
              "lat": 45.390453
            },
            {
              "lng": -123.011451,
              "lat": 45.390904
            },
            {
              "lng": -123.011124,
              "lat": 45.376462
            },
            {
              "lng": -122.991479,
              "lat": 45.375472
            },
            {
              "lng": -122.991522,
              "lat": 45.361002
            },
            {
              "lng": -122.970306,
              "lat": 45.360746
            },
            {
              "lng": -122.970407,
              "lat": 45.346375
            },
            {
              "lng": -122.908737,
              "lat": 45.346185
            },
            {
              "lng": -122.908866,
              "lat": 45.317128
            },
            {
              "lng": -122.868009,
              "lat": 45.317376
            },
            {
              "lng": -122.867816,
              "lat": 45.259585
            },
            {
              "lng": -122.849723,
              "lat": 45.259654
            },
            {
              "lng": -122.862602,
              "lat": 45.253112
            },
            {
              "lng": -122.900435,
              "lat": 45.257063
            },
            {
              "lng": -122.915073,
              "lat": 45.267163
            },
            {
              "lng": -122.949691,
              "lat": 45.26826
            },
            {
              "lng": -122.968724,
              "lat": 45.284538
            },
            {
              "lng": -123.001537,
              "lat": 45.257217
            },
            {
              "lng": -122.999145,
              "lat": 45.224105
            },
            {
              "lng": -123.040165,
              "lat": 45.221961
            },
            {
              "lng": -123.051593,
              "lat": 45.211071
            },
            {
              "lng": -123.043347,
              "lat": 45.198634
            },
            {
              "lng": -123.020521,
              "lat": 45.199841
            },
            {
              "lng": -123.015345,
              "lat": 45.177492
            },
            {
              "lng": -123.000919,
              "lat": 45.166725
            },
            {
              "lng": -123.007996,
              "lat": 45.158324
            },
            {
              "lng": -123.03102,
              "lat": 45.158881
            },
            {
              "lng": -123.032638,
              "lat": 45.14692
            },
            {
              "lng": -123.013517,
              "lat": 45.135691
            },
            {
              "lng": -122.996823,
              "lat": 45.115672
            },
            {
              "lng": -123.012885,
              "lat": 45.103435
            },
            {
              "lng": -123.036113,
              "lat": 45.098359
            },
            {
              "lng": -123.069955,
              "lat": 45.075108
            },
            {
              "lng": -123.724213,
              "lat": 45.076098
            }
          ]
        }
      ]
    },
    {
      "name": "Area 2",
      "color": "#00cbff",
      "counties": [
        {
          "name": "Benton",
          "boundaries": [
            {
              "lng": -123.347514,
              "lat": 44.720105
            },
            {
              "lng": -123.149058,
              "lat": 44.720277
            },
            {
              "lng": -123.116892,
              "lat": 44.676966
            },
            {
              "lng": -123.092509,
              "lat": 44.675887
            },
            {
              "lng": -123.073643,
              "lat": 44.657331
            },
            {
              "lng": -123.104133,
              "lat": 44.63933
            },
            {
              "lng": -123.17088,
              "lat": 44.634245
            },
            {
              "lng": -123.171626,
              "lat": 44.621011
            },
            {
              "lng": -123.19519,
              "lat": 44.604953
            },
            {
              "lng": -123.19701,
              "lat": 44.59756
            },
            {
              "lng": -123.183202,
              "lat": 44.593077
            },
            {
              "lng": -123.19195,
              "lat": 44.585814
            },
            {
              "lng": -123.220049,
              "lat": 44.584926
            },
            {
              "lng": -123.251209,
              "lat": 44.574626
            },
            {
              "lng": -123.256196,
              "lat": 44.566101
            },
            {
              "lng": -123.260251,
              "lat": 44.559351
            },
            {
              "lng": -123.260338,
              "lat": 44.555391
            },
            {
              "lng": -123.24579,
              "lat": 44.539654
            },
            {
              "lng": -123.228938,
              "lat": 44.518445
            },
            {
              "lng": -123.21428,
              "lat": 44.490407
            },
            {
              "lng": -123.210667,
              "lat": 44.450663
            },
            {
              "lng": -123.22434,
              "lat": 44.425338
            },
            {
              "lng": -123.230136,
              "lat": 44.388538
            },
            {
              "lng": -123.221426,
              "lat": 44.359595
            },
            {
              "lng": -123.231467,
              "lat": 44.330481
            },
            {
              "lng": -123.192187,
              "lat": 44.294626
            },
            {
              "lng": -123.18398,
              "lat": 44.283691
            },
            {
              "lng": -123.593454,
              "lat": 44.281601
            },
            {
              "lng": -123.593594,
              "lat": 44.276581
            },
            {
              "lng": -123.714886,
              "lat": 44.280303
            },
            {
              "lng": -123.715125,
              "lat": 44.283897
            },
            {
              "lng": -123.77542,
              "lat": 44.283561
            },
            {
              "lng": -123.775646,
              "lat": 44.316339
            },
            {
              "lng": -123.816405,
              "lat": 44.315695
            },
            {
              "lng": -123.816931,
              "lat": 44.344804
            },
            {
              "lng": -123.734872,
              "lat": 44.345801
            },
            {
              "lng": -123.735603,
              "lat": 44.360739
            },
            {
              "lng": -123.715212,
              "lat": 44.360569
            },
            {
              "lng": -123.72042,
              "lat": 44.433053
            },
            {
              "lng": -123.597217,
              "lat": 44.43289
            },
            {
              "lng": -123.597212,
              "lat": 44.651327
            },
            {
              "lng": -123.602858,
              "lat": 44.651312
            },
            {
              "lng": -123.602566,
              "lat": 44.721191
            },
            {
              "lng": -123.580757,
              "lat": 44.719441
            },
            {
              "lng": -123.347514,
              "lat": 44.720105
            }
          ]
        },
        {
          "name": "Lincoln",
          "boundaries": [
            {
              "lng": -123.725389,
              "lat": 45.043987
            },
            {
              "lng": -123.724916,
              "lat": 44.73908
            },
            {
              "lng": -123.704539,
              "lat": 44.739063
            },
            {
              "lng": -123.704468,
              "lat": 44.721075
            },
            {
              "lng": -123.602566,
              "lat": 44.721191
            },
            {
              "lng": -123.602858,
              "lat": 44.651312
            },
            {
              "lng": -123.597212,
              "lat": 44.651327
            },
            {
              "lng": -123.597217,
              "lat": 44.43289
            },
            {
              "lng": -123.72042,
              "lat": 44.433053
            },
            {
              "lng": -123.715212,
              "lat": 44.360569
            },
            {
              "lng": -123.735603,
              "lat": 44.360739
            },
            {
              "lng": -123.734872,
              "lat": 44.345801
            },
            {
              "lng": -123.816931,
              "lat": 44.344804
            },
            {
              "lng": -123.816405,
              "lat": 44.315695
            },
            {
              "lng": -123.775646,
              "lat": 44.316339
            },
            {
              "lng": -123.77542,
              "lat": 44.283561
            },
            {
              "lng": -123.94104,
              "lat": 44.282971
            },
            {
              "lng": -123.940966,
              "lat": 44.277542
            },
            {
              "lng": -124.115849,
              "lat": 44.276277
            },
            {
              "lng": -124.1152,
              "lat": 44.286486
            },
            {
              "lng": -124.10907,
              "lat": 44.303707
            },
            {
              "lng": -124.108088,
              "lat": 44.309926
            },
            {
              "lng": -124.109556,
              "lat": 44.314545
            },
            {
              "lng": -124.100587,
              "lat": 44.331926
            },
            {
              "lng": -124.092101,
              "lat": 44.370388
            },
            {
              "lng": -124.084401,
              "lat": 44.415611
            },
            {
              "lng": -124.080989,
              "lat": 44.419728
            },
            {
              "lng": -124.071706,
              "lat": 44.423662
            },
            {
              "lng": -124.067569,
              "lat": 44.428582
            },
            {
              "lng": -124.073941,
              "lat": 44.434481
            },
            {
              "lng": -124.079301,
              "lat": 44.430863
            },
            {
              "lng": -124.082113,
              "lat": 44.441518
            },
            {
              "lng": -124.082061,
              "lat": 44.478171
            },
            {
              "lng": -124.084429,
              "lat": 44.486927
            },
            {
              "lng": -124.083601,
              "lat": 44.501123
            },
            {
              "lng": -124.076387,
              "lat": 44.531214
            },
            {
              "lng": -124.067251,
              "lat": 44.60804
            },
            {
              "lng": -124.06914,
              "lat": 44.612979
            },
            {
              "lng": -124.082326,
              "lat": 44.608861
            },
            {
              "lng": -124.084476,
              "lat": 44.611056
            },
            {
              "lng": -124.065202,
              "lat": 44.622445
            },
            {
              "lng": -124.065008,
              "lat": 44.632504
            },
            {
              "lng": -124.058281,
              "lat": 44.658866
            },
            {
              "lng": -124.060043,
              "lat": 44.669361
            },
            {
              "lng": -124.070394,
              "lat": 44.683514
            },
            {
              "lng": -124.063406,
              "lat": 44.703177
            },
            {
              "lng": -124.059077,
              "lat": 44.737656
            },
            {
              "lng": -124.066325,
              "lat": 44.762671
            },
            {
              "lng": -124.075473,
              "lat": 44.771403
            },
            {
              "lng": -124.074066,
              "lat": 44.798107
            },
            {
              "lng": -124.066746,
              "lat": 44.831191
            },
            {
              "lng": -124.063155,
              "lat": 44.835333
            },
            {
              "lng": -124.054151,
              "lat": 44.838233
            },
            {
              "lng": -124.048814,
              "lat": 44.850007
            },
            {
              "lng": -124.032296,
              "lat": 44.900809
            },
            {
              "lng": -124.025136,
              "lat": 44.928175
            },
            {
              "lng": -124.025678,
              "lat": 44.936542
            },
            {
              "lng": -124.023834,
              "lat": 44.949825
            },
            {
              "lng": -124.015243,
              "lat": 44.982904
            },
            {
              "lng": -124.004598,
              "lat": 45.044959
            },
            {
              "lng": -123.725389,
              "lat": 45.043987
            }
          ]
        },
        {
          "name": "Linn",
          "boundaries": [
            {
              "lng": -123.18398,
              "lat": 44.283691
            },
            {
              "lng": -123.192187,
              "lat": 44.294626
            },
            {
              "lng": -123.231467,
              "lat": 44.330481
            },
            {
              "lng": -123.221426,
              "lat": 44.359595
            },
            {
              "lng": -123.230136,
              "lat": 44.388538
            },
            {
              "lng": -123.22434,
              "lat": 44.425338
            },
            {
              "lng": -123.210667,
              "lat": 44.450663
            },
            {
              "lng": -123.21428,
              "lat": 44.490407
            },
            {
              "lng": -123.228938,
              "lat": 44.518445
            },
            {
              "lng": -123.24579,
              "lat": 44.539654
            },
            {
              "lng": -123.260338,
              "lat": 44.555391
            },
            {
              "lng": -123.260251,
              "lat": 44.559351
            },
            {
              "lng": -123.256196,
              "lat": 44.566101
            },
            {
              "lng": -123.251209,
              "lat": 44.574626
            },
            {
              "lng": -123.220049,
              "lat": 44.584926
            },
            {
              "lng": -123.19195,
              "lat": 44.585814
            },
            {
              "lng": -123.183202,
              "lat": 44.593077
            },
            {
              "lng": -123.19701,
              "lat": 44.59756
            },
            {
              "lng": -123.19519,
              "lat": 44.604953
            },
            {
              "lng": -123.171626,
              "lat": 44.621011
            },
            {
              "lng": -123.17088,
              "lat": 44.634245
            },
            {
              "lng": -123.104133,
              "lat": 44.63933
            },
            {
              "lng": -123.073643,
              "lat": 44.657331
            },
            {
              "lng": -123.092509,
              "lat": 44.675887
            },
            {
              "lng": -123.116892,
              "lat": 44.676966
            },
            {
              "lng": -123.149058,
              "lat": 44.720277
            },
            {
              "lng": -123.133529,
              "lat": 44.738662
            },
            {
              "lng": -123.143556,
              "lat": 44.74967
            },
            {
              "lng": -123.112816,
              "lat": 44.757863
            },
            {
              "lng": -123.104928,
              "lat": 44.749133
            },
            {
              "lng": -123.061509,
              "lat": 44.747952
            },
            {
              "lng": -123.042009,
              "lat": 44.737719
            },
            {
              "lng": -123.032396,
              "lat": 44.720978
            },
            {
              "lng": -123.016018,
              "lat": 44.721403
            },
            {
              "lng": -123.018756,
              "lat": 44.698855
            },
            {
              "lng": -123.006847,
              "lat": 44.686898
            },
            {
              "lng": -122.97513,
              "lat": 44.698037
            },
            {
              "lng": -122.956318,
              "lat": 44.720647
            },
            {
              "lng": -122.939906,
              "lat": 44.714995
            },
            {
              "lng": -122.849087,
              "lat": 44.763391
            },
            {
              "lng": -122.84607,
              "lat": 44.774521
            },
            {
              "lng": -122.825239,
              "lat": 44.771623
            },
            {
              "lng": -122.798369,
              "lat": 44.791564
            },
            {
              "lng": -122.748364,
              "lat": 44.787621
            },
            {
              "lng": -122.725189,
              "lat": 44.792915
            },
            {
              "lng": -122.71571,
              "lat": 44.781668
            },
            {
              "lng": -122.691057,
              "lat": 44.77488
            },
            {
              "lng": -122.619769,
              "lat": 44.78895
            },
            {
              "lng": -122.563727,
              "lat": 44.767975
            },
            {
              "lng": -122.521802,
              "lat": 44.763879
            },
            {
              "lng": -122.503087,
              "lat": 44.749809
            },
            {
              "lng": -122.478373,
              "lat": 44.755551
            },
            {
              "lng": -122.333969,
              "lat": 44.755645
            },
            {
              "lng": -122.318374,
              "lat": 44.759295
            },
            {
              "lng": -122.286651,
              "lat": 44.752444
            },
            {
              "lng": -122.273607,
              "lat": 44.735646
            },
            {
              "lng": -122.249732,
              "lat": 44.722133
            },
            {
              "lng": -122.219576,
              "lat": 44.693488
            },
            {
              "lng": -122.199334,
              "lat": 44.69617
            },
            {
              "lng": -122.154047,
              "lat": 44.719762
            },
            {
              "lng": -122.13441,
              "lat": 44.723111
            },
            {
              "lng": -122.11805,
              "lat": 44.7109
            },
            {
              "lng": -122.033233,
              "lat": 44.685678
            },
            {
              "lng": -121.982217,
              "lat": 44.693647
            },
            {
              "lng": -121.964788,
              "lat": 44.684121
            },
            {
              "lng": -121.794077,
              "lat": 44.68394
            },
            {
              "lng": -121.798028,
              "lat": 44.681767
            },
            {
              "lng": -121.797376,
              "lat": 44.63954
            },
            {
              "lng": -121.810876,
              "lat": 44.61674
            },
            {
              "lng": -121.795774,
              "lat": 44.58984
            },
            {
              "lng": -121.805873,
              "lat": 44.54824
            },
            {
              "lng": -121.815873,
              "lat": 44.53584
            },
            {
              "lng": -121.808172,
              "lat": 44.51494
            },
            {
              "lng": -121.822373,
              "lat": 44.51074
            },
            {
              "lng": -121.848772,
              "lat": 44.485341
            },
            {
              "lng": -121.842667,
              "lat": 44.39244
            },
            {
              "lng": -121.837265,
              "lat": 44.33494
            },
            {
              "lng": -121.840263,
              "lat": 44.28554
            },
            {
              "lng": -121.799359,
              "lat": 44.258138
            },
            {
              "lng": -122.326584,
              "lat": 44.253349
            },
            {
              "lng": -122.329082,
              "lat": 44.230349
            },
            {
              "lng": -122.381717,
              "lat": 44.209346
            },
            {
              "lng": -122.386174,
              "lat": 44.217149
            },
            {
              "lng": -122.465085,
              "lat": 44.222749
            },
            {
              "lng": -122.506512,
              "lat": 44.222957
            },
            {
              "lng": -122.535854,
              "lat": 44.234394
            },
            {
              "lng": -122.577089,
              "lat": 44.228149
            },
            {
              "lng": -122.59509,
              "lat": 44.244549
            },
            {
              "lng": -122.644755,
              "lat": 44.251879
            },
            {
              "lng": -122.647,
              "lat": 44.266593
            },
            {
              "lng": -122.720693,
              "lat": 44.280948
            },
            {
              "lng": -122.724538,
              "lat": 44.288202
            },
            {
              "lng": -122.760494,
              "lat": 44.290548
            },
            {
              "lng": -122.828094,
              "lat": 44.276948
            },
            {
              "lng": -122.864595,
              "lat": 44.287947
            },
            {
              "lng": -122.865395,
              "lat": 44.258847
            },
            {
              "lng": -122.903295,
              "lat": 44.259046
            },
            {
              "lng": -122.905594,
              "lat": 44.200247
            },
            {
              "lng": -123.165394,
              "lat": 44.200021
            },
            {
              "lng": -123.151714,
              "lat": 44.228485
            },
            {
              "lng": -123.176019,
              "lat": 44.246181
            },
            {
              "lng": -123.174678,
              "lat": 44.276494
            },
            {
              "lng": -123.18398,
              "lat": 44.283691
            }
          ]
        },
        {
          "name": "Marion",
          "boundaries": [
            {
              "lng": -123.069955,
              "lat": 45.075108
            },
            {
              "lng": -123.036113,
              "lat": 45.098359
            },
            {
              "lng": -123.012885,
              "lat": 45.103435
            },
            {
              "lng": -122.996823,
              "lat": 45.115672
            },
            {
              "lng": -123.013517,
              "lat": 45.135691
            },
            {
              "lng": -123.032638,
              "lat": 45.14692
            },
            {
              "lng": -123.03102,
              "lat": 45.158881
            },
            {
              "lng": -123.007996,
              "lat": 45.158324
            },
            {
              "lng": -123.000919,
              "lat": 45.166725
            },
            {
              "lng": -123.015345,
              "lat": 45.177492
            },
            {
              "lng": -123.020521,
              "lat": 45.199841
            },
            {
              "lng": -123.043347,
              "lat": 45.198634
            },
            {
              "lng": -123.051593,
              "lat": 45.211071
            },
            {
              "lng": -123.040165,
              "lat": 45.221961
            },
            {
              "lng": -122.999145,
              "lat": 45.224105
            },
            {
              "lng": -123.001537,
              "lat": 45.257217
            },
            {
              "lng": -122.968724,
              "lat": 45.284538
            },
            {
              "lng": -122.949691,
              "lat": 45.26826
            },
            {
              "lng": -122.915073,
              "lat": 45.267163
            },
            {
              "lng": -122.900435,
              "lat": 45.257063
            },
            {
              "lng": -122.862602,
              "lat": 45.253112
            },
            {
              "lng": -122.849723,
              "lat": 45.259654
            },
            {
              "lng": -122.821057,
              "lat": 45.274049
            },
            {
              "lng": -122.738988,
              "lat": 45.259532
            },
            {
              "lng": -122.752007,
              "lat": 45.230029
            },
            {
              "lng": -122.745417,
              "lat": 45.216243
            },
            {
              "lng": -122.756995,
              "lat": 45.172761
            },
            {
              "lng": -122.776852,
              "lat": 45.153277
            },
            {
              "lng": -122.788386,
              "lat": 45.130129
            },
            {
              "lng": -122.749606,
              "lat": 45.107199
            },
            {
              "lng": -122.705561,
              "lat": 45.059429
            },
            {
              "lng": -122.667342,
              "lat": 45.04487
            },
            {
              "lng": -122.658664,
              "lat": 45.035968
            },
            {
              "lng": -122.596216,
              "lat": 45.019928
            },
            {
              "lng": -122.59271,
              "lat": 44.989337
            },
            {
              "lng": -122.571047,
              "lat": 44.984984
            },
            {
              "lng": -122.53515,
              "lat": 44.936464
            },
            {
              "lng": -122.508396,
              "lat": 44.919805
            },
            {
              "lng": -122.480643,
              "lat": 44.921775
            },
            {
              "lng": -122.441605,
              "lat": 44.903943
            },
            {
              "lng": -122.414816,
              "lat": 44.903969
            },
            {
              "lng": -122.395861,
              "lat": 44.901832
            },
            {
              "lng": -122.395327,
              "lat": 44.885734
            },
            {
              "lng": -121.734167,
              "lat": 44.885782
            },
            {
              "lng": -121.753182,
              "lat": 44.86124
            },
            {
              "lng": -121.742081,
              "lat": 44.84534
            },
            {
              "lng": -121.75948,
              "lat": 44.82564
            },
            {
              "lng": -121.818982,
              "lat": 44.800841
            },
            {
              "lng": -121.804381,
              "lat": 44.777641
            },
            {
              "lng": -121.77228,
              "lat": 44.77614
            },
            {
              "lng": -121.759079,
              "lat": 44.76354
            },
            {
              "lng": -121.790679,
              "lat": 44.74674
            },
            {
              "lng": -121.803679,
              "lat": 44.729441
            },
            {
              "lng": -121.794077,
              "lat": 44.68394
            },
            {
              "lng": -121.964788,
              "lat": 44.684121
            },
            {
              "lng": -121.982217,
              "lat": 44.693647
            },
            {
              "lng": -122.033233,
              "lat": 44.685678
            },
            {
              "lng": -122.11805,
              "lat": 44.7109
            },
            {
              "lng": -122.13441,
              "lat": 44.723111
            },
            {
              "lng": -122.154047,
              "lat": 44.719762
            },
            {
              "lng": -122.199334,
              "lat": 44.69617
            },
            {
              "lng": -122.219576,
              "lat": 44.693488
            },
            {
              "lng": -122.249732,
              "lat": 44.722133
            },
            {
              "lng": -122.273607,
              "lat": 44.735646
            },
            {
              "lng": -122.286651,
              "lat": 44.752444
            },
            {
              "lng": -122.318374,
              "lat": 44.759295
            },
            {
              "lng": -122.333969,
              "lat": 44.755645
            },
            {
              "lng": -122.478373,
              "lat": 44.755551
            },
            {
              "lng": -122.503087,
              "lat": 44.749809
            },
            {
              "lng": -122.521802,
              "lat": 44.763879
            },
            {
              "lng": -122.563727,
              "lat": 44.767975
            },
            {
              "lng": -122.619769,
              "lat": 44.78895
            },
            {
              "lng": -122.691057,
              "lat": 44.77488
            },
            {
              "lng": -122.71571,
              "lat": 44.781668
            },
            {
              "lng": -122.725189,
              "lat": 44.792915
            },
            {
              "lng": -122.748364,
              "lat": 44.787621
            },
            {
              "lng": -122.798369,
              "lat": 44.791564
            },
            {
              "lng": -122.825239,
              "lat": 44.771623
            },
            {
              "lng": -122.84607,
              "lat": 44.774521
            },
            {
              "lng": -122.849087,
              "lat": 44.763391
            },
            {
              "lng": -122.939906,
              "lat": 44.714995
            },
            {
              "lng": -122.956318,
              "lat": 44.720647
            },
            {
              "lng": -122.97513,
              "lat": 44.698037
            },
            {
              "lng": -123.006847,
              "lat": 44.686898
            },
            {
              "lng": -123.018756,
              "lat": 44.698855
            },
            {
              "lng": -123.016018,
              "lat": 44.721403
            },
            {
              "lng": -123.032396,
              "lat": 44.720978
            },
            {
              "lng": -123.042009,
              "lat": 44.737719
            },
            {
              "lng": -123.061509,
              "lat": 44.747952
            },
            {
              "lng": -123.104928,
              "lat": 44.749133
            },
            {
              "lng": -123.112816,
              "lat": 44.757863
            },
            {
              "lng": -123.143556,
              "lat": 44.74967
            },
            {
              "lng": -123.145269,
              "lat": 44.7713
            },
            {
              "lng": -123.123815,
              "lat": 44.793154
            },
            {
              "lng": -123.096999,
              "lat": 44.799442
            },
            {
              "lng": -123.091351,
              "lat": 44.811298
            },
            {
              "lng": -123.129027,
              "lat": 44.826523
            },
            {
              "lng": -123.169435,
              "lat": 44.828745
            },
            {
              "lng": -123.178687,
              "lat": 44.833551
            },
            {
              "lng": -123.180908,
              "lat": 44.857553
            },
            {
              "lng": -123.170891,
              "lat": 44.864462
            },
            {
              "lng": -123.148436,
              "lat": 44.862009
            },
            {
              "lng": -123.145417,
              "lat": 44.876491
            },
            {
              "lng": -123.113081,
              "lat": 44.928577
            },
            {
              "lng": -123.073708,
              "lat": 44.927541
            },
            {
              "lng": -123.041107,
              "lat": 44.948141
            },
            {
              "lng": -123.040408,
              "lat": 44.988541
            },
            {
              "lng": -123.065415,
              "lat": 44.990718
            },
            {
              "lng": -123.075577,
              "lat": 45.014513
            },
            {
              "lng": -123.066313,
              "lat": 45.067162
            },
            {
              "lng": -123.069955,
              "lat": 45.075108
            }
          ]
        },
        {
          "name": "Polk",
          "boundaries": [
            {
              "lng": -123.347514,
              "lat": 44.720105
            },
            {
              "lng": -123.580757,
              "lat": 44.719441
            },
            {
              "lng": -123.602566,
              "lat": 44.721191
            },
            {
              "lng": -123.704468,
              "lat": 44.721075
            },
            {
              "lng": -123.704539,
              "lat": 44.739063
            },
            {
              "lng": -123.724916,
              "lat": 44.73908
            },
            {
              "lng": -123.725389,
              "lat": 45.043987
            },
            {
              "lng": -123.724213,
              "lat": 45.076098
            },
            {
              "lng": -123.069955,
              "lat": 45.075108
            },
            {
              "lng": -123.066313,
              "lat": 45.067162
            },
            {
              "lng": -123.075577,
              "lat": 45.014513
            },
            {
              "lng": -123.065415,
              "lat": 44.990718
            },
            {
              "lng": -123.040408,
              "lat": 44.988541
            },
            {
              "lng": -123.041107,
              "lat": 44.948141
            },
            {
              "lng": -123.073708,
              "lat": 44.927541
            },
            {
              "lng": -123.113081,
              "lat": 44.928577
            },
            {
              "lng": -123.145417,
              "lat": 44.876491
            },
            {
              "lng": -123.148436,
              "lat": 44.862009
            },
            {
              "lng": -123.170891,
              "lat": 44.864462
            },
            {
              "lng": -123.180908,
              "lat": 44.857553
            },
            {
              "lng": -123.178687,
              "lat": 44.833551
            },
            {
              "lng": -123.169435,
              "lat": 44.828745
            },
            {
              "lng": -123.129027,
              "lat": 44.826523
            },
            {
              "lng": -123.091351,
              "lat": 44.811298
            },
            {
              "lng": -123.096999,
              "lat": 44.799442
            },
            {
              "lng": -123.123815,
              "lat": 44.793154
            },
            {
              "lng": -123.145269,
              "lat": 44.7713
            },
            {
              "lng": -123.143556,
              "lat": 44.74967
            },
            {
              "lng": -123.133529,
              "lat": 44.738662
            },
            {
              "lng": -123.149058,
              "lat": 44.720277
            },
            {
              "lng": -123.347514,
              "lat": 44.720105
            }
          ]
        }
      ]
    },
    {
      "name": "Area 3",
      "color": "#af7e0c",
      "counties": [
        {
          "name": "Lane",
          "boundaries": [
            {
              "lng": -123.77542,
              "lat": 44.283561
            },
            {
              "lng": -123.715125,
              "lat": 44.283897
            },
            {
              "lng": -123.714886,
              "lat": 44.280303
            },
            {
              "lng": -123.593594,
              "lat": 44.276581
            },
            {
              "lng": -123.593454,
              "lat": 44.281601
            },
            {
              "lng": -123.18398,
              "lat": 44.283691
            },
            {
              "lng": -123.174678,
              "lat": 44.276494
            },
            {
              "lng": -123.176019,
              "lat": 44.246181
            },
            {
              "lng": -123.151714,
              "lat": 44.228485
            },
            {
              "lng": -123.165394,
              "lat": 44.200021
            },
            {
              "lng": -122.905594,
              "lat": 44.200247
            },
            {
              "lng": -122.903295,
              "lat": 44.259046
            },
            {
              "lng": -122.865395,
              "lat": 44.258847
            },
            {
              "lng": -122.864595,
              "lat": 44.287947
            },
            {
              "lng": -122.828094,
              "lat": 44.276948
            },
            {
              "lng": -122.760494,
              "lat": 44.290548
            },
            {
              "lng": -122.724538,
              "lat": 44.288202
            },
            {
              "lng": -122.720693,
              "lat": 44.280948
            },
            {
              "lng": -122.647,
              "lat": 44.266593
            },
            {
              "lng": -122.644755,
              "lat": 44.251879
            },
            {
              "lng": -122.59509,
              "lat": 44.244549
            },
            {
              "lng": -122.577089,
              "lat": 44.228149
            },
            {
              "lng": -122.535854,
              "lat": 44.234394
            },
            {
              "lng": -122.506512,
              "lat": 44.222957
            },
            {
              "lng": -122.465085,
              "lat": 44.222749
            },
            {
              "lng": -122.386174,
              "lat": 44.217149
            },
            {
              "lng": -122.381717,
              "lat": 44.209346
            },
            {
              "lng": -122.329082,
              "lat": 44.230349
            },
            {
              "lng": -122.326584,
              "lat": 44.253349
            },
            {
              "lng": -121.799359,
              "lat": 44.258138
            },
            {
              "lng": -121.788859,
              "lat": 44.247839
            },
            {
              "lng": -121.781756,
              "lat": 44.197938
            },
            {
              "lng": -121.770854,
              "lat": 44.167138
            },
            {
              "lng": -121.783753,
              "lat": 44.147938
            },
            {
              "lng": -121.771852,
              "lat": 44.139338
            },
            {
              "lng": -121.76855,
              "lat": 44.101437
            },
            {
              "lng": -121.779249,
              "lat": 44.079937
            },
            {
              "lng": -121.801847,
              "lat": 44.052338
            },
            {
              "lng": -121.818348,
              "lat": 44.051738
            },
            {
              "lng": -121.833947,
              "lat": 44.039638
            },
            {
              "lng": -121.821645,
              "lat": 44.011538
            },
            {
              "lng": -121.827099,
              "lat": 43.997625
            },
            {
              "lng": -121.853925,
              "lat": 43.966813
            },
            {
              "lng": -121.86897,
              "lat": 43.912256
            },
            {
              "lng": -121.891351,
              "lat": 43.908482
            },
            {
              "lng": -121.917767,
              "lat": 43.91485
            },
            {
              "lng": -121.975479,
              "lat": 43.856875
            },
            {
              "lng": -121.975447,
              "lat": 43.811479
            },
            {
              "lng": -121.960831,
              "lat": 43.78156
            },
            {
              "lng": -121.960872,
              "lat": 43.763805
            },
            {
              "lng": -121.980693,
              "lat": 43.743586
            },
            {
              "lng": -121.973567,
              "lat": 43.73099
            },
            {
              "lng": -121.974538,
              "lat": 43.708581
            },
            {
              "lng": -121.967088,
              "lat": 43.702528
            },
            {
              "lng": -121.978047,
              "lat": 43.688289
            },
            {
              "lng": -121.986187,
              "lat": 43.661633
            },
            {
              "lng": -121.980666,
              "lat": 43.63989
            },
            {
              "lng": -121.964854,
              "lat": 43.626826
            },
            {
              "lng": -122.000154,
              "lat": 43.626287
            },
            {
              "lng": -122.002675,
              "lat": 43.615228
            },
            {
              "lng": -122.130944,
              "lat": 43.557149
            },
            {
              "lng": -122.147813,
              "lat": 43.516031
            },
            {
              "lng": -122.132938,
              "lat": 43.509658
            },
            {
              "lng": -122.132945,
              "lat": 43.474545
            },
            {
              "lng": -122.150546,
              "lat": 43.444445
            },
            {
              "lng": -122.132044,
              "lat": 43.440445
            },
            {
              "lng": -122.622161,
              "lat": 43.440342
            },
            {
              "lng": -122.740765,
              "lat": 43.437142
            },
            {
              "lng": -122.741771,
              "lat": 43.544553
            },
            {
              "lng": -123.107475,
              "lat": 43.540004
            },
            {
              "lng": -123.107719,
              "lat": 43.605937
            },
            {
              "lng": -123.137064,
              "lat": 43.60597
            },
            {
              "lng": -123.137677,
              "lat": 43.779666
            },
            {
              "lng": -123.347659,
              "lat": 43.780169
            },
            {
              "lng": -123.348016,
              "lat": 43.809165
            },
            {
              "lng": -123.470506,
              "lat": 43.810196
            },
            {
              "lng": -123.470729,
              "lat": 43.830517
            },
            {
              "lng": -123.529131,
              "lat": 43.829471
            },
            {
              "lng": -123.528959,
              "lat": 43.868192
            },
            {
              "lng": -123.579681,
              "lat": 43.868138
            },
            {
              "lng": -123.57949,
              "lat": 43.891057
            },
            {
              "lng": -123.619311,
              "lat": 43.891653
            },
            {
              "lng": -123.6193,
              "lat": 43.92013
            },
            {
              "lng": -123.658912,
              "lat": 43.921122
            },
            {
              "lng": -123.658936,
              "lat": 43.935857
            },
            {
              "lng": -123.703586,
              "lat": 43.936798
            },
            {
              "lng": -123.703461,
              "lat": 43.945131
            },
            {
              "lng": -123.827622,
              "lat": 43.945045
            },
            {
              "lng": -123.83303,
              "lat": 43.935048
            },
            {
              "lng": -123.882242,
              "lat": 43.906082
            },
            {
              "lng": -123.925513,
              "lat": 43.899167
            },
            {
              "lng": -123.92551,
              "lat": 43.865633
            },
            {
              "lng": -123.945541,
              "lat": 43.871088
            },
            {
              "lng": -123.945558,
              "lat": 43.862742
            },
            {
              "lng": -124.064657,
              "lat": 43.861931
            },
            {
              "lng": -124.158684,
              "lat": 43.863504
            },
            {
              "lng": -124.150267,
              "lat": 43.91085
            },
            {
              "lng": -124.142704,
              "lat": 43.958182
            },
            {
              "lng": -124.133547,
              "lat": 44.035845
            },
            {
              "lng": -124.122406,
              "lat": 44.104442
            },
            {
              "lng": -124.125824,
              "lat": 44.12613
            },
            {
              "lng": -124.117006,
              "lat": 44.171913
            },
            {
              "lng": -124.114424,
              "lat": 44.198164
            },
            {
              "lng": -124.115671,
              "lat": 44.206554
            },
            {
              "lng": -124.111054,
              "lat": 44.235071
            },
            {
              "lng": -124.108945,
              "lat": 44.265475
            },
            {
              "lng": -124.109744,
              "lat": 44.270597
            },
            {
              "lng": -124.114869,
              "lat": 44.272721
            },
            {
              "lng": -124.115953,
              "lat": 44.274641
            },
            {
              "lng": -124.115849,
              "lat": 44.276277
            },
            {
              "lng": -123.940966,
              "lat": 44.277542
            },
            {
              "lng": -123.94104,
              "lat": 44.282971
            },
            {
              "lng": -123.77542,
              "lat": 44.283561
            }
          ]
        }
      ]
    },
    {
      "name": "Area 4",
      "color": "#f76fde",
      "counties": [
        {
          "name": "Coos",
          "boundaries": [
            {
              "lng": -124.218876,
              "lat": 43.610319
            },
            {
              "lng": -124.183342,
              "lat": 43.611134
            },
            {
              "lng": -123.875424,
              "lat": 43.608254
            },
            {
              "lng": -123.875529,
              "lat": 43.515949
            },
            {
              "lng": -123.816834,
              "lat": 43.51603
            },
            {
              "lng": -123.817707,
              "lat": 43.431237
            },
            {
              "lng": -123.764005,
              "lat": 43.432237
            },
            {
              "lng": -123.764,
              "lat": 43.257935
            },
            {
              "lng": -123.703798,
              "lat": 43.257835
            },
            {
              "lng": -123.701989,
              "lat": 43.087288
            },
            {
              "lng": -123.70788,
              "lat": 43.083612
            },
            {
              "lng": -123.76063,
              "lat": 43.083127
            },
            {
              "lng": -123.762095,
              "lat": 42.996036
            },
            {
              "lng": -123.820798,
              "lat": 42.995935
            },
            {
              "lng": -123.819795,
              "lat": 42.824334
            },
            {
              "lng": -123.811694,
              "lat": 42.824334
            },
            {
              "lng": -123.812093,
              "lat": 42.789433
            },
            {
              "lng": -123.849495,
              "lat": 42.789034
            },
            {
              "lng": -123.869296,
              "lat": 42.774734
            },
            {
              "lng": -123.925499,
              "lat": 42.774933
            },
            {
              "lng": -123.926298,
              "lat": 42.739433
            },
            {
              "lng": -123.937498,
              "lat": 42.728833
            },
            {
              "lng": -123.957399,
              "lat": 42.728933
            },
            {
              "lng": -123.957499,
              "lat": 42.714232
            },
            {
              "lng": -123.9769,
              "lat": 42.714332
            },
            {
              "lng": -123.977299,
              "lat": 42.700132
            },
            {
              "lng": -123.9969,
              "lat": 42.700032
            },
            {
              "lng": -123.997,
              "lat": 42.685632
            },
            {
              "lng": -124.089988,
              "lat": 42.68544
            },
            {
              "lng": -124.089761,
              "lat": 42.678228
            },
            {
              "lng": -124.120106,
              "lat": 42.677989
            },
            {
              "lng": -124.132985,
              "lat": 42.666379
            },
            {
              "lng": -124.138939,
              "lat": 42.670819
            },
            {
              "lng": -124.138854,
              "lat": 42.739672
            },
            {
              "lng": -124.159941,
              "lat": 42.739632
            },
            {
              "lng": -124.160293,
              "lat": 42.789232
            },
            {
              "lng": -124.164972,
              "lat": 42.817251
            },
            {
              "lng": -124.160875,
              "lat": 42.828018
            },
            {
              "lng": -124.142084,
              "lat": 42.828612
            },
            {
              "lng": -124.141977,
              "lat": 42.849334
            },
            {
              "lng": -124.161289,
              "lat": 42.867679
            },
            {
              "lng": -124.160868,
              "lat": 42.882444
            },
            {
              "lng": -124.180681,
              "lat": 42.882338
            },
            {
              "lng": -124.184995,
              "lat": 42.893041
            },
            {
              "lng": -124.214687,
              "lat": 42.9035
            },
            {
              "lng": -124.219613,
              "lat": 42.933297
            },
            {
              "lng": -124.239897,
              "lat": 42.933043
            },
            {
              "lng": -124.257111,
              "lat": 42.954757
            },
            {
              "lng": -124.479344,
              "lat": 42.95497
            },
            {
              "lng": -124.462619,
              "lat": 42.99143
            },
            {
              "lng": -124.456918,
              "lat": 43.000315
            },
            {
              "lng": -124.436198,
              "lat": 43.071312
            },
            {
              "lng": -124.432236,
              "lat": 43.097383
            },
            {
              "lng": -124.434451,
              "lat": 43.115986
            },
            {
              "lng": -124.424113,
              "lat": 43.126859
            },
            {
              "lng": -124.401726,
              "lat": 43.184896
            },
            {
              "lng": -124.395302,
              "lat": 43.211101
            },
            {
              "lng": -124.395607,
              "lat": 43.223908
            },
            {
              "lng": -124.38246,
              "lat": 43.270167
            },
            {
              "lng": -124.388891,
              "lat": 43.290523
            },
            {
              "lng": -124.393988,
              "lat": 43.29926
            },
            {
              "lng": -124.400404,
              "lat": 43.302121
            },
            {
              "lng": -124.402814,
              "lat": 43.305872
            },
            {
              "lng": -124.387642,
              "lat": 43.325968
            },
            {
              "lng": -124.373037,
              "lat": 43.338953
            },
            {
              "lng": -124.353332,
              "lat": 43.342667
            },
            {
              "lng": -124.341587,
              "lat": 43.351337
            },
            {
              "lng": -124.315012,
              "lat": 43.388389
            },
            {
              "lng": -124.286896,
              "lat": 43.436296
            },
            {
              "lng": -124.255609,
              "lat": 43.502172
            },
            {
              "lng": -124.233534,
              "lat": 43.55713
            },
            {
              "lng": -124.218876,
              "lat": 43.610319
            }
          ]
        },
        {
          "name": "Curry",
          "boundaries": [
            {
              "lng": -124.211605,
              "lat": 41.99846
            },
            {
              "lng": -124.214213,
              "lat": 42.005939
            },
            {
              "lng": -124.270464,
              "lat": 42.045553
            },
            {
              "lng": -124.287374,
              "lat": 42.046016
            },
            {
              "lng": -124.299649,
              "lat": 42.051736
            },
            {
              "lng": -124.314289,
              "lat": 42.067864
            },
            {
              "lng": -124.34101,
              "lat": 42.092929
            },
            {
              "lng": -124.356229,
              "lat": 42.114952
            },
            {
              "lng": -124.357122,
              "lat": 42.118016
            },
            {
              "lng": -124.351535,
              "lat": 42.129796
            },
            {
              "lng": -124.351784,
              "lat": 42.134965
            },
            {
              "lng": -124.355696,
              "lat": 42.141964
            },
            {
              "lng": -124.361563,
              "lat": 42.143767
            },
            {
              "lng": -124.366028,
              "lat": 42.152343
            },
            {
              "lng": -124.366832,
              "lat": 42.15845
            },
            {
              "lng": -124.363389,
              "lat": 42.158588
            },
            {
              "lng": -124.360318,
              "lat": 42.162272
            },
            {
              "lng": -124.361009,
              "lat": 42.180752
            },
            {
              "lng": -124.367751,
              "lat": 42.188321
            },
            {
              "lng": -124.373175,
              "lat": 42.190218
            },
            {
              "lng": -124.374949,
              "lat": 42.193129
            },
            {
              "lng": -124.376215,
              "lat": 42.196381
            },
            {
              "lng": -124.375553,
              "lat": 42.20882
            },
            {
              "lng": -124.377762,
              "lat": 42.218809
            },
            {
              "lng": -124.383633,
              "lat": 42.22716
            },
            {
              "lng": -124.410982,
              "lat": 42.250547
            },
            {
              "lng": -124.411534,
              "lat": 42.254115
            },
            {
              "lng": -124.408514,
              "lat": 42.260588
            },
            {
              "lng": -124.405148,
              "lat": 42.278107
            },
            {
              "lng": -124.410556,
              "lat": 42.307431
            },
            {
              "lng": -124.429288,
              "lat": 42.331746
            },
            {
              "lng": -124.427222,
              "lat": 42.33488
            },
            {
              "lng": -124.425554,
              "lat": 42.351874
            },
            {
              "lng": -124.424066,
              "lat": 42.377242
            },
            {
              "lng": -124.424863,
              "lat": 42.395426
            },
            {
              "lng": -124.428068,
              "lat": 42.420333
            },
            {
              "lng": -124.434882,
              "lat": 42.434916
            },
            {
              "lng": -124.435105,
              "lat": 42.440163
            },
            {
              "lng": -124.422038,
              "lat": 42.461226
            },
            {
              "lng": -124.423084,
              "lat": 42.478952
            },
            {
              "lng": -124.421381,
              "lat": 42.491737
            },
            {
              "lng": -124.399065,
              "lat": 42.539928
            },
            {
              "lng": -124.390664,
              "lat": 42.566593
            },
            {
              "lng": -124.389977,
              "lat": 42.574758
            },
            {
              "lng": -124.400918,
              "lat": 42.597518
            },
            {
              "lng": -124.399421,
              "lat": 42.618079
            },
            {
              "lng": -124.401177,
              "lat": 42.627192
            },
            {
              "lng": -124.413119,
              "lat": 42.657934
            },
            {
              "lng": -124.416774,
              "lat": 42.661594
            },
            {
              "lng": -124.45074,
              "lat": 42.675798
            },
            {
              "lng": -124.451484,
              "lat": 42.677787
            },
            {
              "lng": -124.447487,
              "lat": 42.68474
            },
            {
              "lng": -124.448418,
              "lat": 42.689909
            },
            {
              "lng": -124.473864,
              "lat": 42.732671
            },
            {
              "lng": -124.491679,
              "lat": 42.741789
            },
            {
              "lng": -124.498473,
              "lat": 42.741077
            },
            {
              "lng": -124.499122,
              "lat": 42.738606
            },
            {
              "lng": -124.510017,
              "lat": 42.734746
            },
            {
              "lng": -124.513368,
              "lat": 42.735068
            },
            {
              "lng": -124.514669,
              "lat": 42.736806
            },
            {
              "lng": -124.516236,
              "lat": 42.753632
            },
            {
              "lng": -124.524439,
              "lat": 42.789793
            },
            {
              "lng": -124.536073,
              "lat": 42.814175
            },
            {
              "lng": -124.544179,
              "lat": 42.822958
            },
            {
              "lng": -124.552441,
              "lat": 42.840568
            },
            {
              "lng": -124.500141,
              "lat": 42.917502
            },
            {
              "lng": -124.480938,
              "lat": 42.951495
            },
            {
              "lng": -124.479344,
              "lat": 42.95497
            },
            {
              "lng": -124.257111,
              "lat": 42.954757
            },
            {
              "lng": -124.239897,
              "lat": 42.933043
            },
            {
              "lng": -124.219613,
              "lat": 42.933297
            },
            {
              "lng": -124.214687,
              "lat": 42.9035
            },
            {
              "lng": -124.184995,
              "lat": 42.893041
            },
            {
              "lng": -124.180681,
              "lat": 42.882338
            },
            {
              "lng": -124.160868,
              "lat": 42.882444
            },
            {
              "lng": -124.161289,
              "lat": 42.867679
            },
            {
              "lng": -124.141977,
              "lat": 42.849334
            },
            {
              "lng": -124.142084,
              "lat": 42.828612
            },
            {
              "lng": -124.160875,
              "lat": 42.828018
            },
            {
              "lng": -124.164972,
              "lat": 42.817251
            },
            {
              "lng": -124.160293,
              "lat": 42.789232
            },
            {
              "lng": -124.159941,
              "lat": 42.739632
            },
            {
              "lng": -124.138854,
              "lat": 42.739672
            },
            {
              "lng": -124.138939,
              "lat": 42.670819
            },
            {
              "lng": -124.132985,
              "lat": 42.666379
            },
            {
              "lng": -124.120106,
              "lat": 42.677989
            },
            {
              "lng": -124.089761,
              "lat": 42.678228
            },
            {
              "lng": -124.089988,
              "lat": 42.68544
            },
            {
              "lng": -123.997,
              "lat": 42.685632
            },
            {
              "lng": -123.9969,
              "lat": 42.700032
            },
            {
              "lng": -123.977299,
              "lat": 42.700132
            },
            {
              "lng": -123.9769,
              "lat": 42.714332
            },
            {
              "lng": -123.957499,
              "lat": 42.714232
            },
            {
              "lng": -123.957399,
              "lat": 42.728933
            },
            {
              "lng": -123.937498,
              "lat": 42.728833
            },
            {
              "lng": -123.926298,
              "lat": 42.739433
            },
            {
              "lng": -123.925499,
              "lat": 42.774933
            },
            {
              "lng": -123.869296,
              "lat": 42.774734
            },
            {
              "lng": -123.849495,
              "lat": 42.789034
            },
            {
              "lng": -123.812093,
              "lat": 42.789433
            },
            {
              "lng": -123.777322,
              "lat": 42.798988
            },
            {
              "lng": -123.727589,
              "lat": 42.780135
            },
            {
              "lng": -123.71619,
              "lat": 42.784234
            },
            {
              "lng": -123.719882,
              "lat": 42.781644
            },
            {
              "lng": -123.73629,
              "lat": 42.760894
            },
            {
              "lng": -123.751997,
              "lat": 42.737571
            },
            {
              "lng": -123.755949,
              "lat": 42.723342
            },
            {
              "lng": -123.766202,
              "lat": 42.710289
            },
            {
              "lng": -123.817159,
              "lat": 42.649845
            },
            {
              "lng": -123.836635,
              "lat": 42.591796
            },
            {
              "lng": -123.850124,
              "lat": 42.576437
            },
            {
              "lng": -123.860844,
              "lat": 42.559989
            },
            {
              "lng": -123.865433,
              "lat": 42.541378
            },
            {
              "lng": -123.878566,
              "lat": 42.52366
            },
            {
              "lng": -123.881088,
              "lat": 42.509181
            },
            {
              "lng": -123.894899,
              "lat": 42.499312
            },
            {
              "lng": -123.92353,
              "lat": 42.495023
            },
            {
              "lng": -123.945038,
              "lat": 42.501361
            },
            {
              "lng": -123.973402,
              "lat": 42.495802
            },
            {
              "lng": -123.986497,
              "lat": 42.498429
            },
            {
              "lng": -124.004367,
              "lat": 42.486844
            },
            {
              "lng": -124.001617,
              "lat": 42.478813
            },
            {
              "lng": -124.002747,
              "lat": 42.446867
            },
            {
              "lng": -124.01086,
              "lat": 42.416974
            },
            {
              "lng": -124.030698,
              "lat": 42.402978
            },
            {
              "lng": -124.039493,
              "lat": 42.388494
            },
            {
              "lng": -124.015094,
              "lat": 42.35913
            },
            {
              "lng": -123.878788,
              "lat": 42.339231
            },
            {
              "lng": -123.819185,
              "lat": 42.264032
            },
            {
              "lng": -123.829185,
              "lat": 42.156533
            },
            {
              "lng": -123.836251,
              "lat": 42.031013
            },
            {
              "lng": -123.821472,
              "lat": 41.995473
            },
            {
              "lng": -123.834208,
              "lat": 41.996116
            },
            {
              "lng": -124.001188,
              "lat": 41.996146
            },
            {
              "lng": -124.086661,
              "lat": 41.996869
            },
            {
              "lng": -124.087827,
              "lat": 41.996891
            },
            {
              "lng": -124.100216,
              "lat": 41.996842
            },
            {
              "lng": -124.100921,
              "lat": 41.996956
            },
            {
              "lng": -124.126194,
              "lat": 41.996992
            },
            {
              "lng": -124.211605,
              "lat": 41.99846
            }
          ]
        },
        {
          "name": "Douglas",
          "boundaries": [
            {
              "lng": -123.812093,
              "lat": 42.789433
            },
            {
              "lng": -123.811694,
              "lat": 42.824334
            },
            {
              "lng": -123.819795,
              "lat": 42.824334
            },
            {
              "lng": -123.820798,
              "lat": 42.995935
            },
            {
              "lng": -123.762095,
              "lat": 42.996036
            },
            {
              "lng": -123.76063,
              "lat": 43.083127
            },
            {
              "lng": -123.70788,
              "lat": 43.083612
            },
            {
              "lng": -123.701989,
              "lat": 43.087288
            },
            {
              "lng": -123.703798,
              "lat": 43.257835
            },
            {
              "lng": -123.764,
              "lat": 43.257935
            },
            {
              "lng": -123.764005,
              "lat": 43.432237
            },
            {
              "lng": -123.817707,
              "lat": 43.431237
            },
            {
              "lng": -123.816834,
              "lat": 43.51603
            },
            {
              "lng": -123.875529,
              "lat": 43.515949
            },
            {
              "lng": -123.875424,
              "lat": 43.608254
            },
            {
              "lng": -124.183342,
              "lat": 43.611134
            },
            {
              "lng": -124.218876,
              "lat": 43.610319
            },
            {
              "lng": -124.203028,
              "lat": 43.667825
            },
            {
              "lng": -124.204888,
              "lat": 43.673976
            },
            {
              "lng": -124.198275,
              "lat": 43.689481
            },
            {
              "lng": -124.193455,
              "lat": 43.706085
            },
            {
              "lng": -124.168392,
              "lat": 43.808903
            },
            {
              "lng": -124.158684,
              "lat": 43.863504
            },
            {
              "lng": -124.064657,
              "lat": 43.861931
            },
            {
              "lng": -123.945558,
              "lat": 43.862742
            },
            {
              "lng": -123.945541,
              "lat": 43.871088
            },
            {
              "lng": -123.92551,
              "lat": 43.865633
            },
            {
              "lng": -123.925513,
              "lat": 43.899167
            },
            {
              "lng": -123.882242,
              "lat": 43.906082
            },
            {
              "lng": -123.83303,
              "lat": 43.935048
            },
            {
              "lng": -123.827622,
              "lat": 43.945045
            },
            {
              "lng": -123.703461,
              "lat": 43.945131
            },
            {
              "lng": -123.703586,
              "lat": 43.936798
            },
            {
              "lng": -123.658936,
              "lat": 43.935857
            },
            {
              "lng": -123.658912,
              "lat": 43.921122
            },
            {
              "lng": -123.6193,
              "lat": 43.92013
            },
            {
              "lng": -123.619311,
              "lat": 43.891653
            },
            {
              "lng": -123.57949,
              "lat": 43.891057
            },
            {
              "lng": -123.579681,
              "lat": 43.868138
            },
            {
              "lng": -123.528959,
              "lat": 43.868192
            },
            {
              "lng": -123.529131,
              "lat": 43.829471
            },
            {
              "lng": -123.470729,
              "lat": 43.830517
            },
            {
              "lng": -123.470506,
              "lat": 43.810196
            },
            {
              "lng": -123.348016,
              "lat": 43.809165
            },
            {
              "lng": -123.347659,
              "lat": 43.780169
            },
            {
              "lng": -123.137677,
              "lat": 43.779666
            },
            {
              "lng": -123.137064,
              "lat": 43.60597
            },
            {
              "lng": -123.107719,
              "lat": 43.605937
            },
            {
              "lng": -123.107475,
              "lat": 43.540004
            },
            {
              "lng": -122.741771,
              "lat": 43.544553
            },
            {
              "lng": -122.740765,
              "lat": 43.437142
            },
            {
              "lng": -122.622161,
              "lat": 43.440342
            },
            {
              "lng": -122.132044,
              "lat": 43.440445
            },
            {
              "lng": -122.090943,
              "lat": 43.428246
            },
            {
              "lng": -122.056942,
              "lat": 43.399347
            },
            {
              "lng": -122.056541,
              "lat": 43.381748
            },
            {
              "lng": -122.02164,
              "lat": 43.362048
            },
            {
              "lng": -122.010239,
              "lat": 43.343249
            },
            {
              "lng": -122.013239,
              "lat": 43.319049
            },
            {
              "lng": -121.999187,
              "lat": 43.309059
            },
            {
              "lng": -122.009438,
              "lat": 43.292949
            },
            {
              "lng": -121.973841,
              "lat": 43.261728
            },
            {
              "lng": -122.038139,
              "lat": 43.21695
            },
            {
              "lng": -122.032238,
              "lat": 43.20865
            },
            {
              "lng": -122.053739,
              "lat": 43.17325
            },
            {
              "lng": -122.052939,
              "lat": 43.15765
            },
            {
              "lng": -122.065838,
              "lat": 43.152849
            },
            {
              "lng": -122.091539,
              "lat": 43.07605
            },
            {
              "lng": -122.073339,
              "lat": 43.06735
            },
            {
              "lng": -122.282245,
              "lat": 43.067547
            },
            {
              "lng": -122.281856,
              "lat": 42.996556
            },
            {
              "lng": -122.400467,
              "lat": 42.996426
            },
            {
              "lng": -122.400748,
              "lat": 42.983246
            },
            {
              "lng": -122.420308,
              "lat": 42.983345
            },
            {
              "lng": -122.42025,
              "lat": 42.968971
            },
            {
              "lng": -122.440128,
              "lat": 42.968981
            },
            {
              "lng": -122.440128,
              "lat": 42.954436
            },
            {
              "lng": -122.459791,
              "lat": 42.954423
            },
            {
              "lng": -122.460053,
              "lat": 42.939852
            },
            {
              "lng": -122.560225,
              "lat": 42.939106
            },
            {
              "lng": -122.560191,
              "lat": 42.924289
            },
            {
              "lng": -122.580055,
              "lat": 42.924581
            },
            {
              "lng": -122.579939,
              "lat": 42.910695
            },
            {
              "lng": -122.600041,
              "lat": 42.911032
            },
            {
              "lng": -122.59991,
              "lat": 42.895607
            },
            {
              "lng": -122.638224,
              "lat": 42.897454
            },
            {
              "lng": -122.638052,
              "lat": 42.881145
            },
            {
              "lng": -122.677211,
              "lat": 42.881341
            },
            {
              "lng": -122.677339,
              "lat": 42.86676
            },
            {
              "lng": -122.696995,
              "lat": 42.866745
            },
            {
              "lng": -122.696873,
              "lat": 42.852153
            },
            {
              "lng": -122.716535,
              "lat": 42.852123
            },
            {
              "lng": -122.716587,
              "lat": 42.837671
            },
            {
              "lng": -122.736233,
              "lat": 42.837661
            },
            {
              "lng": -122.736342,
              "lat": 42.823628
            },
            {
              "lng": -122.775025,
              "lat": 42.828564
            },
            {
              "lng": -122.774941,
              "lat": 42.808666
            },
            {
              "lng": -122.794815,
              "lat": 42.794109
            },
            {
              "lng": -122.794793,
              "lat": 42.779422
            },
            {
              "lng": -122.853881,
              "lat": 42.780953
            },
            {
              "lng": -122.85373,
              "lat": 42.774171
            },
            {
              "lng": -122.950954,
              "lat": 42.774567
            },
            {
              "lng": -122.971673,
              "lat": 42.76006
            },
            {
              "lng": -123.009266,
              "lat": 42.759345
            },
            {
              "lng": -123.009266,
              "lat": 42.752145
            },
            {
              "lng": -123.112276,
              "lat": 42.752037
            },
            {
              "lng": -123.151421,
              "lat": 42.756069
            },
            {
              "lng": -123.152272,
              "lat": 42.737751
            },
            {
              "lng": -123.180961,
              "lat": 42.737725
            },
            {
              "lng": -123.210576,
              "lat": 42.709999
            },
            {
              "lng": -123.2299,
              "lat": 42.702486
            },
            {
              "lng": -123.249672,
              "lat": 42.702942
            },
            {
              "lng": -123.249372,
              "lat": 42.724543
            },
            {
              "lng": -123.273573,
              "lat": 42.731642
            },
            {
              "lng": -123.365975,
              "lat": 42.73204
            },
            {
              "lng": -123.371475,
              "lat": 42.72464
            },
            {
              "lng": -123.401476,
              "lat": 42.72459
            },
            {
              "lng": -123.405776,
              "lat": 42.713739
            },
            {
              "lng": -123.444177,
              "lat": 42.710438
            },
            {
              "lng": -123.464777,
              "lat": 42.699338
            },
            {
              "lng": -123.493878,
              "lat": 42.702737
            },
            {
              "lng": -123.493778,
              "lat": 42.710037
            },
            {
              "lng": -123.54248,
              "lat": 42.710437
            },
            {
              "lng": -123.561881,
              "lat": 42.717837
            },
            {
              "lng": -123.566781,
              "lat": 42.735937
            },
            {
              "lng": -123.581482,
              "lat": 42.740236
            },
            {
              "lng": -123.677203,
              "lat": 42.739747
            },
            {
              "lng": -123.677351,
              "lat": 42.751121
            },
            {
              "lng": -123.697319,
              "lat": 42.753418
            },
            {
              "lng": -123.69727,
              "lat": 42.739735
            },
            {
              "lng": -123.715088,
              "lat": 42.739735
            },
            {
              "lng": -123.71619,
              "lat": 42.784234
            },
            {
              "lng": -123.727589,
              "lat": 42.780135
            },
            {
              "lng": -123.777322,
              "lat": 42.798988
            },
            {
              "lng": -123.812093,
              "lat": 42.789433
            }
          ]
        }
      ]
    },
    {
      "name": "Area 5",
      "color": "#41cc3f",
      "counties": [
        {
          "name": "Jackson",
          "boundaries": [
            {
              "lng": -123.230024,
              "lat": 42.287494
            },
            {
              "lng": -123.227876,
              "lat": 42.499825
            },
            {
              "lng": -123.229857,
              "lat": 42.551783
            },
            {
              "lng": -123.2299,
              "lat": 42.702486
            },
            {
              "lng": -123.210576,
              "lat": 42.709999
            },
            {
              "lng": -123.180961,
              "lat": 42.737725
            },
            {
              "lng": -123.152272,
              "lat": 42.737751
            },
            {
              "lng": -123.151421,
              "lat": 42.756069
            },
            {
              "lng": -123.112276,
              "lat": 42.752037
            },
            {
              "lng": -123.009266,
              "lat": 42.752145
            },
            {
              "lng": -123.009266,
              "lat": 42.759345
            },
            {
              "lng": -122.971673,
              "lat": 42.76006
            },
            {
              "lng": -122.950954,
              "lat": 42.774567
            },
            {
              "lng": -122.85373,
              "lat": 42.774171
            },
            {
              "lng": -122.853881,
              "lat": 42.780953
            },
            {
              "lng": -122.794793,
              "lat": 42.779422
            },
            {
              "lng": -122.794815,
              "lat": 42.794109
            },
            {
              "lng": -122.774941,
              "lat": 42.808666
            },
            {
              "lng": -122.775025,
              "lat": 42.828564
            },
            {
              "lng": -122.736342,
              "lat": 42.823628
            },
            {
              "lng": -122.736233,
              "lat": 42.837661
            },
            {
              "lng": -122.716587,
              "lat": 42.837671
            },
            {
              "lng": -122.716535,
              "lat": 42.852123
            },
            {
              "lng": -122.696873,
              "lat": 42.852153
            },
            {
              "lng": -122.696995,
              "lat": 42.866745
            },
            {
              "lng": -122.677339,
              "lat": 42.86676
            },
            {
              "lng": -122.677211,
              "lat": 42.881341
            },
            {
              "lng": -122.638052,
              "lat": 42.881145
            },
            {
              "lng": -122.638224,
              "lat": 42.897454
            },
            {
              "lng": -122.59991,
              "lat": 42.895607
            },
            {
              "lng": -122.600041,
              "lat": 42.911032
            },
            {
              "lng": -122.579939,
              "lat": 42.910695
            },
            {
              "lng": -122.580055,
              "lat": 42.924581
            },
            {
              "lng": -122.560191,
              "lat": 42.924289
            },
            {
              "lng": -122.560225,
              "lat": 42.939106
            },
            {
              "lng": -122.460053,
              "lat": 42.939852
            },
            {
              "lng": -122.459791,
              "lat": 42.954423
            },
            {
              "lng": -122.440128,
              "lat": 42.954436
            },
            {
              "lng": -122.440128,
              "lat": 42.968981
            },
            {
              "lng": -122.42025,
              "lat": 42.968971
            },
            {
              "lng": -122.420308,
              "lat": 42.983345
            },
            {
              "lng": -122.400748,
              "lat": 42.983246
            },
            {
              "lng": -122.400467,
              "lat": 42.996426
            },
            {
              "lng": -122.281856,
              "lat": 42.996556
            },
            {
              "lng": -122.284611,
              "lat": 42.496091
            },
            {
              "lng": -122.287935,
              "lat": 42.474755
            },
            {
              "lng": -122.287446,
              "lat": 42.127168
            },
            {
              "lng": -122.290351,
              "lat": 42.127092
            },
            {
              "lng": -122.28974,
              "lat": 42.122561
            },
            {
              "lng": -122.289533,
              "lat": 42.007764
            },
            {
              "lng": -122.378193,
              "lat": 42.009518
            },
            {
              "lng": -122.397984,
              "lat": 42.008758
            },
            {
              "lng": -122.501135,
              "lat": 42.00846
            },
            {
              "lng": -122.634739,
              "lat": 42.004858
            },
            {
              "lng": -122.712942,
              "lat": 42.004157
            },
            {
              "lng": -122.80008,
              "lat": 42.004071
            },
            {
              "lng": -122.876148,
              "lat": 42.003247
            },
            {
              "lng": -122.893961,
              "lat": 42.002605
            },
            {
              "lng": -122.941597,
              "lat": 42.003085
            },
            {
              "lng": -123.045254,
              "lat": 42.003049
            },
            {
              "lng": -123.065655,
              "lat": 42.004948
            },
            {
              "lng": -123.083956,
              "lat": 42.005448
            },
            {
              "lng": -123.145959,
              "lat": 42.009247
            },
            {
              "lng": -123.154908,
              "lat": 42.008036
            },
            {
              "lng": -123.192361,
              "lat": 42.005446
            },
            {
              "lng": -123.230762,
              "lat": 42.003845
            },
            {
              "lng": -123.230764,
              "lat": 42.003845
            },
            {
              "lng": -123.231628,
              "lat": 42.128074
            },
            {
              "lng": -123.229284,
              "lat": 42.128069
            },
            {
              "lng": -123.230024,
              "lat": 42.287494
            }
          ]
        },
        {
          "name": "Josephine",
          "boundaries": [
            {
              "lng": -123.230024,
              "lat": 42.287494
            },
            {
              "lng": -123.229284,
              "lat": 42.128069
            },
            {
              "lng": -123.231628,
              "lat": 42.128074
            },
            {
              "lng": -123.230764,
              "lat": 42.003845
            },
            {
              "lng": -123.347562,
              "lat": 41.999108
            },
            {
              "lng": -123.381776,
              "lat": 41.999268
            },
            {
              "lng": -123.43477,
              "lat": 42.001641
            },
            {
              "lng": -123.49883,
              "lat": 42.000525
            },
            {
              "lng": -123.498896,
              "lat": 42.000474
            },
            {
              "lng": -123.501997,
              "lat": 42.000527
            },
            {
              "lng": -123.517906,
              "lat": 42.000883
            },
            {
              "lng": -123.525245,
              "lat": 42.001047
            },
            {
              "lng": -123.55256,
              "lat": 42.000246
            },
            {
              "lng": -123.624554,
              "lat": 41.999837
            },
            {
              "lng": -123.656998,
              "lat": 41.995137
            },
            {
              "lng": -123.728156,
              "lat": 41.997007
            },
            {
              "lng": -123.789295,
              "lat": 41.996111
            },
            {
              "lng": -123.813992,
              "lat": 41.995096
            },
            {
              "lng": -123.821472,
              "lat": 41.995473
            },
            {
              "lng": -123.836251,
              "lat": 42.031013
            },
            {
              "lng": -123.829185,
              "lat": 42.156533
            },
            {
              "lng": -123.819185,
              "lat": 42.264032
            },
            {
              "lng": -123.878788,
              "lat": 42.339231
            },
            {
              "lng": -124.015094,
              "lat": 42.35913
            },
            {
              "lng": -124.039493,
              "lat": 42.388494
            },
            {
              "lng": -124.030698,
              "lat": 42.402978
            },
            {
              "lng": -124.01086,
              "lat": 42.416974
            },
            {
              "lng": -124.002747,
              "lat": 42.446867
            },
            {
              "lng": -124.001617,
              "lat": 42.478813
            },
            {
              "lng": -124.004367,
              "lat": 42.486844
            },
            {
              "lng": -123.986497,
              "lat": 42.498429
            },
            {
              "lng": -123.973402,
              "lat": 42.495802
            },
            {
              "lng": -123.945038,
              "lat": 42.501361
            },
            {
              "lng": -123.92353,
              "lat": 42.495023
            },
            {
              "lng": -123.894899,
              "lat": 42.499312
            },
            {
              "lng": -123.881088,
              "lat": 42.509181
            },
            {
              "lng": -123.878566,
              "lat": 42.52366
            },
            {
              "lng": -123.865433,
              "lat": 42.541378
            },
            {
              "lng": -123.860844,
              "lat": 42.559989
            },
            {
              "lng": -123.850124,
              "lat": 42.576437
            },
            {
              "lng": -123.836635,
              "lat": 42.591796
            },
            {
              "lng": -123.817159,
              "lat": 42.649845
            },
            {
              "lng": -123.766202,
              "lat": 42.710289
            },
            {
              "lng": -123.755949,
              "lat": 42.723342
            },
            {
              "lng": -123.751997,
              "lat": 42.737571
            },
            {
              "lng": -123.73629,
              "lat": 42.760894
            },
            {
              "lng": -123.719882,
              "lat": 42.781644
            },
            {
              "lng": -123.71619,
              "lat": 42.784234
            },
            {
              "lng": -123.715088,
              "lat": 42.739735
            },
            {
              "lng": -123.69727,
              "lat": 42.739735
            },
            {
              "lng": -123.697319,
              "lat": 42.753418
            },
            {
              "lng": -123.677351,
              "lat": 42.751121
            },
            {
              "lng": -123.677203,
              "lat": 42.739747
            },
            {
              "lng": -123.581482,
              "lat": 42.740236
            },
            {
              "lng": -123.566781,
              "lat": 42.735937
            },
            {
              "lng": -123.561881,
              "lat": 42.717837
            },
            {
              "lng": -123.54248,
              "lat": 42.710437
            },
            {
              "lng": -123.493778,
              "lat": 42.710037
            },
            {
              "lng": -123.493878,
              "lat": 42.702737
            },
            {
              "lng": -123.464777,
              "lat": 42.699338
            },
            {
              "lng": -123.444177,
              "lat": 42.710438
            },
            {
              "lng": -123.405776,
              "lat": 42.713739
            },
            {
              "lng": -123.401476,
              "lat": 42.72459
            },
            {
              "lng": -123.371475,
              "lat": 42.72464
            },
            {
              "lng": -123.365975,
              "lat": 42.73204
            },
            {
              "lng": -123.273573,
              "lat": 42.731642
            },
            {
              "lng": -123.249372,
              "lat": 42.724543
            },
            {
              "lng": -123.249672,
              "lat": 42.702942
            },
            {
              "lng": -123.2299,
              "lat": 42.702486
            },
            {
              "lng": -123.229857,
              "lat": 42.551783
            },
            {
              "lng": -123.227876,
              "lat": 42.499825
            },
            {
              "lng": -123.230024,
              "lat": 42.287494
            }
          ]
        },
        {
          "name": "Klamath",
          "boundaries": [
            {
              "lng": -122.002675,
              "lat": 43.615228
            },
            {
              "lng": -121.332982,
              "lat": 43.616629
            },
            {
              "lng": -121.332335,
              "lat": 43.356575
            },
            {
              "lng": -121.348576,
              "lat": 43.356691
            },
            {
              "lng": -121.34988,
              "lat": 42.746671
            },
            {
              "lng": -120.99659,
              "lat": 42.74635
            },
            {
              "lng": -120.961835,
              "lat": 42.743712
            },
            {
              "lng": -120.88334,
              "lat": 42.743883
            },
            {
              "lng": -120.882051,
              "lat": 42.509307
            },
            {
              "lng": -120.879481,
              "lat": 41.993781
            },
            {
              "lng": -121.035195,
              "lat": 41.993323
            },
            {
              "lng": -121.094926,
              "lat": 41.994658
            },
            {
              "lng": -121.126093,
              "lat": 41.99601
            },
            {
              "lng": -121.247616,
              "lat": 41.997054
            },
            {
              "lng": -121.251099,
              "lat": 41.99757
            },
            {
              "lng": -121.309981,
              "lat": 41.997612
            },
            {
              "lng": -121.334385,
              "lat": 41.996655
            },
            {
              "lng": -121.335734,
              "lat": 41.996518
            },
            {
              "lng": -121.340517,
              "lat": 41.99622
            },
            {
              "lng": -121.360253,
              "lat": 41.99668
            },
            {
              "lng": -121.376101,
              "lat": 41.997026
            },
            {
              "lng": -121.434977,
              "lat": 41.997022
            },
            {
              "lng": -121.43961,
              "lat": 41.99708
            },
            {
              "lng": -121.44754,
              "lat": 41.997169
            },
            {
              "lng": -121.52025,
              "lat": 41.997983
            },
            {
              "lng": -121.580865,
              "lat": 41.998668
            },
            {
              "lng": -121.675348,
              "lat": 42.000351
            },
            {
              "lng": -121.689159,
              "lat": 42.000584
            },
            {
              "lng": -121.705045,
              "lat": 42.000766
            },
            {
              "lng": -121.708199,
              "lat": 42.000815
            },
            {
              "lng": -121.846712,
              "lat": 42.00307
            },
            {
              "lng": -122.000319,
              "lat": 42.003967
            },
            {
              "lng": -122.101922,
              "lat": 42.005766
            },
            {
              "lng": -122.155408,
              "lat": 42.007429
            },
            {
              "lng": -122.156666,
              "lat": 42.007384
            },
            {
              "lng": -122.160438,
              "lat": 42.007637
            },
            {
              "lng": -122.161328,
              "lat": 42.007637
            },
            {
              "lng": -122.261127,
              "lat": 42.007364
            },
            {
              "lng": -122.289527,
              "lat": 42.007764
            },
            {
              "lng": -122.289533,
              "lat": 42.007764
            },
            {
              "lng": -122.28974,
              "lat": 42.122561
            },
            {
              "lng": -122.290351,
              "lat": 42.127092
            },
            {
              "lng": -122.287446,
              "lat": 42.127168
            },
            {
              "lng": -122.287935,
              "lat": 42.474755
            },
            {
              "lng": -122.284611,
              "lat": 42.496091
            },
            {
              "lng": -122.281856,
              "lat": 42.996556
            },
            {
              "lng": -122.282245,
              "lat": 43.067547
            },
            {
              "lng": -122.073339,
              "lat": 43.06735
            },
            {
              "lng": -122.091539,
              "lat": 43.07605
            },
            {
              "lng": -122.065838,
              "lat": 43.152849
            },
            {
              "lng": -122.052939,
              "lat": 43.15765
            },
            {
              "lng": -122.053739,
              "lat": 43.17325
            },
            {
              "lng": -122.032238,
              "lat": 43.20865
            },
            {
              "lng": -122.038139,
              "lat": 43.21695
            },
            {
              "lng": -121.973841,
              "lat": 43.261728
            },
            {
              "lng": -122.009438,
              "lat": 43.292949
            },
            {
              "lng": -121.999187,
              "lat": 43.309059
            },
            {
              "lng": -122.013239,
              "lat": 43.319049
            },
            {
              "lng": -122.010239,
              "lat": 43.343249
            },
            {
              "lng": -122.02164,
              "lat": 43.362048
            },
            {
              "lng": -122.056541,
              "lat": 43.381748
            },
            {
              "lng": -122.056942,
              "lat": 43.399347
            },
            {
              "lng": -122.090943,
              "lat": 43.428246
            },
            {
              "lng": -122.132044,
              "lat": 43.440445
            },
            {
              "lng": -122.150546,
              "lat": 43.444445
            },
            {
              "lng": -122.132945,
              "lat": 43.474545
            },
            {
              "lng": -122.132938,
              "lat": 43.509658
            },
            {
              "lng": -122.147813,
              "lat": 43.516031
            },
            {
              "lng": -122.130944,
              "lat": 43.557149
            },
            {
              "lng": -122.002675,
              "lat": 43.615228
            }
          ]
        },
        {
          "name": "Lake",
          "boundaries": [
            {
              "lng": -119.896365,
              "lat": 43.610259
            },
            {
              "lng": -119.894694,
              "lat": 43.584464
            },
            {
              "lng": -119.896776,
              "lat": 43.179006
            },
            {
              "lng": -119.932439,
              "lat": 43.178982
            },
            {
              "lng": -119.931554,
              "lat": 42.917044
            },
            {
              "lng": -119.943427,
              "lat": 42.917107
            },
            {
              "lng": -119.943888,
              "lat": 42.74632
            },
            {
              "lng": -119.734201,
              "lat": 42.746636
            },
            {
              "lng": -119.706041,
              "lat": 42.748696
            },
            {
              "lng": -119.365284,
              "lat": 42.749038
            },
            {
              "lng": -119.363515,
              "lat": 42.136945
            },
            {
              "lng": -119.359403,
              "lat": 42.113829
            },
            {
              "lng": -119.360177,
              "lat": 41.994384
            },
            {
              "lng": -119.444598,
              "lat": 41.995478
            },
            {
              "lng": -119.72573,
              "lat": 41.996296
            },
            {
              "lng": -119.790087,
              "lat": 41.997544
            },
            {
              "lng": -119.848907,
              "lat": 41.997281
            },
            {
              "lng": -119.872929,
              "lat": 41.997641
            },
            {
              "lng": -119.876054,
              "lat": 41.997199
            },
            {
              "lng": -119.986678,
              "lat": 41.995842
            },
            {
              "lng": -119.999168,
              "lat": 41.99454
            },
            {
              "lng": -120.001058,
              "lat": 41.995139
            },
            {
              "lng": -120.181563,
              "lat": 41.994588
            },
            {
              "lng": -120.286424,
              "lat": 41.993058
            },
            {
              "lng": -120.326005,
              "lat": 41.993122
            },
            {
              "lng": -120.501069,
              "lat": 41.993785
            },
            {
              "lng": -120.647173,
              "lat": 41.993084
            },
            {
              "lng": -120.692219,
              "lat": 41.993677
            },
            {
              "lng": -120.693941,
              "lat": 41.993676
            },
            {
              "lng": -120.812279,
              "lat": 41.994183
            },
            {
              "lng": -120.879481,
              "lat": 41.993781
            },
            {
              "lng": -120.882051,
              "lat": 42.509307
            },
            {
              "lng": -120.88334,
              "lat": 42.743883
            },
            {
              "lng": -120.961835,
              "lat": 42.743712
            },
            {
              "lng": -120.99659,
              "lat": 42.74635
            },
            {
              "lng": -121.34988,
              "lat": 42.746671
            },
            {
              "lng": -121.348576,
              "lat": 43.356691
            },
            {
              "lng": -121.332335,
              "lat": 43.356575
            },
            {
              "lng": -121.332982,
              "lat": 43.616629
            },
            {
              "lng": -120.989811,
              "lat": 43.617577
            },
            {
              "lng": -120.959969,
              "lat": 43.615724
            },
            {
              "lng": -120.378194,
              "lat": 43.615452
            },
            {
              "lng": -120.378194,
              "lat": 43.611059
            },
            {
              "lng": -120.279963,
              "lat": 43.612107
            },
            {
              "lng": -120.251631,
              "lat": 43.610875
            },
            {
              "lng": -119.896365,
              "lat": 43.610259
            }
          ]
        }
      ]
    },
    {
      "name": "Area 6",
      "color": "#ff8330",
      "counties": [
        {
          "name": "Baker",
          "boundaries": [
            {
              "lng": -116.896249,
              "lat": 44.84833
            },
            {
              "lng": -116.901028,
              "lat": 44.841536
            },
            {
              "lng": -116.905771,
              "lat": 44.834794
            },
            {
              "lng": -116.920498,
              "lat": 44.81438
            },
            {
              "lng": -116.928099,
              "lat": 44.808381
            },
            {
              "lng": -116.931099,
              "lat": 44.804781
            },
            {
              "lng": -116.933699,
              "lat": 44.798781
            },
            {
              "lng": -116.933799,
              "lat": 44.796781
            },
            {
              "lng": -116.933099,
              "lat": 44.794481
            },
            {
              "lng": -116.9308,
              "lat": 44.790981
            },
            {
              "lng": -116.9307,
              "lat": 44.789881
            },
            {
              "lng": -116.9318,
              "lat": 44.787181
            },
            {
              "lng": -116.9347,
              "lat": 44.783881
            },
            {
              "lng": -116.9368,
              "lat": 44.782881
            },
            {
              "lng": -116.949001,
              "lat": 44.777981
            },
            {
              "lng": -116.966801,
              "lat": 44.775181
            },
            {
              "lng": -116.970902,
              "lat": 44.773881
            },
            {
              "lng": -116.972902,
              "lat": 44.772581
            },
            {
              "lng": -116.977802,
              "lat": 44.767981
            },
            {
              "lng": -116.986502,
              "lat": 44.762381
            },
            {
              "lng": -116.992003,
              "lat": 44.759182
            },
            {
              "lng": -116.998903,
              "lat": 44.756382
            },
            {
              "lng": -117.006045,
              "lat": 44.756024
            },
            {
              "lng": -117.013802,
              "lat": 44.756841
            },
            {
              "lng": -117.03827,
              "lat": 44.748179
            },
            {
              "lng": -117.044217,
              "lat": 44.74514
            },
            {
              "lng": -117.062273,
              "lat": 44.727143
            },
            {
              "lng": -117.060454,
              "lat": 44.721668
            },
            {
              "lng": -117.061799,
              "lat": 44.706654
            },
            {
              "lng": -117.063824,
              "lat": 44.703623
            },
            {
              "lng": -117.072221,
              "lat": 44.700517
            },
            {
              "lng": -117.07912,
              "lat": 44.692175
            },
            {
              "lng": -117.080555,
              "lat": 44.686714
            },
            {
              "lng": -117.080772,
              "lat": 44.684161
            },
            {
              "lng": -117.091223,
              "lat": 44.668807
            },
            {
              "lng": -117.095868,
              "lat": 44.664737
            },
            {
              "lng": -117.096791,
              "lat": 44.657385
            },
            {
              "lng": -117.094968,
              "lat": 44.652011
            },
            {
              "lng": -117.098221,
              "lat": 44.640689
            },
            {
              "lng": -117.108231,
              "lat": 44.62711
            },
            {
              "lng": -117.114754,
              "lat": 44.624883
            },
            {
              "lng": -117.117809,
              "lat": 44.620139
            },
            {
              "lng": -117.120522,
              "lat": 44.614658
            },
            {
              "lng": -117.125267,
              "lat": 44.593818
            },
            {
              "lng": -117.124754,
              "lat": 44.583834
            },
            {
              "lng": -117.126009,
              "lat": 44.581553
            },
            {
              "lng": -117.133963,
              "lat": 44.57524
            },
            {
              "lng": -117.138066,
              "lat": 44.572996
            },
            {
              "lng": -117.14248,
              "lat": 44.57143
            },
            {
              "lng": -117.146032,
              "lat": 44.568603
            },
            {
              "lng": -117.148255,
              "lat": 44.564371
            },
            {
              "lng": -117.147934,
              "lat": 44.562143
            },
            {
              "lng": -117.14293,
              "lat": 44.557236
            },
            {
              "lng": -117.144161,
              "lat": 44.545647
            },
            {
              "lng": -117.149242,
              "lat": 44.536151
            },
            {
              "lng": -117.152406,
              "lat": 44.531802
            },
            {
              "lng": -117.161033,
              "lat": 44.525166
            },
            {
              "lng": -117.167187,
              "lat": 44.523431
            },
            {
              "lng": -117.181583,
              "lat": 44.52296
            },
            {
              "lng": -117.185386,
              "lat": 44.519261
            },
            {
              "lng": -117.189759,
              "lat": 44.513385
            },
            {
              "lng": -117.19163,
              "lat": 44.509886
            },
            {
              "lng": -117.191329,
              "lat": 44.506784
            },
            {
              "lng": -117.192494,
              "lat": 44.503272
            },
            {
              "lng": -117.194317,
              "lat": 44.499884
            },
            {
              "lng": -117.200237,
              "lat": 44.492027
            },
            {
              "lng": -117.208936,
              "lat": 44.485661
            },
            {
              "lng": -117.211148,
              "lat": 44.485359
            },
            {
              "lng": -117.216372,
              "lat": 44.48616
            },
            {
              "lng": -117.224104,
              "lat": 44.483734
            },
            {
              "lng": -117.225076,
              "lat": 44.482346
            },
            {
              "lng": -117.225932,
              "lat": 44.479389
            },
            {
              "lng": -117.225758,
              "lat": 44.477223
            },
            {
              "lng": -117.224445,
              "lat": 44.473884
            },
            {
              "lng": -117.221548,
              "lat": 44.470146
            },
            {
              "lng": -117.217015,
              "lat": 44.459042
            },
            {
              "lng": -117.215573,
              "lat": 44.453746
            },
            {
              "lng": -117.214637,
              "lat": 44.44803
            },
            {
              "lng": -117.215072,
              "lat": 44.427162
            },
            {
              "lng": -117.218285,
              "lat": 44.420664
            },
            {
              "lng": -117.225461,
              "lat": 44.407729
            },
            {
              "lng": -117.22698,
              "lat": 44.405583
            },
            {
              "lng": -117.234835,
              "lat": 44.399669
            },
            {
              "lng": -117.242675,
              "lat": 44.396548
            },
            {
              "lng": -117.243027,
              "lat": 44.390974
            },
            {
              "lng": -117.235117,
              "lat": 44.373853
            },
            {
              "lng": -117.227938,
              "lat": 44.367975
            },
            {
              "lng": -117.216911,
              "lat": 44.360163
            },
            {
              "lng": -117.210587,
              "lat": 44.357703
            },
            {
              "lng": -117.206962,
              "lat": 44.355206
            },
            {
              "lng": -117.197339,
              "lat": 44.347406
            },
            {
              "lng": -117.196149,
              "lat": 44.346362
            },
            {
              "lng": -117.189769,
              "lat": 44.336585
            },
            {
              "lng": -117.189842,
              "lat": 44.335007
            },
            {
              "lng": -117.191546,
              "lat": 44.329621
            },
            {
              "lng": -117.192203,
              "lat": 44.32863
            },
            {
              "lng": -117.203323,
              "lat": 44.313024
            },
            {
              "lng": -117.2055,
              "lat": 44.311789
            },
            {
              "lng": -117.21521,
              "lat": 44.309116
            },
            {
              "lng": -117.216795,
              "lat": 44.308236
            },
            {
              "lng": -117.217843,
              "lat": 44.30718
            },
            {
              "lng": -117.220069,
              "lat": 44.301382
            },
            {
              "lng": -117.486153,
              "lat": 44.30142
            },
            {
              "lng": -117.485899,
              "lat": 44.387696
            },
            {
              "lng": -117.509425,
              "lat": 44.387245
            },
            {
              "lng": -117.509586,
              "lat": 44.401826
            },
            {
              "lng": -117.529533,
              "lat": 44.401649
            },
            {
              "lng": -117.529694,
              "lat": 44.415723
            },
            {
              "lng": -117.56988,
              "lat": 44.415491
            },
            {
              "lng": -117.570106,
              "lat": 44.43027
            },
            {
              "lng": -117.59081,
              "lat": 44.430078
            },
            {
              "lng": -117.590992,
              "lat": 44.444461
            },
            {
              "lng": -117.971596,
              "lat": 44.443328
            },
            {
              "lng": -117.971597,
              "lat": 44.429626
            },
            {
              "lng": -118.011342,
              "lat": 44.429683
            },
            {
              "lng": -118.011341,
              "lat": 44.415283
            },
            {
              "lng": -118.031442,
              "lat": 44.415183
            },
            {
              "lng": -118.031741,
              "lat": 44.389883
            },
            {
              "lng": -118.051941,
              "lat": 44.389983
            },
            {
              "lng": -118.05164,
              "lat": 44.371983
            },
            {
              "lng": -118.07184,
              "lat": 44.371783
            },
            {
              "lng": -118.07194,
              "lat": 44.357383
            },
            {
              "lng": -118.08694,
              "lat": 44.357483
            },
            {
              "lng": -118.092239,
              "lat": 44.328683
            },
            {
              "lng": -118.11184,
              "lat": 44.328683
            },
            {
              "lng": -118.111739,
              "lat": 44.314183
            },
            {
              "lng": -118.13204,
              "lat": 44.313883
            },
            {
              "lng": -118.131839,
              "lat": 44.299483
            },
            {
              "lng": -118.15234,
              "lat": 44.299583
            },
            {
              "lng": -118.152639,
              "lat": 44.270682
            },
            {
              "lng": -118.23214,
              "lat": 44.256083
            },
            {
              "lng": -118.497249,
              "lat": 44.255084
            },
            {
              "lng": -118.49025,
              "lat": 44.289284
            },
            {
              "lng": -118.46905,
              "lat": 44.334583
            },
            {
              "lng": -118.439549,
              "lat": 44.351183
            },
            {
              "lng": -118.434049,
              "lat": 44.367983
            },
            {
              "lng": -118.409749,
              "lat": 44.378683
            },
            {
              "lng": -118.43485,
              "lat": 44.397583
            },
            {
              "lng": -118.41815,
              "lat": 44.432282
            },
            {
              "lng": -118.41915,
              "lat": 44.456682
            },
            {
              "lng": -118.40845,
              "lat": 44.452782
            },
            {
              "lng": -118.360949,
              "lat": 44.471282
            },
            {
              "lng": -118.357849,
              "lat": 44.484582
            },
            {
              "lng": -118.37485,
              "lat": 44.507882
            },
            {
              "lng": -118.37235,
              "lat": 44.528581
            },
            {
              "lng": -118.34735,
              "lat": 44.55018
            },
            {
              "lng": -118.33765,
              "lat": 44.56718
            },
            {
              "lng": -118.32585,
              "lat": 44.56088
            },
            {
              "lng": -118.30615,
              "lat": 44.588979
            },
            {
              "lng": -118.316651,
              "lat": 44.603878
            },
            {
              "lng": -118.338951,
              "lat": 44.611378
            },
            {
              "lng": -118.355052,
              "lat": 44.639177
            },
            {
              "lng": -118.372953,
              "lat": 44.645376
            },
            {
              "lng": -118.409754,
              "lat": 44.642676
            },
            {
              "lng": -118.424554,
              "lat": 44.654876
            },
            {
              "lng": -118.455955,
              "lat": 44.655476
            },
            {
              "lng": -118.504957,
              "lat": 44.666275
            },
            {
              "lng": -118.519257,
              "lat": 44.706374
            },
            {
              "lng": -118.494457,
              "lat": 44.713574
            },
            {
              "lng": -118.461656,
              "lat": 44.707374
            },
            {
              "lng": -118.443056,
              "lat": 44.724273
            },
            {
              "lng": -118.419156,
              "lat": 44.718674
            },
            {
              "lng": -118.393555,
              "lat": 44.727873
            },
            {
              "lng": -118.367655,
              "lat": 44.747273
            },
            {
              "lng": -118.321253,
              "lat": 44.741473
            },
            {
              "lng": -118.285153,
              "lat": 44.751172
            },
            {
              "lng": -118.282853,
              "lat": 44.771871
            },
            {
              "lng": -118.299453,
              "lat": 44.796369
            },
            {
              "lng": -118.296353,
              "lat": 44.816168
            },
            {
              "lng": -118.318954,
              "lat": 44.836266
            },
            {
              "lng": -118.293753,
              "lat": 44.852965
            },
            {
              "lng": -118.296153,
              "lat": 44.862664
            },
            {
              "lng": -118.267452,
              "lat": 44.869364
            },
            {
              "lng": -118.228052,
              "lat": 44.865364
            },
            {
              "lng": -118.237352,
              "lat": 44.908161
            },
            {
              "lng": -118.223652,
              "lat": 44.936959
            },
            {
              "lng": -118.244952,
              "lat": 44.945358
            },
            {
              "lng": -118.244751,
              "lat": 44.958256
            },
            {
              "lng": -118.213869,
              "lat": 44.989174
            },
            {
              "lng": -118.214497,
              "lat": 45.006585
            },
            {
              "lng": -118.194901,
              "lat": 45.017329
            },
            {
              "lng": -118.161036,
              "lat": 45.015711
            },
            {
              "lng": -118.130309,
              "lat": 45.045124
            },
            {
              "lng": -118.09213,
              "lat": 45.041238
            },
            {
              "lng": -118.06955,
              "lat": 45.016873
            },
            {
              "lng": -117.998761,
              "lat": 44.994314
            },
            {
              "lng": -117.969185,
              "lat": 44.995803
            },
            {
              "lng": -117.921573,
              "lat": 45.019224
            },
            {
              "lng": -117.896386,
              "lat": 45.037917
            },
            {
              "lng": -117.874244,
              "lat": 45.065608
            },
            {
              "lng": -117.862587,
              "lat": 45.054395
            },
            {
              "lng": -117.84343,
              "lat": 45.058477
            },
            {
              "lng": -117.818062,
              "lat": 45.025909
            },
            {
              "lng": -117.805122,
              "lat": 45.032882
            },
            {
              "lng": -117.781825,
              "lat": 45.013583
            },
            {
              "lng": -117.777504,
              "lat": 44.992161
            },
            {
              "lng": -117.563714,
              "lat": 44.992788
            },
            {
              "lng": -117.563138,
              "lat": 45.079588
            },
            {
              "lng": -117.266572,
              "lat": 45.080805
            },
            {
              "lng": -116.783808,
              "lat": 45.079026
            },
            {
              "lng": -116.78371,
              "lat": 45.076972
            },
            {
              "lng": -116.797329,
              "lat": 45.060267
            },
            {
              "lng": -116.808576,
              "lat": 45.050652
            },
            {
              "lng": -116.825133,
              "lat": 45.03784
            },
            {
              "lng": -116.830115,
              "lat": 45.035317
            },
            {
              "lng": -116.841314,
              "lat": 45.030907
            },
            {
              "lng": -116.847944,
              "lat": 45.022602
            },
            {
              "lng": -116.848037,
              "lat": 45.021728
            },
            {
              "lng": -116.845847,
              "lat": 45.01847
            },
            {
              "lng": -116.844796,
              "lat": 45.015312
            },
            {
              "lng": -116.844625,
              "lat": 45.001435
            },
            {
              "lng": -116.846103,
              "lat": 44.999878
            },
            {
              "lng": -116.856754,
              "lat": 44.984298
            },
            {
              "lng": -116.858313,
              "lat": 44.978761
            },
            {
              "lng": -116.851406,
              "lat": 44.959841
            },
            {
              "lng": -116.850737,
              "lat": 44.958113
            },
            {
              "lng": -116.846461,
              "lat": 44.951521
            },
            {
              "lng": -116.835702,
              "lat": 44.940633
            },
            {
              "lng": -116.83199,
              "lat": 44.933007
            },
            {
              "lng": -116.832176,
              "lat": 44.931373
            },
            {
              "lng": -116.833632,
              "lat": 44.928976
            },
            {
              "lng": -116.838467,
              "lat": 44.923601
            },
            {
              "lng": -116.842108,
              "lat": 44.914922
            },
            {
              "lng": -116.846061,
              "lat": 44.905249
            },
            {
              "lng": -116.850512,
              "lat": 44.893523
            },
            {
              "lng": -116.852427,
              "lat": 44.887577
            },
            {
              "lng": -116.857038,
              "lat": 44.880769
            },
            {
              "lng": -116.865338,
              "lat": 44.870599
            },
            {
              "lng": -116.883598,
              "lat": 44.858268
            },
            {
              "lng": -116.896249,
              "lat": 44.84833
            }
          ]
        },
        {
          "name": "Gilliam",
          "boundaries": [
            {
              "lng": -120.653559,
              "lat": 45.737237
            },
            {
              "lng": -120.634968,
              "lat": 45.745847
            },
            {
              "lng": -120.591166,
              "lat": 45.746547
            },
            {
              "lng": -120.559465,
              "lat": 45.738348
            },
            {
              "lng": -120.521964,
              "lat": 45.709848
            },
            {
              "lng": -120.505863,
              "lat": 45.700048
            },
            {
              "lng": -120.482362,
              "lat": 45.694449
            },
            {
              "lng": -120.40396,
              "lat": 45.699249
            },
            {
              "lng": -120.329057,
              "lat": 45.71105
            },
            {
              "lng": -120.288656,
              "lat": 45.72015
            },
            {
              "lng": -120.282156,
              "lat": 45.72125
            },
            {
              "lng": -120.210754,
              "lat": 45.725951
            },
            {
              "lng": -120.170453,
              "lat": 45.761951
            },
            {
              "lng": -120.141352,
              "lat": 45.773152
            },
            {
              "lng": -120.07015,
              "lat": 45.785152
            },
            {
              "lng": -120.001148,
              "lat": 45.811902
            },
            {
              "lng": -119.999502,
              "lat": 45.812481
            },
            {
              "lng": -119.999243,
              "lat": 45.517431
            },
            {
              "lng": -120.004783,
              "lat": 45.517382
            },
            {
              "lng": -120.00674,
              "lat": 45.257454
            },
            {
              "lng": -119.882037,
              "lat": 45.255956
            },
            {
              "lng": -119.883034,
              "lat": 45.169657
            },
            {
              "lng": -119.760125,
              "lat": 45.16758
            },
            {
              "lng": -119.760426,
              "lat": 45.081261
            },
            {
              "lng": -119.790327,
              "lat": 45.08146
            },
            {
              "lng": -119.790426,
              "lat": 45.067761
            },
            {
              "lng": -119.890329,
              "lat": 45.068158
            },
            {
              "lng": -119.91023,
              "lat": 45.066558
            },
            {
              "lng": -119.91023,
              "lat": 45.065658
            },
            {
              "lng": -120.402245,
              "lat": 45.066751
            },
            {
              "lng": -120.495247,
              "lat": 45.068549
            },
            {
              "lng": -120.494548,
              "lat": 45.07465
            },
            {
              "lng": -120.503549,
              "lat": 45.08295
            },
            {
              "lng": -120.512249,
              "lat": 45.09095
            },
            {
              "lng": -120.50005,
              "lat": 45.10435
            },
            {
              "lng": -120.478549,
              "lat": 45.11085
            },
            {
              "lng": -120.46085,
              "lat": 45.13725
            },
            {
              "lng": -120.470551,
              "lat": 45.16075
            },
            {
              "lng": -120.508454,
              "lat": 45.19735
            },
            {
              "lng": -120.536755,
              "lat": 45.21115
            },
            {
              "lng": -120.536656,
              "lat": 45.22185
            },
            {
              "lng": -120.550957,
              "lat": 45.244549
            },
            {
              "lng": -120.546657,
              "lat": 45.266249
            },
            {
              "lng": -120.545758,
              "lat": 45.293749
            },
            {
              "lng": -120.530358,
              "lat": 45.308349
            },
            {
              "lng": -120.534358,
              "lat": 45.331449
            },
            {
              "lng": -120.531759,
              "lat": 45.361749
            },
            {
              "lng": -120.521759,
              "lat": 45.390749
            },
            {
              "lng": -120.495059,
              "lat": 45.428149
            },
            {
              "lng": -120.495659,
              "lat": 45.449649
            },
            {
              "lng": -120.476659,
              "lat": 45.473149
            },
            {
              "lng": -120.435673,
              "lat": 45.474062
            },
            {
              "lng": -120.408857,
              "lat": 45.49805
            },
            {
              "lng": -120.385056,
              "lat": 45.49585
            },
            {
              "lng": -120.364691,
              "lat": 45.513351
            },
            {
              "lng": -120.366533,
              "lat": 45.53134
            },
            {
              "lng": -120.396065,
              "lat": 45.552844
            },
            {
              "lng": -120.424039,
              "lat": 45.597371
            },
            {
              "lng": -120.472851,
              "lat": 45.626246
            },
            {
              "lng": -120.491186,
              "lat": 45.650633
            },
            {
              "lng": -120.555064,
              "lat": 45.679048
            },
            {
              "lng": -120.635868,
              "lat": 45.721546
            },
            {
              "lng": -120.653559,
              "lat": 45.737237
            }
          ]
        },
        {
          "name": "Malheur",
          "boundaries": [
            {
              "lng": -116.895931,
              "lat": 44.154295
            },
            {
              "lng": -116.897175,
              "lat": 44.152538
            },
            {
              "lng": -116.927688,
              "lat": 44.109438
            },
            {
              "lng": -116.928306,
              "lat": 44.107326
            },
            {
              "lng": -116.933704,
              "lat": 44.100039
            },
            {
              "lng": -116.937835,
              "lat": 44.096943
            },
            {
              "lng": -116.943132,
              "lat": 44.09406
            },
            {
              "lng": -116.957009,
              "lat": 44.091743
            },
            {
              "lng": -116.967203,
              "lat": 44.090936
            },
            {
              "lng": -116.974253,
              "lat": 44.088295
            },
            {
              "lng": -116.977351,
              "lat": 44.085364
            },
            {
              "lng": -116.974016,
              "lat": 44.053663
            },
            {
              "lng": -116.973185,
              "lat": 44.049425
            },
            {
              "lng": -116.972504,
              "lat": 44.048771
            },
            {
              "lng": -116.956246,
              "lat": 44.042888
            },
            {
              "lng": -116.943361,
              "lat": 44.035645
            },
            {
              "lng": -116.937342,
              "lat": 44.029376
            },
            {
              "lng": -116.934727,
              "lat": 44.023806
            },
            {
              "lng": -116.934485,
              "lat": 44.021249
            },
            {
              "lng": -116.936765,
              "lat": 44.010608
            },
            {
              "lng": -116.942346,
              "lat": 43.989106
            },
            {
              "lng": -116.942944,
              "lat": 43.987512
            },
            {
              "lng": -116.957527,
              "lat": 43.972443
            },
            {
              "lng": -116.966314,
              "lat": 43.968884
            },
            {
              "lng": -116.969842,
              "lat": 43.967588
            },
            {
              "lng": -116.971436,
              "lat": 43.964998
            },
            {
              "lng": -116.971835,
              "lat": 43.962806
            },
            {
              "lng": -116.971237,
              "lat": 43.960216
            },
            {
              "lng": -116.970241,
              "lat": 43.958622
            },
            {
              "lng": -116.969245,
              "lat": 43.957426
            },
            {
              "lng": -116.966256,
              "lat": 43.955832
            },
            {
              "lng": -116.963666,
              "lat": 43.952644
            },
            {
              "lng": -116.96247,
              "lat": 43.928336
            },
            {
              "lng": -116.963666,
              "lat": 43.921363
            },
            {
              "lng": -116.966256,
              "lat": 43.918573
            },
            {
              "lng": -116.977332,
              "lat": 43.905812
            },
            {
              "lng": -116.976429,
              "lat": 43.901293
            },
            {
              "lng": -116.976024,
              "lat": 43.895548
            },
            {
              "lng": -116.979711,
              "lat": 43.879975
            },
            {
              "lng": -116.982347,
              "lat": 43.86884
            },
            {
              "lng": -116.98294,
              "lat": 43.86771
            },
            {
              "lng": -116.989598,
              "lat": 43.864301
            },
            {
              "lng": -116.991415,
              "lat": 43.863864
            },
            {
              "lng": -116.997391,
              "lat": 43.864874
            },
            {
              "lng": -116.999061,
              "lat": 43.864637
            },
            {
              "lng": -117.01077,
              "lat": 43.862269
            },
            {
              "lng": -117.013954,
              "lat": 43.859358
            },
            {
              "lng": -117.026143,
              "lat": 43.83448
            },
            {
              "lng": -117.026871,
              "lat": 43.832479
            },
            {
              "lng": -117.02678,
              "lat": 43.829841
            },
            {
              "lng": -117.026634,
              "lat": 43.808104
            },
            {
              "lng": -117.026651,
              "lat": 43.733935
            },
            {
              "lng": -117.026841,
              "lat": 43.732905
            },
            {
              "lng": -117.026725,
              "lat": 43.714815
            },
            {
              "lng": -117.026825,
              "lat": 43.706193
            },
            {
              "lng": -117.026586,
              "lat": 43.683001
            },
            {
              "lng": -117.026623,
              "lat": 43.680865
            },
            {
              "lng": -117.026717,
              "lat": 43.675523
            },
            {
              "lng": -117.026661,
              "lat": 43.664385
            },
            {
              "lng": -117.026705,
              "lat": 43.631659
            },
            {
              "lng": -117.026905,
              "lat": 43.62488
            },
            {
              "lng": -117.027001,
              "lat": 43.621032
            },
            {
              "lng": -117.026937,
              "lat": 43.617614
            },
            {
              "lng": -117.026789,
              "lat": 43.610669
            },
            {
              "lng": -117.02676,
              "lat": 43.601912
            },
            {
              "lng": -117.026824,
              "lat": 43.600357
            },
            {
              "lng": -117.026889,
              "lat": 43.596033
            },
            {
              "lng": -117.026922,
              "lat": 43.593632
            },
            {
              "lng": -117.026774,
              "lat": 43.578674
            },
            {
              "lng": -117.026746,
              "lat": 43.577526
            },
            {
              "lng": -117.026652,
              "lat": 43.025128
            },
            {
              "lng": -117.026683,
              "lat": 43.024876
            },
            {
              "lng": -117.026253,
              "lat": 42.807447
            },
            {
              "lng": -117.026303,
              "lat": 42.80717
            },
            {
              "lng": -117.026331,
              "lat": 42.807015
            },
            {
              "lng": -117.026665,
              "lat": 42.624878
            },
            {
              "lng": -117.026551,
              "lat": 42.378557
            },
            {
              "lng": -117.026129,
              "lat": 42.357193
            },
            {
              "lng": -117.026195,
              "lat": 42.166404
            },
            {
              "lng": -117.02659,
              "lat": 42.133258
            },
            {
              "lng": -117.026098,
              "lat": 42.117647
            },
            {
              "lng": -117.026222,
              "lat": 42.000252
            },
            {
              "lng": -117.040906,
              "lat": 41.99989
            },
            {
              "lng": -117.04891,
              "lat": 41.998983
            },
            {
              "lng": -117.055402,
              "lat": 41.99989
            },
            {
              "lng": -117.068613,
              "lat": 42.000035
            },
            {
              "lng": -117.197798,
              "lat": 42.00038
            },
            {
              "lng": -117.217551,
              "lat": 41.999887
            },
            {
              "lng": -117.403613,
              "lat": 41.99929
            },
            {
              "lng": -117.443062,
              "lat": 41.999659
            },
            {
              "lng": -117.623731,
              "lat": 41.998467
            },
            {
              "lng": -117.625973,
              "lat": 41.998102
            },
            {
              "lng": -117.873467,
              "lat": 41.998335
            },
            {
              "lng": -118.197189,
              "lat": 41.996995
            },
            {
              "lng": -118.195361,
              "lat": 42.275869
            },
            {
              "lng": -118.214725,
              "lat": 42.276029
            },
            {
              "lng": -118.216688,
              "lat": 42.914547
            },
            {
              "lng": -118.229049,
              "lat": 42.914581
            },
            {
              "lng": -118.228048,
              "lat": 43.349147
            },
            {
              "lng": -118.232129,
              "lat": 43.374881
            },
            {
              "lng": -118.231926,
              "lat": 43.77898
            },
            {
              "lng": -118.227599,
              "lat": 43.817869
            },
            {
              "lng": -118.227435,
              "lat": 44.039981
            },
            {
              "lng": -118.22834,
              "lat": 44.212483
            },
            {
              "lng": -118.23214,
              "lat": 44.256083
            },
            {
              "lng": -118.152639,
              "lat": 44.270682
            },
            {
              "lng": -118.15234,
              "lat": 44.299583
            },
            {
              "lng": -118.131839,
              "lat": 44.299483
            },
            {
              "lng": -118.13204,
              "lat": 44.313883
            },
            {
              "lng": -118.111739,
              "lat": 44.314183
            },
            {
              "lng": -118.11184,
              "lat": 44.328683
            },
            {
              "lng": -118.092239,
              "lat": 44.328683
            },
            {
              "lng": -118.08694,
              "lat": 44.357483
            },
            {
              "lng": -118.07194,
              "lat": 44.357383
            },
            {
              "lng": -118.07184,
              "lat": 44.371783
            },
            {
              "lng": -118.05164,
              "lat": 44.371983
            },
            {
              "lng": -118.051941,
              "lat": 44.389983
            },
            {
              "lng": -118.031741,
              "lat": 44.389883
            },
            {
              "lng": -118.031442,
              "lat": 44.415183
            },
            {
              "lng": -118.011341,
              "lat": 44.415283
            },
            {
              "lng": -118.011342,
              "lat": 44.429683
            },
            {
              "lng": -117.971597,
              "lat": 44.429626
            },
            {
              "lng": -117.971596,
              "lat": 44.443328
            },
            {
              "lng": -117.590992,
              "lat": 44.444461
            },
            {
              "lng": -117.59081,
              "lat": 44.430078
            },
            {
              "lng": -117.570106,
              "lat": 44.43027
            },
            {
              "lng": -117.56988,
              "lat": 44.415491
            },
            {
              "lng": -117.529694,
              "lat": 44.415723
            },
            {
              "lng": -117.529533,
              "lat": 44.401649
            },
            {
              "lng": -117.509586,
              "lat": 44.401826
            },
            {
              "lng": -117.509425,
              "lat": 44.387245
            },
            {
              "lng": -117.485899,
              "lat": 44.387696
            },
            {
              "lng": -117.486153,
              "lat": 44.30142
            },
            {
              "lng": -117.220069,
              "lat": 44.301382
            },
            {
              "lng": -117.222451,
              "lat": 44.298963
            },
            {
              "lng": -117.222647,
              "lat": 44.297578
            },
            {
              "lng": -117.216974,
              "lat": 44.288357
            },
            {
              "lng": -117.198147,
              "lat": 44.273828
            },
            {
              "lng": -117.193129,
              "lat": 44.270963
            },
            {
              "lng": -117.170342,
              "lat": 44.25889
            },
            {
              "lng": -117.15706,
              "lat": 44.25749
            },
            {
              "lng": -117.143394,
              "lat": 44.258262
            },
            {
              "lng": -117.138523,
              "lat": 44.25937
            },
            {
              "lng": -117.133984,
              "lat": 44.262972
            },
            {
              "lng": -117.133104,
              "lat": 44.264236
            },
            {
              "lng": -117.13253,
              "lat": 44.267045
            },
            {
              "lng": -117.130904,
              "lat": 44.269453
            },
            {
              "lng": -117.121037,
              "lat": 44.277585
            },
            {
              "lng": -117.118018,
              "lat": 44.278945
            },
            {
              "lng": -117.111617,
              "lat": 44.280667
            },
            {
              "lng": -117.107673,
              "lat": 44.280763
            },
            {
              "lng": -117.104208,
              "lat": 44.27994
            },
            {
              "lng": -117.102242,
              "lat": 44.278799
            },
            {
              "lng": -117.098531,
              "lat": 44.275533
            },
            {
              "lng": -117.09457,
              "lat": 44.270978
            },
            {
              "lng": -117.093578,
              "lat": 44.269383
            },
            {
              "lng": -117.090933,
              "lat": 44.260311
            },
            {
              "lng": -117.089503,
              "lat": 44.258234
            },
            {
              "lng": -117.07835,
              "lat": 44.249885
            },
            {
              "lng": -117.067284,
              "lat": 44.24401
            },
            {
              "lng": -117.059352,
              "lat": 44.237244
            },
            {
              "lng": -117.05651,
              "lat": 44.230874
            },
            {
              "lng": -117.05303,
              "lat": 44.229076
            },
            {
              "lng": -117.050057,
              "lat": 44.22883
            },
            {
              "lng": -117.047062,
              "lat": 44.229742
            },
            {
              "lng": -117.045513,
              "lat": 44.232005
            },
            {
              "lng": -117.042283,
              "lat": 44.242775
            },
            {
              "lng": -117.03585,
              "lat": 44.246805
            },
            {
              "lng": -117.031862,
              "lat": 44.248635
            },
            {
              "lng": -117.027558,
              "lat": 44.248881
            },
            {
              "lng": -117.025277,
              "lat": 44.248505
            },
            {
              "lng": -117.020231,
              "lat": 44.246063
            },
            {
              "lng": -117.016921,
              "lat": 44.245391
            },
            {
              "lng": -117.001,
              "lat": 44.245386
            },
            {
              "lng": -116.98687,
              "lat": 44.245477
            },
            {
              "lng": -116.975905,
              "lat": 44.242844
            },
            {
              "lng": -116.973542,
              "lat": 44.23998
            },
            {
              "lng": -116.971958,
              "lat": 44.235677
            },
            {
              "lng": -116.973945,
              "lat": 44.225932
            },
            {
              "lng": -116.973701,
              "lat": 44.208017
            },
            {
              "lng": -116.971675,
              "lat": 44.197256
            },
            {
              "lng": -116.967259,
              "lat": 44.194581
            },
            {
              "lng": -116.965498,
              "lat": 44.194126
            },
            {
              "lng": -116.947591,
              "lat": 44.191264
            },
            {
              "lng": -116.945256,
              "lat": 44.191677
            },
            {
              "lng": -116.940534,
              "lat": 44.19371
            },
            {
              "lng": -116.935443,
              "lat": 44.193962
            },
            {
              "lng": -116.925392,
              "lat": 44.191544
            },
            {
              "lng": -116.902752,
              "lat": 44.179467
            },
            {
              "lng": -116.900103,
              "lat": 44.176851
            },
            {
              "lng": -116.895757,
              "lat": 44.171267
            },
            {
              "lng": -116.894083,
              "lat": 44.160191
            },
            {
              "lng": -116.894309,
              "lat": 44.158114
            },
            {
              "lng": -116.895931,
              "lat": 44.154295
            }
          ]
        },
        {
          "name": "Morrow",
          "boundaries": [
            {
              "lng": -119.965744,
              "lat": 45.824365
            },
            {
              "lng": -119.907461,
              "lat": 45.828135
            },
            {
              "lng": -119.876144,
              "lat": 45.834718
            },
            {
              "lng": -119.868135,
              "lat": 45.835962
            },
            {
              "lng": -119.802655,
              "lat": 45.84753
            },
            {
              "lng": -119.772927,
              "lat": 45.845578
            },
            {
              "lng": -119.669877,
              "lat": 45.856867
            },
            {
              "lng": -119.623393,
              "lat": 45.905639
            },
            {
              "lng": -119.600549,
              "lat": 45.919581
            },
            {
              "lng": -119.571584,
              "lat": 45.925456
            },
            {
              "lng": -119.524632,
              "lat": 45.908605
            },
            {
              "lng": -119.487829,
              "lat": 45.906307
            },
            {
              "lng": -119.450256,
              "lat": 45.917354
            },
            {
              "lng": -119.43189,
              "lat": 45.918263
            },
            {
              "lng": -119.434549,
              "lat": 45.864628
            },
            {
              "lng": -119.434639,
              "lat": 45.602771
            },
            {
              "lng": -119.248241,
              "lat": 45.601873
            },
            {
              "lng": -119.248276,
              "lat": 45.516102
            },
            {
              "lng": -119.14537,
              "lat": 45.516055
            },
            {
              "lng": -119.146402,
              "lat": 45.082963
            },
            {
              "lng": -119.163103,
              "lat": 45.082863
            },
            {
              "lng": -119.163882,
              "lat": 44.995887
            },
            {
              "lng": -119.408168,
              "lat": 44.994759
            },
            {
              "lng": -119.671987,
              "lat": 44.994424
            },
            {
              "lng": -119.791055,
              "lat": 44.994636
            },
            {
              "lng": -119.790426,
              "lat": 45.067761
            },
            {
              "lng": -119.790327,
              "lat": 45.08146
            },
            {
              "lng": -119.760426,
              "lat": 45.081261
            },
            {
              "lng": -119.760125,
              "lat": 45.16758
            },
            {
              "lng": -119.883034,
              "lat": 45.169657
            },
            {
              "lng": -119.882037,
              "lat": 45.255956
            },
            {
              "lng": -120.00674,
              "lat": 45.257454
            },
            {
              "lng": -120.004783,
              "lat": 45.517382
            },
            {
              "lng": -119.999243,
              "lat": 45.517431
            },
            {
              "lng": -119.999502,
              "lat": 45.812481
            },
            {
              "lng": -119.965744,
              "lat": 45.824365
            }
          ]
        },
        {
          "name": "Sherman",
          "boundaries": [
            {
              "lng": -120.915876,
              "lat": 45.641345
            },
            {
              "lng": -120.913476,
              "lat": 45.640045
            },
            {
              "lng": -120.895575,
              "lat": 45.642945
            },
            {
              "lng": -120.870042,
              "lat": 45.661242
            },
            {
              "lng": -120.855674,
              "lat": 45.671545
            },
            {
              "lng": -120.788872,
              "lat": 45.686246
            },
            {
              "lng": -120.724171,
              "lat": 45.706446
            },
            {
              "lng": -120.68937,
              "lat": 45.715847
            },
            {
              "lng": -120.668869,
              "lat": 45.730147
            },
            {
              "lng": -120.653559,
              "lat": 45.737237
            },
            {
              "lng": -120.635868,
              "lat": 45.721546
            },
            {
              "lng": -120.555064,
              "lat": 45.679048
            },
            {
              "lng": -120.491186,
              "lat": 45.650633
            },
            {
              "lng": -120.472851,
              "lat": 45.626246
            },
            {
              "lng": -120.424039,
              "lat": 45.597371
            },
            {
              "lng": -120.396065,
              "lat": 45.552844
            },
            {
              "lng": -120.366533,
              "lat": 45.53134
            },
            {
              "lng": -120.364691,
              "lat": 45.513351
            },
            {
              "lng": -120.385056,
              "lat": 45.49585
            },
            {
              "lng": -120.408857,
              "lat": 45.49805
            },
            {
              "lng": -120.435673,
              "lat": 45.474062
            },
            {
              "lng": -120.476659,
              "lat": 45.473149
            },
            {
              "lng": -120.495659,
              "lat": 45.449649
            },
            {
              "lng": -120.495059,
              "lat": 45.428149
            },
            {
              "lng": -120.521759,
              "lat": 45.390749
            },
            {
              "lng": -120.531759,
              "lat": 45.361749
            },
            {
              "lng": -120.534358,
              "lat": 45.331449
            },
            {
              "lng": -120.530358,
              "lat": 45.308349
            },
            {
              "lng": -120.545758,
              "lat": 45.293749
            },
            {
              "lng": -120.546657,
              "lat": 45.266249
            },
            {
              "lng": -120.550957,
              "lat": 45.244549
            },
            {
              "lng": -120.536656,
              "lat": 45.22185
            },
            {
              "lng": -120.536755,
              "lat": 45.21115
            },
            {
              "lng": -120.508454,
              "lat": 45.19735
            },
            {
              "lng": -120.470551,
              "lat": 45.16075
            },
            {
              "lng": -120.46085,
              "lat": 45.13725
            },
            {
              "lng": -120.478549,
              "lat": 45.11085
            },
            {
              "lng": -120.50005,
              "lat": 45.10435
            },
            {
              "lng": -120.512249,
              "lat": 45.09095
            },
            {
              "lng": -120.503549,
              "lat": 45.08295
            },
            {
              "lng": -120.654262,
              "lat": 45.083712
            },
            {
              "lng": -120.723748,
              "lat": 45.083832
            },
            {
              "lng": -120.726111,
              "lat": 45.101624
            },
            {
              "lng": -120.718501,
              "lat": 45.109673
            },
            {
              "lng": -120.723505,
              "lat": 45.12553
            },
            {
              "lng": -120.747478,
              "lat": 45.140243
            },
            {
              "lng": -120.766227,
              "lat": 45.153311
            },
            {
              "lng": -120.786773,
              "lat": 45.163713
            },
            {
              "lng": -120.810058,
              "lat": 45.170205
            },
            {
              "lng": -120.836211,
              "lat": 45.180576
            },
            {
              "lng": -120.856027,
              "lat": 45.193344
            },
            {
              "lng": -120.881701,
              "lat": 45.200305
            },
            {
              "lng": -120.912699,
              "lat": 45.199697
            },
            {
              "lng": -120.935177,
              "lat": 45.200572
            },
            {
              "lng": -120.957863,
              "lat": 45.196687
            },
            {
              "lng": -120.987691,
              "lat": 45.200376
            },
            {
              "lng": -121.012846,
              "lat": 45.211798
            },
            {
              "lng": -121.02196,
              "lat": 45.230293
            },
            {
              "lng": -121.023015,
              "lat": 45.255812
            },
            {
              "lng": -121.022787,
              "lat": 45.291146
            },
            {
              "lng": -120.973097,
              "lat": 45.318149
            },
            {
              "lng": -120.946315,
              "lat": 45.330507
            },
            {
              "lng": -120.909271,
              "lat": 45.362145
            },
            {
              "lng": -120.867569,
              "lat": 45.39649
            },
            {
              "lng": -120.85917,
              "lat": 45.428645
            },
            {
              "lng": -120.840385,
              "lat": 45.465903
            },
            {
              "lng": -120.835784,
              "lat": 45.506942
            },
            {
              "lng": -120.853673,
              "lat": 45.522146
            },
            {
              "lng": -120.891474,
              "lat": 45.541745
            },
            {
              "lng": -120.905712,
              "lat": 45.567689
            },
            {
              "lng": -120.902477,
              "lat": 45.599146
            },
            {
              "lng": -120.910597,
              "lat": 45.630284
            },
            {
              "lng": -120.915876,
              "lat": 45.641345
            }
          ]
        },
        {
          "name": "Umatilla",
          "boundaries": [
            {
              "lng": -118.987129,
              "lat": 45.999855
            },
            {
              "lng": -118.941242,
              "lat": 46.000574
            },
            {
              "lng": -118.67787,
              "lat": 46.000935
            },
            {
              "lng": -118.658717,
              "lat": 46.000955
            },
            {
              "lng": -118.639332,
              "lat": 46.000994
            },
            {
              "lng": -118.637725,
              "lat": 46.00097
            },
            {
              "lng": -118.579906,
              "lat": 46.000818
            },
            {
              "lng": -118.57571,
              "lat": 46.000718
            },
            {
              "lng": -118.569392,
              "lat": 46.000773
            },
            {
              "lng": -118.537119,
              "lat": 46.00084
            },
            {
              "lng": -118.497027,
              "lat": 46.00062
            },
            {
              "lng": -118.470756,
              "lat": 46.000632
            },
            {
              "lng": -118.37836,
              "lat": 46.000574
            },
            {
              "lng": -118.36779,
              "lat": 46.000622
            },
            {
              "lng": -118.314982,
              "lat": 46.000453
            },
            {
              "lng": -118.283526,
              "lat": 46.000787
            },
            {
              "lng": -118.256368,
              "lat": 46.000439
            },
            {
              "lng": -118.25253,
              "lat": 46.000459
            },
            {
              "lng": -118.236584,
              "lat": 46.000418
            },
            {
              "lng": -118.228941,
              "lat": 46.000421
            },
            {
              "lng": -118.146028,
              "lat": 46.000701
            },
            {
              "lng": -118.131019,
              "lat": 46.00028
            },
            {
              "lng": -118.126197,
              "lat": 46.000282
            },
            {
              "lng": -117.996911,
              "lat": 46.000787
            },
            {
              "lng": -117.977767,
              "lat": 46.000724
            },
            {
              "lng": -117.977688,
              "lat": 45.860558
            },
            {
              "lng": -117.972922,
              "lat": 45.860586
            },
            {
              "lng": -117.973666,
              "lat": 45.816978
            },
            {
              "lng": -118.045003,
              "lat": 45.817098
            },
            {
              "lng": -118.045054,
              "lat": 45.773538
            },
            {
              "lng": -118.066374,
              "lat": 45.773529
            },
            {
              "lng": -118.066823,
              "lat": 45.688365
            },
            {
              "lng": -118.117153,
              "lat": 45.688498
            },
            {
              "lng": -118.117053,
              "lat": 45.470754
            },
            {
              "lng": -118.198158,
              "lat": 45.470453
            },
            {
              "lng": -118.197957,
              "lat": 45.427153
            },
            {
              "lng": -118.241859,
              "lat": 45.428952
            },
            {
              "lng": -118.366566,
              "lat": 45.428951
            },
            {
              "lng": -118.384466,
              "lat": 45.442651
            },
            {
              "lng": -118.405168,
              "lat": 45.442651
            },
            {
              "lng": -118.404868,
              "lat": 45.42905
            },
            {
              "lng": -118.428469,
              "lat": 45.428951
            },
            {
              "lng": -118.428268,
              "lat": 45.355151
            },
            {
              "lng": -118.613379,
              "lat": 45.354952
            },
            {
              "lng": -118.613878,
              "lat": 45.339852
            },
            {
              "lng": -118.656281,
              "lat": 45.340452
            },
            {
              "lng": -118.656181,
              "lat": 45.345252
            },
            {
              "lng": -118.697684,
              "lat": 45.345153
            },
            {
              "lng": -118.696782,
              "lat": 45.257653
            },
            {
              "lng": -118.655779,
              "lat": 45.257753
            },
            {
              "lng": -118.655777,
              "lat": 45.196855
            },
            {
              "lng": -118.546678,
              "lat": 45.196951
            },
            {
              "lng": -118.548568,
              "lat": 45.080756
            },
            {
              "lng": -118.518466,
              "lat": 45.080654
            },
            {
              "lng": -118.519063,
              "lat": 44.995956
            },
            {
              "lng": -119.001088,
              "lat": 44.996778
            },
            {
              "lng": -119.005034,
              "lat": 44.996468
            },
            {
              "lng": -119.163882,
              "lat": 44.995887
            },
            {
              "lng": -119.163103,
              "lat": 45.082863
            },
            {
              "lng": -119.146402,
              "lat": 45.082963
            },
            {
              "lng": -119.14537,
              "lat": 45.516055
            },
            {
              "lng": -119.248276,
              "lat": 45.516102
            },
            {
              "lng": -119.248241,
              "lat": 45.601873
            },
            {
              "lng": -119.434639,
              "lat": 45.602771
            },
            {
              "lng": -119.434549,
              "lat": 45.864628
            },
            {
              "lng": -119.43189,
              "lat": 45.918263
            },
            {
              "lng": -119.364396,
              "lat": 45.921605
            },
            {
              "lng": -119.322509,
              "lat": 45.933183
            },
            {
              "lng": -119.25715,
              "lat": 45.939926
            },
            {
              "lng": -119.225745,
              "lat": 45.932725
            },
            {
              "lng": -119.19553,
              "lat": 45.92787
            },
            {
              "lng": -119.169496,
              "lat": 45.927603
            },
            {
              "lng": -119.12612,
              "lat": 45.932859
            },
            {
              "lng": -119.093221,
              "lat": 45.942745
            },
            {
              "lng": -119.061462,
              "lat": 45.958527
            },
            {
              "lng": -119.027056,
              "lat": 45.969134
            },
            {
              "lng": -119.008558,
              "lat": 45.97927
            },
            {
              "lng": -118.987129,
              "lat": 45.999855
            }
          ]
        },
        {
          "name": "Union",
          "boundaries": [
            {
              "lng": -117.972922,
              "lat": 45.860586
            },
            {
              "lng": -117.747313,
              "lat": 45.861012
            },
            {
              "lng": -117.747101,
              "lat": 45.773346
            },
            {
              "lng": -117.788236,
              "lat": 45.773726
            },
            {
              "lng": -117.787637,
              "lat": 45.689597
            },
            {
              "lng": -117.766887,
              "lat": 45.689473
            },
            {
              "lng": -117.767009,
              "lat": 45.66035
            },
            {
              "lng": -117.746435,
              "lat": 45.659925
            },
            {
              "lng": -117.746434,
              "lat": 45.617194
            },
            {
              "lng": -117.727149,
              "lat": 45.617272
            },
            {
              "lng": -117.727271,
              "lat": 45.514705
            },
            {
              "lng": -117.683957,
              "lat": 45.515143
            },
            {
              "lng": -117.683707,
              "lat": 45.428015
            },
            {
              "lng": -117.663844,
              "lat": 45.427892
            },
            {
              "lng": -117.663557,
              "lat": 45.365757
            },
            {
              "lng": -117.643456,
              "lat": 45.365481
            },
            {
              "lng": -117.64375,
              "lat": 45.337193
            },
            {
              "lng": -117.583018,
              "lat": 45.338291
            },
            {
              "lng": -117.582341,
              "lat": 45.310054
            },
            {
              "lng": -117.56235,
              "lat": 45.310168
            },
            {
              "lng": -117.561634,
              "lat": 45.29598
            },
            {
              "lng": -117.542037,
              "lat": 45.295921
            },
            {
              "lng": -117.54179,
              "lat": 45.267424
            },
            {
              "lng": -117.521904,
              "lat": 45.267762
            },
            {
              "lng": -117.520039,
              "lat": 45.209439
            },
            {
              "lng": -117.476621,
              "lat": 45.209421
            },
            {
              "lng": -117.476987,
              "lat": 45.165315
            },
            {
              "lng": -117.267162,
              "lat": 45.165858
            },
            {
              "lng": -117.266572,
              "lat": 45.080805
            },
            {
              "lng": -117.563138,
              "lat": 45.079588
            },
            {
              "lng": -117.563714,
              "lat": 44.992788
            },
            {
              "lng": -117.777504,
              "lat": 44.992161
            },
            {
              "lng": -117.781825,
              "lat": 45.013583
            },
            {
              "lng": -117.805122,
              "lat": 45.032882
            },
            {
              "lng": -117.818062,
              "lat": 45.025909
            },
            {
              "lng": -117.84343,
              "lat": 45.058477
            },
            {
              "lng": -117.862587,
              "lat": 45.054395
            },
            {
              "lng": -117.874244,
              "lat": 45.065608
            },
            {
              "lng": -117.896386,
              "lat": 45.037917
            },
            {
              "lng": -117.921573,
              "lat": 45.019224
            },
            {
              "lng": -117.969185,
              "lat": 44.995803
            },
            {
              "lng": -117.998761,
              "lat": 44.994314
            },
            {
              "lng": -118.06955,
              "lat": 45.016873
            },
            {
              "lng": -118.09213,
              "lat": 45.041238
            },
            {
              "lng": -118.130309,
              "lat": 45.045124
            },
            {
              "lng": -118.161036,
              "lat": 45.015711
            },
            {
              "lng": -118.194901,
              "lat": 45.017329
            },
            {
              "lng": -118.214497,
              "lat": 45.006585
            },
            {
              "lng": -118.213869,
              "lat": 44.989174
            },
            {
              "lng": -118.244751,
              "lat": 44.958256
            },
            {
              "lng": -118.299324,
              "lat": 44.961054
            },
            {
              "lng": -118.359072,
              "lat": 44.99226
            },
            {
              "lng": -118.389904,
              "lat": 44.972142
            },
            {
              "lng": -118.403659,
              "lat": 44.976457
            },
            {
              "lng": -118.434866,
              "lat": 44.962459
            },
            {
              "lng": -118.436164,
              "lat": 44.98466
            },
            {
              "lng": -118.519063,
              "lat": 44.995956
            },
            {
              "lng": -118.518466,
              "lat": 45.080654
            },
            {
              "lng": -118.548568,
              "lat": 45.080756
            },
            {
              "lng": -118.546678,
              "lat": 45.196951
            },
            {
              "lng": -118.655777,
              "lat": 45.196855
            },
            {
              "lng": -118.655779,
              "lat": 45.257753
            },
            {
              "lng": -118.696782,
              "lat": 45.257653
            },
            {
              "lng": -118.697684,
              "lat": 45.345153
            },
            {
              "lng": -118.656181,
              "lat": 45.345252
            },
            {
              "lng": -118.656281,
              "lat": 45.340452
            },
            {
              "lng": -118.613878,
              "lat": 45.339852
            },
            {
              "lng": -118.613379,
              "lat": 45.354952
            },
            {
              "lng": -118.428268,
              "lat": 45.355151
            },
            {
              "lng": -118.428469,
              "lat": 45.428951
            },
            {
              "lng": -118.404868,
              "lat": 45.42905
            },
            {
              "lng": -118.405168,
              "lat": 45.442651
            },
            {
              "lng": -118.384466,
              "lat": 45.442651
            },
            {
              "lng": -118.366566,
              "lat": 45.428951
            },
            {
              "lng": -118.241859,
              "lat": 45.428952
            },
            {
              "lng": -118.197957,
              "lat": 45.427153
            },
            {
              "lng": -118.198158,
              "lat": 45.470453
            },
            {
              "lng": -118.117053,
              "lat": 45.470754
            },
            {
              "lng": -118.117153,
              "lat": 45.688498
            },
            {
              "lng": -118.066823,
              "lat": 45.688365
            },
            {
              "lng": -118.066374,
              "lat": 45.773529
            },
            {
              "lng": -118.045054,
              "lat": 45.773538
            },
            {
              "lng": -118.045003,
              "lat": 45.817098
            },
            {
              "lng": -117.973666,
              "lat": 45.816978
            },
            {
              "lng": -117.972922,
              "lat": 45.860586
            }
          ]
        },
        {
          "name": "Wallowa",
          "boundaries": [
            {
              "lng": -117.603163,
              "lat": 45.998887
            },
            {
              "lng": -117.504833,
              "lat": 45.998317
            },
            {
              "lng": -117.48013,
              "lat": 45.99787
            },
            {
              "lng": -117.480103,
              "lat": 45.99787
            },
            {
              "lng": -117.47536,
              "lat": 45.997855
            },
            {
              "lng": -117.475148,
              "lat": 45.997893
            },
            {
              "lng": -117.439943,
              "lat": 45.998633
            },
            {
              "lng": -117.390738,
              "lat": 45.998598
            },
            {
              "lng": -117.353928,
              "lat": 45.996349
            },
            {
              "lng": -117.337668,
              "lat": 45.998662
            },
            {
              "lng": -117.216731,
              "lat": 45.998356
            },
            {
              "lng": -117.214534,
              "lat": 45.99832
            },
            {
              "lng": -117.212616,
              "lat": 45.998321
            },
            {
              "lng": -117.070047,
              "lat": 45.99751
            },
            {
              "lng": -117.051304,
              "lat": 45.996849
            },
            {
              "lng": -116.985882,
              "lat": 45.996974
            },
            {
              "lng": -116.940681,
              "lat": 45.996274
            },
            {
              "lng": -116.915989,
              "lat": 45.995413
            },
            {
              "lng": -116.911409,
              "lat": 45.988912
            },
            {
              "lng": -116.892935,
              "lat": 45.974396
            },
            {
              "lng": -116.886843,
              "lat": 45.958617
            },
            {
              "lng": -116.875706,
              "lat": 45.945008
            },
            {
              "lng": -116.869655,
              "lat": 45.923799
            },
            {
              "lng": -116.866544,
              "lat": 45.916958
            },
            {
              "lng": -116.859795,
              "lat": 45.907264
            },
            {
              "lng": -116.857254,
              "lat": 45.904159
            },
            {
              "lng": -116.84355,
              "lat": 45.892273
            },
            {
              "lng": -116.830003,
              "lat": 45.886405
            },
            {
              "lng": -116.819182,
              "lat": 45.880938
            },
            {
              "lng": -116.814142,
              "lat": 45.877551
            },
            {
              "lng": -116.796051,
              "lat": 45.858473
            },
            {
              "lng": -116.79437,
              "lat": 45.856017
            },
            {
              "lng": -116.790151,
              "lat": 45.849851
            },
            {
              "lng": -116.787792,
              "lat": 45.844267
            },
            {
              "lng": -116.78752,
              "lat": 45.840204
            },
            {
              "lng": -116.788923,
              "lat": 45.836741
            },
            {
              "lng": -116.789066,
              "lat": 45.833471
            },
            {
              "lng": -116.788329,
              "lat": 45.831928
            },
            {
              "lng": -116.782676,
              "lat": 45.825376
            },
            {
              "lng": -116.7634,
              "lat": 45.81658
            },
            {
              "lng": -116.759787,
              "lat": 45.816167
            },
            {
              "lng": -116.755288,
              "lat": 45.817061
            },
            {
              "lng": -116.750978,
              "lat": 45.818537
            },
            {
              "lng": -116.745219,
              "lat": 45.821394
            },
            {
              "lng": -116.740486,
              "lat": 45.82446
            },
            {
              "lng": -116.736268,
              "lat": 45.826179
            },
            {
              "lng": -116.715527,
              "lat": 45.826773
            },
            {
              "lng": -116.711822,
              "lat": 45.826267
            },
            {
              "lng": -116.70845,
              "lat": 45.825117
            },
            {
              "lng": -116.698079,
              "lat": 45.820852
            },
            {
              "lng": -116.697192,
              "lat": 45.820135
            },
            {
              "lng": -116.687007,
              "lat": 45.806319
            },
            {
              "lng": -116.680139,
              "lat": 45.79359
            },
            {
              "lng": -116.665344,
              "lat": 45.781998
            },
            {
              "lng": -116.659629,
              "lat": 45.780016
            },
            {
              "lng": -116.646342,
              "lat": 45.779815
            },
            {
              "lng": -116.639641,
              "lat": 45.781274
            },
            {
              "lng": -116.635814,
              "lat": 45.783642
            },
            {
              "lng": -116.632032,
              "lat": 45.784979
            },
            {
              "lng": -116.60504,
              "lat": 45.781018
            },
            {
              "lng": -116.593004,
              "lat": 45.778541
            },
            {
              "lng": -116.577422,
              "lat": 45.76753
            },
            {
              "lng": -116.559444,
              "lat": 45.755189
            },
            {
              "lng": -116.553548,
              "lat": 45.753388
            },
            {
              "lng": -116.549085,
              "lat": 45.752735
            },
            {
              "lng": -116.546643,
              "lat": 45.750972
            },
            {
              "lng": -116.537173,
              "lat": 45.737288
            },
            {
              "lng": -116.535698,
              "lat": 45.734231
            },
            {
              "lng": -116.538014,
              "lat": 45.714929
            },
            {
              "lng": -116.536395,
              "lat": 45.69665
            },
            {
              "lng": -116.535396,
              "lat": 45.691734
            },
            {
              "lng": -116.528272,
              "lat": 45.681473
            },
            {
              "lng": -116.523961,
              "lat": 45.677639
            },
            {
              "lng": -116.512326,
              "lat": 45.670224
            },
            {
              "lng": -116.49451,
              "lat": 45.655679
            },
            {
              "lng": -116.487894,
              "lat": 45.649769
            },
            {
              "lng": -116.482495,
              "lat": 45.639916
            },
            {
              "lng": -116.477452,
              "lat": 45.631267
            },
            {
              "lng": -116.472882,
              "lat": 45.624884
            },
            {
              "lng": -116.469813,
              "lat": 45.620604
            },
            {
              "lng": -116.46517,
              "lat": 45.617986
            },
            {
              "lng": -116.463504,
              "lat": 45.615785
            },
            {
              "lng": -116.463635,
              "lat": 45.602785
            },
            {
              "lng": -116.481943,
              "lat": 45.577898
            },
            {
              "lng": -116.48297,
              "lat": 45.577008
            },
            {
              "lng": -116.490279,
              "lat": 45.574499
            },
            {
              "lng": -116.502756,
              "lat": 45.566608
            },
            {
              "lng": -116.523638,
              "lat": 45.54661
            },
            {
              "lng": -116.535482,
              "lat": 45.525079
            },
            {
              "lng": -116.543837,
              "lat": 45.514193
            },
            {
              "lng": -116.548676,
              "lat": 45.510385
            },
            {
              "lng": -116.553473,
              "lat": 45.499107
            },
            {
              "lng": -116.558804,
              "lat": 45.481188
            },
            {
              "lng": -116.558803,
              "lat": 45.480076
            },
            {
              "lng": -116.55498,
              "lat": 45.472801
            },
            {
              "lng": -116.554829,
              "lat": 45.46293
            },
            {
              "lng": -116.561744,
              "lat": 45.461213
            },
            {
              "lng": -116.563985,
              "lat": 45.460169
            },
            {
              "lng": -116.575949,
              "lat": 45.452522
            },
            {
              "lng": -116.581382,
              "lat": 45.448984
            },
            {
              "lng": -116.588195,
              "lat": 45.44292
            },
            {
              "lng": -116.592416,
              "lat": 45.427356
            },
            {
              "lng": -116.597447,
              "lat": 45.41277
            },
            {
              "lng": -116.619057,
              "lat": 45.39821
            },
            {
              "lng": -116.626633,
              "lat": 45.388037
            },
            {
              "lng": -116.653252,
              "lat": 45.351084
            },
            {
              "lng": -116.673793,
              "lat": 45.321511
            },
            {
              "lng": -116.674648,
              "lat": 45.314342
            },
            {
              "lng": -116.672594,
              "lat": 45.298023
            },
            {
              "lng": -116.672163,
              "lat": 45.288938
            },
            {
              "lng": -116.672733,
              "lat": 45.283183
            },
            {
              "lng": -116.674493,
              "lat": 45.276349
            },
            {
              "lng": -116.675587,
              "lat": 45.274867
            },
            {
              "lng": -116.681013,
              "lat": 45.27072
            },
            {
              "lng": -116.687027,
              "lat": 45.267857
            },
            {
              "lng": -116.691388,
              "lat": 45.263739
            },
            {
              "lng": -116.696047,
              "lat": 45.254679
            },
            {
              "lng": -116.703607,
              "lat": 45.239757
            },
            {
              "lng": -116.709373,
              "lat": 45.219463
            },
            {
              "lng": -116.70975,
              "lat": 45.217243
            },
            {
              "lng": -116.708546,
              "lat": 45.207356
            },
            {
              "lng": -116.709536,
              "lat": 45.203015
            },
            {
              "lng": -116.724205,
              "lat": 45.171501
            },
            {
              "lng": -116.724188,
              "lat": 45.162924
            },
            {
              "lng": -116.728757,
              "lat": 45.144381
            },
            {
              "lng": -116.729607,
              "lat": 45.142091
            },
            {
              "lng": -116.731216,
              "lat": 45.139934
            },
            {
              "lng": -116.754643,
              "lat": 45.113972
            },
            {
              "lng": -116.774847,
              "lat": 45.105536
            },
            {
              "lng": -116.782492,
              "lat": 45.09579
            },
            {
              "lng": -116.783537,
              "lat": 45.093605
            },
            {
              "lng": -116.784244,
              "lat": 45.088128
            },
            {
              "lng": -116.783808,
              "lat": 45.079026
            },
            {
              "lng": -117.266572,
              "lat": 45.080805
            },
            {
              "lng": -117.267162,
              "lat": 45.165858
            },
            {
              "lng": -117.476987,
              "lat": 45.165315
            },
            {
              "lng": -117.476621,
              "lat": 45.209421
            },
            {
              "lng": -117.520039,
              "lat": 45.209439
            },
            {
              "lng": -117.521904,
              "lat": 45.267762
            },
            {
              "lng": -117.54179,
              "lat": 45.267424
            },
            {
              "lng": -117.542037,
              "lat": 45.295921
            },
            {
              "lng": -117.561634,
              "lat": 45.29598
            },
            {
              "lng": -117.56235,
              "lat": 45.310168
            },
            {
              "lng": -117.582341,
              "lat": 45.310054
            },
            {
              "lng": -117.583018,
              "lat": 45.338291
            },
            {
              "lng": -117.64375,
              "lat": 45.337193
            },
            {
              "lng": -117.643456,
              "lat": 45.365481
            },
            {
              "lng": -117.663557,
              "lat": 45.365757
            },
            {
              "lng": -117.663844,
              "lat": 45.427892
            },
            {
              "lng": -117.683707,
              "lat": 45.428015
            },
            {
              "lng": -117.683957,
              "lat": 45.515143
            },
            {
              "lng": -117.727271,
              "lat": 45.514705
            },
            {
              "lng": -117.727149,
              "lat": 45.617272
            },
            {
              "lng": -117.746434,
              "lat": 45.617194
            },
            {
              "lng": -117.746435,
              "lat": 45.659925
            },
            {
              "lng": -117.767009,
              "lat": 45.66035
            },
            {
              "lng": -117.766887,
              "lat": 45.689473
            },
            {
              "lng": -117.787637,
              "lat": 45.689597
            },
            {
              "lng": -117.788236,
              "lat": 45.773726
            },
            {
              "lng": -117.747101,
              "lat": 45.773346
            },
            {
              "lng": -117.747313,
              "lat": 45.861012
            },
            {
              "lng": -117.972922,
              "lat": 45.860586
            },
            {
              "lng": -117.977688,
              "lat": 45.860558
            },
            {
              "lng": -117.977767,
              "lat": 46.000724
            },
            {
              "lng": -117.717852,
              "lat": 45.999866
            },
            {
              "lng": -117.603163,
              "lat": 45.998887
            }
          ]
        },
        {
          "name": "Wasco",
          "boundaries": [
            {
              "lng": -121.734167,
              "lat": 44.885782
            },
            {
              "lng": -121.713982,
              "lat": 44.906139
            },
            {
              "lng": -121.746883,
              "lat": 44.91414
            },
            {
              "lng": -121.743683,
              "lat": 44.92084
            },
            {
              "lng": -121.759785,
              "lat": 44.93954
            },
            {
              "lng": -121.798278,
              "lat": 44.938202
            },
            {
              "lng": -121.790215,
              "lat": 44.956502
            },
            {
              "lng": -121.802086,
              "lat": 44.978341
            },
            {
              "lng": -121.805051,
              "lat": 45.01131
            },
            {
              "lng": -121.780878,
              "lat": 45.015206
            },
            {
              "lng": -121.781471,
              "lat": 45.034032
            },
            {
              "lng": -121.769843,
              "lat": 45.039938
            },
            {
              "lng": -121.74758,
              "lat": 45.033365
            },
            {
              "lng": -121.718592,
              "lat": 45.038079
            },
            {
              "lng": -121.718798,
              "lat": 45.050102
            },
            {
              "lng": -121.68431,
              "lat": 45.067782
            },
            {
              "lng": -121.659355,
              "lat": 45.066511
            },
            {
              "lng": -121.652179,
              "lat": 45.086388
            },
            {
              "lng": -121.665417,
              "lat": 45.119274
            },
            {
              "lng": -121.692519,
              "lat": 45.117628
            },
            {
              "lng": -121.706005,
              "lat": 45.131922
            },
            {
              "lng": -121.711058,
              "lat": 45.15111
            },
            {
              "lng": -121.726835,
              "lat": 45.160288
            },
            {
              "lng": -121.745966,
              "lat": 45.186272
            },
            {
              "lng": -121.749311,
              "lat": 45.201737
            },
            {
              "lng": -121.714672,
              "lat": 45.212181
            },
            {
              "lng": -121.701557,
              "lat": 45.230198
            },
            {
              "lng": -121.682607,
              "lat": 45.228988
            },
            {
              "lng": -121.696808,
              "lat": 45.258017
            },
            {
              "lng": -121.481527,
              "lat": 45.258279
            },
            {
              "lng": -121.482525,
              "lat": 45.519619
            },
            {
              "lng": -121.440612,
              "lat": 45.519301
            },
            {
              "lng": -121.441045,
              "lat": 45.69727
            },
            {
              "lng": -121.423592,
              "lat": 45.69399
            },
            {
              "lng": -121.401739,
              "lat": 45.692887
            },
            {
              "lng": -121.372574,
              "lat": 45.703111
            },
            {
              "lng": -121.33777,
              "lat": 45.704949
            },
            {
              "lng": -121.312198,
              "lat": 45.699925
            },
            {
              "lng": -121.287323,
              "lat": 45.687019
            },
            {
              "lng": -121.251183,
              "lat": 45.67839
            },
            {
              "lng": -121.215779,
              "lat": 45.671238
            },
            {
              "lng": -121.200367,
              "lat": 45.649829
            },
            {
              "lng": -121.195233,
              "lat": 45.629513
            },
            {
              "lng": -121.196556,
              "lat": 45.616689
            },
            {
              "lng": -121.183841,
              "lat": 45.606441
            },
            {
              "lng": -121.167852,
              "lat": 45.606098
            },
            {
              "lng": -121.145534,
              "lat": 45.607886
            },
            {
              "lng": -121.139483,
              "lat": 45.611962
            },
            {
              "lng": -121.131953,
              "lat": 45.609762
            },
            {
              "lng": -121.1222,
              "lat": 45.616067
            },
            {
              "lng": -121.117052,
              "lat": 45.618117
            },
            {
              "lng": -121.120064,
              "lat": 45.623134
            },
            {
              "lng": -121.084933,
              "lat": 45.647893
            },
            {
              "lng": -121.06437,
              "lat": 45.652549
            },
            {
              "lng": -121.033582,
              "lat": 45.650998
            },
            {
              "lng": -121.007449,
              "lat": 45.653217
            },
            {
              "lng": -120.983478,
              "lat": 45.648344
            },
            {
              "lng": -120.977978,
              "lat": 45.649345
            },
            {
              "lng": -120.953077,
              "lat": 45.656745
            },
            {
              "lng": -120.943977,
              "lat": 45.656445
            },
            {
              "lng": -120.915876,
              "lat": 45.641345
            },
            {
              "lng": -120.910597,
              "lat": 45.630284
            },
            {
              "lng": -120.902477,
              "lat": 45.599146
            },
            {
              "lng": -120.905712,
              "lat": 45.567689
            },
            {
              "lng": -120.891474,
              "lat": 45.541745
            },
            {
              "lng": -120.853673,
              "lat": 45.522146
            },
            {
              "lng": -120.835784,
              "lat": 45.506942
            },
            {
              "lng": -120.840385,
              "lat": 45.465903
            },
            {
              "lng": -120.85917,
              "lat": 45.428645
            },
            {
              "lng": -120.867569,
              "lat": 45.39649
            },
            {
              "lng": -120.909271,
              "lat": 45.362145
            },
            {
              "lng": -120.946315,
              "lat": 45.330507
            },
            {
              "lng": -120.973097,
              "lat": 45.318149
            },
            {
              "lng": -121.022787,
              "lat": 45.291146
            },
            {
              "lng": -121.023015,
              "lat": 45.255812
            },
            {
              "lng": -121.02196,
              "lat": 45.230293
            },
            {
              "lng": -121.012846,
              "lat": 45.211798
            },
            {
              "lng": -120.987691,
              "lat": 45.200376
            },
            {
              "lng": -120.957863,
              "lat": 45.196687
            },
            {
              "lng": -120.935177,
              "lat": 45.200572
            },
            {
              "lng": -120.912699,
              "lat": 45.199697
            },
            {
              "lng": -120.881701,
              "lat": 45.200305
            },
            {
              "lng": -120.856027,
              "lat": 45.193344
            },
            {
              "lng": -120.836211,
              "lat": 45.180576
            },
            {
              "lng": -120.810058,
              "lat": 45.170205
            },
            {
              "lng": -120.786773,
              "lat": 45.163713
            },
            {
              "lng": -120.766227,
              "lat": 45.153311
            },
            {
              "lng": -120.747478,
              "lat": 45.140243
            },
            {
              "lng": -120.723505,
              "lat": 45.12553
            },
            {
              "lng": -120.718501,
              "lat": 45.109673
            },
            {
              "lng": -120.726111,
              "lat": 45.101624
            },
            {
              "lng": -120.723748,
              "lat": 45.083832
            },
            {
              "lng": -120.654262,
              "lat": 45.083712
            },
            {
              "lng": -120.503549,
              "lat": 45.08295
            },
            {
              "lng": -120.494548,
              "lat": 45.07465
            },
            {
              "lng": -120.495247,
              "lat": 45.068549
            },
            {
              "lng": -120.485547,
              "lat": 45.05745
            },
            {
              "lng": -120.486046,
              "lat": 45.03175
            },
            {
              "lng": -120.481154,
              "lat": 45.009932
            },
            {
              "lng": -120.481857,
              "lat": 44.994744
            },
            {
              "lng": -120.476778,
              "lat": 44.967456
            },
            {
              "lng": -120.481672,
              "lat": 44.945523
            },
            {
              "lng": -120.472776,
              "lat": 44.927367
            },
            {
              "lng": -120.466452,
              "lat": 44.907253
            },
            {
              "lng": -120.446918,
              "lat": 44.884591
            },
            {
              "lng": -120.454324,
              "lat": 44.871449
            },
            {
              "lng": -120.433469,
              "lat": 44.85675
            },
            {
              "lng": -120.410794,
              "lat": 44.845693
            },
            {
              "lng": -120.376136,
              "lat": 44.824805
            },
            {
              "lng": -120.371422,
              "lat": 44.821568
            },
            {
              "lng": -121.089659,
              "lat": 44.823343
            },
            {
              "lng": -121.091659,
              "lat": 44.825143
            },
            {
              "lng": -121.75948,
              "lat": 44.82564
            },
            {
              "lng": -121.742081,
              "lat": 44.84534
            },
            {
              "lng": -121.753182,
              "lat": 44.86124
            },
            {
              "lng": -121.734167,
              "lat": 44.885782
            }
          ]
        }
      ]
    },
    {
      "name": "Area 7",
      "color": "#e0d91f",
      "counties": [
        {
          "name": "Crook",
          "boundaries": [
            {
              "lng": -121.107344,
              "lat": 44.390542
            },
            {
              "lng": -120.98854,
              "lat": 44.390045
            },
            {
              "lng": -120.988721,
              "lat": 44.476444
            },
            {
              "lng": -120.827177,
              "lat": 44.476633
            },
            {
              "lng": -120.827342,
              "lat": 44.562849
            },
            {
              "lng": -120.808441,
              "lat": 44.562248
            },
            {
              "lng": -120.385526,
              "lat": 44.563954
            },
            {
              "lng": -120.385823,
              "lat": 44.437556
            },
            {
              "lng": -120.021841,
              "lat": 44.438558
            },
            {
              "lng": -120.020663,
              "lat": 44.389651
            },
            {
              "lng": -119.89901,
              "lat": 44.389537
            },
            {
              "lng": -119.898796,
              "lat": 44.306662
            },
            {
              "lng": -119.655586,
              "lat": 44.306964
            },
            {
              "lng": -119.654887,
              "lat": 44.22032
            },
            {
              "lng": -119.656934,
              "lat": 44.215605
            },
            {
              "lng": -119.657577,
              "lat": 43.959051
            },
            {
              "lng": -119.775653,
              "lat": 43.959068
            },
            {
              "lng": -119.777526,
              "lat": 43.698081
            },
            {
              "lng": -119.898172,
              "lat": 43.698323
            },
            {
              "lng": -120.236199,
              "lat": 43.697484
            },
            {
              "lng": -120.258018,
              "lat": 43.698762
            },
            {
              "lng": -120.257893,
              "lat": 43.785259
            },
            {
              "lng": -120.378508,
              "lat": 43.785033
            },
            {
              "lng": -120.3789,
              "lat": 43.871955
            },
            {
              "lng": -120.747946,
              "lat": 43.871266
            },
            {
              "lng": -120.748298,
              "lat": 43.957522
            },
            {
              "lng": -120.829021,
              "lat": 43.957447
            },
            {
              "lng": -120.986527,
              "lat": 43.960943
            },
            {
              "lng": -120.987333,
              "lat": 44.133843
            },
            {
              "lng": -121.102637,
              "lat": 44.138042
            },
            {
              "lng": -121.102938,
              "lat": 44.218442
            },
            {
              "lng": -121.108639,
              "lat": 44.218543
            },
            {
              "lng": -121.107344,
              "lat": 44.390542
            }
          ]
        },
        {
          "name": "Deschutes",
          "boundaries": [
            {
              "lng": -119.898172,
              "lat": 43.698323
            },
            {
              "lng": -119.896365,
              "lat": 43.610259
            },
            {
              "lng": -120.251631,
              "lat": 43.610875
            },
            {
              "lng": -120.279963,
              "lat": 43.612107
            },
            {
              "lng": -120.378194,
              "lat": 43.611059
            },
            {
              "lng": -120.378194,
              "lat": 43.615452
            },
            {
              "lng": -120.959969,
              "lat": 43.615724
            },
            {
              "lng": -120.989811,
              "lat": 43.617577
            },
            {
              "lng": -121.332982,
              "lat": 43.616629
            },
            {
              "lng": -122.002675,
              "lat": 43.615228
            },
            {
              "lng": -122.000154,
              "lat": 43.626287
            },
            {
              "lng": -121.964854,
              "lat": 43.626826
            },
            {
              "lng": -121.980666,
              "lat": 43.63989
            },
            {
              "lng": -121.986187,
              "lat": 43.661633
            },
            {
              "lng": -121.978047,
              "lat": 43.688289
            },
            {
              "lng": -121.967088,
              "lat": 43.702528
            },
            {
              "lng": -121.974538,
              "lat": 43.708581
            },
            {
              "lng": -121.973567,
              "lat": 43.73099
            },
            {
              "lng": -121.980693,
              "lat": 43.743586
            },
            {
              "lng": -121.960872,
              "lat": 43.763805
            },
            {
              "lng": -121.960831,
              "lat": 43.78156
            },
            {
              "lng": -121.975447,
              "lat": 43.811479
            },
            {
              "lng": -121.975479,
              "lat": 43.856875
            },
            {
              "lng": -121.917767,
              "lat": 43.91485
            },
            {
              "lng": -121.891351,
              "lat": 43.908482
            },
            {
              "lng": -121.86897,
              "lat": 43.912256
            },
            {
              "lng": -121.853925,
              "lat": 43.966813
            },
            {
              "lng": -121.827099,
              "lat": 43.997625
            },
            {
              "lng": -121.821645,
              "lat": 44.011538
            },
            {
              "lng": -121.833947,
              "lat": 44.039638
            },
            {
              "lng": -121.818348,
              "lat": 44.051738
            },
            {
              "lng": -121.801847,
              "lat": 44.052338
            },
            {
              "lng": -121.779249,
              "lat": 44.079937
            },
            {
              "lng": -121.76855,
              "lat": 44.101437
            },
            {
              "lng": -121.771852,
              "lat": 44.139338
            },
            {
              "lng": -121.783753,
              "lat": 44.147938
            },
            {
              "lng": -121.770854,
              "lat": 44.167138
            },
            {
              "lng": -121.781756,
              "lat": 44.197938
            },
            {
              "lng": -121.788859,
              "lat": 44.247839
            },
            {
              "lng": -121.799359,
              "lat": 44.258138
            },
            {
              "lng": -121.840263,
              "lat": 44.28554
            },
            {
              "lng": -121.837265,
              "lat": 44.33494
            },
            {
              "lng": -121.842667,
              "lat": 44.39244
            },
            {
              "lng": -121.229063,
              "lat": 44.393032
            },
            {
              "lng": -121.229072,
              "lat": 44.390988
            },
            {
              "lng": -121.107344,
              "lat": 44.390542
            },
            {
              "lng": -121.108639,
              "lat": 44.218543
            },
            {
              "lng": -121.102938,
              "lat": 44.218442
            },
            {
              "lng": -121.102637,
              "lat": 44.138042
            },
            {
              "lng": -120.987333,
              "lat": 44.133843
            },
            {
              "lng": -120.986527,
              "lat": 43.960943
            },
            {
              "lng": -120.829021,
              "lat": 43.957447
            },
            {
              "lng": -120.748298,
              "lat": 43.957522
            },
            {
              "lng": -120.747946,
              "lat": 43.871266
            },
            {
              "lng": -120.3789,
              "lat": 43.871955
            },
            {
              "lng": -120.378508,
              "lat": 43.785033
            },
            {
              "lng": -120.257893,
              "lat": 43.785259
            },
            {
              "lng": -120.258018,
              "lat": 43.698762
            },
            {
              "lng": -120.236199,
              "lat": 43.697484
            },
            {
              "lng": -119.898172,
              "lat": 43.698323
            }
          ]
        },
        {
          "name": "Grant",
          "boundaries": [
            {
              "lng": -119.655586,
              "lat": 44.306964
            },
            {
              "lng": -119.652128,
              "lat": 44.823171
            },
            {
              "lng": -119.671767,
              "lat": 44.8236
            },
            {
              "lng": -119.671987,
              "lat": 44.994424
            },
            {
              "lng": -119.408168,
              "lat": 44.994759
            },
            {
              "lng": -119.163882,
              "lat": 44.995887
            },
            {
              "lng": -119.005034,
              "lat": 44.996468
            },
            {
              "lng": -119.001088,
              "lat": 44.996778
            },
            {
              "lng": -118.519063,
              "lat": 44.995956
            },
            {
              "lng": -118.436164,
              "lat": 44.98466
            },
            {
              "lng": -118.434866,
              "lat": 44.962459
            },
            {
              "lng": -118.403659,
              "lat": 44.976457
            },
            {
              "lng": -118.389904,
              "lat": 44.972142
            },
            {
              "lng": -118.359072,
              "lat": 44.99226
            },
            {
              "lng": -118.299324,
              "lat": 44.961054
            },
            {
              "lng": -118.244751,
              "lat": 44.958256
            },
            {
              "lng": -118.244952,
              "lat": 44.945358
            },
            {
              "lng": -118.223652,
              "lat": 44.936959
            },
            {
              "lng": -118.237352,
              "lat": 44.908161
            },
            {
              "lng": -118.228052,
              "lat": 44.865364
            },
            {
              "lng": -118.267452,
              "lat": 44.869364
            },
            {
              "lng": -118.296153,
              "lat": 44.862664
            },
            {
              "lng": -118.293753,
              "lat": 44.852965
            },
            {
              "lng": -118.318954,
              "lat": 44.836266
            },
            {
              "lng": -118.296353,
              "lat": 44.816168
            },
            {
              "lng": -118.299453,
              "lat": 44.796369
            },
            {
              "lng": -118.282853,
              "lat": 44.771871
            },
            {
              "lng": -118.285153,
              "lat": 44.751172
            },
            {
              "lng": -118.321253,
              "lat": 44.741473
            },
            {
              "lng": -118.367655,
              "lat": 44.747273
            },
            {
              "lng": -118.393555,
              "lat": 44.727873
            },
            {
              "lng": -118.419156,
              "lat": 44.718674
            },
            {
              "lng": -118.443056,
              "lat": 44.724273
            },
            {
              "lng": -118.461656,
              "lat": 44.707374
            },
            {
              "lng": -118.494457,
              "lat": 44.713574
            },
            {
              "lng": -118.519257,
              "lat": 44.706374
            },
            {
              "lng": -118.504957,
              "lat": 44.666275
            },
            {
              "lng": -118.455955,
              "lat": 44.655476
            },
            {
              "lng": -118.424554,
              "lat": 44.654876
            },
            {
              "lng": -118.409754,
              "lat": 44.642676
            },
            {
              "lng": -118.372953,
              "lat": 44.645376
            },
            {
              "lng": -118.355052,
              "lat": 44.639177
            },
            {
              "lng": -118.338951,
              "lat": 44.611378
            },
            {
              "lng": -118.316651,
              "lat": 44.603878
            },
            {
              "lng": -118.30615,
              "lat": 44.588979
            },
            {
              "lng": -118.32585,
              "lat": 44.56088
            },
            {
              "lng": -118.33765,
              "lat": 44.56718
            },
            {
              "lng": -118.34735,
              "lat": 44.55018
            },
            {
              "lng": -118.37235,
              "lat": 44.528581
            },
            {
              "lng": -118.37485,
              "lat": 44.507882
            },
            {
              "lng": -118.357849,
              "lat": 44.484582
            },
            {
              "lng": -118.360949,
              "lat": 44.471282
            },
            {
              "lng": -118.40845,
              "lat": 44.452782
            },
            {
              "lng": -118.41915,
              "lat": 44.456682
            },
            {
              "lng": -118.41815,
              "lat": 44.432282
            },
            {
              "lng": -118.43485,
              "lat": 44.397583
            },
            {
              "lng": -118.409749,
              "lat": 44.378683
            },
            {
              "lng": -118.434049,
              "lat": 44.367983
            },
            {
              "lng": -118.439549,
              "lat": 44.351183
            },
            {
              "lng": -118.46905,
              "lat": 44.334583
            },
            {
              "lng": -118.49025,
              "lat": 44.289284
            },
            {
              "lng": -118.497249,
              "lat": 44.255084
            },
            {
              "lng": -118.23214,
              "lat": 44.256083
            },
            {
              "lng": -118.22834,
              "lat": 44.212483
            },
            {
              "lng": -118.227435,
              "lat": 44.039981
            },
            {
              "lng": -118.586746,
              "lat": 44.040078
            },
            {
              "lng": -118.625816,
              "lat": 44.047243
            },
            {
              "lng": -118.81625,
              "lat": 44.047678
            },
            {
              "lng": -118.816649,
              "lat": 43.959975
            },
            {
              "lng": -119.497704,
              "lat": 43.957418
            },
            {
              "lng": -119.657577,
              "lat": 43.959051
            },
            {
              "lng": -119.656934,
              "lat": 44.215605
            },
            {
              "lng": -119.654887,
              "lat": 44.22032
            },
            {
              "lng": -119.655586,
              "lat": 44.306964
            }
          ]
        },
        {
          "name": "Harney",
          "boundaries": [
            {
              "lng": -119.898172,
              "lat": 43.698323
            },
            {
              "lng": -119.777526,
              "lat": 43.698081
            },
            {
              "lng": -119.775653,
              "lat": 43.959068
            },
            {
              "lng": -119.657577,
              "lat": 43.959051
            },
            {
              "lng": -119.497704,
              "lat": 43.957418
            },
            {
              "lng": -118.816649,
              "lat": 43.959975
            },
            {
              "lng": -118.81625,
              "lat": 44.047678
            },
            {
              "lng": -118.625816,
              "lat": 44.047243
            },
            {
              "lng": -118.586746,
              "lat": 44.040078
            },
            {
              "lng": -118.227435,
              "lat": 44.039981
            },
            {
              "lng": -118.227599,
              "lat": 43.817869
            },
            {
              "lng": -118.231926,
              "lat": 43.77898
            },
            {
              "lng": -118.232129,
              "lat": 43.374881
            },
            {
              "lng": -118.228048,
              "lat": 43.349147
            },
            {
              "lng": -118.229049,
              "lat": 42.914581
            },
            {
              "lng": -118.216688,
              "lat": 42.914547
            },
            {
              "lng": -118.214725,
              "lat": 42.276029
            },
            {
              "lng": -118.195361,
              "lat": 42.275869
            },
            {
              "lng": -118.197189,
              "lat": 41.996995
            },
            {
              "lng": -118.501002,
              "lat": 41.995446
            },
            {
              "lng": -118.601806,
              "lat": 41.993895
            },
            {
              "lng": -118.696409,
              "lat": 41.991794
            },
            {
              "lng": -118.775869,
              "lat": 41.992692
            },
            {
              "lng": -118.777228,
              "lat": 41.992671
            },
            {
              "lng": -118.795612,
              "lat": 41.992394
            },
            {
              "lng": -119.001022,
              "lat": 41.993793
            },
            {
              "lng": -119.20828,
              "lat": 41.993177
            },
            {
              "lng": -119.231876,
              "lat": 41.994212
            },
            {
              "lng": -119.251033,
              "lat": 41.993843
            },
            {
              "lng": -119.324181,
              "lat": 41.994206
            },
            {
              "lng": -119.360177,
              "lat": 41.994384
            },
            {
              "lng": -119.359403,
              "lat": 42.113829
            },
            {
              "lng": -119.363515,
              "lat": 42.136945
            },
            {
              "lng": -119.365284,
              "lat": 42.749038
            },
            {
              "lng": -119.706041,
              "lat": 42.748696
            },
            {
              "lng": -119.734201,
              "lat": 42.746636
            },
            {
              "lng": -119.943888,
              "lat": 42.74632
            },
            {
              "lng": -119.943427,
              "lat": 42.917107
            },
            {
              "lng": -119.931554,
              "lat": 42.917044
            },
            {
              "lng": -119.932439,
              "lat": 43.178982
            },
            {
              "lng": -119.896776,
              "lat": 43.179006
            },
            {
              "lng": -119.894694,
              "lat": 43.584464
            },
            {
              "lng": -119.896365,
              "lat": 43.610259
            },
            {
              "lng": -119.898172,
              "lat": 43.698323
            }
          ]
        },
        {
          "name": "Jefferson",
          "boundaries": [
            {
              "lng": -120.385526,
              "lat": 44.563954
            },
            {
              "lng": -120.808441,
              "lat": 44.562248
            },
            {
              "lng": -120.827342,
              "lat": 44.562849
            },
            {
              "lng": -120.827177,
              "lat": 44.476633
            },
            {
              "lng": -120.988721,
              "lat": 44.476444
            },
            {
              "lng": -120.98854,
              "lat": 44.390045
            },
            {
              "lng": -121.107344,
              "lat": 44.390542
            },
            {
              "lng": -121.229072,
              "lat": 44.390988
            },
            {
              "lng": -121.229063,
              "lat": 44.393032
            },
            {
              "lng": -121.842667,
              "lat": 44.39244
            },
            {
              "lng": -121.848772,
              "lat": 44.485341
            },
            {
              "lng": -121.822373,
              "lat": 44.51074
            },
            {
              "lng": -121.808172,
              "lat": 44.51494
            },
            {
              "lng": -121.815873,
              "lat": 44.53584
            },
            {
              "lng": -121.805873,
              "lat": 44.54824
            },
            {
              "lng": -121.795774,
              "lat": 44.58984
            },
            {
              "lng": -121.810876,
              "lat": 44.61674
            },
            {
              "lng": -121.797376,
              "lat": 44.63954
            },
            {
              "lng": -121.798028,
              "lat": 44.681767
            },
            {
              "lng": -121.794077,
              "lat": 44.68394
            },
            {
              "lng": -121.803679,
              "lat": 44.729441
            },
            {
              "lng": -121.790679,
              "lat": 44.74674
            },
            {
              "lng": -121.759079,
              "lat": 44.76354
            },
            {
              "lng": -121.77228,
              "lat": 44.77614
            },
            {
              "lng": -121.804381,
              "lat": 44.777641
            },
            {
              "lng": -121.818982,
              "lat": 44.800841
            },
            {
              "lng": -121.75948,
              "lat": 44.82564
            },
            {
              "lng": -121.091659,
              "lat": 44.825143
            },
            {
              "lng": -121.089659,
              "lat": 44.823343
            },
            {
              "lng": -120.371422,
              "lat": 44.821568
            },
            {
              "lng": -120.386035,
              "lat": 44.810985
            },
            {
              "lng": -120.385062,
              "lat": 44.796406
            },
            {
              "lng": -120.395872,
              "lat": 44.803969
            },
            {
              "lng": -120.404676,
              "lat": 44.794719
            },
            {
              "lng": -120.387782,
              "lat": 44.769866
            },
            {
              "lng": -120.385684,
              "lat": 44.749853
            },
            {
              "lng": -120.385526,
              "lat": 44.563954
            }
          ]
        },
        {
          "name": "Wheeler",
          "boundaries": [
            {
              "lng": -119.671987,
              "lat": 44.994424
            },
            {
              "lng": -119.671767,
              "lat": 44.8236
            },
            {
              "lng": -119.652128,
              "lat": 44.823171
            },
            {
              "lng": -119.655586,
              "lat": 44.306964
            },
            {
              "lng": -119.898796,
              "lat": 44.306662
            },
            {
              "lng": -119.89901,
              "lat": 44.389537
            },
            {
              "lng": -120.020663,
              "lat": 44.389651
            },
            {
              "lng": -120.021841,
              "lat": 44.438558
            },
            {
              "lng": -120.385823,
              "lat": 44.437556
            },
            {
              "lng": -120.385526,
              "lat": 44.563954
            },
            {
              "lng": -120.385684,
              "lat": 44.749853
            },
            {
              "lng": -120.387782,
              "lat": 44.769866
            },
            {
              "lng": -120.404676,
              "lat": 44.794719
            },
            {
              "lng": -120.395872,
              "lat": 44.803969
            },
            {
              "lng": -120.385062,
              "lat": 44.796406
            },
            {
              "lng": -120.386035,
              "lat": 44.810985
            },
            {
              "lng": -120.371422,
              "lat": 44.821568
            },
            {
              "lng": -120.376136,
              "lat": 44.824805
            },
            {
              "lng": -120.410794,
              "lat": 44.845693
            },
            {
              "lng": -120.433469,
              "lat": 44.85675
            },
            {
              "lng": -120.454324,
              "lat": 44.871449
            },
            {
              "lng": -120.446918,
              "lat": 44.884591
            },
            {
              "lng": -120.466452,
              "lat": 44.907253
            },
            {
              "lng": -120.472776,
              "lat": 44.927367
            },
            {
              "lng": -120.481672,
              "lat": 44.945523
            },
            {
              "lng": -120.476778,
              "lat": 44.967456
            },
            {
              "lng": -120.481857,
              "lat": 44.994744
            },
            {
              "lng": -120.481154,
              "lat": 45.009932
            },
            {
              "lng": -120.486046,
              "lat": 45.03175
            },
            {
              "lng": -120.485547,
              "lat": 45.05745
            },
            {
              "lng": -120.495247,
              "lat": 45.068549
            },
            {
              "lng": -120.402245,
              "lat": 45.066751
            },
            {
              "lng": -119.91023,
              "lat": 45.065658
            },
            {
              "lng": -119.91023,
              "lat": 45.066558
            },
            {
              "lng": -119.890329,
              "lat": 45.068158
            },
            {
              "lng": -119.790426,
              "lat": 45.067761
            },
            {
              "lng": -119.791055,
              "lat": 44.994636
            },
            {
              "lng": -119.671987,
              "lat": 44.994424
            }
          ]
        }
      ]
    }
  ]
}
    


    // var image = "/wp-content/uploads/2018/09/Fill-1-Copy.png";


    function closeAllInfoWindows() {
        infoWindows.forEach(element => element.close());
        /* no clue why forEach works but for doesn't. - BW */
        /*for (var i = 0; i <= infoWindows.length - 1; i++ ) {
            infoWindows[i].close();
            
            // map.setZoom(9);
            // map.setCenter({ centerMark });
        }*/
    };
    function bindInfoWindow(marker, map, infowindow, html) {
	    marker.addListener("click", function() {
            // closeAllInfoWindows();
            console.log(marker);
            //console.log(infoWindows);
            closeAllInfoWindows();
            infowindow.open(map, this);
        });
	  }

    google.maps.event.addListener(map, "click", function() {
      closeAllInfoWindows();
    });

    for( var key in heccData['committees']){
    	if(undefined !== heccData['committees'][key]['coords']){

    	    	var content = createInfobox(heccData['committees'][key]);
    	    	var setlat = heccData['committees'][key]['coords'][0];
    			var setlng = heccData['committees'][key]['coords'][1];

    			if(heccData['committees'][key]['hasOpenStandards'] > 0){
    				var markerIcon = '/wp-content/plugins/hecc_standards_plugin/imgs/marker_active.png';
    			} else{
    				var markerIcon = '/wp-content/plugins/hecc_standards_plugin/imgs/marker_inactive.png';
    			}
    	
    	    	var infowindow = new google.maps.InfoWindow({
    	            content: content
    	        });
    	        infoWindows[heccData['committees'][key]['ma']] = infowindow;
    		
    	        var marker = new google.maps.Marker({
    	        	position: { lat: parseFloat(setlat), lng: parseFloat(setlng) },
    	        	// map: map,
    	        	icon: markerIcon 
    	        });
    	        bindInfoWindow(marker, map, infowindow);
    	        marker.ma = heccData['committees'][key]['ma'];
    	        gmarkers[heccData['committees'][key]['ma']] = marker;
    	    }
        

    }
    index = 0;
    for (var i = boundaries['areas'].length - 1; i >= 0; i--) {
    	for (var j = boundaries['areas'][i]['counties'].length - 1; j >= 0; j--) {	

    		var CountyPolygon = new google.maps.Polygon({
		    	paths: boundaries['areas'][i]['counties'][j]['boundaries'],
		    	strokeColor: boundaries['areas'][i]['color'],
		    	strokeOpacity: 0.8,
		    	strokeWeight: 3,
		    	fillColor: boundaries['areas'][i]['color'],
		    	fillOpacity: 0.35,
		    	// map: map
		    });
		    if(undefined !== CountyPolygon){
		    	// CountyPolygon.latLngs = boundaries['areas'][i]['counties'][j]['boundaries'];
    		    // CountyPolygon.setMap(map);
        		polygons[index] = CountyPolygon;
        		polygons[index].setMap(map);
        	}
        	index++;
    	}
    }

    mapdata = {
	    	'map' : map,
        	'markers' : gmarkers,
        	'infowindows' : infoWindows,
        	'polygons' : polygons
        }




    return mapdata;
}










function clearMapMarkers(){
	for(key in mapdata.markers){
		if(typeof(mapdata.markers[key].setMap) == 'function'){
			mapdata.markers[key].setMap();
		}
	}
}

function showMapMarkers(ma_array){
	for (var i = ma_array.length - 1; i >= 0; i--) {
		if(undefined !== mapdata.markers[ma_array[i]] && typeof(mapdata.markers[ma_array[i]].setMap) == 'function'){
			mapdata.markers[ma_array[i]].setMap(mapdata.map);
		}
	}
}

function getMarkerMAsToShow(){
	var ma_array = [];
	var table = document.getElementById('standards-table');
	for (var i = 0, row; row = table.rows[i]; i++) {
		if( row.getAttribute('validrow') == 'true' && undefined !== row.getAttribute('data-ma')){
		   ma_array.push( row.getAttribute('data-ma') );
		}
	}
	return ma_array;
}


function setMapMarkers(){
	ma_array = getMarkerMAsToShow();
	clearMapMarkers();
	showMapMarkers(ma_array);
}


























// google.maps.event.addDomListener(window, 'load', initialize);

$(document).on('ready', function() {
	console.log('ready');
	if($('#hecc_standards_module').length){
		theMap = initMap();
		createHeccStandardsTable(heccData);
		setMapMarkers();
	}
});







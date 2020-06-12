<?php

/*
Plugin Name: HECC Standards and Counties
Description: Import data to feed the 'Openings' page. Pull in standards and counties, and format for use.
Version: 0.0.1
Author: Alex Tryon @ Watson Creative
Author URI: https://www.watsoncreative.com/
License: Commercial
*/
require_once 'lib/configuration.class.php';
require_once 'lib/county.class.php';
require_once 'lib/standard.class.php';
require_once 'lib/committee.class.php';
require_once 'lib/geocode.class.php';
require_once 'lib/importer.class.php';
require_once 'lib/fetch.class.php';
require_once 'lib/ajax.inc.php';


function hecc_standards_enqueue_scripts() {
	
	wp_enqueue_script('googleMaps', 'https://maps.google.com/maps/api/js?key=AIzaSyBu4aIg_cR0nkItQy1xAhngjCvfl3g2Gh0', array('jquery'), null, true);
	wp_enqueue_script('gmaps', 'https://rawgit.com/HPNeo/gmaps/master/gmaps.js', array('jquery'), null, true);
    wp_enqueue_script( 'tablefilter', '/wp-content/plugins/hecc_standards_plugin/inc/tablefilter/tablefilter.js', array(), '' , true );
    wp_enqueue_script( 'standardsScript', '/wp-content/plugins/hecc_standards_plugin/js/standardsScript.js', array('tablefilter','jquery', 'googleMaps', 'gmaps'), '' , true );
    wp_enqueue_style('hecc-style', '/wp-content/plugins/hecc_standards_plugin/css/heccStyles.css', array());
}
add_action( 'wp_enqueue_scripts', 'hecc_standards_enqueue_scripts' );



/*
 * Administrative Page
 */

function hecc_admin_page_menu_item() {
    add_menu_page('Openings Import Settings', 'Openings Import', 'manage_options', 'hecc-import', 'hecc_admin_page_init');
}
add_action('admin_menu', 'hecc_admin_page_menu_item');

function hecc_admin_page_init() {
    $cfg = new HECC_Configuration();
    $updated = $cfg->save_values();
    require 'inc/admin-page.inc.php';
}


function hecc_standards_do_import() {
    /*
     * Run perodically to fetch the XML data.
     */
    $cfg = new HECC_Configuration();
    $fs = new FileFetcher($cfg->get_url(), $cfg->get_user(), $cfg->get_password());
    // if ($fs->is_new_data()) {
        $d = $fs->get_data();
        // echo '<pre>';
        // var_dump($d['committees']);
        // echo '</pre>';

        $imp = new XMLdataImporter($d['standards'], $d['counties'], $d['committees']);
        $imp->run();
        return TRUE;
    // }
    return FALSE;
}
/*
 * Daily CRON task
 */
function hecc_standards_setup_cron() {
    if (!wp_next_scheduled("hecc_standards_do_import")) {
        wp_schedule_event( time(), 'daily', 'hecc_standards_do_import');
    }
}
add_action( 'init', 'hecc_standards_setup_cron');

register_activation_hook(__FILE__, 'hecc_standards_setup_cron');









function read_standards_file($standards = null){
	if($standards){
		$fh = fopen($standards, "r");
		if ( $fh ) {
		  while ( !feof($fh) ) {
		    $standard = new Standard(explode('~',fgets($fh) ));
		    $standards_listings[$standard->identifier] = $standard;
		  }
		  fclose($fh);
		}
	return $standards_listings;
	}
}

function read_counties_file($counties = null, $standards_listing = null){
	if($counties){
		$fh = fopen($counties, "r");
		if ( $fh ) {
		  while ( !feof($fh) ) {

		    $county = new County(explode('~',fgets($fh) ));
		    $county_listings[] = $county;

		    // if the standards file has been processed, add counties to matched standard listings
		    if($standards_listing){
		    	$standards_listing[$county->identifier]->set_county($county);
		    }
		  }
		  fclose($fh);
		}
		return $county_listings;
	}
}

function get_standards_data(){
	$counties = get_option('hecc_counties_data');
	$standards = get_option('hecc_standards_data');

	$committees = get_option('hecc_committees_data');
	return array( 'standards' => $standards, 'counties' => $counties, 'committees' => $committees);
}


function test_hecc_openings(){
	$data = get_standards_data();

	foreach($data['standards'] as $identifier => $standard){
		return $standard->print_readable() . '<br/>';
	}
}

add_shortcode('test_hecc_openings', 'test_hecc_openings');

function get_hecc_standards_json(){
	$data = get_standards_data();
	$json = array();
	// print_r($data['standards']);
	if($data['standards']){
		foreach($data['standards'] as $identifier => $standard){
			if(null !== $standard){
				$json['standards'][] = $standard;
			}
		}
	}
	if($data['counties']){
		foreach($data['counties'] as $identifier => $county){
			if(null !== $county){
				$json['counties'][] = $county;
			}
		}
	}
	if($data['committees']){
		foreach($data['committees'] as $identifier => $committee){
			if(null !== $committee){
				$json['committees'][] = $committee;
			}
		}
	}

	return '<script>var heccData = ' . json_encode($json) . ';</script>';
}

function print_hecc_standards_table(){
	ob_start();
	echo get_hecc_standards_json();

	echo '<div id="hecc_standards_module">
		<div id="standards-map"></div>
		<table id="standards-table">
			<thead>
				<th>ma</th>
				<th>Occupation</th>
				<th>committee</th>
				<th>Area</th>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>';
	

	$output = ob_get_contents();
	ob_end_clean();
	return $output;
}
add_shortcode('print_hecc_standards_table', 'print_hecc_standards_table');


function test_print_hecc_standards_table(){
	// echo 'printing hecc standards table';

	$data = get_standards_data();

	$table = '<table id="standards-table"><thead>'.
			'<th>ma</th>'.
			// '<th>symbol</th>'.
			// '<th>suffix</th>'.
			// '<th>state_title</th>'.
			// '<th>seq</th>'.
			'<th>committee</th>'.
			'<th>trade_name</th>'.
			// '<th>job_title</th>'.
			// '<th>opening_date</th>'.
			// '<th>closing_date</th>'.
			'<th>Areas</th>'.
			'</thead>'.
			'<tbody>';
	foreach($data['standards'] as $identifier => $standard){
		$table .= $standard->print_as_table_row() . '<br/>';
	}
	$table .= '</tbody>';

	return $table;
}



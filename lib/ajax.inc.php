<?php
/*
 * Set up an AJAX callable end-point to run the import for testing.
 */
/*
function kpdata_endpoints() {
    add_rewrite_tag( '%kp_data_import%', '([^&]+)' );
    add_rewrite_rule( 'kp_data_import/([^&]+)/?', 'index.php?kp_data_import', 'top' );
}
add_action( 'init', 'kpdata_endpoints');
*/
function heccdata_run_import() {
    global $wp_query;
    if (hecc_standards_do_import()) {
        $message = "Data Imported";
    }
    else {
        $message = "No new data to import";
    }
    status_header(200);
    wp_send_json(['message' => $message]);
}
//add_action( 'template_redirect', 'kpdata_run_import');
add_action('wp_ajax_hecc_do_import', 'heccdata_run_import');
add_action('wp_ajax_nopriv_hecc_do_import', 'heccdata_run_import');
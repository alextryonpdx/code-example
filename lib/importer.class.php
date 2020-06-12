<?php
class XMLdataImporter {
    // const STANDARD_CONTENT_TYPE = 'standard';
    // const COUNTY_CONTENT_TYPE = 'county';
    
    private $updated = []; // Record the dentist records updated
            
    function __construct($data_standards, $data_counties, $data_committees) {
        $this->standards = $data_standards;
        $this->counties = $data_counties;
        $this->committees = $data_committees;
    }

    public function run() {
        update_option('hecc_standards_data', $this->standards);
        update_option('hecc_counties_data', $this->counties);
        update_option('hecc_committees_data', $this->committees);
    }
    
    private function print_data(){
        foreach($this->standards as $standard){
            echo $standard->print_data();
        }
        foreach($this->counties as $county){
            echo $county->print_data();
        }
        // foreach($this->committees as $committee){
        //     echo $committee->print_data();
        // }
    }


    // private function update_locations() {
    //     /*
    //      * Create any new locations.
    //      */
        
    //     // For each Location data:
    //     //      Look up by database ID
    //     //      If record does not exist: Create new Location content.
    //     foreach ($this->locations['row'] as $location) {
    //         $posts = get_posts([
    //             'numberposts' => -1,
    //             'post_type' => XMLdataImporter::COUNTY_CONTENT_TYPE,
    //             'meta_key' => 'database_id',
    //             'meta_value' => (string)$location['Location_ID']
    //         ]);
    //         if (!$posts) {
    //             $post = wp_insert_post([
    //                 'post_type' => XMLdataImporter::COUNTY_CONTENT_TYPE,
    //                 'post_status' => 'publish',
    //                 'post_author' => 1,
    //                 'post_title' => $location['Location_Description'],
    //                 'post_content' => ' ',
    //                 'comment_status' => 'closed',
    //                 'ping_status' => 'closed',
    //                 'post_name' => 'location/' . $location['Location_ID']
    //             ], TRUE);
    //             if (array_key_exists('Address2', $location)) {
    //                 // Address 2 present
    //                 $address = $location['Address1'] . "<br/>" . $location['Address2'] . "<br/>" . $location['City'] . ", " . $location['State'] . ' ' .$location['Zip'];
    //             }
    //             else {
    //                 // No address 2 field
    //                 $address = $location['Address1'] . "<br/>" . $location['City'] . ", " . $location['State'] . ' ' . $location['Zip'];
    //             }
    //             update_field('database_id', (int)$location['Location_ID'], $post);          // ID
    //             update_field('location_address', $address, $post);                          // Address
    //             $this->set_phone_field('location_phone', $location['Phone'], $post->ID);    // Phone
    //         }
    //         else {
    //             if (array_key_exists('Address2', $location)) {
    //                 // Address 2 present
    //                 $address = $location['Address1'] . "<br/>" . $location['Address2'] . "<br/>" . $location['City'] . ", " . $location['State'] . ' ' .$location['Zip'];
    //             }
    //             else {
    //                 // No address 2 field
    //                 $address = $location['Address1'] . "<br/>" . $location['City'] . ", " . $location['State'] . ' ' . $location['Zip'];
    //             }
    //             $post_id = $posts[0]->ID;
    //             $post = $posts[0];
    //             update_field('location_address', $address, $post_id);                   // Address
    //             $this->set_phone_field('location_phone', $location['Phone'], $post_id); // Phone
    //             $post->post_title = $location['Location_Description'];                  // Title
    //             wp_update_post($post, true);
    //         }
    //     }
    // }
    
    // private function findLocationByID($locationID) {
    //     // Look up by the remote database ID and return the POST object.
    //     $post = get_posts([
    //         'numberposts' => -1,
    //         'post_type' => XMLdataImporter::COUNTY_CONTENT_TYPE,
    //         'meta_key' => 'database_id',
    //         'meta_value' => $locationID
    //     ]);
    //     if (count($post) == 1) {
    //         return $post[0];
    //     }
    //     else {
    //         return FALSE;
    //     }
    // }
    
    // private function fixBoolean($val) {
    //     if ((int)$val > 0) {
    //         return 1;
    //     }
    //     return 0;
    // }


    // private function update_or_create_dentists() {
    //     /*
    //      * Update or create dentist records.
    //      * Record the IDs of content touched from the
    //      * new feed.
    //      */
        
    //     // For each dentist record:
    //     //      Attempt to load by NPI number
    //     //      If not exists:
    //     //          Creat a new Post.
    //     //      Set the values of each Field and Taxonomy.
    //     //      Resave the Post.
    //     //      Save the PostID for future checks.
    //     foreach ($this->dentists['row'] as $dentist) {
    //         $manual = FALSE;
    //         $npi = $dentist['NPI'];
    //         $posts = get_posts([
    //             'numberposts' => -1,
    //             'post_type' => XMLdataImporter::STANDARD_CONTENT_TYPE,
    //             'meta_key' => 'npi',
    //             'meta_value' => $npi
    //         ]);
    //         if (!$posts) {
    //             // Create Post
    //             $uri = strtolower(preg_replace('/\s+/', '', $dentist['display_name']));
    //             $post_id = wp_insert_post([
    //                 'post_type' => XMLdataImporter::STANDARD_CONTENT_TYPE,
    //                 'post_status' => 'publish',
    //                 'post_author' => 1,
    //                 'comment_status' => 'closed',
    //                 'ping_status' => 'closed',
    //                 'post_name' => $uri,
    //                 'post_content' => ' ',
    //                 'post_title' => $dentist['display_name']
    //             ], TRUE);
    //             update_field('npi', $npi, $post_id);
    //         }
    //         else {
    //             $post_id = $posts[0]->ID;
    //             $manual = get_field('manual_entry', $post_id);
    //         }
    //         if ($manual == FALSE) {
    //             // Fetch locations:
    //             $location_primary = $this->findLocationByID($dentist['Dentist_Primary_Location_ID']);
    //             $location_secondary = $this->findLocationByID($dentist['Dentist_Secondary_Location_ID']);
    //             // Update ACF Fields.
    //             if (array_key_exists('first_name', $dentist)) {
    //                 update_field('first_name', $dentist['first_name'], $post_id);
    //             }
    //             if (array_key_exists('last_name', $dentist)) {
    //                 update_field('last_name', $dentist['last_name'], $post_id);
    //             }
    //             if (array_key_exists('dentist_suff', $dentist)) {
    //                 update_field('dentist_suffix', $dentist['dentist_suff'], $post_id);
    //             }
    //             if (array_key_exists('dentist_about_me', $dentist)) {
    //                 update_field('dentist_about_me', $dentist['dentist_about_me'], $post_id);
    //             }
    //             if (array_key_exists('dentist_about_practice', $dentist)) {
    //                 update_field('dentist_about_practice', $dentist['dentist_about_practice'], $post_id);
    //             }
    //             if (array_key_exists('dentist_thrive', $dentist)) {
    //                 update_field('dentist_thrive', $dentist['dentist_thrive'], $post_id);
    //             }
    //             if (array_key_exists('dentist_education', $dentist)) {
    //                 update_field('dentist_education', $dentist['dentist_education'], $post_id);
    //             }
    //             update_field('dentist_location', $location_primary, $post_id);
    //             if (array_key_exists('dentist_hire_date', $dentist)) {
    //                 update_field('dentist_hire_date', $dentist['dentist_hire_date'], $post_id);
    //             }
    //             if (array_key_exists('Dentist_Secondary_Location_ID', $dentist)) {
    //                 update_field('dentist_secondary_location', $location_secondary, $post_id);
    //             } else {
    //                 delete_field('dentist_secondary_location', $post_id);
    //             }
    //             if (array_key_exists('dentist_gender', $dentist)) {
    //                 update_field('dentist_gender', $dentist['dentist_gender'], $post_id);
    //             }
    //             if (array_key_exists('dentist_certification', $dentist)) {
    //                 update_field('dentist_certification', $dentist['dentist_certification'], $post_id);
    //             }
    //             update_field('dentist_require_referrals', $this->fixBoolean($dentist['dentist_require_referrals']), $post_id);
    //             update_field('dentist_accepting', $this->fixBoolean($dentist['dentist_accepting']), $post_id);
    //             if (array_key_exists('dentist_privilege', $dentist)) {
    //                 update_field('dentist_privilege', $dentist['dentist_privilege'], $post_id);
    //             }
    //             update_field('manual_entry', 0, $post_id);
    //             // Update Taxonomy fields
    //             wp_set_post_terms($post_id, $dentist['dentist_specialty'], 'specialty');
    //             wp_set_post_terms($post_id, $dentist['dentist_languages'], 'language');
    //             $this->updated[] = $post_id;

    //             //Update core WP Post fields --added 11/13/19 by Alex Tryon
    //             $uri = strtolower(preg_replace('/\s+/', '', $dentist['display_name']));
    //             $updated_post = array(
    //                 'ID'            => $post_id,
    //                 'post_title'    => $dentist['display_name'],
    //                 'post_status'   => 'publish',
    //                 'post_name'     => $uri,
    //             );
    //             wp_update_post($updated_post);
    //         }
    //     }
    // }
    
    // private function delete_removed_dentists() {
    //     /*
    //      * Delete any dentist records that where not in the feed and not
    //      * marked for manual management.
    //      */
    //     // Get all dentist posts where manual_entry is FALSE
    //     // For each result:
    //     //      If post ID not in updated delete post.
    //     $posts = get_posts([
    //         'numberposts' => -1,
    //         'post_type' => XMLdataImporter::STANDARD_CONTENT_TYPE,
    //         'meta_key' => 'manual_entry',
    //         'meta_value' => 0
    //     ]);
    //     foreach ($posts as $post) {
    //         if (!in_array($post->ID, $this->updated)) {
    //             wp_delete_post($post->ID);
    //         }
    //     }
    // }
    
    // private function set_phone_field($field, $value, $post_id) {
    //     $repeater = [
    //         [
    //             'location_line' => 'MAIN',
    //             'location_number' => $value
    //         ]
    //     ];
    //     update_field($field, $repeater, $post_id);
    // }
}
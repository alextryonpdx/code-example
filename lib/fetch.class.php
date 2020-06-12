<?php
class FileFetcher {
    const FILE_STANDARDS = "standardinfo.txt";
    const FILE_COUNTIES = "standardcounty.txt";
    
    public function __construct($location, $user, $passwd) {
        $this->user = $user;
        $this->passwd = $passwd;
        $this->url = $location;
        $this->last_fetch = get_option("hecc_standard_last_update_datetime");
    }
    
    public function is_new_data() {
        /*
         * Open connection to the remote server.
         * Fetch the modification times of the files.
         * If the modification time of any of the files is newer then
         * the recorded last fetch datetime set the record to the
         * new date time and return True, else False.
         */
        $rv = FALSE;
        if ($this->is_remote($this->url)) {
            $ts_standard = $this->GetRemoteLastModified($this->url . FileFetcher::FILE_STANDARDS);
            $ts_counties = $this->GetRemoteLastModified($this->url . FileFetcher::FILE_COUNTIES);
        }
        else {
            $ts_standard = filemtime($this->url . FileFetcher::FILE_STANDARDS);
            $ts_counties = filemtime($this->url . FileFetcher::FILE_COUNTIES);
        }
        $ts = 0;
        if ($this->last_fetch == '' || $ts_standard > $this->last_fetch) {
            $rv = TRUE;
            $ts = $ts_standard;
        }
        if ($this->last_fetch == '' || $ts_counties > $this->last_fetch) {
            $rv = TRUE;
            $ts = $ts_counties;
        }
        if ($rv) {
            update_option("hecc_standard_last_update_datetime", $ts);
        }
        return $rv;
    }
    
    public function get_data() {
        /*
         * Fetch contents of the data files.
         */
        $rv = [
            'standard' => [],
            'counties' => []
        ];
        // echo 'url: '. $this->url;
        if ($this->is_remote($this->url)) {
            // Remote fetch
            // echo 'is remote';
            if ($this->user && $this->passwd) {
                // echo 'user:'.$this->user;
                $auth = base64_encode($this->user . ":" . $this->passwd);
                $context = stream_context_create(['http' => ['header' => "Authorization: Basic $auth"]]);
                // $data_standards = file_get_contents($this->url . FileFetcher::FILE_STANDARDS, false, $context );
                $data_standards = file($this->url . FileFetcher::FILE_STANDARDS, false, $context );
                // echo '$data_standards: '. $data_standards;
                // $data_counties = file_get_contents($this->url . FileFetcher::FILE_COUNTIES, false, $context );
                $data_counties = file($this->url . FileFetcher::FILE_COUNTIES, false, $context );
                // echo '$data_counties: '. $data_counties;
            }
            else {
                $data_standards = file_get_contents($this->url . FileFetcher::FILE_STANDARDS);
                $data_counties = file_get_contents($this->url . FileFetcher::FILE_COUNTIES);
            }
        }
        else {
            // Local files
            $data_standards = file_get_contents($this->url . FileFetcher::FILE_STANDARDS);
            $data_counties = file_get_contents($this->url . FileFetcher::FILE_COUNTIES);
        }
        // $rv['standard'] = $this->read_standards_file($data_standards);
        // $rv['counties'] = $this->read_counties_file($data_counties, $data_standards);

        // return $rv;

        $standards_and_committees = $this->read_standards_file($data_standards);
        // var_dump($standards_and_committees[0]);
        $listings = $this->read_counties_file($data_counties, $standards_and_committees[0], $standards_and_committees);
        $listings['committees'] = $standards_and_committees[1];
        return $listings;
    }
    

    private function read_standards_file($standards = null){
        $committees = [];
        if($standards){
            $existing_standards = get_option('hecc_standards_data');
            echo 'standards file present';
            foreach ($standards as $standard_item) {
            
            // $fh = fopen($standards, "r");
            // if ( $fh ) {
            //   while ( !feof($fh) ) {
                $standard = new Standard(explode('~', $standard_item ));

            if( $standard->ma && !$committees[$standard->ma] ){
                $committees[$standard->ma] = new Committee($standard);
                $committees[$standard->ma]->set_standard($standard);
                $committees[$standard->ma]->hasOpenStandards();
            } elseif( $committees[$standard->ma] ){
                $committees[$standard->ma]->set_standard($standard);
                $committees[$standard->ma]->hasOpenStandards();
            }

// MOVE THIS TO THE COMMITTEE OBJECT
                // if($existing_standards[$standard->identifier]){
                //     if(undefined !== $existing_standards[$standard->identifier]->coords){
                //         $standard->coords = $existing_standards[$standard->identifier]->coords;
                //         echo 'reuse coordinates: '.$existing_standards[$standard->identifier]->coords[0] . "<br/>";
                //     }
                // } else {
                //     $standard->geolocate();
                // }
                if($standard->ma){
                    $standards_listings[$standard->identifier] = $standard;
                }
            //   }
            //   fclose($fh);
            // }
            }
        return array($standards_listings, $committees);
        }
    }

    
    private function read_counties_file($counties = null, $standards_listings = null){
        if($counties){
            $existing_counties = get_option('hecc_counties_data');
            echo 'counties file present';
            $county_listings = array();
            // $fh = fopen($counties, "r");
            // if ( $fh ) {
            //   while ( !feof($fh) ) {
            foreach ($counties as $county_item) {
                $county = new County(explode('~', $county_item ));
                $county_listings[] = $county;

                // if the standards file has been processed, add counties to matched standard listings
                if($standards_listings[$county->identifier]){
                    $standards_listings[$county->identifier]->set_county($county);
                }
            }
            //   }
            //   fclose($fh);
            // }
            return array('counties' => $county_listings, 'standards' => $standards_listings);
        }
    }

//THIS REPLECATES THE LAST LINES OF $this->get_data()
    // function build_openings_data($standards = null, $counties = null){
    //     if(null == $counties) {
    //         $counties = plugin_dir_path(__FILE__) . '/sample_data/standardcounty.txt';
    //     }
    //     if(null == $standards) {
    //         $standards = plugin_dir_path(__FILE__) . '/sample_data/standardinfo.txt';
    //     }

    //     $standards_listings = read_standards_file($standards);
    //     $county_listings = read_counties_file($counties, $standards_listings);

    //     return array( 'standards' => $standards_listings, 'counties' => $county_listings);
    // }
    // private function xml_to_array($xmltxt) {
    //     $ob = simplexml_load_string($xmltxt);
    //     $json = json_encode($ob);
    //     return json_decode($json, true);
    // }


    private function is_remote($pathname) {
        /*
         * Test to determine if the path is to a local file or remote,
         * return True if remote.
         */
        if (strpos($pathname, ':') !== FALSE) {
            return TRUE;
        }
        return FALSE;
    }


    private function GetRemoteLastModified( $uri )
    {
        // default
        $unixtime = 0;
        if ($this->user && $this->passwd) {
            // Password protected.
            $auth = base64_encode($this->user . ":" . $this->passwd);
            $context = stream_context_create(['http' => ['header' => "Authorization: Basic $auth"]]);
            $fp = fopen( $uri, "r", FALSE, $context);
        }
        else {
            $fp = fopen( $uri, "r" );
        }
        
        if( !$fp ) {return;}

        $MetaData = stream_get_meta_data( $fp );

        foreach( $MetaData['wrapper_data'] as $response )
        {
            // case: redirection
            if( substr( strtolower($response), 0, 10 ) == 'location: ' )
            {
                $newUri = substr( $response, 10 );
                fclose( $fp );
                return GetRemoteLastModified( $newUri );
            }
            // case: last-modified
            elseif( substr( strtolower($response), 0, 15 ) == 'last-modified: ' )
            {
                $unixtime = strtotime( substr($response, 15) );
                break;
            }
        }
        fclose( $fp );
        return $unixtime;
    }
}
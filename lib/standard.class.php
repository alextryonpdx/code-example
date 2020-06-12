<?php

class Standard {

	public $counties = array();

	function __construct($listing = null)
    {
		if($listing[0]){
			$this->ma = trim($listing[0]);
		}
		if($listing[1]){
			$this->symbol = trim($listing[1]);
		}
		if($listing[2]){
			$this->suffix = trim($listing[2]);
		}
		if($listing[3]){
			$this->job_title = trim($listing[3]);
		}
		if($listing[4]){
			$this->seq = trim($listing[4]);
		}
		if($listing[5]){
			$this->committee = trim($listing[5]);
		}
		if($listing[6]){
			$this->trade_name = trim($listing[6]);
		}
		if($listing[7]){
			$this->state_title = trim($listing[7]);
		}
		if($listing[8]){
			$this->opening_date = strtotime(trim($listing[8]));
		}
		if($listing[9]){
			$this->closing_date = strtotime(trim($listing[9]));
		}
		if($listing[10]){
			$this->contact = trim($listing[10]);
		}
		if($listing[11]){
			$this->street = trim($listing[11]);
		}
		if($listing[12]){
			$this->city = trim($listing[12]);
		}
		if($listing[13]){
			$this->state = trim($listing[13]);
		}
		if($listing[14]){
			$this->zip = trim($listing[14]);
		}
		if($listing[15]){
			$this->phone = trim($listing[15]);
		}
		if($listing[16]){
			$this->phone_ext = trim($listing[16]);
		}
		if($listing[17]){
			$this->email = trim($listing[17]);
		}
		if($listing[18]){
			$this->website = trim($listing[18]);
		}
		$this->is_open();
		$this->get_identifier();
		// $this->geolocate();
    }

  //   public function geolocate(){
  //   	$full_address = '';
		// $full_address .= $this->street . ' ';
		// $full_address .= $this->city . ', ';
		// $full_address .= $this->state . ' ';
		// $full_address .= $this->zip . ' ';
		// echo $full_address;
		// $geocode = new Geocode($full_address);
		// $this->coords = $geocode->getCoords();
  //   }

    public function set_county($county = null){
    	$this->counties[$county->county_identifier] = $county;
    }

    public function get_county_list(){
    	$county_list = '';
    	foreach($this->counties as $county){
    		$county_list .= $county->county_text . ', ';
    	}
    	return substr($county_list, 0, (strlen($county_list) - 2));
    }

    public function get_identifier(){
    	if($this->ma && $this->symbol && $this->suffix){
    		$this->identifier = $this->ma .'_'. $this->symbol .'_'. $this->suffix;
    	}
    }

    public function print_data(){
    	return $this->identifier . ' = ' . $this->committee . ' : ' . $this->state_title . "\n";
    }

    public function print_readable(){
    	$readable = $this->committee . ' : ' . $this->state_title . '||| counties: ' .  $this->get_county_list() . "\n";
   		return $readable;
    }

    public function is_open(){
    	$date = strtotime('now');


    	if( undefined !== $this->opening_date && undefined !== $this->closing_date){
			if($date >= $this->opening_date && $date <= $this->closing_date){
				$this->is_open = true;    			
			} else {
				$this->is_open = false;
			}
		} else {
			$this->is_open = false;
		}
    }

    public function build_json_object(){
		$obj = JSON_encode(array( 
			'counties' => $this->counties,
			'county_names' =>  $this->get_county_names(),
			'areas' =>  $this->get_areas(),
			'ma' => $this->ma,
			'symbol' => $this->symbol,
			'suffix' => $this->suffix,
			'job_title' => $this->job_title,
			'seq' => $this->seq,
			'committee' => $this->committee,
			'trade_name' => $this->trade_name,
			'state_title' => $this->state_title,
			'opening_date' => $this->opening_date,
			'closing_date' => $this->closing_date,
			'open' => $this->is_open,
		));
		return $obj;
    }

    // public function get_county_names(){
    // 	$county_names = '';
    // 	foreach ($this->counties as $key => $county) {
    // 		$county_names .= $county->county_text ', ';
    // 	}
    // 	return $county_names;
    // }
    public function get_county_names(){
    	$county_names = '';
    	foreach ($this->counties as $key => $county) {
    		echo $county->county_text;
    	}
    	// return substr($county_names, 0 , strlen($county_names) - 2);
    }
    public function get_areas(){
    	$areas = '';
    	foreach ($this->counties as $key => $county) {
    		$areas .= $county->area . ', ';
    	}
    	return $areas;
    }
    public function print_as_table_row(){
    	$row = '<tr>';
		$row .= '<td>'.$this->ma.'</td>';
		// $row .= '<td>'.$this->symbol.'</td>';
		// $row .= '<td>'.$this->suffix.'</td>';
		$row .= '<td>'.$this->job_title.'</td>';
		// $row .= '<td>'.$this->seq.'</td>';
		$row .= '<td>'.$this->committee.'</td>';
		$row .= '<td>'.$this->trade_name.'</td>';
		// $row .= '<td>'.$this->state_title.'</td>';
		// $row .= '<td>'.$this->opening_date.'</td>';
		// $row .= '<td>'.$this->closing_date.'</td>';
		// $row .= '<td>'.$this->get_county_names().'</td>';
		$row .= '<td>'.$this->get_areas().'</td>';
		$row .= '</tr>';
		return $row;
    }

}
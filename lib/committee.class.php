<?php

class Committee {

	public $coords = array();
	public $standards = array();
	public $hasOpenStandards = 0;

    public function __construct($standard = null) {
    	if(null !== $standard){
			if($standard->ma){
				$this->ma = $standard->ma;
			}
			if($standard->committee){
				$this->committee = $standard->committee;
			}
			if($standard->contact){
				$this->contact = $standard->contact;
			}
			if($standard->street){
				$this->street = $standard->street;
			}
			if($standard->city){
				$this->city = $standard->city;
			}
			if($standard->state){
				$this->state = $standard->state;
			}
			if($standard->zip){
				$this->zip = $standard->zip;
			}
			if($standard->phone){
				$this->phone = $standard->phone;
			}
			if($standard->phone_ext){
				$this->phone_ext = $standard->phone_ext;
			}
			if($standard->email){
				$this->email = $standard->email;
			}
			if($standard->website){
				$this->website = $standard->website;
			}
			$this->geolocate();

		}
    }
    public function geolocate(){
    	$full_address = '';
		$full_address .= $this->street . ' ';
		$full_address .= $this->city . ', ';
		$full_address .= $this->state . ' ';
		$full_address .= $this->zip . ' ';
		// echo $full_address;
		$geocode = new Geocode($full_address);
		$this->coords = $geocode->getCoords();
    }
    public function build_json_object(){
		$obj = JSON_encode(array( 
			'ma' => $this->ma,
			'committee' => $this->committee,
			'contact' => $this->contact,
			'street' => $this->street,
			'city' => $this->city,
			'state' => $this->state,
			'zip' => $this->zip,
			'phone' => $this->phone,
			'phone_ext' => $this->phone_ext,
			'email' => $this->email,
			'website' => $this->website,
			'coords' => $this->coords,
			'standards' => $this->standards,
			'standards_count' => count($this->standards),
			'open_standards' => $this->hasOpenStandards,
		));
		return $obj;
    }
    public function set_standard($standard){
    	$this->standards[] = $standard;
    }
    public function hasOpenStandards(){
    	foreach ($this->standards as $standard) {
			if($standard->is_open === true){
				$this->hasOpenStandards++;
			}
		}
    		
    }

}
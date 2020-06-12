<?php
class County {

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
			$this->county_code = trim($listing[3]);
		}
		if($listing[4]){
			$this->county_text = trim($listing[4]);
		}
		$this->get_identifier();
		$this->get_county_identifier();
		$this->get_area();
    }

    public function get_identifier(){
    	if($this->ma && $this->symbol && $this->suffix){
    		$this->identifier = $this->ma .'_'. $this->symbol .'_'. $this->suffix;
    	}
    }

    public function get_county_identifier(){
    	if($this->ma && $this->symbol && $this->suffix){
    		$this->county_identifier = $this->ma .'_'. $this->symbol .'_'. $this->suffix .'_' . $this->county_code;
    	}
    }

    public function print_data(){
    	return $this->county_identifier . ' = ' . $this->county_text . ' (' . $this->county_code . ")\n";
    }

    public function get_area(){
    	$areas = array(
			'1' => array('Clackamas','Clatsop','Columbia','Hood River','Multnomah','Tillamook','Washington','Yamhill'),
			'2' => array('Benton','Lincoln','Linn','Marion','Polk'),
			'3' => array('Lane'),
			'4' => array('Coos','Curry','Douglas'),
			'5' => array('Jackson','Josephine','Klamath','Lake'),
			'6' => array('Baker','Gilliam','Malheur','Morrow','Sherman','Umatilla','Union','Wallowa','Wasco'),
			'7' => array('Crook','Deschutes','Grant','Harney','Jefferson','Wheeler')
		);
		foreach ($areas as $area => $counties) {
			if(in_array($this->county_text, $counties)){
				$this->area = $area;
			}
		}
    }

    public function build_json_object(){
		$obj = JSON_encode(array( 
			'ma' => $this->ma,
			'symbol' => $this->symbol,
			'suffix' => $this->suffix,
			'county_code' => $this->county_code,
			'county_text' => $this->county_text,
			'area' => ''
		));
		return $obj;
    }

}
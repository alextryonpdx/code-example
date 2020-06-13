<?php
class Geocode {
	function __construct($address = null){

		define("MAPS_HOST", "https://maps.googleapis.com/maps/");
		//Personal Google Maps API key
		define("KEY", "xxx");

		if(null !== $address){
			$this->address = urlencode($address);
		}
	}
	public function test(){
		echo $this->address;
	}
	public function getCoords(){
		// session_start();

			

		//Get address from which we will geocode the coordinates
		$address=$_GET['address'];

		if( $this->address!=NULL)
		{
			// Initialize delay in geocode speed
			$delay = 0;
			$request_url = MAPS_HOST . "api/geocode/json?address=" . $this->address . "&key=". KEY;


			// $request_url = $base_url . "&q=" . $this->address;
			// $ch = curl_init();
			// curl_setopt($ch, CURLOPT_URL, $request_url);
			// $result = curl_exec($ch);
			// curl_close($ch);

			$json = file_get_contents($request_url);
			$obj = json_decode($json);
			$lat = $obj->results[0]->geometry->location->lat;
			$long = $obj->results[0]->geometry->location->lng;

			return array($lat, $long);
			
		}
		else
		{
			return;
		}
	}

}
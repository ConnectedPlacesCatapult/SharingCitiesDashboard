<?php

namespace FCC;

class Source
{
	protected $db;
	protected $config;
	protected $fetchedAt;
	
	private $saveCount = 0;
	
	public function __construct($db, $config, $fetchedAt)
	{
		$this->db = $db;
		$this->config = $config;
		$this->fetchedAt = $fetchedAt;		
	}
	
	public function getDefaults()
	{
		return ['refresh' => 3600];	
	}
	
	public function getSampleResponse()
	{
		return file_get_contents('/var/www/fcc/data/'.array_pop(explode('\\', get_class($this))).'.json');
	}
	
	public function getURL($url)
	{
		return file_get_contents($url);
	}
	
	public function getSaveCount()
	{
		return $this->saveCount;
	}
	
	protected function touchLocation($dataset, $location)
	{
		$locationId = $this->lookupLocation($dataset, $location);

		$this->setSeenAs($dataset, $locationId);		
	}
	
	protected function getLastCurrentAt($dataset)
	{
		//return $this->db->doQueryValue('SELECT MAX(current_at) FROM '.$dataset);
		return $this->db->fetchColumn('SELECT MAX(current_at) FROM '.$dataset);		
	}
	
	protected function saveDataPoint($dataset, $location, $data = [])
	{
		//var_dump([$location, $data]);
		
		$this->saveCount++;		
		$locationId = $this->lookupLocation($dataset, $location);
		
		$this->setSeenAs($dataset, $locationId);
			
		if(count($data) > 0)
		{			
			if(!array_key_exists('current_at', $data))			
				$data['current_at'] = date('Y-m-d H:i:s', $this->fetchedAt);
			
			$data['location_id'] = $locationId;		
			
			$this->doInsertOrUpdate($dataset, ['location_id', 'current_at'], $data);			
		}
	}
	
	protected function lookupLocation($dataset, $location = null)
	{
		//var_dump([$dataset, $location]);
		
		if(!isset($location))
			return -1;
			
		if(!is_array($location))
			$location = ['name' => $location];
			
		$lookupFields = ['name'];
		
		if(array_key_exists('lat', $location))
		{
			$lookupFields[] = 'lat';
			$lookupFields[] = 'lon';
		}
		
		return $this->doInsertOrLookupAutoId($dataset.'_location', 'id',
			$lookupFields, $location);
	}

	protected function setSeenAs($dataset, $locationId)
	{		
		if($locationId > -1)
		{
			$this->db->executeQuery('UPDATE '.$dataset.'_location
				SET seen_at = :seen_at WHERE id = :location_id',
				[
					'location_id' => $locationId,
					'seen_at' => date('Y-m-d H:i:s', $this->fetchedAt)
				]
			);
		}
	}
	
	/* database helper functions - to be moved elsewhere */

	protected function doInsertOrUpdate($table, $keyFields, $data)
	{
		$platform = $this->db->getDatabasePlatform();

		//var_dump([$table, $keyFields, $data, get_class($platform)]);
				
		if(!is_array($keyFields))
			$keyFields = [$keyFields];
			
		$fields = array_keys($data);
			
		$updates = [];
				
		if($platform instanceof \Doctrine\DBAL\Platforms\PostgreSQL94Platform)
		{
			$query = 'INSERT INTO '.$table.' ("'.implode('", "', $fields)
				.'") VALUES (:'.implode(', :', $fields).')';
					
			foreach($fields as $field)
				if(!in_array($field, $keyFields))
					$updates[] = $field.' = EXCLUDED.'.$field;

			if(count($updates) > 0)
				$query .= ' ON CONFLICT ('.implode(', ', $keyFields).') DO UPDATE SET '.implode(', ', $updates);
		}
		else if($platform instanceof \Doctrine\DBAL\Platforms\MySQL57Platform)
		{
			$query = 'INSERT INTO '.$table.' (`'.implode('`, `', $fields)
				.'`) VALUES (:'.implode(', :', $fields).')';
				
			foreach($fields as $field)
				if(!in_array($field, $keyFields))
					$updates[] = $field.' = VALUES('.$field.')';

			if(count($updates) > 0)
				$query .= ' ON DUPLICATE KEY UPDATE '.implode(', ', $updates);
		}
		else
			throw new Exception('unsupported db');
		
		//echo '<p>', $query, '</p>';
																											
		$this->db->executeQuery($query, $data);													
	}
	
	protected function doInsertOrLookupAutoId($table, $autoIncField, $lookupFields, $data)
	{
		$query = 'SELECT '.$autoIncField.' FROM '.$table.' WHERE ';
		
		$index = 0;
		$lookupValues = [];
		
		foreach($lookupFields as $index => $field)
		{
			if($index > 0)
				$query .= ' AND ';

			$query .= $field.' = :'.$field;
			$lookupValues[$field] = $data[$field];
			
			$index++;
		}
													
		//echo '<p>', $query, '</p>';		
		//var_dump($lookupValues);
		
		$match = $this->db->fetchAssoc($query, $lookupValues);
		
		//var_dump($match);
																						
		if($match == false || count($match) == 0)
		{
				$this->db->insert($table, $data);
				$id = $this->db->lastInsertId();
		}
		else
			$id = $match[$autoIncField];
		
		return $id;		
	}

	/* misc helper functions */

	protected function fromJson($json)
	{
		return json_decode($json, true);
	}
	
	protected function msg($message)
	{
		echo date('H:i:s'), ': ', $message, (php_sapi_name() == 'cli') ? "\n" : '<br>';
	}	
		
}
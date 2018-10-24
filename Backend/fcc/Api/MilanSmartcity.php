<?php

namespace FCC\Api;

use FCC\Source;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Client;

class MilanSmartcity extends Source
{
	const
		DATASET = 'milan_lampione';
		
	private $http;
	
	public function __construct($db, $config, $fetchedAt)
	{
		parent::__construct($db, $config, $fetchedAt);
										
		$this->http = new Client([
			'base_uri' => 'http://supernovalora.a2asmartcity.io'
		]);		
	}
	
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 300,
			'endpoint' => 'http://supernovalora.a2asmartcity.io/api/v2/devices'
		]);
	}
		
	public function tables($schema)
	{
		// data
		
		$lampione = $schema->createTable(self::DATASET);

		$lampione->addColumn('location_id', 'integer', ['notnull' => true]);
		$lampione->addColumn('current_at', 'datetime', ['notnull' => true]);
		
		$lampione->addColumn('temperature', 'float', ['notnull' => false]);
		$lampione->addColumn('di1', 'smallint', ['notnull' => false]);
		$lampione->addColumn('di2', 'smallint', ['notnull' => false]);
		$lampione->addColumn('di3', 'smallint', ['notnull' => false]);
		$lampione->addColumn('di4', 'smallint', ['notnull' => false]);
		$lampione->addColumn('di5', 'smallint', ['notnull' => false]);
		$lampione->addColumn('do1', 'smallint', ['notnull' => false]);
		$lampione->addColumn('do2', 'smallint', ['notnull' => false]);
		
		$lampione->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);
		$location->addColumn('lat', 'float', ['notnull' => false]);
		$location->addColumn('lon', 'float', ['notnull' => false]);
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}
	
	public function sync()
	{	
		$getFromTimestamp = $this->getLastCurrentAt(self::DATASET);
		
		if(isset($getFromTimestamp))
			$getFromTimestamp = strtotime($getFromTimestamp) + 1;
		else
			$getFromTimestamp = time() - 3600 * 4;
			
		$this->msg('from: '.date('Y-m-d H:i:s', $getFromTimestamp));
		
		$devices = $this->get('/api/v2/devices');
		
		$lampione = [];
		
		foreach($devices as $device)
			if($device['device_title'] == 'Lampione')
			{
				$device['location_id'] = $this->lookupLocation(self::DATASET, [
					'name' => $device['device_eui'],
					'lat' => $device['device_coordinate']['lat'],
					'lon' => $device['device_coordinate']['lng']
				]);
								
				$lampione[$device['device_id']] = $device;
			}
		
		$recentEventEndpoint = '/api/v2/sensors?timestamp='.$getFromTimestamp;
		
		$deviceValuesList = $this->get($recentEventEndpoint);
				
		foreach($deviceValuesList as $deviceValues)
		{
			if(array_key_exists($deviceValues['id'], $lampione))
			{
				$device = $lampione[$deviceValues['id']];
				
				foreach($deviceValues['values'] as $values)
				{
					$record = ['current_at' => date('Y-m-d H:i:s', $values['timestamp'])];
					
					$copyFields = ['temperature', 'di1', 'di2', 'di3', 'di4', 'di5', 'do1', 'do2'];
					
					foreach($copyFields as $copyField)
						if(array_key_exists($copyField, $values['payload']))
							$record[$copyField] = $values['payload'][$copyField];
												
					$this->saveDataPoint(self::DATASET, $device['device_eui'], $record);			
				}
			}
		}	
	}
	
	public function parseSampleFile()
	{		
		$devices = json_decode(file_get_contents(__DIR__.'/../data/MilanSuperDevices.json'), true);
		
		$titles = [];
		
		foreach($devices as $device)
		{
			var_dump($device);
			
			if(array_key_exists($device['device_title'], $titles))
				$titles[$device['device_title']]++;
			else
				$titles[$device['device_title']] = 1;			
		}

		echo '<h3>device titles</h3><ol>';
		
		foreach($titles as $title => $count)
			if($count > 2)
				echo '<li>', $title, ': ', $count, '</li>';
	
		echo '</ol>';
			
		$events = json_decode(file_get_contents(__DIR__.'/../data/MilanSuperEvents.json'), true);
		
		$fields = [];
		
		foreach($events as $device)
		{
			//echo '<h3>', $device['id'], '</h3>';
			
			foreach($device['values'] as $index => $values)
			{
				if($index > 0)
					break;
				
				$fieldList = implode(', ', array_keys($values['payload']));
				
				if(array_key_exists($fieldList, $fields))
					$fields[$fieldList]++;
				else
					$fields[$fieldList] = 1;
			}			
		}
		
		echo '<h3>field sets</h3><ul>';
		
		foreach($fields as $fieldList => $count)
			echo '<li>', $fieldList, ': ', $count, '</li>';

		echo '</ul>';

	}
		
	public function get($uri)
	{		
		$response = $this->http->get($uri);
				
		return json_decode($response->getBody(), true);
	}		
}
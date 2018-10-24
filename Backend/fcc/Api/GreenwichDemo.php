<?php

namespace FCC\Api;

use FCC\Source;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Client;

class GreenwichDemo extends Source
{
	private $http;
	
	public function __construct($db, $config, $fetchedAt)
	{
		parent::__construct($db, $config, $fetchedAt);
		
		$this->lastRequest = 0;
		$this->http = new Client();
	}
	
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 100000,
			'endpoint' => 'https://maps.london.gov.uk/gla/rest/services/apps/smart_parking_demo_service_01/MapServer'
		]);	
	}
	
	public function tables($schema)
	{
		for($layer = 0; $layer <= 6; $layer++)
			$this->layerToTable($layer, $schema);
	}
	
	public function sync()
	{
		for($layer = 0; $layer <= 6; $layer++)
			$this->saveLayerData($layer, true);		
	}
	
	private function layerToTable($layerNum, $schema)
	{
		$meta = $this->get('/'.$layerNum.'?f=pjson');
				
		if(!array_key_exists('name', $meta) || !array_key_exists('fields', $meta))
			return;
		
		$structure = ['layer' => $layerNum, 'name' => $meta['name']];

		$nameParts = explode('.', $meta['name']);		
		$structure['table'] = 'gla_'.$nameParts[count($nameParts) - 1];
						
		// discover fields
		
		$typeMap = [
			'esriFieldTypeDouble' => 'float',
			'esriFieldTypeString' => 'string',			
			'esriFieldTypeOID' => 'integer',
			'esriFieldTypeInteger' => 'integer',
			'esriFieldTypeSmallInteger' => 'integer',
			'esriFieldTypeDate' => 'datetime'
		];

		// see if we need sorting
		
		$data = $this->getLayerData($layerNum, 0, 10);				
				
		$needsSorting = (array_key_exists('error', $data)
			&& strpos($data['error']['message'], 'requires either orderBy field') !== false);
		
		$sort = [];
						
		if($needsSorting)
		{
			foreach($meta['fields'] as $field)
				$sort[] = $field['name'];
				
			$data = $this->getLayerData($layerNum, 0, 10, $sort);								
		}				
			
		$fields = [];
		
		foreach($data['fields'] as $field)
		{
			$fields[strtolower($field['name'])] = [
				'name' => $field['name'],
				'type' => $typeMap[$field['type']],
				'size' => 0
			];
		}
						
		foreach($data['features'] as $record)
		{
			foreach($fields as $fieldName => $field)
			{
				if($field['type'] == 'string')
				{
					$size = strlen($record['attributes'][$field['name']]);
					$size = 10 * ceil($size * 0.15);

					$fields[$fieldName]['size'] = max(10, $field['size'], $size);
				}
			}
		}
				
		$table = $schema->createTable($structure['table']);
		
		foreach($fields as $fieldName => $field)
		{
			$options = ['notnull' => false];
			if($field['size'] > 0)
				$options['length'] = $field['size'];
								
			$table->addColumn($fieldName, $field['type'], $options);
		}
	}	
	
	private function saveLayerData($layerNum, $emptyTable = false)
	{
		$meta = $this->get('/'.$layerNum.'?f=pjson');
		
		if(!array_key_exists('name', $meta) || !array_key_exists('fields', $meta))
			return;

		// table name
		
		$nameParts = explode('.', $meta['name']);		
		$tableName = 'gla_'.$nameParts[count($nameParts) - 1];
		
		if($emptyTable)
		{
			$this->msg('empty table '.$tableName);
			$this->db->executeQuery('DELETE FROM '.$tableName);
		}
		
		
		$this->msg('get table '.$tableName.' - layer '.$layerNum);
		
		// see if we need sorting
		
		$data = $this->getLayerData($layerNum, 0, 10);				
				
		$needsSorting = (array_key_exists('error', $data)
			&& strpos($data['error']['message'], 'requires either orderBy field') !== false);
		
		$sort = [];
						
		if($needsSorting)
		{
			foreach($meta['fields'] as $field)
				$sort[] = $field['name'];				
		}		
		
		// get data
		
		$offset = 0;
		$count = 1000;
		$loopCount = 0;
		
		// check field sizes and warn if truncate
		
		do {
			
			$this->msg('get layer '.$layerNum.' offset '.$offset);
			
			$data = $this->getLayerData($layerNum, $offset, $count, $sort);
			
			//file_put_contents('/var/www/squirrelboard/data/GlaParking.json', json_encode($data, JSON_PRETTY_PRINT));
			
			$recordCount = count($data['features']);
			
			if($recordCount > 0)
			{
				foreach($data['features'] as $feature)
					$this->saveDataRecord($tableName, $feature['attributes'], $meta['fields']);
			}

			$offset += $count;
			$loopCount++;
						
			// TODO: temp loopCount limit!
		}	while ($recordCount > 0 && $loopCount < 4);
	}
	
	private function saveDataRecord($tableName, $record, $fields)
	{
		// change date fields

		$data = [];
		
		foreach($fields as $field)
		{
			$fieldName = strtolower($field['name']);
			
			if(array_key_exists($field['name'], $record))
			{				
				if($field['type'] == 'esriFieldTypeDate')
					$data[$fieldName] = date('Y-m-d H:i:s', $record[$field['name']] / 1000);
				else
					$data[$fieldName] = $record[$field['name']];
			}
		}
				
		$this->db->insert($tableName, $data);
	}
	
	private function getLayerData($layerNum, $offset, $count, $sort = [])
	{
		$uri = '/'.$layerNum.'/query?where=1%3D1&outFields=*&resultOffset='.$offset
			.'&resultRecordCount='.$count.'&f=json';
			
		if(count($sort) > 0)
			$uri .= '&orderByFields='.implode('%2C', $sort);
				
		return $this->get($uri);
	}
		
	public function get($uri)
	{		
		$uri = 'https://maps.london.gov.uk/gla/rest/services/apps/smart_parking_demo_service_01/MapServer'
			.$uri.'&token='.$this->config['token'];
				
		$response = $this->http->get($uri);
				
		return json_decode($response->getBody(), true);
	}	
}
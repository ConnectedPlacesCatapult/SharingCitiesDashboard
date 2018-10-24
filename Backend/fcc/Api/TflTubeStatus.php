<?php

namespace FCC\Api;

use FCC\Source;

class TflTubeStatus extends Source
{
	const
		DATASET = 'tube_status';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 600,
			'endpoint' => 'https://api.tfl.gov.uk/line/mode/tube/status'
		]);
	}
				
	public function getEndpoint()
	{
		return 'https://api.tfl.gov.uk/line/mode/tube/status';	
	}
	
	public function import($data)
	{
		$data = $this->fromJson($data);
		
		foreach($data as $line)
		{
			// $line['modified']??
			
			$status = $line['lineStatuses'][0]['statusSeverity'];
			
			// Good Service or Service Closed
			if($status == 10 || $status == 20)
			{
				$this->touchlocation(self::DATASET, $line['name']);		
			}
			else
			{				
				$this->saveDataPoint(self::DATASET, $line['name'], [
					'status' => $status,
					'status_name' => $line['lineStatuses'][0]['statusSeverityDescription'],
				]);
			}
			
		}
	}
	
	public function tables($schema)
	{
		// data
		
		$status = $schema->createTable(self::DATASET);

		$status->addColumn('location_id', 'integer', ['notnull' => true]);
		$status->addColumn('current_at', 'datetime', ['notnull' => true]);
		$status->addColumn('status', 'smallint', ['notnull' => false]);
		$status->addColumn('status_name', 'string', ['length' => 20]);

		$status->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}		
}
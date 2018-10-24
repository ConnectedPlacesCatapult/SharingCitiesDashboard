<?php

namespace FCC\Api;

use FCC\Source;

class KclAirquality extends Source
{
	const
		DATASET = 'air_quality';
		
	const
		SPECIES = ['no2', 'so2', 'o3', 'pm10', 'pm25'];
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 3600,
			'endpoint' => 'https://api.erg.kcl.ac.uk/AirQuality/Hourly/MonitoringIndex/GroupName=LAQN/json'
		]);	
	}
	
	public function import($data)
	{
		$data = $this->fromJson($data);
		
		//var_dump($data);
		
		foreach($data['HourlyAirQualityIndex']['LocalAuthority'] as $locality)
		{
			if(array_key_exists('Site', $locality) && is_array($locality['Site']))
			{
				if(array_key_exists('Species', $locality['Site']))
					$site = $locality['Site'];
				else
					$site = $locality['Site'][0];
			}
			else
				continue;
			
			if(array_key_exists('@SpeciesDescription', $site['Species']))
				$species = [$site['Species']];
			else
				$species = $site['Species'];

			$values = [
				'current_at' => $site['@BulletinDate'],				
			];
			
			foreach($species as $item)
			{
				$name = strtolower($item['@SpeciesCode']);
				
				if(in_array($name, self::SPECIES))
					$values[$name] = intval($item['@AirQualityIndex']);
			}
			
			$this->saveDataPoint(
				self::DATASET,
				[
					'name' => $locality['@LocalAuthorityName'],
					'lat' => $locality['@LaCentreLatitude'],
					'lon' => $locality['@LaCentreLongitude']
				],
				$values
			);
		}
	}
	
	public function tables($schema)
	{
		// data
		
		$air = $schema->createTable(self::DATASET);

		$air->addColumn('location_id', 'integer', ['notnull' => true]);
		$air->addColumn('current_at', 'datetime', ['notnull' => true]);

		foreach(self::SPECIES as $field)
			$air->addColumn($field, 'integer', ['notnull' => false]);

		$air->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);
		$location->addColumn('lat', 'float', ['notnull' => false]);
		$location->addColumn('lon', 'float', ['notnull' => false]);		
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}			
}
<?php

namespace FCC\Api;

use FCC\Source;

class TflJamCam extends Source
{
	const
		DATASET = 'jamcam';	

	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 3600,
			'endpoint' => 'https://api.tfl.gov.uk/Place?lat=51.513395&lon=-0.089095&radius=250000&type=JamCam&app_id=66e25ccc&app_key=eed0febebc17e68ab1da05866830ec20'
		]);
	}
				
	public function import($data)
	{
		$data = $this->fromJson($data);
				
		foreach($data['places'] as $camera)
		{		
			$properties = [];
			
			foreach($camera['additionalProperties'] as $additionalProperty)
			{
				$properties[$additionalProperty['key']] = $additionalProperty['value'];
				$modified = $additionalProperty['modified'];
			}
				
			$nameParts = explode('.', $camera['id']);			
			$name = $camera['commonName'].', '.array_pop($nameParts);
			
			$location = [
				'name' => $name,
				'view' => $properties['view'],
				'image' => pathinfo($properties['imageUrl'], PATHINFO_BASENAME),
				'video' => pathinfo($properties['videoUrl'], PATHINFO_BASENAME),
				'lat' => $camera['lat'],					
				'lon' => $camera['lon'],
				'updated_at' => date('Y-m-d H:i:s', strtotime($modified))
			];
						
			if($properties['available'] == 'true')
				$this->saveDataPoint(self::DATASET, $location);						
		}
	}
	
	public function tables($schema)
	{
		// data
		
		$cam = $schema->createTable(self::DATASET.'_location');
		
		$cam->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$cam->addColumn('name', 'string', ['length' => 200]);
		$cam->addColumn('lat', 'float', ['notnull' => false]);
		$cam->addColumn('lon', 'float', ['notnull' => false]);
		$cam->addColumn('view', 'string', ['length' => 100]);
		$cam->addColumn('image', 'string', ['length' => 40]);
		$cam->addColumn('video', 'string', ['length' => 40]);
		$cam->addColumn('updated_at', 'datetime', ['notnull' => false]);
		$cam->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$cam->setPrimaryKey(['id']);		
	}
	
	public function importSome($data)
	{
		$data = $this->fromJson($data);
		
		echo '<p>five random cameras from ', count($data['places']), '</p>';
		
		$count = 0;
		
		echo '<table><tr>';
		
		$indexes = [];
		
		do
		{
			do {
				$index = rand(0, count($data['places']) - 1);
				
				$camera = $data['places'][$index];
				
				$properties = [];			
				foreach($camera['additionalProperties'] as $additionalProperty)
				{
					$properties[$additionalProperty['key']] = $additionalProperty['value'];
					$modified = $additionalProperty['modified'];
				}
					
				$location = [
					'name' => $camera['commonName'],
					'view' => $properties['view'],
					'image' => pathinfo($properties['imageUrl'], PATHINFO_BASENAME),
					'video' => pathinfo($properties['videoUrl'], PATHINFO_BASENAME),
					'lat' => $camera['lat'],					
					'lon' => $camera['lon'],
					'updated_at' => date('Y-m-d H:i:s', strtotime($modified))
				];
				
			} while ($properties['available'] == 'false');
			
			$indexes[] = $index;
						
			echo '<td>',
				'<img width="176" height="144" src="', $properties['imageUrl'], '"><br>',
				'<font size=1>', $camera['id'], '</font></td>';
				
			$this->saveDataPoint(self::DATASET, $location);
			
		} while (count($indexes) < 5);
		
		echo '</tr></table>';		
	}	
}
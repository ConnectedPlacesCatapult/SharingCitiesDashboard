<?php

namespace FCC;

class ApiLink
{
	private $directory;
	private $config;
	
	private $db;
	private $schemaManager;	
	private $schema;
	
	public function __construct($directory)
	{
		$this->directory = $directory;
		
		$this->config = json_decode(file_get_contents($this->directory.'config.json'), true);
		
		$this->db = \Doctrine\DBAL\DriverManager::getConnection(
			['url' => $this->config['database']],
			new \Doctrine\DBAL\Configuration()
		);
		
		$this->schemaManager = $this->db->getSchemaManager();
		
		$this->checkSourceTable();	
		$this->checkSourceApiClasses();
	}
	
	public function checkAllSources()
	{
		$this->msg('check all sources');
		
		$sources = $this->db->fetchAll('SELECT id FROM source ORDER BY id');
			
		foreach($sources as $source)
		{
			try {				
				$this->checkSource($source['id']);
			}
			catch (Exception $e)
			{
				echo 'error: ', $d->getMessage();
			}			
		}
	}
	
	public function checkSourceTable()
	{
		// create "source" table if needed
		
		$tables = $this->schemaManager->listTables();

		$hasSourceTable = false;
		
		foreach($tables as $table)
		{
			//$this->msg($table->getName());
			
			if($table->getName() == 'source')
				$hasSourceTable = true;
		}
				
		if(!$hasSourceTable)
		{
			$schema = new \Doctrine\DBAL\Schema\Schema();
			
			$source = $schema->createTable('source');
	
			$source->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);

			$source->addColumn('interface_class', 'string', ['length' => 40, 'notnull' => true]);

			$source->addColumn('begin_at', 'datetime', ['notnull' => true]);
			$source->addColumn('fetched_at', 'datetime', ['notnull' => false]);
			$source->addColumn('last_fetched_at', 'datetime', ['notnull' => false]);
			
			$source->addColumn('refresh', 'integer', ['notnull' => true]);
			$source->addColumn('endpoint', 'string', ['length' => 200, 'notnull' => true]);
			$source->addColumn('param_sets', 'text', ['notnull' => false]);
		
			$source->setPrimaryKey(['id']);			
			
			$this->applySchema($schema);
		}
	}
	
	private function checkSourceApiClasses()
	{
		// register source classes
		
		$schema = new \Doctrine\DBAL\Schema\Schema();		
		
		$queryBuilder = $this->db->createQueryBuilder();

		$existingSources = $this->db->fetchAll($queryBuilder->select('interface_class')->from('source'));
		
		$existingSourceClasses = [];
		
		foreach($existingSources as $existingSource)
			$existingSourceClasses[] = $existingSource['interface_class'];
						
		$apiClassFiles = scandir(__DIR__.'/Api/');
		
		foreach($apiClassFiles as $apiClassFile)
		{
			if(pathinfo($apiClassFile, PATHINFO_EXTENSION) == 'php')
			{
				$classBaseName = pathinfo($apiClassFile, PATHINFO_FILENAME);
				
				if(!in_array($classBaseName, $existingSourceClasses))
				{
					$interface = $this->createApiClass($classBaseName);
					
					if(is_object($interface))
					{
						// save to source table
						
						$source = $interface->getDefaults();
						
						$source['begin_at'] = date('Y-m-d 0:00:00');
						$source['interface_class'] = $classBaseName;
	
						$this->msg('adding API class: '.get_class($interface));					
							
						// TODO!!!			
						$this->db->insert('source', $source);
						
						// gather tables
						
						if(method_exists($interface, 'tables'))				
							$interface->tables($schema);										
					}						
				}												
			}
		}
				
		// create tables
		
		$this->applySchema($schema);		
	}
	
	public function checkSource($sourceId)
	{
		if(is_numeric($sourceId))
		{
			$source = $this->db->fetchAssoc('SELECT * FROM source WHERE id = :id', ['id' => $sourceId]);
		}
		else
		{
			$source = $this->db->fetchAssoc('SELECT * FROM source WHERE interface_class = :id', ['id' => $sourceId]);
			$sourceId = $source['id'];
		}
		
		$fetchedAt = time();
				
		$age = time() - strtotime($source['fetched_at']);
		
		$expectedAt = $this->getExpectedFetchTime($source);
		
		//var_dump($source);
		//var_dump(date('Y-m-d H:i:s', $expectedAt));
		//exit;
		
		$paramSets = json_decode($source['param_sets'], true);
		if(!is_array($paramSets) || is_array($paramSets) && count($paramSets) == 0)
			$paramSets = [[]];
				
		if($expectedAt < (time() - 10))
		{			
			// change from fetched at to expected at!
			
			$interface = $this->createApiClass($source['interface_class'], $expectedAt);			
								
			foreach($paramSets as $params)
			{
				$endpoint = $source['endpoint'];
				
				foreach($params as $paramName => $paramValue)
					$endpoint = str_replace('$'.$paramName, $paramValue, $endpoint);
					
				if(method_exists($interface, 'import'))
				{
					$response = file_get_contents($endpoint);
					$interface->import($response);					
				}
				else if(method_exists($interface, 'sync'))
				{
					$interface->sync();					
				}
				else
					throw new Exception('no method found');
			}
								
			$this->db->executeQuery('
				UPDATE source
				SET
					last_fetched_at = fetched_at,
					fetched_at = :fetched_at
				WHERE id = :id',
				[
					'id' => $sourceId,
					'fetched_at' => date('Y-m-d H:i:s', $fetchedAt)
				]
			);
			
			$this->msg($source['interface_class'].': updated with '.$interface->getSaveCount().' data points');
		}		
	}

	private function createApiClass($classBaseName, $fetchedAt = null)
	{
		$className = 'FCC\\Api\\'.$classBaseName;
				
		if(class_exists($className))
		{
			if(array_key_exists($classBaseName, $this->config))
				$config = $this->config[$classBaseName];
			else
				$config = [];
								
			$interface = new $className($this->db, $config, $fetchedAt);					
		}
		
		return $interface;
	}
			
	private function applySchema($schema)
	{
		$platform = $this->db->getDatabasePlatform();			
		$queries = $schema->toSql($platform);
		
		foreach($queries as $query)
		{
			$this->msg('query: '.substr($query, 0, 40).'...');
			$this->db->query($query);
		}
	}	
	
	private function getExpectedFetchTime($source)
	{
		$beginAt = strtotime($source['begin_at']);
		
		$lastFetchedAt = strtotime($source['fetched_at']);
				
		$count = floor((time() - $beginAt) / $source['refresh']);
		
		$lastExpected = $beginAt + ($count * $source['refresh']);
		
		if($lastFetchedAt < $lastExpected)
			$nextExpected = $lastExpected;
		else		
			$nextExpected = $lastExpected + $source['refresh'];
		
		return $nextExpected;
	}
	
	private function saveResponse($sourceId, $fetchedAt, $expectedAt, $content)
	{
		$hash = sha1($content);
		
		if(array_key_exists('cache', $this->config) && $this->config['cache']	== true)
		{			
			$weHaveIt = $this->db->doQueryValue('SELECT COUNT(*) FROM response_content WHERE hash = :hash', ['hash' => $hash]);
			
			if($weHaveIt == 0)
				$this->db->doInsert('response_content', ['hash' => $hash, 'content' => $content]);
		}
			
		$this->db->doInsert('source_fetch', [
			'source_id' => $sourceId,
			'fetched_at' => date('Y-m-d H:i:s', $fetchedAt),
			'expected_at' => date('Y-m-d H:i:s', $expectedAt),
			'content_hash' => $hash
		]);
	}
	
	private function msg($message)
	{
		echo date('H:i:s'), ': ', $message, (php_sapi_name() == 'cli') ? "\n" : '<br>';
	}
	
	public function timingTest()
	{
		$sources = $this->db->doQuery('SELECT id, name, refresh, fetched_at, begin_at FROM source ORDER BY id');
		
		echo '<h4>time is ', date('Y-m-d H:i:s'), '</h4>';
		
		foreach($sources as $source)
		{
			echo '<p><b>', $source['name'], '</b>: ';
			
			$beginAt = strtotime($source['begin_at']);
			
			$now = time();
			
			$count = floor(($now - $beginAt) / $source['refresh']);
			
			$lastExpected = $beginAt + ($count * $source['refresh']);
			
			$nextExpected = $lastExpected + $source['refresh'];
			
			echo 'refresh every ', $source['refresh'], 's, ', $count, ' already, last had to be at ',
				date('Y-m-d H:i:s', $lastExpected), ' next at ', date('Y-m-d H:i:s', $nextExpected), '<br>';
			
			
			echo '</p>';
			/*
			var_dump($now - $beginAt);
			
			$next = date('Y-m-d H:i:s', $beginAt + floor(($now - $beginAt) / $source['refresh']));
			
			var_dump($source);
			
			var_dump($next);
			*/
		}
	}	
}

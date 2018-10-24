<?php

namespace FCC;

class Flatten
{
	private $db;
	
	private $attributes;
	private $locations;
	
	private $buffer;
	
	private $recordCount;
	private $flatItemCount;
	
	public function __construct($db)
	{
		$this->db = $db;
		
		$this->lookup = [];		
	}

	public function flattenTable($table)
	{
		$startTime = microtime(true);
		
		$fields = $this->db->doQuery('DESCRIBE '.$table);
				
		$this->recordCount = 0;
		$this->flatItemCount = 0;
		
		$query = 'SELECT * FROM '.$table;
		$data = $this->db->doQuery($query);

		$this->db->beginTransaction();
		
		foreach($data as $row)
		{
			$flatBase = [
				'location_id' => $this->lookup('location', $table, $row['location_id']),
				'current_at' => $row['current_at']
			];
			
			foreach($row as $field => $value)
			{
				$flat = $flatBase;
				
				if($field != 'location_id' && $field != 'current_at' && $value != null)
				{
					$flat['attribute_id'] = $this->lookup('attribute', $table, $field);
					$flat['data'] = $value;
					
					$this->save($flat);
				}				
			}
			
			$this->recordCount++;
		}
		
		$this->reallySave();
				
		$this->db->commit();
		
		$runTime = microtime(true) - $startTime;
		$recordPerSec = $this->recordCount / $runTime;
		$flatItemPerSec = $this->flatItemCount / $runTime;
		
		echo $table, ' (', count($fields), ' fields): ', $this->recordCount, ' records (', round($recordPerSec), '/s) flattened to ',
			$this->flatItemCount, ' items (', round($flatItemPerSec), '/s) in ', round($runTime, 3), "s\n";		
	}
	
	private function save($flat)
	{
		$this->buffer[] = $flat;
		
		$this->flatItemCount++;
		
		if(count($this->buffer) > 2000)
			$this->reallySave();
	}
	
	private function reallySave()
	{
		$query = "INSERT INTO flat_data (location_id, attribute_id, current_at, data) VALUES\n";
		
		foreach($this->buffer as $index => $row)
		{
			$element = '  ('.$row['location_id'].', '.$row['attribute_id'].', "'.$row['current_at'].'", "'.$row['data'].'")';
			
			if($index == 0)
				$query .= $element;
			else
				$query .= ",\n".$element;
		}
		
		$this->buffer = [];
		
		$this->db->doExec($query);
	}
	
	private function lookup($thing, $table, $name)
	{
		$lookupName = $table.'.'.$name;
		
		if(array_key_exists($thing, $this->lookup) && array_key_exists($lookupName, $this->lookup[$thing]))
		{
			$lookupId = $this->lookup[$thing][$lookupName];		
		}
		else
		{
			$lookupId = $this->db->doInsertOrLookupAutoId('flat_'.$thing, 'id', ['name'], ['name' => $lookupName]);
			$this->lookup[$thing][$lookupName] = $lookupId;
		}
		
		return intval($lookupId);		
	}
}
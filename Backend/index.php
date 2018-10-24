<?php

require(__DIR__.'/vendor/autoload.php');

require(__DIR__.'/JsonStreamMagic.php');
require(__DIR__.'/ArrayMagic.php');
require(__DIR__.'/Magic.php');

ini_set('xdebug.var_display_max_depth', 7);

$config = json_decode(file_get_contents(__DIR__.'/config.json'), true);

if(isset($_GET['pgsql']) || isset($argv) && in_array('pgsql', $argv))
{
	$db = new \DbEx\PDOEx('pgsql:host=localhost;dbname=fcc',
		'fcc', 'fccmagic777');
	
	var_dump($db);
	
	exit;
}


$db = new \DbEx\PDOEx($config['database']['connection'],
	$config['database']['user'],$config['database']['password']);

// flatten

if(isset($_GET['flatten']) || isset($argv) && in_array('flatten', $argv))
{
	$api = new FCC\Flatten($db);

	
	
	$api->createTables($config['database']);
	
	exit;

	$db->doExec('truncate flat_data');

	$api->flattenTable('weather');
	$api->flattenTable('weather_forecast');
	$api->flattenTable('milan_lampione');
	
	exit;
}

// play with Lisbon data

if(isset($_GET['lisbon']) || isset($argv) && in_array('lisbon', $argv))
{				
	$api = new FCC\Lisbon($db, $config['lisbon']);	
	$api->subscribe();	
	exit;
}

// play with London data

if(isset($_GET['london']) || isset($argv) && in_array('london', $argv))
{	
	$api = new FCC\London($db, $config['london']);
	$api->sync();	
	exit;
}

// play with Milan data

if(isset($_GET['milan']) || isset($argv) && in_array('milan', $argv))
{	
	$api = new FCC\MilanSmartcity($db, $config['milan']);
	$api->sync();	
	exit;
}

// generic data parser

$dataDir = __DIR__.'/data/';

if(isset($_GET['file']) && file_exists($dataDir.$_GET['file'].'.json'))
{
	$hintFile = $dataDir.'hint/'.$_GET['file'].'.json';
	
	if(array_key_exists('clearmap', $_GET))
	{
		if(file_exists($hintFile))
			unlink($hintFile);
			
		exit;
	}
	
	$hints = json_decode(file_get_contents('php://input'), true);
		
	if(!is_array($hints))
	{
		if(file_exists($hintFile))
			$hints = json_decode(file_get_contents($hintFile), true);
		else
			$hints = [];			
	}
	
	//var_dump($hints);
	
	$includeUI = (count($_GET['refresh']) == 0);	
	
	if($includeUI)
	{
?>
<html>
	<head>
		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>		
		<script src="ui.js"></script>
	</head>	
	<body>
<?php
	}
	
	$data = json_decode(file_get_contents($dataDir.$_GET['file'].'.json'), true);
	
	$magic = new Magic();
	$table = $magic->parse($data, $hints, $includeUI);
	$magic->dumpTable($table);
	
	if(!$includeUI)
		$magic->createTable('data_'.$_GET['file']);
	
	// save mapping
	
	if(array_key_exists('savemap', $_GET))
		file_put_contents($hintFile, json_encode($magic->getHints(), JSON_PRETTY_PRINT));
	
	if($includeUI)
	{
?>

	</body>
</html>
<?php
	}
}
else
{	
	$files = scandir($dataDir);
	
	echo '<h3>files</h3><ul>';
	
	foreach($files as $fileName)
		if(pathinfo($fileName, PATHINFO_EXTENSION) == 'json')
			echo '<li><a href="?file=', pathinfo($fileName, PATHINFO_FILENAME), '">', $fileName, '</a></li>';
			
	echo '</ul>';			
}

?>

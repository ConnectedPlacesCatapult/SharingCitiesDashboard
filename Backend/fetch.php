<?php

require(__DIR__.'/vendor/autoload.php');

$link = new \FCC\ApiLink(__DIR__.'/');

//$link->checkSource('TflCarpark');
//exit;

$link->checkAllSources();	
exit;

if(php_sapi_name() == 'cli')
	$link->checkAllSources();
else
	$link->checkSource(10);	

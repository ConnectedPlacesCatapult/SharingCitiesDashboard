<?php

namespace FCC\Api;

use FCC\Source;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Client;

class LisbonAltice extends Source
{
	/*
	
	curl -H 'Authorization: Bearer skr5hepp0fvii4c6e9du0ohr4jumda54ipdug44omt9bt3st9q4t'
		-XGET https://iot.alticelabs.com/api/devices/2468

	*/
	
	private $http;
	private $lastRequest;
	
	public $exampleDeviceIDs = [
		'emelcn-983' => '30+Bici',
		'emelpz-41399' => 'Parking Zone',
		'emelcn-923' => 'Pista Ciclável Bidirecional',
		'emelcn-992' => 'Pistas Cicláveis Unidirecionais',
		'emelcn-697' => 'Trilho',
		'emelcn-803' => 'Percurso Ciclopedonal',
		'emelgs-490' => 'Gira Station',
		'emelcn-2765' => 'Faixas Cicláveis ou Contrafluxos',
		'emelcn-2723' => 'Zona de Coexistência',
		'sequence_generator-emel' => 'sequence_generator',
		'8f57c4c0-626d-40aa-bc86-c4af04e637f7' => 'Traffic Closure',
		'alert_generator-emel' => 'alert_generator',
		'4af69935-0475-42f2-b52f-99e34ee55db9' => 'Gira Statistics',
		'aef870c5-4d99-b7a5-80a99f1e5148' => 'Traffic Waze',
	]; 
	
	public function __construct($db, $config, $fetchedAt)
	{
		parent::__construct($db, $config, $fetchedAt);

		$this->lastRequest = 0;
						
		$this->http = new Client([
			'base_uri' => 'https://iot.alticelabs.com',
			'headers' => ['Authorization' => 'Bearer '.$this->config['user_token']]
		]);
		
		//$this->renew(); exit;		
	}
	
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 300,
			'endpoint' => 'https://iot.alticelabs.com/api/'
		]);
	}
	
	public function sync()
	{
		
	}
	
	public function subscribe()
	{
		// create "all" filter
		
		$filter = [
			'name' => 'All devices',
			'description' => 'List of all devices created by EMEL, essentially all',
			'labels' => [
				'CreatedBy' => 'EMEL'
			]
		];
		
		//$result = $this->post('/api/filters', $filter);
		//var_dump($result);
		
		// create device set
		
		$set = [
			'name' => 'All devices #2',
			'description' => 'List of all devices created by EMEL, essentially all',
			'filters' => ['40033614-fe95-4e24-8df8-48111f086fdc']
		];
		
		//$result = $this->post('/api/devicesets', $set);
		//var_dump($result);

		//var_dump($this->get('/api/devicesets'));
				
		//$this->delete('/api/devicesets/a86d52d2-81c9-4486-9b57-49bbf5f0f391');
		//$this->delete('/api/devicesets/c83c369b-a801-436c-a9be-b19d3568b253');

		//var_dump($this->get('/api/devicesets'));

		//$this->put('/api/devicesets/3aaf49ff-aa93-49d4-ac9a-c312e1737bdf/refresh');
		
		//$devices = $this->get('/api/devicesets/3aaf49ff-aa93-49d4-ac9a-c312e1737bdf/devices');		
		//var_dump($devices);
		
		$subscriberSecret = sha1('hello-fcc-scubscriber-magic-2018');
		
		var_dump($subscriberSecret);
		
		$subscriber = [
			'id' => 'fcc_subscriber',
			'secret' => $subscriberSecret,
			'name' => 'FCC Subscriber Device',
			'description' => 'FCC Subscriber Device, only used when subscribing EMEL owned device streams',
			'labels' => [
				'CreatedBy' => 'FCC'
			]
		];
		
		$subscriberToken = $this->getDeviceToken('fcc_subscriber', $subscriberSecret);		
		var_dump($subscriberToken);
				
		//$result = $this->post('/api/devices', $subscriber);
		//var_dump($result);		
		
		// create subscriber device
		
		// subscriptions
		
		$subscription = [
			'name' => 'FCC subscription to EMEL',
			'description' => 'FCC subscription to all devices created by EMEL',
			'subscriber_id' => 'fcc_subscriber',
			'device_set_id' => '3aaf49ff-aa93-49d4-ac9a-c312e1737bdf',			
			'retention_count' => 1000,
			'retention_time' => 36000,
			'retries' => 10			
		];
		
		/*
		echo '<pre>', json_encode($subscription, JSON_PRETTY_PRINT), '</pre>';		
		$result = $this->post('/api/subscriptions', $subscription);
		var_dump($result);
		*/
		
		// subscription id: 3d767898-0516-4d2e-b6de-33956f84a309, 4daef3d5-61f4-4382-9a9b-a8495a34d079
		
		
		
		//echo '<pre>', json_encode($subscription, JSON_PRETTY_PRINT), '</pre>';
		
		//$result = $this->get('/api/subscriptions');
		//var_dump($result);
		
		
		var_dump($this->get('/api/subscriptions/4daef3d5-61f4-4382-9a9b-a8495a34d079'));		

		/*		
		file_put_contents('/var/www/squirrelboard/data/LisbonSubscription.json',
			json_encode($result, JSON_PRETTY_PRINT));
		*/

		//$values = $this->get('/api/subscriptions/4daef3d5-61f4-4382-9a9b-a8495a34d079/values');
		
		$values = $this->getWithToken('/api/subscriptions/4daef3d5-61f4-4382-9a9b-a8495a34d079/values',
			$subscriberToken);

		var_dump($values);
		
		file_put_contents('/var/www/squirrelboard/data/LisbonValues'.time().'.json',
			json_encode($values, JSON_PRETTY_PRINT));
		
	}
	
	public function show()
	{
		$devices = $this->db->doQuery('
			select max(id) id, name, count(*) cnt 
			from lisbon_device 
			group by name 
			order by cnt desc
		');
		
		foreach($devices as $device)
		{
			//if($device['name'] != 'Traffic Closure')
			//	continue;
			
			echo '<h3>', $device['name'], '</h3>';

			$detail = $this->get('/api/devices/'.$device['id']);
						
			var_dump($detail);
			
			if(is_array($detail['stream_list']))
			{
				foreach($detail['stream_list'] as $stream)
				{
					echo '<h4>', $device['name'], '/', $stream['name'], '</h4>';

					$streamValues = $this->get('/api/devices/'.$device['id'].'/streams/'.$stream['name'].'/values');
					
					//var_dump($streamValues);
					
					if(is_array($streamValues['values']))
					{
						foreach($streamValues['values'] as $value)
						{
							var_dump($value['timestamp']);
							echo '<p>', $value['value'], '</p>';
						}
					}
				}
			}
			
			echo '<h>';
		}
	}
	
	public function update()
	{
	
		//var_dump($this->getDeciceStream('4af69935-0475-42f2-b52f-99e34ee55db9', 'GiraStatistics'));
		//exit;
		
		//$this->getAllDevices();
		
		//$this->updateAllDevices();
		
		//var_dump($this->get('/api/devices/619/streams/CyclingNetworkSituation/values'));
		
		//var_dump($this->getDeciceStream('619', 'CyclingNetworkSituation'));
		
		// Gira Statistics
		/*

		{
			total_use: '393',
			total_use_members: '3923',
			total_routes: '3937',
			average_transitions: '16.22',
			average_distance: '21',
			total_distance: '122',
			most_used_period: {
				"start": "08:00:00",
				"end": "09:00:00"
			},
			total_users: '391233',
			most_used_station: 'Dummie Station',
			total_calories: '3562',
			total_savings: '34',
			total_co2: '3600'
		}

		*/

		var_dump($this->getDeciceStream('4af69935-0475-42f2-b52f-99e34ee55db9', 'GiraStatistics'));

		// Percurso Ciclopedonal {"descricao_situacao":"Executado","descricao":"Existente"}
		//var_dump($this->get('/api/devices/402/streams/CyclingNetworkSituation/values'));
		
		// Traffic Closure
		/*

		{
			"geometry": {
				"coordinates": [
					[
						[-9.13749333, 38.7314156],
						[-9.13728412, 38.73139676]
					]
				],
				"type": "MultiLineString"
			},
			"type": "Feature",
			"properties": {
				"motivo": "RESERVA DE ESTACIONAMENTO",
				"estado": "APROVADO",
				"bbox": [-9.13749333, 38.73139676, -9.13728412, 38.7314156],
				"creation_date": "2018-08-07T15:51:45Z",
				"restricao_circulacao": "Estacionamento",
				"closure_id": "COND-2018-6027-33",
				"impacto": "Relevante",
				"local_referencia": null,
				"pedido": "COND-2018-6027",
				"lastmod_date"		
		*/
		
		//var_dump($this->getDeciceStream('8f57c4c0-626d-40aa-bc86-c4af04e637f7', 'trafficClosureStream'));
		
	}
	
	public function updateAllDevices()
	{		
		$devices = $this->db->doQuery('
			select id
			from lisbon_device 
		');		
				
		foreach($devices as $device)
		{
			echo 'getting id ', $device['id'], "\n";
			
			$detail = $this->get('/api/devices/'.$device['id']);
			
			//echo '<h4>', $detail['stream_list'][0]['name'], '</h4>';
						
			$this->db->doQuery('UPDATE lisbon_device SET detail = :detail WHERE id = :id',
				[
				 'id' => $device['id'],
				 'detail' => json_encode($detail)
				]
			);			
		}
	}
	
	public function getAllDevices()
	{
		$offset = 0;
		
		do {
			
			echo 'offset: ', $offset, "\n";
			
			$data = $this->get('/api/devices?offset='.$offset.'&limit=100');
			
			$gotDevices = (is_array($data['devices']) && count($data['devices']) > 0);
			
			if($gotDevices)
			{
				echo 'got ', count($data['devices']), " devices\n";
				
				foreach($data['devices'] as $device)
				{				
					$this->db->doQuery('INSERT INTO lisbon_device (id, data, name) VALUES (:id, :data, :name)
						ON DUPLICATE KEY UPDATE data = VALUES(data), name = VALUES(name), hit_count = hit_count + 1',
						[
						 'id' => $device['id'],
						 'data' => json_encode($device),
						 'name' => $device['name']
						]
					);
				}
			
			}
			
			$offset += 100;
			
		} while ($gotDevices);
	}
	
	public function getDeciceStream($device, $stream)
	{
		$uri = '/api/devices/'.$device.'/streams/'.$stream.'/values';
		
		echo '<h4>', $uri, '</h4>';
		
		$stream = $this->get($uri);

		echo '<pre>', $stream['values'][0]['value'], '</pre>';
		
		var_dump($stream);
		
		//return $stream['values'];
		
		return json_decode($stream['values'][0]['value'], true);
	}
	
	public function get($uri)
	{		
		$this->waitIfNeeded();

		$response = $this->http->get($uri);
		
		return json_decode($response->getBody(), true);
	}

	public function getWithToken($uri, $token)
	{
		var_dump($token);
		
		$this->waitIfNeeded();

		$response = $this->http->get($uri, ['headers' => ['Authorization' => 'Bearer '.$token]]);
		
		return json_decode($response->getBody(), true);
	}
	
	public function put($uri)
	{		
		$this->waitIfNeeded();

		$response = $this->http->put($uri);
		
		return json_decode($response->getBody(), true);
	}
	
	public function post($uri, $data)
	{
		$this->waitIfNeeded();
		
		$response = $this->http->post($uri, [
			'json' => $data
		]);
		
		return json_decode($response->getBody(), true);
	}
	
	public function delete($uri)
	{
		$this->waitIfNeeded();

		$this->http->delete($uri);
	}	
	
	public function get_OLD($uri)
	{		
		try {
			$this->waitIfNeeded();
			$response = $this->http->get($uri, ['headers' => ['Authorization' => 'Bearer '.$this->config['token']]]);
		}
		catch (ClientException $e)
		{
			$code = $e->getResponse()->getStatusCode();
			
			if($code == 401)
			{				
				$this->renew();
				
				$this->waitIfNeeded();
				$response = $this->http->get($uri, ['headers' => ['Authorization' => 'Bearer '.$this->config['token']]]);				
			}
			else
				throw $e;			
		}
		
		return json_decode($response->getBody(), true);
	}
	
	private function waitIfNeeded()
	{
		// otherwise: `429 Too Many Requests` response: {"message":"API rate limit exceeded"}
		
		$sleepNeeded = microtime(true) - $this->lastRequest - 0.5;
				
		if($sleepNeeded < 0)
		{
			//var_dump('sleep '.$sleepNeeded);
			
			usleep(abs($sleepNeeded) * 1000000);
		}
			
		$this->lastRequest = microtime(true);
	}
	
	public function renew()
	{
		$this->waitIfNeeded();
		
		$response = $this->http->request('POST', '/api/accounts/token', [
			'auth' => [
        $this->config['user'], 
        $this->config['password']
			],
			'form_params' => [
        'grant_type' => 'client_credentials'
	    ]			
		]);
		
		$this->config['user_token'] = (string)$response->getBody();
		
		var_dump($this->config['user_token']);
	}
	
	public function getDeviceToken($deviceId, $deviceSecret)
	{		
		$this->waitIfNeeded();
		
		$response = $this->http->request('POST', '/api/devices/token', [
			'auth' => [
        $deviceId, 
        $deviceSecret
			],
			'form_params' => [
        'grant_type' => 'client_credentials'
	    ]			
		]);
		
		return (string)$response->getBody();
	}
}
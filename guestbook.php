<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'Predis/Autoloader.php';

Predis\Autoloader::register();

if (isset($_GET['cmd']) === true) {
  $host = getenv('REDIS_HOST')?:"redis";
  $port = getenv('REDIS_PORT')?:"6379";
  $password = getenv('REDIS_PASSWORD');
  $client = new Predis\Client([
    'scheme'   => 'tcp',
    'host'     => $host,
    'port'     => $port,
    'password' => $password,
  ]);
  header('Content-Type: application/json');
  if ($_GET['cmd'] == 'set') {
    $client->set($_GET['key'], $_GET['value']);
    print('{"message": "Updated"}');
  } else if ($_GET['cmd'] == 'get') {
    $value = $client->get($_GET['key']);
    print('{"data": "' . $value . '"}');
  } else { // assume getall
    // a fairly poor performing impl but we want to just use multiple keys
    // for the guestbook to have data span across shards
    $value = "";
    foreach (new Predis\Collection\Iterator\Keyspace($client, ($_GET['key'])) as $key) {
      $value = $value . ',' . $client->get($key);
    }
    print('{"data": "' . $value . '"}');
  }
} else {
  phpinfo();
} ?>

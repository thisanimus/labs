<?php

function fetchRegionData($zip){
	$json = file_get_contents('https://api.zippopotam.us/us/'.$zip);
	$region = json_decode($json);
	return $region;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$zip = filter_var ( $_POST["zip"], FILTER_SANITIZE_STRING);
}else{
	$zip = '90210';
}

$region = fetchRegionData($zip);

?>
<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Zip Code</title>
	<meta name="description" content="A frontend dev aptitude test by Deep Space Robots.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="reset.css">
	<link rel="stylesheet" href="style.css">
</head>
<body>
	
	<div class="location-card">
		<div class="output">
			<div class="state">
				<div class="img-wrapper">
				<img src="states/<?= $region->places[0]->{'state abbreviation'}; ?>.svg"/>
				</div>
				<div class="label">state</div>
				<h2 class="title"><?= $region->places[0]->state; ?></h2>
			</div>
			<div class="city">
				<div class="label">city</div>
				<h3 class="title"><?= $region->places[0]->{'place name'}; ?></h3>
			</div>
			<div class="geo">
				<div class="label">geolocation</div>
				<h4><span class="label">lat:</span> <span id="lat"><?= $region->places[0]->latitude; ?></span></h4>
				<h4><span class="label">lng:</span> <span id="lng"><?= $region->places[0]->longitude; ?></span></h4>
			</div>
		</div>
		<form method="post" name="zipForm" action="<?= htmlspecialchars($_SERVER[" PHP_SELF "]);?>">
			<div class="form-context">
				<p>Enter a zipcode to get details about its location.</p>
				<label for="zip" class="hidden">Zip</label>
			</div>
			<div class="form-inline">
				<input name="zip" type="text" value="90210" /><button>Find</button>
			</div>
		</form>

	</div>
</body>
</html>


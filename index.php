<?php
function animus_get_page_meta( $url, $specificTags=0 ){
    $doc = new DOMDocument();

    @$doc->loadHTML(file_get_contents($url));
    $res['title'] = $doc->getElementsByTagName('title')->item(0)->nodeValue;
	$res['url'] = '/'.basename(dirname($url));
	$res['modified'] = date ("F d Y H:i:s.", filemtime($url));

    foreach ($doc->getElementsByTagName('meta') as $m){
        $tag = $m->getAttribute('name') ?: $m->getAttribute('property');
        if(in_array($tag,['description','keywords']) || strpos($tag,'og:')===0) $res[str_replace('og:','',$tag)] = $m->getAttribute('content');
    }
    return $specificTags? array_intersect_key( $res, array_flip($specificTags) ) : $res;
}
$labs = [];
$dir = new DirectoryIterator(dirname(__FILE__));
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot() && $fileinfo->isDir()) {
		$file = false;
		if(is_file ( $fileinfo->getPathname() . '/index.html' )){
			$file = $fileinfo->getPathname() . '/index.html';
		}elseif(is_file ( $fileinfo->getPathname() . '/index.php' )){
			$file = $fileinfo->getPathname() . '/index.php';
		}
		if($file){
			$labs[] = animus_get_page_meta($file);
		}

    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Labs</title>
	<meta content="Little experiments with HTML, CSS and JS that are just too fun to push to prod." name="description">
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<meta content="https://labs.thisanimus.com/offset/assets/og.jpg" property="og:image">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">

	<link href="assets/style.css" rel="stylesheet">
</head>
<body>
<h1>Labs</h1>
<ul class="labs-list">
	<?php foreach ($labs as $lab): ?>
		<li>
			<a href="<?= $lab['url'] ?>">
				<?= $lab['title'] ?>
			</a>
		
		</li>
	<?php endforeach; ?>
</ul>
</pre>
</body>
</html>
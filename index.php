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

function animus_format_bytes($bytes, $precision = 2) { 
    $units = array('B', 'KB', 'MB', 'GB', 'TB'); 

    $bytes = max($bytes, 0); 
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
    $pow = min($pow, count($units) - 1); 

    // Uncomment one of the following alternatives
    $bytes /= pow(1024, $pow);
    // $bytes /= (1 << (10 * $pow)); 

    return round($bytes, $precision) . ' ' . $units[$pow]; 
} 

function animus_get_lab_size($path){
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($path)
	);
	
	$bytes = 0;
	foreach ($iterator as $file) {
		$bytes += $file->getSize();
	}
	$totalSize = animus_format_bytes($bytes);
	return $totalSize;
}
$labs = [];

$dir = new DirectoryIterator(dirname(__FILE__));
foreach ($dir as $fileinfo) {
	$totalSize = 0;
    if (!$fileinfo->isDot() && $fileinfo->isDir()) {
		$file = false;
		if(is_file ( $fileinfo->getPathname() . '/index.html' )){
			$file = $fileinfo->getPathname() . '/index.html';
		}elseif(is_file ( $fileinfo->getPathname() . '/index.php' )){
			$file = $fileinfo->getPathname() . '/index.php';
		}
		if($file){
			$lab = animus_get_page_meta($file);
			$labMeta = [
				'size'=>animus_get_lab_size($fileinfo->getPathname()),
				'modified'=>date('Y-m-d H:i:s', $fileinfo->getMTime()),
				'filetype'=>'.'.pathinfo($file, PATHINFO_EXTENSION)
			];
			$lab['meta'] = $labMeta;
			$labs[] = $lab;
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
	<link rel="preconnect" href="https://fonts.googleapis.com"> 
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
	<link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap" rel="stylesheet">
	<link href="assets/reset.css" rel="stylesheet">
	<link href="assets/style.css" rel="stylesheet">
</head>
<body>
	<main class="crt">
		<section class="section labs">
			<h1>Labs</h1>
			<ul class="labs-list">
				<?php foreach ($labs as $lab): ?>
					<li class="lab">
						<a class="lab-link" href="<?= $lab['url'] ?>">
							<div class="lab-image">
								<div class="image-overlay magenta-overlay">
									<img class="lab-image" src="<?= $lab['image'] ?>" alt="<?= $lab['title'] ?>"/> 
								</div>
								<div class="image-overlay cyan-overlay">
									<img class="lab-image" src="<?= $lab['image'] ?>" alt="<?= $lab['title'] ?>"/> 
								</div>
								<img class="color-image" src="<?= $lab['image'] ?>" alt="<?= $lab['title'] ?>"/>
							</div>
							
							<h2 class="lab-title"><?= $lab['title'] ?></h2>
							<p class="lab-description"><?= $lab['description'] ?></p>
							<ul class="lab-meta">
								<?php foreach($lab['meta'] as $k=>$v):?>
									<li>
										<div class="meta-name"><?= $k ?></div>
										<div class="spacer"></div>
										<div class="meta-value"><?= $v ?></div>
									</li>
								<?php endforeach ?>
							</ul>
						</a>
					
					</li>
				<?php endforeach; ?>
			</ul>
		</section>
	</main>
</body>
</html>
<?php

$xml = "<root>&amp;</root>";

$xmldoc = @domxml_open_mem($xml,DOMXML_LOAD_PARSING,$error);

echo "<pre>";� � # Just for nice layout
foreach ($error as $errorline) {� � # Loop through all errors
�� echo $errorline['errormessage'];
�� echo " Node� : " . $errorline['nodename'] . "\n";
�� echo " Line� : " . $errorline['line'] . "\n";
�� echo " Column : " . $errorline['col'] . "\n\n";
}

?>

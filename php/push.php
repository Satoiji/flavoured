<?php 
exec("cd ../");
exec("git add .");  
exec("git commit -m 'emergency commit'");
exec("git push");
echo "emergency push to github" >> push.log;

?>
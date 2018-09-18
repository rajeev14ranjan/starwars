<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once './database.php';
include_once './logs.php';
 
// instantiate database and Logs object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$logs = new Logs($db);
 
// query Logss
$stmt = $logs->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // Logss array
    $Logss_arr=array();
    $Logss_arr["logs"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $Logs_item=array(
            "userid" => $userid,
            "username" => $username,
            "fullname" => $fullname,
            "timestamp" => $timestamp,
            "useragent" => $useragent,
            "score" => $score
        );
 
        array_push($Logss_arr["logs"], $Logs_item);
    }
    echo json_encode($Logss_arr);
}
 
else{
    echo json_encode(
        array("message" => "No Logs found+")
    );
}
?>
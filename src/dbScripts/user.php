<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once './database.php';
include_once './users.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$users = new Users($db);
 
// query products
$stmt = $users->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found

    // products array
    $products_arr=array();
    $products_arr["users"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $product_item=array(
            "userid" => $userid,
            "username" => $username,
            "fullname" => $fullname,
            "access" => $access,
            "data" => $data
        );
 
        array_push($products_arr["users"], $product_item);
    }
 
    echo json_encode($products_arr);

 

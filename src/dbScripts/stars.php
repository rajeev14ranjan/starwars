<?php

include("./connection.php");
$db = new dbObj();
$connection =  $db->getConnstring();

$request_method=$_SERVER["REQUEST_METHOD"];

switch($request_method){
case 'GET':
    if(!empty($_GET["a"]) && !empty($_GET["key"])){
        handle_get_request($_GET["a"], $_GET["key"]);
    } else {
        header("HTTP/1.0 405 Method Not Allowed");
    }
    break;
case 'POST':
        handle_post_request();
    break;
default:
        // Invalid Request Method
        header("HTTP/1.0 405 Method Not Allowed");
    break; 
}

//Function to validate client key against server key 
function validate_Key($client_keyhex){
    $server_key = date("U");
    $client_key = base_convert($client_keyhex, 36, 10);
    
    $t_difference = $server_key - $client_key;
    if($t_difference >= 0 and $t_difference <= 50){
        return true;
    } else {
        return false;
    }
}

//-------------- GET Methods --------------
function handle_get_request($action,$key){
    if(!validate_Key($key)){
        header('Content-Type: application/json');
        $response=array(
            'error' => 'Invalid Key',
            'message' =>'No standalone acess to API.'
        );
        echo json_encode($response);
    } else {

        switch($action){
            case 'score':
                getHighScore();
                break;
            case 'getUser':
                get_users();
                break;
            case 'getLogs':
                get_logs();
                break;
            case 'getFeedback':
                get_feedback();
                break;
            case 'getUserScore':
                get_user_score();
                break;
            default:
                // Invalid Request Method
                header("HTTP/1.0 405 Method Not Allowed");
            break; 
            }
        }
}

function get_users(){
    global $connection;
    $query="SELECT userid,username,fullname,access,data,authkey FROM usertb";
    $id = mysqli_real_escape_string($connection,$_GET["id"]);
    if(!empty($id))
    {
        $query = $query . " WHERE userid=" .$id. " OR username=".$id." LIMIT 1";
    }
    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function get_feedback(){
    global $connection;
    $query="SELECT logid, userid, timestamp, useragent, rating, feedback FROM feedbacktb";
    $id = mysqli_real_escape_string($connection,$_GET["id"]);
    if(!empty($id))
    {
        $query = $query . " WHERE userid = " .$id ;
    }
    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function get_logs(){
    global $connection;
    $id= mysqli_real_escape_string($connection,intval($_GET["id"]));

    $query="SELECT l.userid,u.fullname,l.timestamp,l.useragent,l.score,l.screen FROM loginlogs l left join usertb u on l.userid = u.userid where l.userid = ". $id ." order by l.logid desc";

    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}


function getHighScore(){
    global $connection;
    $query="SELECT l.timestamp,l.score FROM loginlogs l order by l.score desc LIMIT 1";
    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function get_user_score(){
    global $connection;
    $uid = mysqli_real_escape_string($connection,intval($_GET["uid"]));
    $game = mysqli_real_escape_string($connection,$_GET["game"]);
    $query="SELECT * FROM scoretb WHERE userid = ".$uid." AND game = '" .$game. "'";
    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}



//-------------- POST Methods ------------

function handle_post_request(){
    $data = json_decode(file_get_contents('php://input'), true);
    $key = $data["key"];
    if(!validate_Key($key)){
        header('Content-Type: application/json');
        $response=array(
            'error' => 'Invalid Key',
            'message' =>'No standalone acess to API.'
        );
        echo json_encode($response);
    } else {

    $action = $data["action"];
    switch($action){
        case 'createUser':
            create_user($data);
            break;
        case 'login':
            validate_login($data);
            break;
        case 'validate':
            validate_user($data);
            break;
        case 'deleteUser':
            delete_user($data);
            break;
        case 'insertLog':
            insert_Log($data);
            break;
        case 'feedback':
            save_feedback($data);
            break;
        case 'saveScore':
            save_score($data);
            break;
        default:
            // Invalid Request Method
            header("HTTP/1.0 405 Method Not Allowed");
        break; 
        }
    }
}
        
    

function create_user($data){

    global $connection;

    $fn = mysqli_real_escape_string($connection,$data["fn"]);
    $un = mysqli_real_escape_string($connection,$data["un"]);
    $pw = mysqli_real_escape_string($connection,$data["pw"]);
    
    $query="INSERT INTO usertb SET username='".$un."', fullname='".$fn."', password='".$pw."'";

    if(mysqli_query($connection, $query))
    {
        $response=array(
            'status' => 1,
            'status_message' =>'Sign Up Successful.'
        );
    }
    else
    {
        $response=array(
            'status' => 0,
            'status_message' =>'User Sign Up Failed.'
        );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function validate_login($data){
    global $connection;
    
    $un = mysqli_real_escape_string($connection,$data["un"]);
    $pw = mysqli_real_escape_string($connection,$data["pw"]);

    $query="SELECT userid, username, fullname, access, data, authkey FROM usertb WHERE username = '". $un."' and password = '".$pw ."' LIMIT 1";

    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function validate_user($data){
    global $connection;

    $un = mysqli_real_escape_string($connection,$data["un"]);

    $query="SELECT fullname FROM usertb WHERE username = '". $un."' LIMIT 1";
    $response=array();
    $result=mysqli_query($connection, $query);
    while($row=mysqli_fetch_assoc($result))
    {
        $response[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function delete_user($data){
    global $connection;
    
    $usr = mysqli_real_escape_string($connection,$data['usr']);
    $uid = mysqli_real_escape_string($connection,$data['uid']);

    if(!empty($usr) && !empty($uid)){

        $response=array(
            'status' => 0,
            'status_message' =>'Not Authorize to delete users.'
        );

        $delQuery = $uid > 2? "DELETE FROM usertb WHERE username = '". $usr."' AND userid = ". $uid."; " : "";
        $delQuery .= "DELETE FROM loginlogs WHERE userid = ". $uid."";

        if(mysqli_query($connection, $delQuery))
        {    $response=array(
                'status' => 1,
                'status_message' =>'User deleted Successfully.'
                );
        }

        header('Content-Type: application/json');
        echo json_encode($response);

    } else {
        header("HTTP/1.0 405 Method Not Allowed");
    }
}

function insert_Log($data){
    global $connection;
    $logid = mysqli_real_escape_string($connection,$data["logid"]);
    $uid =   mysqli_real_escape_string($connection,$data["id"]);
    $sc  =   mysqli_real_escape_string($connection,$data["sc"]);
    $ua  =   mysqli_real_escape_string($connection,$data["ua"]);
    $scr  =  mysqli_real_escape_string($connection,$data["scr"]);
    $ts  = date('D M d Y H:i:s O');
    
    $query = "INSERT INTO loginlogs (logid, userid,timestamp,useragent,screen,score) VALUES ('".$logid ."','".$uid ."','".$ts ."','".$ua ."','".$scr ."','".$sc ."') ON DUPLICATE KEY UPDATE score = score + ".$sc ."";

    if(mysqli_query($connection, $query))
    {
        $response=array(
            'status' => 1,
            'status_message' =>'Logged Successfully.'
        );
    }
    else
    {
        $response=array(
            'status' => 0,
            'status_message' =>'Logging Failed.'
        );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function save_feedback($data){
    global $connection;

    $uid = empty($data["id"]) ? 2 : $data["id"];
    $logid = mysqli_real_escape_string($connection,$data["logid"]);
    $rat  = mysqli_real_escape_string($connection,$data["rat"]);
    $ua  = mysqli_real_escape_string($connection,$data["ua"]);
    $fd  = mysqli_real_escape_string($connection,$data["fd"]);
    $ts  = date('D M d Y H:i:s O');
    
    $query = "INSERT INTO feedbacktb (logid, userid, timestamp, useragent, rating, feedback) VALUES ('".$logid ."','".$uid ."','".$ts ."','".$ua ."','".$rat ."','".$fd ."')";

    if(mysqli_query($connection, $query))
    {
        $response=array(
            'status' => 1,
            'status_message' =>'Logged Successfully.'
        );
    }
    else
    {
        $response=array(
            'status' => 0,
            'status_message' =>'Logging Failed.'
        );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

function save_score($data){
    global $connection;

    $uid = mysqli_real_escape_string($connection,$data["id"]);
    $game  = mysqli_real_escape_string($connection,$data["game"]);
    $sc  = mysqli_real_escape_string($connection,$data["score"]);
    
    $query = "UPDATE scoretb SET score = '".$sc ."' WHERE userid = ".$uid ." AND  game = '". $game ."'";
    

    $sql = "SELECT * FROM scoretb WHERE userid = ".$uid." AND game = '". $game ."'";
    
    
    if (!mysqli_num_rows(mysqli_query($connection, $sql))) 
    {
        $query = "INSERT INTO scoretb (userid, game, score) VALUES ('".$uid."', '".$game."', '".$sc."')";
    }

    if(mysqli_query($connection, $query))
    {
        $response=array(
            'status' => 1,
            'status_message' =>'Saved Successfully'
        );
    }
    else
    {
        $response=array(
            'status' => 0,
            'status_message' =>'Saving Failed'
        );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}




?>
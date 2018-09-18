<?php
class Users{
 
    // database connection and table name
    private $conn;
    private $table_name = "usertb";
 
    // object properties
    public $userid;
    public $username;
    public $fullname;
    public $access;
    public $data;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
 
        // select all query

            $query = "SELECT
            p.userid, p.username,p.fullname, p.access, p.data
        FROM
            usertb p
        ORDER BY
            p.id";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }
}

?>
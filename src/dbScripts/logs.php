<?php
class Logs{
 
    // database connection and table name
    private $conn;
 
    // object properties
    public $userid;
    public $timestamp;
    public $useragent;
    public $score;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
 
        // select all query
        $query = "SELECT
                l.userid, p.username, p.fullname, l.timestamp,l.useragent, l.score
            FROM
                loginlogs l
                LEFT JOIN
                    usertb u
                        ON l.userid = u.userid
            ORDER BY
                l.timestamp desc";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }
}

?>
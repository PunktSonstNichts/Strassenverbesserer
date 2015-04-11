<?php
class database{
        var $host;
        var $user;
        var $password;
        var $dbname;

        var $mysql_o;
   
    function __construct($dbhost = "localhost", $dbuser = "root", $dbpass = "123456", $dbname = "strassenverbesserer"){
        $this->host     = $dbhost; 
        $this->user     = $dbuser; 
        $this->password = $dbpass; 
        $this->dbname   = $dbname;
        $this->connect();
    }
    function connect(){ 
        $this->mysql_o = new mysqli($this->host,$this->user,$this->password,$this->dbname);
        if($this->mysql_o->connect_errno){
            $err_message =  sprintf(_t('Failed to connect to MySQL: (" %s ") '), $mysqli->connect_errno);
            $this->error_handling($err_message);
        }
    }
   
    
    private function error_handling($err_message) {
        die($err_message); //WIP
    }

}
?>
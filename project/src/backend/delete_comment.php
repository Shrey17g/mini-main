<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->id)) {
        $sql = "UPDATE post_comments SET status = 'deleted' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data->id);
        
        if($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Comment deleted successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error deleting comment"
            ]);
        }
        $stmt->close();
    }
    $conn->close();
}
?>

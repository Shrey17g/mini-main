<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->post_id) && isset($data->user_id) && isset($data->content)) {
        $sql = "INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iis", $data->post_id, $data->user_id, $data->content);
        
        if($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Comment added successfully",
                "id" => $conn->insert_id
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error adding comment"
            ]);
        }
        $stmt->close();
    }
    $conn->close();
}
?>

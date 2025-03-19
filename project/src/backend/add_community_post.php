<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->content) && isset($data->user_id)) {
        $sql = "INSERT INTO community_posts (user_id, content) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $data->user_id, $data->content);
        
        if($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Post created successfully",
                "id" => $conn->insert_id
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error creating post"
            ]);
        }
        $stmt->close();
    }
    $conn->close();
}
?>

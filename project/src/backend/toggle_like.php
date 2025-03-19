<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->post_id) && isset($data->user_id)) {
        // Check if like exists
        $checkSql = "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ii", $data->post_id, $data->user_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if($result->num_rows > 0) {
            // Unlike
            $sql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?";
            $liked = false;
        } else {
            // Like
            $sql = "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)";
            $liked = true;
        }
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $data->post_id, $data->user_id);
        
        if($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "liked" => $liked,
                "message" => $liked ? "Post liked" : "Post unliked"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error toggling like"
            ]);
        }
        $stmt->close();
    }
    $conn->close();
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->id)) {
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Delete related comments
            $sqlComments = "DELETE FROM post_comments WHERE post_id = ?";
            $stmtComments = $conn->prepare($sqlComments);
            $stmtComments->bind_param("i", $data->id);
            $stmtComments->execute();
            $stmtComments->close();
            
            // Delete related likes
            $sqlLikes = "DELETE FROM post_likes WHERE post_id = ?";
            $stmtLikes = $conn->prepare($sqlLikes);
            $stmtLikes->bind_param("i", $data->id);
            $stmtLikes->execute();
            $stmtLikes->close();
            
            // Update post status
            $sqlPost = "UPDATE community_posts SET status = 'deleted' WHERE id = ?";
            $stmtPost = $conn->prepare($sqlPost);
            $stmtPost->bind_param("i", $data->id);
            $stmtPost->execute();
            $stmtPost->close();

            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Post and related data deleted successfully"
            ]);
        } catch (Exception $e) {
            // Rollback on error
            $conn->rollback();
            echo json_encode([
                "success" => false,
                "message" => "Error deleting post: " . $e->getMessage()
            ]);
        }
    }
    $conn->close();
}
?>

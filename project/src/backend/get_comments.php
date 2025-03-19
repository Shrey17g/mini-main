<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_connect.php");

if(isset($_GET['postId'])) {
    $sql = "SELECT pc.*, 
            CASE 
                WHEN au.email = 'admin@pawsconnect.com' THEN 'Admin'
                ELSE SUBSTRING_INDEX(au.email, '@', 1)
            END as author_name,
            pc.created_at as timestamp
            FROM post_comments pc
            JOIN admin_users au ON pc.user_id = au.id
            WHERE pc.post_id = ? AND pc.status = 'active'
            ORDER BY pc.created_at DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $_GET['postId']);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = array();
    while($row = $result->fetch_assoc()) {
        $comments[] = array(
            'id' => $row['id'],
            'content' => $row['content'],
            'author' => $row['author_name'],
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
            'timestamp' => date('Y-m-d H:i:s', strtotime($row['timestamp']))
        );
    }

    echo json_encode([
        "success" => true,
        "comments" => $comments
    ]);

    $stmt->close();
}
$conn->close();
?>

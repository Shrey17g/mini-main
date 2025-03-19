<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

$userId = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

$sql = "SELECT cp.*, 
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = cp.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = cp.id AND pc.status = 'active') as comments_count,
        EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = cp.id AND pl.user_id = ?) as is_liked
        FROM community_posts cp 
        WHERE cp.status = 'active' 
        ORDER BY cp.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$posts = array();
while($row = $result->fetch_assoc()) {
    $imageData = null;
    if ($row['image_url']) {
        $imageData = 'data:image/jpeg;base64,' . base64_encode($row['image_url']);
    }
    
    $posts[] = array(
        'id' => $row['id'],
        'content' => $row['content'],
        'image' => $imageData,
        'likes' => intval($row['likes_count']),
        'comments' => intval($row['comments_count']),
        'author' => 'Admin',
        'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
        'timestamp' => date('Y-m-d H:i:s', strtotime($row['created_at'])),
        'isLiked' => (bool)$row['is_liked']
    );
}

echo json_encode([
    "success" => true,
    "posts" => $posts
]);

$conn->close();
?>

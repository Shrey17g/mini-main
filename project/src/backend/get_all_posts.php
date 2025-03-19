<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_connect.php");

$sql = "SELECT cp.*, 
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = cp.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = cp.id AND pc.status = 'active') as comments_count,
        EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = cp.id AND pl.user_id = ?) as is_liked_by_admin
        FROM community_posts cp 
        WHERE cp.status = 'active' 
        ORDER BY cp.created_at DESC";

$stmt = $conn->prepare($sql);
$adminId = isset($_GET['admin_id']) ? $_GET['admin_id'] : 0;
$stmt->bind_param("i", $adminId);
$stmt->execute();
$result = $stmt->get_result();

$posts = array();
while($row = $result->fetch_assoc()) {
    if ($row['image_url']) {
        $row['image_url'] = base64_encode($row['image_url']);
    }
    $posts[] = $row;
}

echo json_encode([
    "success" => true,
    "posts" => $posts
]);

$stmt->close();
$conn->close();
?>

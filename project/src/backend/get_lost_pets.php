<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_connect.php");

$type = isset($_GET['type']) ? $_GET['type'] : 'lost';
$sql = "SELECT * FROM lost_found_pets WHERE type = ? AND status = 'active' ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $type);
$stmt->execute();
$result = $stmt->get_result();

$pets = array();
while($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

echo json_encode($pets);

$stmt->close();
$conn->close();
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_connect.php");

$sql = "SELECT id, name, price, description, image_url FROM products WHERE status = 'active'";
$result = $conn->query($sql);

$products = array();
while($row = $result->fetch_assoc()) {
    if ($row['image_url']) {
        $row['image_url'] = 'data:image/jpeg;base64,' . base64_encode($row['image_url']);
    }
    $products[] = $row;
}

echo json_encode($products);
$conn->close();
?>

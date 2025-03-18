<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $price = floatval($_POST['price']);
    $description = $_POST['description'];
    
    // First deactivate any existing products with same name (except current one)
    $deactivateQuery = "UPDATE products SET status = 'deleted' WHERE name = ? AND id != ?";
    $deactStmt = $conn->prepare($deactivateQuery);
    $deactStmt->bind_param("si", $name, $id);
    $deactStmt->execute();
    $deactStmt->close();

    // Now update the current product
    if (isset($_FILES['image']) && $_FILES['image']['size'] > 0) {
        // Update with new image
        $image = file_get_contents($_FILES['image']['tmp_name']);
        $sql = "UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, status = 'active' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdssi", $name, $price, $description, $image, $id);
    } else {
        // Keep existing image
        $sql = "UPDATE products SET name = ?, price = ?, description = ?, status = 'active' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdsi", $name, $price, $description, $id);
    }
    
    if($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Product updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error updating product: " . $stmt->error
        ]);
    }
    
    $stmt->close();
    $conn->close();
}
?>

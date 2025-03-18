<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $price = floatval($_POST['price']);
    $description = $_POST['description'];
    $image = null;

    if (isset($_FILES['image'])) {
        $image = file_get_contents($_FILES['image']['tmp_name']);
        $imageHash = md5($image);
    }

    // Check for exact duplicate (same name, price, description, and image)
    $checkSql = "SELECT id, status FROM products WHERE name = ? AND price = ? AND description = ?";
    if ($image) {
        $checkSql .= " AND MD5(image_url) = ?";
    }
    $checkStmt = $conn->prepare($checkSql);
    
    if ($image) {
        $checkStmt->bind_param("sdss", $name, $price, $description, $imageHash);
    } else {
        $checkStmt->bind_param("sds", $name, $price, $description);
    }
    
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        if($product['status'] === 'deleted') {
            // Reactivate if exact duplicate found
            $updateSql = "UPDATE products SET status = 'active' WHERE id = ?";
            $stmt = $conn->prepare($updateSql);
            $stmt->bind_param("i", $product['id']);
            
            if($stmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product reactivated",
                    "id" => $product['id']
                ]);
            }
            exit();
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Exact duplicate product exists"
            ]);
            exit();
        }
    }

    // If no exact duplicate, create new product
    $sql = "INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdss", $name, $price, $description, $image);
    
    if($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Product added successfully",
            "id" => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error adding product: " . $stmt->error
        ]);
    }
    $stmt->close();
    $conn->close();
}
?>

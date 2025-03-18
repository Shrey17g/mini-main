<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->id)) {
        // Changed back to UPDATE for soft delete
        $sql = "UPDATE products SET status = 'deleted' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data->id);
        
        if($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Product deleted"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting product"]);
        }
        $stmt->close();
    }
    $conn->close();
}
?>

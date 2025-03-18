<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    error_log("Received login attempt for email: " . $data->email);
    
    if(isset($data->email) && isset($data->password)) {
        $email = mysqli_real_escape_string($conn, $data->email);
        $password = $data->password;
        
        $sql = "SELECT * FROM admin_users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            error_log("Found user, verifying password");
            if(password_verify($password, $row['password'])) {
                error_log("Password verified successfully");
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "admin_id" => $row['id']
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid password"
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Admin not found"
            ]);
        }
        
        $stmt->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Email and password required"
        ]);
    }
    
    $conn->close();
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
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
            if(password_verify($password, $row['password'])) {
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
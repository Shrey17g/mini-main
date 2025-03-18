<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    $sql = "INSERT INTO lost_found_pets (type, pet_name, description, location, date, 
            image_url, contact_name, contact_phone, contact_email, last_seen_details, 
            additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssss", 
        $data->type,
        $data->petName,
        $data->description,
        $data->location,
        $data->date,
        $data->imageUrl,
        $data->contactName,
        $data->contactPhone,
        $data->contactEmail,
        $data->lastSeenDetails,
        $data->additionalInfo
    );
    
    if($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Pet report added successfully",
            "id" => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error adding report: " . $stmt->error
        ]);
    }
    
    $stmt->close();
    $conn->close();
}
?>

<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

   
    


    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $description = $conn->real_escape_string($data['description']);
        $amount = $data['amount'];
        $type = $data['type'];

        $sql = "INSERT INTO expenses (description, amount, type)
                VALUES ('$description', '$amount', '$type')";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Expense added"]);
        } else {
            echo json_encode(["error" => "Insert failed"]);
        }
        break;
    case 'DELETE':
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["message" => "Deleted successfully"]);
    break;


   
    
    default:
        echo json_encode(["error" => "Invalid request"]);
        break;
}

$conn->close();
?>

<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO expenses (description, amount, type, category) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sdss", $data["description"], $data["amount"], $data["type"], $data["category"]);
$stmt->execute();

echo json_encode(["status" => "success"]);
?>

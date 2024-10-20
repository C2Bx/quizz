<?php
// Connexion à la base de données
$servername = "";      
$username = ""; 
$password = ""; 
$dbname = "";

// Récupérer les données JSON envoyées depuis le frontend
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier que toutes les données sont présentes
if (!isset($data['name'], $data['firstname'], $data['contact'], $data['score'], $data['time'], $data['rgpd'])) {
    http_response_code(400);
    echo json_encode(["message" => "Données manquantes ou invalides."]);
    exit();
}

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["message" => "Échec de la connexion à la base de données : " . $conn->connect_error]));
}

// Préparation de la requête
$stmt = $conn->prepare("INSERT INTO scores (name, firstname, contact, score, time, rgpd, newsletter) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param(
    "sssiiii",
    $data['name'],
    $data['firstname'],
    $data['contact'],
    $data['score'],
    $data['time'],
    $data['rgpd'],
    $data['newsletter']
);

// Exécution de la requête
if ($stmt->execute()) {
    echo json_encode(["message" => "Score soumis avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de l'enregistrement du score : " . $stmt->error]);
}

// Fermeture de la connexion
$stmt->close();
$conn->close();
?>

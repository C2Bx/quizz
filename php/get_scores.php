<?php
// Connexion à la base de données
$servername = "";      
$username = ""; 
$password = ""; 
$dbname = "";

// Connexion à la base de données avec gestion des erreurs
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["message" => "Échec de la connexion à la base de données : " . $conn->connect_error]));
}

// Requête pour récupérer les scores, triés par score décroissant puis par temps croissant
$sql = "SELECT name, firstname, score, time FROM scores ORDER BY score DESC, time ASC";
$result = $conn->query($sql);

// Construction du tableau des scores
$scores = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
}

// Envoi des scores en JSON
header('Content-Type: application/json');
echo json_encode($scores);

// Fermeture de la connexion
$conn->close();
?>

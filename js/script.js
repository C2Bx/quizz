$(document).ready(function () {
    // Variables globales
    let score = 0;
    let currentQuestionIndex = 0;
    let questions = [];
    let selectedAnswer = null;
    let timerInterval;
    let timerSeconds = 0;
    let backgroundMusic = document.getElementById('background-music');
    let musicStarted = false;

    // Fonction pour démarrer la musique de fond
    function startBackgroundMusic() {
        if (!musicStarted && backgroundMusic) {
            backgroundMusic.volume = 0.2;
            backgroundMusic.loop = true;
            backgroundMusic.play();
            musicStarted = true;
        }
    }

    // Démarrer la musique de fond dès que l'utilisateur clique n'importe où sur la page
    $(document).on('click', function () {
        startBackgroundMusic();
    });

    // Fonction pour formater le temps en minutes et secondes
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} sec`;
    }

    // Fonction pour mélanger un tableau
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    // Charger les questions depuis le fichier JSON et sélectionner 10 questions aléatoires
    function loadQuestions() {
        return $.getJSON("assets/questions.json")
            .then(function (data) {
                let shuffledQuestions = shuffleArray(data.questions); // Mélanger les questions
                questions = shuffledQuestions.slice(0, 10); // Sélectionner 10 questions
                $('#start-quiz').prop('disabled', false); // Activer le bouton "Commencer"
            })
            .fail(function () {
                alert("Erreur lors du chargement des questions.");
            });
    }

    // Afficher l'écran d'accueil
    function showHome() {
        $('#quiz-container').html(`
            <div class="row my-sm-4 my-md-0">
                <div class="col logo">
                    <img src="assets/logoFCF.png" alt="Logo de la Fédération">
                </div>
            </div>
            <h1 class="quiz-title">TIR AU QUIZ</h1>
            <h2 class="quiz-subtitle">Marque un maximum de but</h2>
            <button class="quiz-btn-start mt-5" id="start-quiz" disabled>Commencer</button>
            <button class="quiz-btn-score mt-5" id="show-scores">Tableau des scores</button>
        `);

        loadQuestions().then(function () {
            $('#start-quiz').prop('disabled', false); // Activer le bouton après chargement des questions
        });
    }

    // Charger les questions et afficher l'écran d'accueil
    showHome();

    // Démarrer le timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timerSeconds++;
            displayTimer();
        }, 1000);
    }

    // Arrêter le timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Mettre à jour l'affichage du timer
    function displayTimer() {
        $('#timer').text(`Temps écoulé : ${formatTime(timerSeconds)}`);
    }

    // Fonction pour stopper un son en cours
    function stopSound(sound) {
        if (sound) {
            sound.pause();
            sound.currentTime = 0; // Remettre à zéro pour permettre de rejouer le son
        }
    }

    // Afficher la question actuelle et mélanger les choix de réponses
    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            const shuffledChoices = shuffleArray([...currentQuestion.choices]);
            selectedAnswer = null;

            // Créer la structure HTML si c'est la première question
            if ($('#question-container').length === 0) {
                let quizHtml = `
                    <div class="question-container" id="question-container">
                        <h4 id="question-number"></h4>
                        <p id="timer"></p>
                        <p id="score"></p>
                        <label id="question-text" style="font-size: 2em;"></label>
                    </div>
                    <div class="question-form" id="choices-container"></div>
                    <button class="quiz-btn-submit mt-4" id="submit-answer" disabled>Vérifier</button>
                `;
                $('#quiz-container').html(quizHtml);
            }

            // Mettre à jour les éléments de la question
            $('#question-number').text(`Question : ${currentQuestionIndex + 1} / ${questions.length}`);
            $('#score').text(`Score : ${score} / ${questions.length}`);
            $('#question-text').text(currentQuestion.question);

            // Afficher le timer
            displayTimer();

            // Générer les choix
            let choicesHtml = '';
            shuffledChoices.forEach((choice) => {
                if (currentQuestion.type === "image") {
                    choicesHtml += `
                        <button class="quiz-btn-choice" data-answer="${choice.image}">
                            <img src="${choice.image}" alt="${choice.alt}" style="width: 100%;" />
                        </button>`;
                } else {
                    choicesHtml += `<button class="quiz-btn-choice" data-answer="${choice.text}">${choice.text}</button>`;
                }
            });
            $('#choices-container').html(choicesHtml);

            // Désactiver le bouton de soumission
            $('#submit-answer').prop('disabled', true);
        } else {
            stopTimer();
            displayFinalResult();
        }
    }

    // Gestion des événements pour les choix de réponse
    $(document).on('click', '.quiz-btn-choice', function () {
        $('.quiz-btn-choice').removeClass('quiz-btn-choice-selected');
        $(this).addClass('quiz-btn-choice-selected');
        selectedAnswer = $(this).data('answer');
        $('#submit-answer').prop('disabled', false); // Activer le bouton "Vérifier" après sélection
    });

    // Vérifier la réponse sélectionnée
    $(document).on('click', '#submit-answer', function () {
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        // Récupérer les sons
        let correctSound = document.getElementById('correct-sound');
        let wrongSound = document.getElementById('wrong-sound');

        // Stopper les sons en cours
        stopSound(correctSound);
        stopSound(wrongSound);

        // Assainir les réponses pour éviter les erreurs de comparaison dues à des espaces ou différences de types
        const sanitizedSelectedAnswer = String(selectedAnswer).trim();
        const sanitizedCorrectAnswer = String(correctAnswer).trim();

        // Comparaison des réponses
        if (sanitizedSelectedAnswer === sanitizedCorrectAnswer) {
            if (correctSound) {
                correctSound.play();  // Jouer le son si la réponse est correcte
            }
            $('.quiz-btn-choice-selected').addClass('quiz-btn-choice-correct');
            score++;
        } else {
            if (wrongSound) {
                wrongSound.play();  // Jouer le son si la réponse est incorrecte
            }
            $('.quiz-btn-choice-selected').addClass('quiz-btn-choice-wrong');
            $(`.quiz-btn-choice[data-answer="${sanitizedCorrectAnswer}"]`).addClass('quiz-btn-choice-correct');
        }

        $('.quiz-btn-choice').prop('disabled', true);
        $('#submit-answer').prop('disabled', true);

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    });

    // Fonction pour afficher le résultat final avec la position dans le classement
    function displayFinalResult() {
        // Récupérer les scores actuels et trouver la position du joueur
        $.ajax({
            url: 'php/get_scores.php',
            method: 'GET',
            dataType: 'json',
            success: function (scores) {
                // Ajouter le score actuel du joueur à la liste des scores pour simuler l'ajout
                scores.push({
                    name: $('#name').val(),
                    firstname: $('#firstname').val(),
                    score: score,
                    time: timerSeconds
                });

                // Trier les scores par score décroissant puis par temps croissant
                scores.sort((a, b) => {
                    if (a.score === b.score) {
                        return a.time - b.time; // Si les scores sont égaux, trier par le temps
                    }
                    return b.score - a.score;  // Trier par score décroissant
                });

                // Trouver la position du joueur dans le classement
                let playerPosition = scores.findIndex(s => s.name === $('#name').val() && s.firstname === $('#firstname').val()) + 1;

                let resultHtml = `
                    <div class="finish-container">
                        <h2>Quiz Terminé!</h2>
                        <p>Votre score est de ${score} sur ${questions.length}.</p>
                        <p>Temps total : ${formatTime(timerSeconds)}.</p>
                        <p>Votre position dans le classement est : ${playerPosition}</p>
                        
                        <!-- Formulaire de soumission des informations -->
                        <form id="submit-form">
                            <div class="form-group">
                                <label for="name">Nom <span class="required"></span>:</label>
                                <input type="text" id="name" name="name" required>
                                <span id="error-name" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="firstname">Prénom <span class="required"></span>:</label>
                                <input type="text" id="firstname" name="firstname" required>
                                <span id="error-firstname" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="contact">Email <span class="required"></span>:</label>
                                <input type="email" id="contact" name="contact" required>
                                <span id="error-email" class="error-message"></span>
                            </div>
                            
                            <!-- Case à cocher obligatoire (RGPD) -->
                            <div class="form-check">
                                <input type="checkbox" id="rgpd" name="rgpd" class="form-check-input" required>
                                <label for="rgpd" class="form-check-label">J'accepte de figurer sur le tableau des scores</label>
                            </div>
                            
                            <!-- Case à cocher facultative (Newsletter) -->
                            <div class="form-check">
                                <input type="checkbox" id="newsletter" name="newsletter" class="form-check-input">
                                <label for="newsletter" class="form-check-label">J'accepte d'être recontacté(e) par la ligue de football</label>
                            </div>
                            
                            <!-- Bouton de soumission -->
                            <button class="quiz-btn-submit" id="submit-score">Soumettre mon score</button>
                        </form>
                    </div>
                `;

                $('#quiz-container').html(resultHtml);
                markRequiredFields(); // Marquer les champs obligatoires avec *
            },
            error: function (xhr, status, error) {
                console.error("Erreur lors de la récupération des scores :", status, error);
            }
        });
    }

    // Fonction pour valider les champs du formulaire
    function validateForm() {
        let isValid = true;

        // Récupérer les valeurs des champs
        const name = $('#name').val().trim();
        const firstname = $('#firstname').val().trim();
        const email = $('#contact').val().trim();

        // Réinitialiser les messages d'erreur
        $('.error-message').hide();

        // Validation du nom
        if (name === "") {
            $('#error-name').text("Veuillez entrer votre nom.").show();
            isValid = false;
        }

        // Validation du prénom
        if (firstname === "") {
            $('#error-firstname').text("Veuillez entrer votre prénom.").show();
            isValid = false;
        }

        // Validation de l'email
        if (email === "") {
            $('#error-email').text("Veuillez entrer votre email.").show();
            isValid = false;
        }

        return isValid;
    }

    // Soumettre le formulaire avec AJAX après validation
    $(document).on('click', '#submit-score', function (e) {
        e.preventDefault(); // Empêcher le rechargement de la page

        // Si le formulaire est valide
        if (validateForm()) {
            const formData = {
                name: $('#name').val(),
                firstname: $('#firstname').val(),
                contact: $('#contact').val(),
                score: score,
                time: timerSeconds,
                rgpd: $('#rgpd').is(':checked') ? 1 : 0,
                newsletter: $('#newsletter').is(':checked') ? 1 : 0
            };

            // Envoyer les données via AJAX
            $.ajax({
                url: 'php/submit_score.php',
                method: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (response) {
                    alert('Score soumis avec succès !');
                    showHome(); // Retour à l'accueil après soumission
                },
                error: function (xhr, status, error) {
                    console.error("Erreur lors de la soumission :", status, error);
                    alert("Une erreur est survenue lors de la soumission de votre score.");
                }
            });
        }
    });

    // Fonction pour ajouter un symbole '*' rouge aux champs obligatoires
    function markRequiredFields() {
        $('label[for="name"]').append('<span class="required">*</span>');
        $('label[for="firstname"]').append('<span class="required">*</span>');
        $('label[for="contact"]').append('<span class="required">*</span>');
    }

    // Style pour le symbole '*' rouge
    $('<style>')
        .prop('type', 'text/css')
        .html('.required { color: red; font-weight: bold; }')
        .appendTo('head');

    // Appel de la fonction pour ajouter le symbole '*' rouge
    markRequiredFields();

    // Fonction pour afficher le tableau des scores
    function displayScores() {
        $.ajax({
            url: 'php/get_scores.php',
            method: 'GET',
            dataType: 'json',
            success: function (scores) {
                // Trier les scores par score décroissant puis par temps croissant
                scores.sort((a, b) => {
                    if (a.score === b.score) {
                        return a.time - b.time; // Si les scores sont égaux, trier par le temps
                    }
                    return b.score - a.score;  // Trier par score décroissant
                });

                // Créer le HTML pour afficher les scores
                let scoreHtml = `
                    <div class="scores-container">
                        <h2>Tableau des scores</h2>
                        <div class="scroller">
                            <table class="score-table">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Prénom</th>
                                        <th>Nom</th>
                                        <th>Score</th>
                                        <th>Temps</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                let currentRank = 1;
                for (let i = 0; i < scores.length; i++) {
                    const totalTime = formatTime(scores[i].time);
                    let rankClass = "";

                    // Attribuer une classe spéciale aux trois premiers
                    if (currentRank === 1) {
                        rankClass = "gold";
                    } else if (currentRank === 2) {
                        rankClass = "silver";
                    } else if (currentRank === 3) {
                        rankClass = "bronze";
                    }

                    scoreHtml += `
                        <tr class="${rankClass}">
                            <td>${currentRank}</td>
                            <td>${scores[i].firstname}</td>
                            <td>${scores[i].name}</td>
                            <td>${scores[i].score}</td>
                            <td>${totalTime}</td>
                        </tr>`;

                    currentRank++;
                }

                scoreHtml += `
                                </tbody>
                            </table>
                        </div>
                        <button class="quiz-btn-home mt-4" id="go-home">Accueil</button>
                    </div>`;

                // Afficher le tableau des scores dans le conteneur
                $('#quiz-container').html(scoreHtml);
            },
            error: function (xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
                alert("Une erreur s'est produite lors de la récupération des scores.");
            }
        });
    }

    // Afficher le tableau des scores
    $(document).on('click', '#show-scores', function () {
        displayScores();
    });

    // Retourner à l'accueil
    $(document).on('click', '#go-home', function () {
        showHome();
    });

    // Réinitialiser le quiz en cliquant sur le bouton home
    $(document).on('click', '#restart-btn', function () {
        location.reload();
    });

    // Jouer le son de clic sur tous les boutons
    function playClickSound() {
        let clickSound = document.getElementById('click-sound');
        if (clickSound) {
            clickSound.play();
        }
    }

    $(document).on('click', 'button', function () {
        playClickSound();
    });

    // Démarrer le quiz lorsque le bouton "Commencer" est cliqué
    $(document).on('click', '#start-quiz', function () {
        currentQuestionIndex = 0;
        score = 0;
        timerSeconds = 0;
        startTimer(); // Démarrer le timer
        displayQuestion(); // Afficher la première question
    });
});

// Attend que le DOM soit complètement chargé avant d'exécuter la fonction
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    // Charge les messages existants
    loadMessages();

    // Ajoute un écouteur d'événements pour envoyer le message lorsque l'utilisateur appuie sur la touche "Enter"
    document.getElementById('message-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Ajoute un écouteur d'événements pour envoyer le message lorsque l'utilisateur clique sur le bouton "Envoyer"
    document.getElementById('send-button').addEventListener('click', function () {
        sendMessage();
    });
});

// Fonction pour charger les messages depuis le serveur
function loadMessages() {
    console.log("Loading messages...");

    // Fait une requête GET pour récupérer les messages depuis le fichier PHP
    fetch('public/message.php')
        .then(response => response.json())  // Convertit la réponse en JSON
        .then(data => {
            console.log("Data received from server:", data);

            // Sélectionne le conteneur de chat
            const chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML = '';  // Vide le conteneur

            // Parcourt les messages et les ajoute au conteneur
            data.forEach(message => {
                const messageElement = document.createElement('p');
                messageElement.innerHTML = `
                <img class="chat_avatar" src="/img/user.jpg">
                <div class="chat_info">
                  <div class="contact_name">${message.username}</div>
                  <div class="contact_msg">${message.message} </div>
                </div>`;
                // Assigne une classe différente en fonction de l'utilisateur (admin ou utilisateur normal)
                messageElement.className = message.username === 'admin' ? 'admin-message' : 'user-message';
                chatContainer.appendChild(messageElement);
            });
            // Fait défiler le conteneur de chat pour afficher le nouveau message
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => console.error('Error loading messages:', error));  // Gère les erreurs de la requête
}

// Fonction pour envoyer un message
function sendMessage() {
    // Récupère la valeur du message et les informations de l'utilisateur connecté
    const message = document.getElementById('message-input').value;
    const user = JSON.parse(Cookies.get("user"));

    if (message.trim()) {  // Vérifie que le message n'est pas vide
        console.log("Sending message:", message);

        // Fait une requête POST pour envoyer le message au fichier PHP
        fetch('public/message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, username: user.username })  // Envoie le message et le nom d'utilisateur
        })
            .then(response => response.json())  // Convertit la réponse en JSON
            .then(data => {
                console.log("Data received from server after POST:", data);

                if (data.success) {
                    // Si l'envoi est réussi, ajoute immédiatement le message au conteneur de chat
                    const chatContainer = document.getElementById('chat-container');
                    const messageElement = document.createElement('p');
                    messageElement.innerHTML = `
                    <img class="chat_avatar" src="/img/user.jpg">
                    <div class="chat_info">
                      <div class="contact_name">${user.username}</div>
                      <div class="contact_msg">${message} </div>
                    </div>`;
                    messageElement.className = data.username === 'admin' ? 'admin-message' : 'user-message';
                    chatContainer.appendChild(messageElement);
                    // Fait défiler le conteneur de chat pour afficher le nouveau message
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    // Efface l'entrée de texte
                    document.getElementById('message-input').value = '';
                } else {
                    alert(`Erreur lors de l'envoi du message : ${data.error}`);
                }
            })
            .catch(error => console.error('Error sending message:', error));  // Gère les erreurs de la requête
    } else {
        console.log("Message is empty, not sending.");  // Affiche un message dans la console si le message est vide
    }
}

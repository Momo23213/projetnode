Bienvenue sur la documentation de mon API sur la Gestion des tâches d'une equipe



Vous aurez toutes les informations necessaire pour l'utlisation efficace de cette API

----------------------------------------------------------info dve-----------------------------------------------------
Nom: Soumah
Prenom: Fode momo
Email: fodemomos11@gmail.com
adresse: Hafia (Labé)
status:etudiants
universite:universite de labé
departement:information
----------------------------------------------------variable invironnement----------------------------------------------
DOMAINE:

PORT=3000

DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx(Si vous travaillez avec mongodb Atlas)

DB1=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx(Si vous travaillez en local)

JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

JWT_REFRESH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

--------------------------------------------les endpoint pour la methode post-------------------------------------------

1) pour ajouter un membre de l'equipe dans la base de donnée

endpoint : /membre
les donnée a envoyé : {nom, email, password, role}

2) pour connecter un membre de l'equipe

endpoint:  /membre/login

les donnée a envoyé : {email, password}

3) pour deconnecter un membre de l'equipe

endpoint : /membre/logout

NB: pas de donnée a envoyé

4) pour ajouter une taches

endpoint : /tache/ajoute

les donnée a envoyé : {titre: description, status, priority, assignedTo}

NB: il faut être connecté pour ajouter une taches

5) pour affiche les taches avec pagination et filtre

endpoint : /tache/affiche

les données a envoyé : { page, limit, status, priority }
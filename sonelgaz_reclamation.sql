CREATE DATABASE IF NOT EXISTS sonelgaz_reclamation
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sonelgaz_reclamation;

-- 1. Utilisateur (Classe abstraite): Ne crée pas de table directement

-- 2. Administrateurs
CREATE TABLE IF NOT EXISTS administrateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    prenom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    permission VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Abonnes
CREATE TABLE IF NOT EXISTS abonnes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    prenom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    reference VARCHAR(100) UNIQUE,
    region VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    email_verifie BOOLEAN DEFAULT FALSE,
    code_verification VARCHAR(6),
    date_expiration_code DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Operateurs
CREATE TABLE IF NOT EXISTS operateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    prenom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    niveau VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Superviseurs
CREATE TABLE IF NOT EXISTS superviseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    prenom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    region VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Agents
CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    prenom VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    telephone VARCHAR(20),
    visibilite VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    charge_actuelle INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Réclamations
CREATE TABLE IF NOT EXISTS reclamations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    categorie ENUM('Gaz', 'Électricité', 'Facturation') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    statut ENUM('en_attente', 'en_cours', 'resolue', 'rejetee') DEFAULT 'en_attente',
    priorite ENUM('haute', 'moyenne', 'basse') DEFAULT 'moyenne',
    abonne_id INT,
    operateur_id INT,
    FOREIGN KEY (abonne_id) REFERENCES abonnes(id) ON DELETE SET NULL,
    FOREIGN KEY (operateur_id) REFERENCES operateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Affectation (relation entre Agent et Réclamation)
CREATE TABLE IF NOT EXISTS affectations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_id INT,
    reclamation_id INT,
    date_affectation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Dates (relation entre Réclamation et Abonné)
CREATE TABLE IF NOT EXISTS dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reclamation_id INT,
    abonne_id INT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id) ON DELETE CASCADE,
    FOREIGN KEY (abonne_id) REFERENCES abonnes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

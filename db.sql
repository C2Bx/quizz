-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Hôte : rds.relance.nc:3306
-- Version du serveur : 8.0.36
-- Version de PHP : 8.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `sae_quiz_ddb` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `sae_quiz_ddb`;

-- Structure de la table `scores`
CREATE TABLE `scores` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `score` int NOT NULL,
  `time` int NOT NULL,
  `rgpd` tinyint(1) NOT NULL,
  `newsletter` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Index pour la table `scores`
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT pour la table `scores`
ALTER TABLE `scores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

COMMIT;

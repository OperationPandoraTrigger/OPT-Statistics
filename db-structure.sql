-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 28, 2021 at 08:26 PM
-- Server version: 10.5.11-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `opt`
--

-- --------------------------------------------------------

--
-- Table structure for table `Campaigns`
--

CREATE TABLE `Campaigns` (
  `ID` int(11) NOT NULL,
  `CampaignName` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `ID` int(11) NOT NULL,
  `CampaignID` int(11) DEFAULT NULL,
  `MissionID` int(11) DEFAULT NULL,
  `Time` timestamp NULL DEFAULT NULL,
  `PlayerUID` bigint(20) UNSIGNED DEFAULT NULL,
  `PlayerSide` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `KilledEnemy` bigint(20) DEFAULT NULL,
  `KilledByEnemy` bigint(20) DEFAULT NULL,
  `KilledTeammate` bigint(20) DEFAULT NULL,
  `KilledByTeammate` bigint(20) DEFAULT NULL,
  `KillDistance` float DEFAULT NULL,
  `KilledByDistance` float DEFAULT NULL,
  `KillItem` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `KilledVehicleName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `KilledVehicleCategory` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RevivedTeammate` bigint(20) DEFAULT NULL,
  `RevivedByTeammate` bigint(20) DEFAULT NULL,
  `RevivedDistance` float DEFAULT NULL,
  `RevivedByDistance` float DEFAULT NULL,
  `RespawnClick` tinyint(1) DEFAULT NULL,
  `RespawnTimeout` tinyint(1) DEFAULT NULL,
  `FlagDistance` float DEFAULT NULL,
  `BudgetItem` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BudgetBuy` float DEFAULT NULL,
  `BudgetSell` float DEFAULT NULL,
  `BudgetSWORD` float DEFAULT NULL,
  `BudgetARF` float DEFAULT NULL,
  `PointsSWORD` int(11) DEFAULT NULL,
  `PointsARF` int(11) DEFAULT NULL,
  `FPS` double DEFAULT NULL,
  `WalkDistance` double DEFAULT NULL,
  `SwimDistance` double DEFAULT NULL,
  `BoatDistance` double DEFAULT NULL,
  `BoatPassengerDistance` double DEFAULT NULL,
  `PilotDistance` double DEFAULT NULL,
  `AirPassengerDistance` double DEFAULT NULL,
  `DriverDistance` double DEFAULT NULL,
  `DrivePassengerDistance` double DEFAULT NULL,
  `TransporterUID` bigint(20) DEFAULT NULL,
  `PassengerUID` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FPS`
--

CREATE TABLE `FPS` (
  `ID` int(11) NOT NULL,
  `Time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `PlayerUID` bigint(20) NOT NULL,
  `FPS` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Missions`
--

CREATE TABLE `Missions` (
  `ID` int(11) NOT NULL,
  `Start` timestamp NULL DEFAULT NULL,
  `End` timestamp NULL DEFAULT NULL,
  `Fractions` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SideSWORD` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SideARF` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MissionFileName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CampaignName` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MissionName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Rated` tinyint(1) NOT NULL DEFAULT 0,
  `PointsSWORD` int(11) DEFAULT NULL,
  `PointsARF` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ObjectLifetime`
--

CREATE TABLE `ObjectLifetime` (
  `ID` int(11) NOT NULL,
  `Time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Category` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lifetime` int(11) NOT NULL,
  `Buyer` bigint(20) DEFAULT NULL,
  `Side` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Players`
--

CREATE TABLE `Players` (
  `SteamID64` bigint(20) UNSIGNED NOT NULL,
  `Nickname` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SeenFirst` timestamp NULL DEFAULT NULL,
  `SeenLast` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Campaigns`
--
ALTER TABLE `Campaigns`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Campaign` (`CampaignName`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `FPS`
--
ALTER TABLE `FPS`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Missions`
--
ALTER TABLE `Missions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CampaignNameConstraint` (`CampaignName`);

--
-- Indexes for table `ObjectLifetime`
--
ALTER TABLE `ObjectLifetime`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Players`
--
ALTER TABLE `Players`
  ADD PRIMARY KEY (`SteamID64`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Campaigns`
--
ALTER TABLE `Campaigns`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `FPS`
--
ALTER TABLE `FPS`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Missions`
--
ALTER TABLE `Missions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ObjectLifetime`
--
ALTER TABLE `ObjectLifetime`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Missions`
--
ALTER TABLE `Missions`
  ADD CONSTRAINT `CampaignNameConstraint` FOREIGN KEY (`CampaignName`) REFERENCES `Campaigns` (`CampaignName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2023 at 05:20 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE `friendships` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted','declined') NOT NULL,
  `is_colleague` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friendships`
--

INSERT INTO `friendships` (`id`, `user_id`, `friend_id`, `status`, `is_colleague`) VALUES
(3, 4, 3, 'accepted', NULL),
(4, 3, 4, 'accepted', NULL),
(5, 5, 4, 'accepted', NULL),
(6, 5, 3, 'pending', NULL),
(7, 4, 5, 'accepted', NULL),
(14, 8, 4, 'accepted', 1),
(15, 4, 8, 'accepted', 1);

-- --------------------------------------------------------

--
-- Table structure for table `friend_chats`
--

CREATE TABLE `friend_chats` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `original_filename` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friend_chats`
--

INSERT INTO `friend_chats` (`id`, `sender_id`, `receiver_id`, `message`, `timestamp`, `original_filename`, `file_path`) VALUES
(1, 2, 3, 'Hey', '2023-04-19 02:30:16', NULL, NULL),
(2, 2, 3, NULL, '2023-04-19 02:31:50', 'Alfresco_Federation_Services_-_Datasheet.pdf', 'uploads\\Alfresco_Federation_Services_-_Datasheet.pdf'),
(3, 4, 3, 'Hey', '2023-04-19 02:47:47', NULL, NULL),
(4, 4, 3, 'Hey', '2023-04-25 02:14:38', NULL, NULL),
(5, 7, 4, 'Hey', '2023-04-25 02:42:51', NULL, NULL),
(6, 7, 4, 'Hi', '2023-04-25 02:42:58', NULL, NULL),
(7, 4, 7, 'Hey', '2023-04-25 02:54:42', NULL, NULL),
(8, 4, 3, 'Hi', '2023-04-25 02:59:35', NULL, NULL),
(9, 4, 5, 'Hey', '2023-04-25 02:59:43', NULL, NULL),
(10, 4, 5, 'Hey', '2023-04-25 03:18:45', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `Email`, `organization`, `role`) VALUES
(3, 'test', 'test', 'test@gmail.com', 'test', 'Solutions consultant'),
(4, 'demo', 'demo', 'demo@demo', 'demo', 'Solutions consultant'),
(5, 'uwe', 'uwe', 'uwe@uwe.com', 'uwe', 'uwe'),
(8, 'demo5', 'demo', 'demo5@demo5', 'demo', 'Sales manager');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `friend_chats`
--
ALTER TABLE `friend_chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `friend_chats`
--
ALTER TABLE `friend_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2023 at 04:12 PM
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
(14, 8, 4, 'accepted', 1),
(15, 4, 8, 'accepted', 1),
(16, 9, 3, 'declined', 0),
(17, 9, 4, 'accepted', 0),
(19, 4, 9, 'accepted', 0),
(20, 4, 10, 'pending', 1),
(21, 4, 5, 'pending', 0),
(22, 4, 3, 'pending', 0);

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
  `file_path` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friend_chats`
--

INSERT INTO `friend_chats` (`id`, `sender_id`, `receiver_id`, `message`, `timestamp`, `original_filename`, `file_path`, `is_read`) VALUES
(1, 2, 3, 'Hey', '2023-04-19 02:30:16', NULL, NULL, 0),
(2, 2, 3, NULL, '2023-04-19 02:31:50', 'Alfresco_Federation_Services_-_Datasheet.pdf', 'uploads\\Alfresco_Federation_Services_-_Datasheet.pdf', 0),
(3, 4, 3, 'Hey', '2023-04-19 02:47:47', NULL, NULL, 1),
(4, 4, 3, 'Hey', '2023-04-25 02:14:38', NULL, NULL, 1),
(5, 7, 4, 'Hey', '2023-04-25 02:42:51', NULL, NULL, 0),
(6, 7, 4, 'Hi', '2023-04-25 02:42:58', NULL, NULL, 0),
(7, 4, 7, 'Hey', '2023-04-25 02:54:42', NULL, NULL, 0),
(8, 4, 3, 'Hi', '2023-04-25 02:59:35', NULL, NULL, 1),
(9, 4, 5, 'Hey', '2023-04-25 02:59:43', NULL, NULL, 1),
(10, 4, 5, 'Hey', '2023-04-25 03:18:45', NULL, NULL, 1),
(11, 4, 8, 'Hey', '2023-04-25 15:26:56', NULL, NULL, 1),
(12, 8, 4, 'Hey', '2023-04-25 15:27:21', NULL, NULL, 1),
(13, 4, 8, 'Hye', '2023-04-25 15:40:35', NULL, NULL, 1),
(14, 8, 4, 'Hey', '2023-04-25 15:42:06', NULL, NULL, 1),
(15, 5, 4, 'Hey', '2023-04-25 15:42:39', NULL, NULL, 1),
(16, 5, 4, 'Hey', '2023-04-25 15:42:43', NULL, NULL, 1),
(17, 3, 4, 'Hey', '2023-04-25 15:43:00', NULL, NULL, 1),
(18, 8, 4, 'Hey', '2023-04-25 15:44:06', NULL, NULL, 1),
(19, 8, 4, 'Hi', '2023-04-25 15:52:48', NULL, NULL, 1),
(20, 3, 4, 'Hey', '2023-04-25 15:53:01', NULL, NULL, 1),
(21, 5, 4, 'Hey', '2023-04-25 15:53:09', NULL, NULL, 1),
(22, 4, 3, 'Hey', '2023-04-25 16:02:52', NULL, NULL, 1),
(23, 4, 3, 'Hey', '2023-04-25 16:04:29', NULL, NULL, 1),
(24, 4, 3, 'test', '2023-04-25 16:06:15', NULL, NULL, 1),
(25, 4, 8, 'Hi', '2023-04-25 19:43:16', NULL, NULL, 1),
(26, 4, 5, 'Hey', '2023-04-25 20:00:49', NULL, NULL, 1),
(27, 8, 4, 'Hey', '2023-04-25 20:06:01', NULL, NULL, 1),
(28, 4, 5, 'Hi', '2023-04-25 20:07:39', NULL, NULL, 1),
(29, 4, 5, 'a', '2023-04-25 20:07:49', NULL, NULL, 1),
(30, 4, 5, 'Hey', '2023-04-25 20:07:54', NULL, NULL, 1),
(31, 4, 5, 'Hey', '2023-04-25 20:08:17', NULL, NULL, 1),
(32, 4, 5, 'Hey', '2023-04-25 20:11:18', NULL, NULL, 1),
(33, 5, 4, 'Hey', '2023-04-25 20:19:51', NULL, NULL, 1),
(34, 5, 4, 'Hi', '2023-04-26 00:09:33', NULL, NULL, 1),
(35, 4, 8, 'Hey', '2023-04-26 14:04:30', NULL, NULL, 1),
(36, 4, 3, 'Hey', '2023-04-26 14:04:37', NULL, NULL, 1),
(37, 4, 3, NULL, '2023-04-26 14:04:42', 'app.js', 'uploads\\app.js', 1),
(38, 4, 8, 'Hey', '2023-04-26 15:01:31', NULL, NULL, 1),
(39, 4, 8, 'Hey', '2023-04-29 13:46:23', NULL, NULL, 1),
(40, 8, 4, 'Hey', '2023-04-29 13:46:37', NULL, NULL, 1),
(41, 4, 8, 'Test', '2023-04-29 14:01:09', NULL, NULL, 0),
(42, 4, 8, 'Hi', '2023-04-29 15:55:34', NULL, NULL, 0),
(43, 3, 4, 'Hey', '2023-04-30 15:36:41', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `renewals`
--

CREATE TABLE `renewals` (
  `id` int(11) NOT NULL,
  `friendship_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewals`
--

INSERT INTO `renewals` (`id`, `friendship_id`, `product_name`, `start_date`, `end_date`, `details`, `status`) VALUES
(1, NULL, 'Test', '2023-05-13', '2023-05-14', 'Test', 'Ongoing'),
(2, NULL, 'Test', '2023-05-12', '2023-05-14', 'Test', 'Ongoing'),
(3, NULL, 'Test', '2023-05-10', '2023-05-13', 'Test', 'Ongoing'),
(4, NULL, 'Test', '2023-05-02', '2023-05-05', 'Test', 'Ongoing'),
(5, NULL, 'Test', '2023-05-09', '2023-05-10', 'Test', 'Ongoing'),
(6, 17, 'Test', '2023-05-10', '2023-05-14', 'Test', 'Ongoing');

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
(4, 'demo', 'demo', 'demo', 'demo', 'Solutions consultant'),
(5, 'uwe', 'uwe', 'uwe@uwe.com', 'uwe', 'uwe'),
(8, 'demo5', 'demo', 'demo5@demo5', 'demo', 'Sales manager'),
(9, 'pppp', 'pppp', 'pppp@pppp', 'pppp', 'pppp'),
(10, 'John-Appleseed', 'John', 'John@Appleseed.com', 'demo', 'HR Manager');

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
-- Indexes for table `renewals`
--
ALTER TABLE `renewals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `friendship_id` (`friendship_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `friend_chats`
--
ALTER TABLE `friend_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `renewals`
--
ALTER TABLE `renewals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `renewals`
--
ALTER TABLE `renewals`
  ADD CONSTRAINT `renewals_ibfk_1` FOREIGN KEY (`friendship_id`) REFERENCES `friendships` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

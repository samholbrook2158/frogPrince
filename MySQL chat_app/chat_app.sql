-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2023 at 09:49 AM
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
(20, 4, 10, 'pending', 1);

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
(44, 4, 8, 'Hey', '2023-05-14 03:45:44', NULL, NULL, 0),
(45, 4, 5, 'Hi', '2023-05-14 04:22:39', NULL, NULL, 1),
(46, 5, 4, 'Hey', '2023-05-14 04:22:51', NULL, NULL, 1),
(47, 4, 12, 'Hey', '2023-05-14 07:40:50', NULL, NULL, 1),
(48, 4, 12, 'I dont like these terms lets talk about this', '2023-05-14 07:42:40', NULL, NULL, 0),
(49, 4, 12, 'blah blah blah', '2023-05-14 07:42:49', 'UFCFFF-30-3 GDPR Permission form.docx', 'uploads\\UFCFFF-30-3 GDPR Permission form.docx', 0);

-- --------------------------------------------------------

--
-- Table structure for table `renewals`
--

CREATE TABLE `renewals` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `renewal_date` date DEFAULT NULL,
  `contract_duration` varchar(255) DEFAULT NULL,
  `consulting_hours` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewals`
--

INSERT INTO `renewals` (`id`, `product_name`, `start_date`, `end_date`, `details`, `status`, `user_id`, `friend_id`, `price`, `renewal_date`, `contract_duration`, `consulting_hours`) VALUES
(28, 'Test', '2023-05-02', '2023-05-18', 'Test', 'Ongoing', 4, 5, 12000.00, '2023-05-01', '12 Months', 12),
(29, 'test', '2023-05-01', '2023-05-11', 'Test', 'Upcoming', 4, 5, 1200000.00, '2023-05-10', '12 Months', 12);

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
(4, 'demo', 'demo', 'demo', 'demo', 'Solutions consultant'),
(8, 'demo5', 'demo', 'demo5@demo5', 'demo', 'Sales manager'),
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
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `friend_chats`
--
ALTER TABLE `friend_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `renewals`
--
ALTER TABLE `renewals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  ADD CONSTRAINT `renewals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

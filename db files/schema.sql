# Creates the database if it doesnt already exists
CREATE DATABASE IF NOT EXISTS db_project;
# Use the database 
USE db_project;

# Creating the users table
CREATE TABLE IF NOT EXISTS `users` (
  `cms_id` integer PRIMARY KEY, # cms_id that will uniquely identify each user and will serve as a foreign key
  `full_name` varchar(255) NOT NULL, # Users full name
  `username` varchar(255) UNIQUE NOT NULL, # Users username for to be displayed to other users
  `password` varchar(255) UNIQUE NOT NULL, 
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(255) UNIQUE NOT NULL 
);

# Creating the tradeable items table that stores the items that are up for trade
CREATE TABLE IF NOT EXISTS `tradeable_items` (
  `item_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key to identify each item
  `owner_id` integer NOT NULL, # Reference to the user who wants to trade this item
  `image_url` varchar(255) UNIQUE, 
  `status` bool NOT NULL, # true for available and false for traded
  `item_description` varchar(255) NOT NULL, 
  `token_val` integer NOT NULL # Items can only be traded with other items of equal token val
);

# Creating the table that stores the diff categories that items may belong to
# Immutable table (values must be inserted by the admin)
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key to be used to reference the category
  `category_name` varchar(255) UNIQUE NOT NULL, 
  `description` varchar(255) NOT NULL
);

# Creating the table that stores the items that can be borrowed 
CREATE TABLE IF NOT EXISTS `borrowable_items` (
  `item_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key to uniquely identify each item and to be used to reference the item
  `owner_id` integer NOT NULL, # Reference to the user who wants to lend this item
  `image_url` varchar(255) UNIQUE,
  `status` bool NOT NULL, # true for available and false for can be borrowed
  `item_description` varchar(255) NOT NULL
);

# Creating the table that stores the trade requests
CREATE TABLE IF NOT EXISTS `trades` (
  `trade_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key to uniquely identify each trade
  `offered_item` integer NOT NULL COMMENT 'item that is offered in exchange', 
  `requester_id` integer NOT NULL COMMENT 'id of the person who is making the request',
  `owner_id` integer NOT NULL COMMENT 'owner of the item that is being requested',
  `requested_id` integer NOT NULL
);

# Creating the table that stores the borrow request
CREATE TABLE IF NOT EXISTS `borrow_req` (
  `borrow_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key to uniquely identify each borrow request
  `item_id` integer NOT NULL,
  `requester_id` integer NOT NULL,
  `owner_id` integer NOT NULL,
  `borrow_dur` integer NOT NULL COMMENT 'Integer because it will be specified in days',
  `creation_date` timestamp NOT NULL # Date for when the request was made
);

# Creating the item feedback table
CREATE TABLE IF NOT EXISTS `item_feedback` (
  `rating_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key that uniquely identifies each review
  `item_id` integer NOT NULL, # item that received this revies
  `review` varchar(255) NOT NULL,
  `rating` integer NOT NULL, # Rating on a scale of (1 - 10)
  `reviewer_id` integer NOT NULL # User who gave this review
);

# Creating the table that stores the reviews that a user received
CREATE TABLE IF NOT EXISTS `user_review` (
  `rating_id` integer PRIMARY KEY AUTO_INCREMENT, # primary key that uniquely identifies each review
  `user_id` integer NOT NULL, # User who received this review 
  `review` varchar(255) NOT NULL, 
  `rating` integer NOT NULL, # Rating on a scale of (1 - 10)
  `reviewer_id` integer NOT NULL # User who gave this review
);

# Creating the table that stores the notifications
CREATE TABLE IF NOT EXISTS `notification` (
  `notification_id` integer PRIMARY KEY AUTO_INCREMENT, 
  `user_id` integer NOT NULL, # User who is to receive this notification
  `notification` varchar(255) NOT NULL,
  `is_read` bool
);

# Table to implement a many to many relation between categories and items in borrow table
CREATE TABLE IF NOT EXISTS `borrow_category` (
  `category_id` integer,
  `item_id` integer,
  PRIMARY KEY (`category_id`, `item_id`)
);

# Table to implement a many to many relation between categories and items in trade table
CREATE TABLE IF NOT EXISTS `trade_category` (
  `category_id` integer,
  `item_id` integer,
  PRIMARY KEY (`category_id`, `item_id`)
);

# Adding comments to the tables
ALTER TABLE `users` COMMENT = 'Stores user information';

ALTER TABLE `tradeable_items` COMMENT = 'Stores the items that are up for trade';

ALTER TABLE `category` COMMENT = 'Stores the categories that the items must belong to';

ALTER TABLE `borrowable_items` COMMENT = 'Stores the items that can be borrowed';

ALTER TABLE `trades` COMMENT = 'Stores the trade requests along with the appropriate information about the trade items';

ALTER TABLE `borrow_req` COMMENT = 'Stores the borrow requests';

ALTER TABLE `item_feedback` COMMENT = 'Stores the feedback that an item receives';

ALTER TABLE `user_review` COMMENT = 'Stores the reviews that a user receives';

ALTER TABLE `notification` COMMENT = 'Stores the notification information';

ALTER TABLE `borrow_category` COMMENT = 'To implement a many to many relation btw borrow items and categories';

ALTER TABLE `trade_category` COMMENT = 'To implement the many-to-many relation btw tradeable items and categories';

# Adding Foreign keys (to implement relations)

# many to many relation between items in the borrow table and the categories
ALTER TABLE `borrow_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`); 
ALTER TABLE `borrow_category` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

# many to many relation between items in the trade table and the categories
ALTER TABLE `trade_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);
ALTER TABLE `trade_category` ADD FOREIGN KEY (`item_id`) REFERENCES `tradeable_items` (`item_id`);

# one to many relation between users and the reviews they received
ALTER TABLE `user_review` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`cms_id`);

# one to many relation between users and the reviews they gave
ALTER TABLE `user_review` ADD FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the users and the trades that they requested
ALTER TABLE `trades` ADD FOREIGN KEY (`requester_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the users and the trades that they are being offered
ALTER TABLE `trades` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the tradeable items in the tradeable_items table and the offers that are being made to trade them by the owner
ALTER TABLE `trades` ADD FOREIGN KEY (`offered_item`) REFERENCES `tradeable_items` (`item_id`);

# one to many relation between the tradeable items in the tradeable_items table and the requests that are being to exchange them to the owner
ALTER TABLE `trades` ADD FOREIGN KEY (`requested_id`) REFERENCES `tradeable_items` (`item_id`);

# one to many relation between the users and the borrow requests that they are making
ALTER TABLE `borrow_req` ADD FOREIGN KEY (`requester_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the users and the borrow requests that they are receiving
ALTER TABLE `borrow_req` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the users and the tradeable items that they have put up for trade
ALTER TABLE `tradeable_items` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the users and the items that they are willing to lend to others
ALTER TABLE `borrowable_items` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

# one to many relation between borrowable items and the feedback those items received
ALTER TABLE `item_feedback` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

# one to many relation between users and the items they reviewed
ALTER TABLE `item_feedback` ADD FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`cms_id`);

# one to many relation between users and the notifications that they are to receive
ALTER TABLE `notification` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`cms_id`);

# one to many relation between the borrowable items and the requests that are made for those items
ALTER TABLE `borrow_req` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

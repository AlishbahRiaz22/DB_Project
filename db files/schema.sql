CREATE TABLE `users` (
  `cms_id` integer PRIMARY KEY,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `tradeable_items` (
  `item_id` integer PRIMARY KEY AUTO_INCREMENT,
  `owner_id` integer NOT NULL,
  `image_url` varchar(255) UNIQUE,
  `status` bool NOT NULL,
  `item_description` varchar(255) NOT NULL,
  `token_val` integer NOT NULL
);

CREATE TABLE `category` (
  `category_id` integer PRIMARY KEY AUTO_INCREMENT,
  `category_name` varchar(255) UNIQUE NOT NULL,
  `description` varchar(255) NOT NULL
);

CREATE TABLE `borrowable_items` (
  `item_id` integer PRIMARY KEY AUTO_INCREMENT,
  `owner_id` integer NOT NULL,
  `image_url` varchar(255) UNIQUE,
  `status` bool NOT NULL,
  `item_description` varchar(255) NOT NULL
);

CREATE TABLE `trades` (
  `trade_id` integer PRIMARY KEY AUTO_INCREMENT,
  `offered_item` integer NOT NULL COMMENT 'item that is offered in exchange',
  `requester_id` integer NOT NULL COMMENT 'id of the person who is making the request',
  `owner_id` integer NOT NULL COMMENT 'owner of the item that is being requested',
  `requested_id` integer NOT NULL
);

CREATE TABLE `borrow_req` (
  `borrow_id` integer PRIMARY KEY AUTO_INCREMENT,
  `item_id` integer NOT NULL,
  `requester_id` integer NOT NULL,
  `owner_id` integer NOT NULL,
  `borrow_dur` integer NOT NULL COMMENT 'Integer because it will be specified in days',
  `creation_date` timestamp NOT NULL
);

CREATE TABLE `item_feedback` (
  `rating_id` integer PRIMARY KEY AUTO_INCREMENT,
  `item_id` integer NOT NULL,
  `review` varchar(255) NOT NULL,
  `rating` integer NOT NULL,
  `reviewer_id` integer NOT NULL
);

CREATE TABLE `user_review` (
  `rating_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `review` varchar(255) NOT NULL,
  `rating` integer NOT NULL,
  `reviewer_id` integer NOT NULL
);

CREATE TABLE `notification` (
  `notification_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `notification` varchar(255) NOT NULL,
  `is_read` bool
);

CREATE TABLE `borrow_category` (
  `category_id` integer,
  `item_id` integer,
  PRIMARY KEY (`category_id`, `item_id`)
);

CREATE TABLE `trade_category` (
  `category_id` integer,
  `item_id` integer,
  PRIMARY KEY (`category_id`, `item_id`)
);

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

ALTER TABLE `borrow_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

ALTER TABLE `borrow_category` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

ALTER TABLE `trade_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

ALTER TABLE `trade_category` ADD FOREIGN KEY (`item_id`) REFERENCES `tradeable_items` (`item_id`);

ALTER TABLE `user_review` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `user_review` ADD FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `trades` ADD FOREIGN KEY (`requester_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `trades` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `trades` ADD FOREIGN KEY (`offered_item`) REFERENCES `tradeable_items` (`item_id`);

ALTER TABLE `trades` ADD FOREIGN KEY (`requested_id`) REFERENCES `tradeable_items` (`item_id`);

ALTER TABLE `borrow_req` ADD FOREIGN KEY (`requester_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `borrow_req` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `tradeable_items` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `borrowable_items` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `item_feedback` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

ALTER TABLE `item_feedback` ADD FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `notification` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`cms_id`);

ALTER TABLE `borrow_req` ADD FOREIGN KEY (`item_id`) REFERENCES `borrowable_items` (`item_id`);

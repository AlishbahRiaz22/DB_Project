-- Use the database
USE db_project;

-- Inserting data into the users table
INSERT INTO `users` (`cms_id`, `full_name`, `username`, `password`, `email`, `phone`) VALUES
(1, 'Alice Johnson', 'alicej', 'hashed_password_1', 'alice@example.com', '123-456-7890'),
(2, 'Bob Smith', 'bobsmith', 'hashed_password_2', 'bob@example.com', '234-567-8901'),
(3, 'Charlie Brown', 'charlieb', 'hashed_password_3', 'charlie@example.com', '345-678-9012');

-- Inserting data into the category table
INSERT INTO `category` (`category_name`, `description`) VALUES
('Electronics', 'Devices and gadgets'),
('Books', 'Printed and digital books'),
('Clothing', 'Apparel and accessories'),
('Furniture', 'Home and office furniture');

-- Inserting data into the tradeable_items table
INSERT INTO `tradeable_items` (`owner_id`, `image_url`, `status`, `item_description`, `token_val`) VALUES
(1, 'http://example.com/image1.jpg', TRUE, 'Smartphone in good condition', 100),
(2, 'http://example.com/image2.jpg', TRUE, 'A collection of science fiction novels', 50),
(3, 'http://example.com/image3.jpg', TRUE, 'Winter jacket, size M', 75);

-- Inserting data into the borrowable_items table
INSERT INTO `borrowable_items` (`owner_id`, `image_url`, `status`, `item_description`) VALUES
(1, 'http://example.com/image4.jpg', TRUE, 'Camping tent for 4 people'),
(2, 'http://example.com/image5.jpg', TRUE, 'Electric guitar with accessories'),
(3, 'http://example.com/image6.jpg', TRUE, 'Office chair, ergonomic design');

-- Inserting data into the trades table
INSERT INTO `trades` (`offered_item`, `requester_id`, `owner_id`, `requested_id`) VALUES
(1, 2, 1, 2),  -- Alice offers her smartphone to Bob for his book collection
(2, 3, 2, 1);  -- Bob offers his book collection to Charlie for Alice's smartphone

-- Inserting data into the borrow_req table
INSERT INTO `borrow_req` (`item_id`, `requester_id`, `owner_id`, `borrow_dur`, `creation_date`) VALUES
(1, 2, 1, 7, NOW()),  -- Bob requests to borrow Alice's camping tent for 7 days
(2, 3, 2, 14, NOW()); -- Charlie requests to borrow Bob's electric guitar for 14 days

-- Inserting data into the item_feedback table
INSERT INTO `item_feedback` (`item_id`, `review`, `rating`, `reviewer_id`) VALUES
(1, 'Great smartphone, works perfectly!', 9, 2),  -- Bob reviews Alice's smartphone
(2, 'Loved the book collection!', 10, 3);        -- Charlie reviews Bob's book collection

-- Inserting data into the user_review table
INSERT INTO `user_review` (`user_id`, `review`, `rating`, `reviewer_id`) VALUES
(1, 'Alice is a great trader!', 10, 2),  -- Bob reviews Alice
(2, 'Bob is very reliable!', 9, 1);      -- Alice reviews Bob

-- Inserting data into the notification table
INSERT INTO `notification` (`user_id`, `notification`, `is_read`) VALUES
(1, 'You have a new trade request from Bob.', FALSE),
(2, 'Your borrow request has been approved by Alice.', TRUE);

-- Inserting data into the borrow_category table
INSERT INTO `borrow_category` (`category_id`, `item_id`) VALUES
(1, 1),  -- Camping tent belongs to Electronics category
(2, 2);  -- Electric guitar belongs to Electronics category

-- Inserting data into the trade_category table
INSERT INTO `trade_category` (`category_id`, `item_id`) VALUES
(1, 1),  -- Smartphone belongs to Electronics category
(2, 2);  -- Book collection belongs to Books category
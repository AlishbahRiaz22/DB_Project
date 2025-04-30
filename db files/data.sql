-- First, let's insert categories
INSERT INTO `category` (`category_name`, `description`) VALUES
('Electronics', 'Electronic devices like laptops, smartphones, and accessories'),
('Books', 'Textbooks, novels, and other reading materials'),
('Sports Equipment', 'Items for various sports and outdoor activities'),
('Clothing', 'Various types of clothes, shoes, and accessories'),
('Kitchen Appliances', 'Small appliances and tools for cooking and dining');

-- Insert tradeable items
INSERT INTO `tradeable_items` (`item_name`, `owner_id`, `image_url`, `status`, `item_description`, `token_val`) VALUES
('Sony WH-1000XM4 Headphones', 123456, 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX522_.jpg', TRUE, 'Premium noise cancelling headphones with exceptional sound quality. Barely used and in excellent condition with all original accessories included.', 10),
('MacBook Pro 2022', 234567, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229', TRUE, 'M2 chip with 16GB RAM and 512GB SSD. Purchased 6 months ago with AppleCare+ until 2025. Perfect condition with zero scratches.', 15),
('Harry Potter Complete Book Collection', 345678, 'https://m.media-amazon.com/images/I/71rOzy4cyAL._AC_SL1500_.jpg', TRUE, 'Complete set of all 7 Harry Potter books in hardcover. Books are in excellent condition with minimal wear. Special anniversary edition with beautiful cover art.', 5),
('PlayStation 5 Console', 456789, 'https://m.media-amazon.com/images/I/51QKZfyi-dL._AC_SL1500_.jpg', TRUE, 'PS5 console with one DualSense controller. Includes several digital games already installed on the system. Only used for a few months.', 10),
('Nike Air Jordan 1', 567890, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7c2fff30-0cf4-4bef-a2b2-5114092310f7/air-jordan-1-mid-shoes-SQf7DM.png', TRUE, 'Air Jordan 1 Mid, size 10, black and red colorway. Worn only twice, practically new. Original box and extra laces included.', 5),
('Canon EOS R5 Camera', 123456, 'https://m.media-amazon.com/images/I/81depb5FkhL._AC_SL1500_.jpg', TRUE, '45MP full-frame mirrorless camera with 8K video capability. Includes 24-105mm lens, two batteries, and camera bag. Purchased last year with low shutter count.', 10),
('Nintendo Switch OLED', 345678, 'https://m.media-amazon.com/images/I/61lYIKPieDL._SL1500_.jpg', TRUE, 'White Nintendo Switch OLED model with improved screen and kickstand. Includes all original accessories and three physical games. Protected with screen protector since day one.', 8),
('iPad Pro 12.9" (2023)', 567890, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202210-11inch-space-gray-wifi?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1664411207212', TRUE, 'Latest M2 iPad Pro with 256GB storage and WiFi+Cellular. Includes Apple Pencil 2 and Magic Keyboard. Still under warranty for 9 more months.', 15),
('Bose QuietComfort Earbuds', 234567, 'https://m.media-amazon.com/images/I/51G5JGP1+WL._AC_SL1500_.jpg', TRUE, 'Wireless noise-cancelling earbuds with amazing sound quality. Includes all ear tip sizes and charging case. Battery life still excellent with minimal usage.', 5),
('DJI Mini 3 Pro Drone', 456789, 'https://m.media-amazon.com/images/I/61Y1P6uIRFL._AC_SL1500_.jpg', TRUE, 'Lightweight drone with 4K camera and obstacle avoidance. Includes extra batteries, propellers, and carrying case. Perfect for beginners or experienced pilots.', 10);

-- Insert borrowable items
INSERT INTO `borrowable_items` (`item_name`, `owner_id`, `image_url`, `status`, `item_description`) VALUES
('Dell XPS 15 Laptop', 123456, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4000&hei=2500&qlt=100,0&resMode=sharp2&size=4000,2500', TRUE, 'Powerful laptop with i9 processor, 32GB RAM and 1TB SSD. Perfect for programming, design work, or gaming. Includes charger and protective case.'),
('The Lord of the Rings Trilogy', 234567, 'https://m.media-amazon.com/images/I/71JqAUXOcvL._AC_SL1000_.jpg', TRUE, 'Hardcover illustrated edition of the complete Lord of the Rings trilogy. Beautiful collector\'s item in excellent condition with original dust jackets.'),
('Badminton Set', 345678, 'https://m.media-amazon.com/images/I/71RYRoHL0kL._AC_SL1500_.jpg', TRUE, 'Complete set with 4 rackets, shuttlecocks, and carrying case. Professional quality rackets with good grip and balance. Perfect for recreational play.'),
('Hiking Backpack', 456789, 'https://m.media-amazon.com/images/I/81VcN6-lXaL._AC_SL1500_.jpg', TRUE, '65L capacity backpack with multiple compartments and rain cover. Ergonomic design with padded straps and back support. Great for weekend or week-long trips.'),
('Instant Pot Pressure Cooker', 567890, 'https://m.media-amazon.com/images/I/71pB9CIXxoL._AC_SL1500_.jpg', TRUE, '7-in-1 electric pressure cooker with various cooking modes. Perfect for quick meals, stews, rice, yogurt, and more. Includes recipe book and accessories.'),
('GoPro Hero 11', 123456, 'https://m.media-amazon.com/images/I/61eL42FvmrL._AC_SL1500_.jpg', TRUE, 'Latest model GoPro with 5.3K video and water resistance. Includes multiple mounts and extra batteries. Perfect for capturing action and adventure footage.'),
('Tennis Racket Set', 234567, 'https://m.media-amazon.com/images/I/71+yM5Z-TmL._AC_SL1500_.jpg', TRUE, 'Two professional Wilson tennis rackets with a tube of balls. Well-maintained with new grip tape. Suitable for beginners or intermediate players.'),
('Yoga Mat and Blocks', 345678, 'https://m.media-amazon.com/images/I/71+aWMWpWBL._AC_SL1500_.jpg', TRUE, 'Thick, non-slip yoga mat with two foam blocks and a strap. Perfect for home practice or taking to classes. Mat is easily washable and durable.'),
('Board Game Collection', 456789, 'https://m.media-amazon.com/images/I/91RSg9MCGtL._AC_SL1500_.jpg', TRUE, 'Collection includes Catan, Ticket to Ride, Pandemic, and Codenames. All games are complete with all pieces and instructions. Great for game nights with friends.'),
('Camping Tent', 567890, 'https://m.media-amazon.com/images/I/81MODCeNnFL._AC_SL1500_.jpg', TRUE, '4-person waterproof tent with easy setup. Includes rainfly, stakes, and carrying bag. Perfect for family camping trips in various weather conditions.');

-- Insert category relationships for tradeable items
INSERT INTO `trade_category` (`category_id`, `item_id`) VALUES
(1, 1), -- Sony Headphones - Electronics
(1, 2), -- MacBook Pro - Electronics
(2, 3), -- Harry Potter Books - Books
(1, 4), -- PlayStation 5 - Electronics
(4, 5), -- Nike Shoes - Clothing
(1, 6), -- Canon Camera - Electronics
(1, 7), -- Nintendo Switch - Electronics
(1, 8), -- iPad Pro - Electronics
(1, 9), -- Bose Earbuds - Electronics
(1, 10); -- DJI Drone - Electronics

-- Insert category relationships for borrowable items
INSERT INTO `borrow_category` (`category_id`, `item_id`) VALUES
(1, 1), -- Dell Laptop - Electronics
(2, 2), -- Lord of the Rings - Books
(3, 3), -- Badminton Set - Sports Equipment
(3, 4), -- Hiking Backpack - Sports Equipment
(5, 5), -- Instant Pot - Kitchen Appliances
(1, 6), -- GoPro - Electronics
(3, 7), -- Tennis Racket - Sports Equipment
(3, 8), -- Yoga Mat - Sports Equipment
(2, 9), -- Board Games - Books (could also be its own category)
(3, 10); -- Camping Tent - Sports Equipment

-- Sample trade requests
INSERT INTO `trades` (`offered_item`, `requester_id`, `owner_id`, `requested_id`, `reason`, `creation_date`) VALUES
(3, 345678, 456789, 4, 'I would love to trade my book collection for your PS5. Books are in excellent condition!', '2025-04-20 14:30:00'),
(5, 567890, 123456, 1, 'My shoes for your headphones? They\'re practically new and very comfortable.', '2025-04-22 09:15:00');

-- Sample borrow requests
INSERT INTO `borrow_req` (`item_id`, `requester_id`, `owner_id`, `borrow_dur`, `creation_date`, `reason`) VALUES
(1, 234567, 123456, 7, '2025-04-21 10:45:00', 'Need a powerful laptop for a week-long coding project. Will take good care of it.'),
(5, 345678, 567890, 3, '2025-04-23 16:20:00', 'Would like to borrow the Instant Pot to try some new recipes for a dinner party this weekend.');

-- Sample item feedback
INSERT INTO `item_feedback` (`item_id`, `review`, `rating`, `reviewer_id`) VALUES
(2, 'The books were in pristine condition, exactly as described. A pleasure to read!', 9, 345678),
(6, 'GoPro worked perfectly for my hiking trip. All the mounts were very useful!', 10, 456789);

-- Sample user reviews
INSERT INTO `user_review` (`user_id`, `review`, `rating`, `reviewer_id`) VALUES
(123456, 'John was very responsive and the item was in excellent condition as promised.', 9, 234567),
(345678, 'Bob was punctual and returned the item in the same condition. Would lend to him again!', 10, 567890);

-- Sample notifications
INSERT INTO `notification` (`user_id`, `notification`, `is_read`) VALUES
(123456, 'You have a new trade request for your Sony Headphones.', FALSE),
(345678, 'Your borrow request for the Instant Pot has been approved.', FALSE),
(456789, 'Someone left a review on your item.', TRUE),
(234567, 'Your trade offer has been accepted!', FALSE);

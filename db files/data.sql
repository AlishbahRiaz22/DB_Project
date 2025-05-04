USE db_project;

-- Add more categories (continuing from existing ones)
INSERT INTO `category` (`category_name`, `description`) VALUES
('Gaming', 'Video games, board games, and gaming accessories'),
('Outdoor Gear', 'Equipment for camping, hiking, and outdoor activities'),
('Musical Instruments', 'Various musical instruments and equipment'),
('Tools', 'Power tools, hand tools, and workshop equipment'),
('Art Supplies', 'Materials for painting, drawing, and other creative activities');

-- Add more tradeable items
INSERT INTO `tradeable_items` (`item_name`, `owner_id`, `image_url`, `status`, `item_description`, `item_condition`) VALUES
('Fender Stratocaster Guitar', 123456, 'https://example.com/stratocaster.jpg', TRUE, 'American-made Stratocaster in sunburst finish. Includes hard case and extra strings. Great condition with minimal playing wear.', 'new'),
('Samsung Galaxy S24 Ultra', 234567, 'https://example.com/galaxy-s24.jpg', TRUE, 'Latest Samsung flagship phone with 512GB storage. Includes original box, charger, and two cases. Under warranty until 2026.', 'good'),
('Dyson V15 Vacuum', 345678, 'https://example.com/dyson-v15.jpg', TRUE, 'Cordless vacuum with powerful suction and all attachments. Barely used as it was a duplicate gift.', 'fair'),
('Lego Star Wars Millennium Falcon', 456789, 'https://example.com/lego-falcon.jpg', TRUE, 'Ultimate Collector Series set #75192. Brand new in sealed box. Limited edition item that\'s now hard to find.', 'worn),
('Trek Mountain Bike', 567890, 'https://example.com/trek-bike.jpg', TRUE, 'Full suspension mountain bike with carbon frame. Size medium. Recently serviced with new tires and brakes.', 'like-new'),
('Gaming PC Build', 123456, 'https://example.com/gaming-pc.jpg', TRUE, 'Custom PC with RTX 4080, i9 processor, 32GB RAM, and 2TB SSD. RGB lighting and liquid cooling. Perfect for gaming or content creation.', 'new'),
('Patek Philippe Watch', 234567, 'https://example.com/patek-watch.jpg', TRUE, 'Genuine luxury timepiece in excellent condition. Includes box, papers, and extra links. Recently serviced by authorized dealer.', 'good'),
('Limited Edition Sneakers', 345678, 'https://example.com/limited-sneakers.jpg', TRUE, 'Rare collaboration sneakers, size 9. Never worn, deadstock condition with original box and tags.', 'new'),
('Espresso Machine', 456789, 'https://example.com/espresso.jpg', TRUE, 'Commercial-grade espresso machine with built-in grinder. Makes perfect coffee and has been well maintained.', 'good'),
('Drone with 8K Camera', 567890, 'https://example.com/drone-8k.jpg', TRUE, 'Professional-grade drone with stabilized 8K camera. Includes multiple batteries and controller with screen. Perfect for aerial photography.', 'like-new');

-- Add more borrowable items
INSERT INTO `borrowable_items` (`item_name`, `owner_id`, `image_url`, `status`, `item_description`, `item_conditon`) VALUES
('DSLR Camera with Lenses', 123456, 'https://example.com/dslr-set.jpg', TRUE, 'Nikon D850 with 24-70mm and 70-200mm lenses. Includes camera bag, tripod, and memory cards. Great for professional photography.', 'like-new'),
('Electric Drill Set', 234567, 'https://example.com/drill-set.jpg', TRUE, 'DeWalt 20V drill with multiple bits and attachments. Recently purchased and barely used. Perfect for home projects.', 'new'),
('Projector', 345678, 'https://example.com/projector.jpg', TRUE, '4K projector with 120" screen. Great for movie nights or presentations. Easy to set up and use.', 'good'),
('Beach Umbrella and Chairs', 456789, 'https://example.com/beach-set.jpg', TRUE, 'Large beach umbrella with 4 folding chairs and cooler. Perfect for beach days or outdoor events.', 'fair'),
('Stand Mixer', 567890, 'https://example.com/stand-mixer.jpg', TRUE, 'KitchenAid Professional 600 mixer with all attachments. Great for baking projects or making pasta.', 'like-new'),
('Telescope', 123456, 'https://example.com/telescope.jpg', TRUE, 'Celestron computerized telescope with tripod. Perfect for stargazing and astrophotography. Includes instructional guide.', 'new'),
('Sewing Machine', 234567, 'https://example.com/sewing-machine.jpg', TRUE, 'Brother computerized sewing machine with multiple stitch options. Great for clothing repairs or crafting projects.', 'good'),
('Snowboard and Boots', 345678, 'https://example.com/snowboard.jpg', TRUE, 'Burton snowboard (155cm) with bindings and size 10 boots. Perfect for beginners or intermediate riders.', 'like-new'),
('Pressure Washer', 456789, 'https://example.com/pressure-washer.jpg', TRUE, '3000 PSI electric pressure washer with multiple nozzles. Great for cleaning driveways, decks, and vehicles.', 'worn'),
('Air Fryer', 567890, 'https://example.com/air-fryer.jpg', TRUE, 'Large capacity air fryer with digital controls. Perfect for healthier cooking with less oil. Includes recipe book.', 'new');

-- Add durations for borrowable items
INSERT INTO `borrowable_item_durations` (`item_id`, `duration_days`) VALUES
(1, 3), (1, 7), -- DSLR Camera
(2, 3), (2, 7), -- Electric Drill Set
(3, 2), (3, 5), -- Projector
(4, 3), (4, 7), -- Beach Umbrella
(5, 3), (5, 7), -- Stand Mixer
(6, 5), (6, 10), -- Telescope
(7, 7), (7, 14), -- Sewing Machine
(8, 7), (8, 14), -- Snowboard
(9, 2), (9, 5), -- Pressure Washer
(10, 3), (10, 7); -- Air Fryer

-- Add category relationships for tradeable items (assuming new category IDs start at 6)
INSERT INTO `trade_category` (`category_id`, `item_id`) VALUES
(2, 1), -- Fender Guitar - Musical Instruments
(1, 2), -- Samsung Galaxy - Electronics
(5, 3), -- Dyson Vacuum - Kitchen Appliances (closest category)
(5, 4), -- Lego Star Wars - Gaming
(3, 5), -- Trek Mountain Bike - Sports Equipment
(1, 6), -- Gaming PC - Electronics
(4, 7), -- Patek Philippe Watch - Clothing (as accessory)
(4, 8), -- Limited Edition Sneakers - Clothing
(5, 9), -- Espresso Machine - Kitchen Appliances
(1, 10); -- Drone with 8K Camera - Electronics

-- Add category relationships for borrowable items
INSERT INTO `borrow_category` (`category_id`, `item_id`) VALUES
(1, 1), -- DSLR Camera - Electronics
(2, 2), -- Electric Drill Set - Tools
(1, 3), -- Projector - Electronics
(3, 4), -- Beach Umbrella - Outdoor Gear
(5, 5), -- Stand Mixer - Kitchen Appliances
(1, 6), -- Telescope - Electronics
(4, 7), -- Sewing Machine - Tools
(3, 8), -- Snowboard - Sports Equipment
(5, 9), -- Pressure Washer - Tools
(5, 10); -- Air Fryer - Kitchen Appliances

-- Add more trade requests
INSERT INTO `trades` (`offered_item`, `requester_id`, `owner_id`, `requested_id`, `reason`, `creation_date`) VALUES
(1, 123456, 234567, 2, 'Would love to trade my guitar for your new Samsung phone. Guitar is in excellent condition and includes case.', '2025-04-24 11:20:00'),
(3, 345678, 123456, 6, 'My Dyson vacuum for your gaming PC? The vacuum is practically new and works perfectly.', '2025-04-25 15:45:00'),
(5, 567890, 345678, 3, 'Would you consider trading my mountain bike for your vacuum? Bike was recently serviced.', '2025-04-26 09:30:00'),
(7, 234567, 456789, 4, 'My luxury watch for your Lego collection? The watch is genuine and comes with all documentation.', '2025-04-27 14:15:00'),
(9, 456789, 567890, 10, 'Would love to trade my espresso machine for your drone. Machine makes perfect coffee every time!', '2025-04-28 16:40:00');

-- Add more borrow requests
INSERT INTO `borrow_req` (`item_id`, `requester_id`, `owner_id`, `borrow_dur`, `creation_date`, `reason`) VALUES
(3, 123456, 345678, 3, '2025-04-24 10:30:00', 'Would like to borrow the badminton set for a weekend family gathering. Will return in perfect condition.'),
(6, 567890, 123456, 5, '2025-04-25 13:15:00', 'Need the GoPro for an upcoming hiking trip. Promise to take good care of it and return promptly.'),
(1, 345678, 123456, 7, '2025-04-26 11:45:00', 'Would love to borrow your DSLR for a wedding I\'m attending. I\'m an experienced photographer and will handle it carefully.'),
(5, 456789, 567890, 3, '2025-04-27 09:20:00', 'Need to borrow the stand mixer for a baking project. I\'ll clean it thoroughly before returning.'),
(6, 234567, 123456, 5, '2025-04-28 14:30:00', 'Would like to borrow the telescope for my son\'s science project. We\'ll use it responsibly.');

-- Add more item feedback
-- Note: Fixed the creation_date field which appears required based on your schema
INSERT INTO `item_feedback` (`item_id`, `review`, `rating`, `reviewer_id`, `creation_date`) VALUES
(1, 'The laptop worked perfectly for my project. Battery life is excellent!', 10, 234567, '2025-04-28 15:20:00'),
(3, 'Badminton set was in great condition with quality rackets. Perfect for our family event!', 9, 123456, '2025-04-29 11:30:00'),
(5, 'The Instant Pot was amazing! So easy to use and made delicious meals.', 10, 345678, '2025-04-30 14:45:00'),
(1, 'Camera and lenses were all in excellent condition. Got some amazing shots!', 10, 345678, '2025-05-01 10:15:00'),
(5, 'Stand mixer worked perfectly for my baking project. All attachments included and in great condition.', 9, 456789, '2025-05-01 16:30:00');

-- Add more user reviews
INSERT INTO `user_review` (`user_id`, `review`, `rating`, `reviewer_id`) VALUES
(234567, 'Sarah was prompt in communication and returned the item in perfect condition.', 10, 123456),
(456789, 'David was respectful and took great care of the borrowed item. Would definitely lend to him again.', 9, 567890),
(567890, 'Michael was wonderful to deal with. Transaction was smooth and he was very honest about the item condition.', 10, 234567),
(123456, 'John is a reliable borrower who returns items on time and in good condition. Highly recommended!', 10, 345678),
(345678, 'Robert is a pleasure to trade with. Very fair and honest in all dealings.', 9, 456789);

-- Add more notifications
INSERT INTO `notification` (`user_id`, `notification`, `is_read`, `creation_date`) VALUES
(123456, 'Your item "Fender Stratocaster Guitar" has received a new trade offer.', FALSE, '2025-04-29 09:15:00'),
(234567, 'Your borrow request for the telescope has been approved.', FALSE, '2025-04-29 14:30:00'),
(345678, 'Someone has left feedback on your "Badminton Set".', TRUE, '2025-04-30 10:45:00'),
(456789, 'You have a new borrow request for your "Stand Mixer".', FALSE, '2025-04-30 15:20:00'),
(567890, 'Your item "Trek Mountain Bike" has a new trade offer.', FALSE, '2025-05-01 11:30:00'),
(123456, 'Your borrow request for the "Snowboard and Boots" has been declined.', TRUE, '2025-05-01 14:15:00'),
(234567, 'You have a new review from a user you traded with.', FALSE, '2025-05-01 16:45:00'),
(345678, 'An item you borrowed is due for return in 2 days.', FALSE, '2025-05-02 09:10:00'),
(456789, 'Your trade request has been accepted! Please arrange exchange details.', FALSE, '2025-05-02 11:30:00'),
(567890, 'A borrowed item is now overdue. Please return it or request an extension.', FALSE, '2025-05-02 13:45:00');

-- Add notification with return date for testing overdue notification procedure
INSERT INTO `notification` (`user_id`, `notification`, `is_read`, `creation_date`, `return_date`, `item_id`) VALUES
(123456, 'You have borrowed "Badminton Set". Please return by the due date.', FALSE, '2025-04-22 10:30:00', '2025-05-04', 3),
(234567, 'You have borrowed "Stand Mixer". Please return by the due date.', FALSE, '2025-04-23 14:15:00', '2025-05-03', 15),
(345678, 'You have borrowed "GoPro Hero 11". Please return by the due date.', FALSE, '2025-04-24 11:45:00', '2025-05-05', 6),
(456789, 'You have borrowed "DSLR Camera". Please return by the due date.', FALSE, '2025-04-25 16:20:00', '2025-05-06', 11),
(567890, 'You have borrowed "Telescope". Please return by the due date.', FALSE, '2025-04-26 09:30:00', '2025-05-07', 16);
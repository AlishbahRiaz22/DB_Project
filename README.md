# 🔄 Virtual Swap Shop

![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

This is a full stack website that allows university students to trade or borrow items with other students.

## 📋 Table of Contents
- [How it Works](#how-it-works)
- [Features](#features)
  - [Signup/Login](#signuplogin)
  - [Borrow](#borrow)
  - [Trade](#trade)
  - [Profile](#profile)
  - [Browse Items](#browse-items)
- [How to Use](#how-to-use)
  - [Mock Data](#mock-data)
- [Technologies Used](#technologies-used)

---

## 🔄 How it works
The website allows students to trade or borrow items with each other. The students can list their items as either tradable or borrowable. The items can be anything from books, electronics, clothes, etc. The website provides a platform for students to connect and exchange items without any monetary transactions.

---

## ✨ Features

### 🔐 Signup/Login
The website provides a signup and login functionality for the students. The students can sign up using their university identification number (cms_id) along with their email and password. The cms_id is used to verify the student's identity and ensure that only university students can use the website. After signing up, the students can log in using their credentials.

### 📚 Borrow
The students can browse borrowable items on the website and send a request to the owner of the borrowable item if they are interested in any item. The user can then decline or accept the request. In either case, the requester will be notified on his account. And if the request is accepted,the requester will be provided with the contact information of the owner so that they can contact and owner and decide on when and where to transfer the said item.

### 🔄 Trade 
Similar procedure will be followed for the trade functionality with the exception that when sending a request the requester must also specify one of his item that they are willing to trade.

### 👤 Profile
The users can change their credentials after signing up with the exception of the university identification number. Furthermore, they can upload borrowable/tradable items on the website with the required information and a picture of the item and for borrowable items, they can also specify the durations that they are willing to lend it for. Moreover, they can delete their listed items or view any incoming or outgoing requests on their profile page. For incoming requests, they can either accept it or decline the request. They can also view the notifications on their profile and mark them as read.

### 🔍 Browse Items
The users can browse items on the website and can use the filter functionality that allows them to filter on the basis of keywords, categories, status, alphabetic order or the whether the items are listed as tradable or borrowable.

---

## 🚀 How to Use
Copy the link to the repository and clone it to your local machine using the command:
```bash
git clone <repository-link>
```
Then, copy the database schema and run it on your local MySQL server. You can find the schema in the `schema.sql` file in the db files directory.

After that, create a `.env` file in the backend directory and add the following environment variables:
```plaintext
# Port for CORS
CORS_PORT= // Port on which the frontend will run

# Defining the port 
PORT= // port on which mysql server is running

# Server port
SPORT= // Port on which the backend server will run (should be 8808)

# Password for the database
DB_PASSWORD=

# User for the database
USER=

# Host 
HOST= // Host for the database (usually localhost)

# Database name
DB_NAME=

# Secret for the session
SECRET=

# Environment Config
NODE_ENV= // Environment (development for now or production)
```

Then, navigate to the backend directory and run the following commands:
```bash
npm install
```

And to start the backend server, run:
```bash
npm start
```

Now, navigate to the frontend directory and launch the frontend using the live preview option in your IDE on the port specified in the `.env` file and enjoy the website.

### 📊 Mock Data
If you want to test the wesite, some user credentials are provided in the `user.txt` file in the db files directory. You can use these credentials to sign up and log in to the website. 
After which you can run the mock data script to populate the database with some mock data. The script can be found in the `data.sql` file in the db files directory.

---

## 💻 Technologies Used
- **Frontend**: 
  - ![HTML](https://img.shields.io/badge/-HTML-E34F26?style=flat-square&logo=html5&logoColor=white) 
  - ![CSS](https://img.shields.io/badge/-CSS-1572B6?style=flat-square&logo=css3&logoColor=white)
  - ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
- **Backend**: 
  - ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
  - ![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)
- **Database**: 
  - ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
- **Other Tools**:
  - Multer (File Upload)
  - dotenv (Environment Variables)
  - express-session (Session Management)
  - cors (CORS)




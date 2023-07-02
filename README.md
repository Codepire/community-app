# community-app

a basic chatting application.

# Tech Stack 🔧

<div>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> 
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/mongoose-43853D?style=for-the-badge"/>
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"/>
</div>

## Architecture

<img src="./images/structure.png" alt="structure"/>

## Initial DB Schema

<img src="./images/initial-schema.png" alt="db Schema"/>

## Prerequisites

Before setting up the Community App, ensure that you have the following prerequisites installed:

- Node.js (version 14 or above)
- MongoDB

## Installation

Follow the steps below to set up the Community App:

**1. Clone the repository:**

```bash
git clone https://github.com/Codepire/community-app-backend.git
```

**2. Navigate to the project directory:**

```bash
cd community-app-backend
```

**3. Install with:**

```bash
npm install
```

**4. Configure environment variables:**

- Create a .env file in the root directory.
- Add the following variables to the .env file:

```bash
JWT_SEED=aslkjfa;sldfjk
TOKEN_EXPIRATION_TIME=1h
```

**For Windows:**

- Use a text editor to create the .env file and add the variables mentioned above.
- Save the file with the name .env in the root directory.

**For Linux:**

- Open the terminal and navigate to the project directory.
- Use the following command to create the .env file and open it in the terminal-based text editor:

```bash
nano .env
```

- Add the variables mentioned above to the opened file.
- Save the file by pressing Ctrl + O and then exit the editor by pressing Ctrl + X.

**5. Start the server:**

```bash
npm start
```

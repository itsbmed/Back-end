# This's a simple API project

## Installation

-   Install all dependencies :
    `npm install`
-   Add .env file to root app :

```
# setting port of server
PORT=3030
# enable debugger
DEBUGGER=true
# set logger format => [combined ,common, tiny ,dev ,short]
LOGGER_FORMAT=dev
# database config
DB_HOST=localhost
DB_DIALECT=mysql
# database credentials
DB_USER=YOUR DATABASE USERNAME
DB_PASS=YOUR DATABASE PASSWORD
DB_NAME=YOUR DATABASE NAME
```

-   Init sequelize & create database :

```bash
npx sequelize init --force # create sequelize folders
npx sequelize db:create # create database
```

-   Overwrite `config/db.js` with following :

```js
require("dotenv").config();
const env = process.env.NODE_ENV;
const config = require("./settings")(env)["db"];
module.exports = config;
```

-   Update `app/models/index.js` with following :

```diff
- const config = require(__dirname + '/../../config/db.js')[env];
+ const config = require(__dirname + "/../../config/settings.js")(env)["db"];
```

-   Run app :

```bash
npm run dev # for development
npm run pro # for production
```

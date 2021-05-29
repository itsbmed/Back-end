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

-   Run app :

```bash
npm run dev # for development
npm run pro # for production
```

# open-cms

An experimental CMS system.

## Features 

* [x] Collections
* [x] Timestamps
* [x] Pages
* [x] Aliases
* [x] Wysiwig edititing
* [x] Source editing

## Environment Variables

This site uses a variety of Environment Variables.

|KEY                         |VALUE                                                                 |
|----------------------------|----------------------------------------------------------------------|
|DBURL                       |The url string to access the MongoDB database.                        |
|SITE_TITLE                  |The string value of the website title. Used by layout.                |
|ADMIN_PANEL                 |Disables Admin Panel unless the value is `true`.                      |
|ADMIN_PASS                  |The password to access the Admin Panel. Make it long and secret.      |


## How to install and run

Install Node.js (with NPM). Have a MongoDB instance available somewhere. Clone the repo and change directory into it. Then:

```
npm install
```

Add your credentials for Mongo, alongside your other environment variables, into `.env`, and then get `foreman`:

```
npm install -g foreman
```

Then run:

```
nf run npm start
```

---

Copyright (c) 2015 Isaac Reid-Guest All Rights Reserved.

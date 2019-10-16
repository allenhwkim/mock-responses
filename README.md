# **Table of Contents**

- [**Table of Contents**](#table-of-contents)
- [How to install and start](#how-to-install-and-start)
    - [To Start With Forever](#to-start-with-forever)
    - [To Start Manally](#to-start-manally)
- [Documentation](#documentation)
- [Mock Response Features](#mock-response-features)
  - [create mock-responses](#create-mock-responses)
  - [update mock-response](#update-mock-response)
  - [search mock-response](#search-mock-response)
  - [create use-cases](#create-use-cases)
  - [update use-case](#update-use-case)
  - [activate use-case](#activate-use-case)

<br> 

# How to install and start

### To Start With Forever

`forever start -c "npm run dev:start" ./`

### To Start Manally

`$ kill-port 9300`

`$ ts-node src/main.ts --db-path=demo/mock-responses.sql --port=9300 --cookie='PLAY_SESSION=ACCTNBR=123456789; Path=/'`

**After Starting, go to** `http://localhost:3000/developer/#`

<br>

# Documentation

[Mock Response Documentation]("./documentation/api/mock-responses.md)

[Use Case Documentation]("./documentation/api/use-cases.md)

<br>

# Mock Response Features

## create mock-responses

<img src="./src/documentation/images/new-page.png">

## update mock-response

<img src="./src/documentation/images/edit-page.png">

## search mock-response

<img src="./src/documentation/images/home-page.png">

Note: the search looks for matching strings in 'name', 'url', and 'body' column.

## create use-cases

<img src="./src/documentation/images/use-case-create-page.png">


## update use-case

<img src="./src/documentation/images/use-case-edit-page.png">

Note: Use the search bar on the right side to search mock services, then click the service to add it to the use case. Click the trash can icon to remove the mock service from a use case.

## activate use-case

Activates all mock services under that use case.
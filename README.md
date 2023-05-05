<!--
title: 'AWS Serverless HTTP API in NodeJS with Amazon Cognito authentication to use a ToDo list app that store data in DynamoDB'
description: 'It setups an HTTP API with Cognito authentication allowing you to create, list, get, update and delete Todos. DynamoDB is used to store the data.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
version: 1.0.0
authorLink: 'https://github.com/danieltikamori'
authorName: 'Daniel Tikamori'
authorAvatar: 'https://avatars3.githubusercontent.com/u/danieltikamori'
-->

# Serverless ToDos app with RESTful API with Amazon Cognito authentication and using DynamoDB to store data

This template setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete Todos. DynamoDB is used to store the data. This is just an example and of course, you could use any data storage as a backend.
Implemented Cognito hosted UI for sign up and log in, also uses Cognito verification features like cognito email verification service.
Already have basic security features, planning to implement features like zero-knowledge authentication, rate limiting (possible to implement manually through WAF and API Gateway) and much more.

## Version

1.0.0 - Initial version for further improvement.

## Structure

This service has a separate directory for all the todo operations. For each operation, exactly one file exists e.g. `todos/delete.js`. In each of these files, there is exactly one function that is directly attached to `module.exports`.

The idea behind the `todos` directory is that in case you want to create a service containing multiple resources e.g. users, notes, and comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use case and your preference.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
npm install
```

## Deploy

To deploy the endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: todos-app
stage: dev
region: us-west-2
api keys: None
endpoints:
POST - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos
GET - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos
GET - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/{id}
PUT - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/{id}
DELETE - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/{id}
POST - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/auth/signup
POST - https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/auth/login
functions:
  create: todos-app-dev-create
  get: todos-app-dev-get
  list: todos-app-dev-list
  update: todos-app-dev-update
  delete: todos-app-dev-delete
  signup: todos-app-dev-signup
  login: todos-app-dev-login
```

## Usage

First sign up for a new account(if prefer, use the Cognito Hosted UI already set), do the email verification and after logging in, it is ready to go.

You can create, retrieve, update, or delete todos with the following commands:

### Create a Todo

```bash
curl -X POST https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos --data '{ "text": "Learn Serverless" }'
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### List all Todos

```bash
curl https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos
```

Example output:

```bash
[{"text":"Deploy my first service","id":"ac90feaa11e6-9ede-afdfa051af86","checked":true,"updatedAt":1479139961304},{"text":"Learn Serverless","id":"206793aa11e6-9ede-afdfa051af86","createdAt":1479139943241,"checked":false,"updatedAt":1479139943241}]%
```

### Get one Todo

```bash
# Replace the <id> part with a real id from your todos table
curl https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/<id>
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### Update a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X PUT https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":true,"updatedAt":1479138570824}%
```

### Delete a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X DELETE https://XXXXXXX.execute-api.us-west-2.amazonaws.com/dev/todos/<id>
```

No output

### Scaling

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify the provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decrease capacity as needed.

This can be done via settings in the `serverless.yml`.

```yml
ProvisionedThroughput:
  ReadCapacityUnits: 1
  WriteCapacityUnits: 1
```

In case you expect a lot of traffic fluctuation we recommend checking out this guide on how to auto-scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)

"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const listTodos = async (event, context) => {
  const token = event.requestContext.authorizer.jwt.claims;
  const { email } = token;

  const params = {
    TableName: process.env.TODOS_TABLE_NAME,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email }
  };

  try {
    const result = await dynamoDb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Unable to list todos" })
    };
  }
};

module.exports = { listTodos };

"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const deleteTodo = async (event, context) => {
  const id = event.pathParameters.id;
  const token = event.requestContext.authorizer.jwt.claims;
  const { email } = token;

  const params = {
    TableName: process.env.TODOS_TABLE_NAME,
    Key: { id, email }
  };

  try {
    const result = await dynamoDb.delete(params).promise();
    console.log(result);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted successfully" })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Unable to delete todo" })
    };
  }
};

module.exports = { deleteTodo };

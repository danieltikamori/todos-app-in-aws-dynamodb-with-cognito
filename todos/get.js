"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getTodo = async (event, context) => {
  const id = event.pathParameters.id;
  const token = event.requestContext.authorizer.jwt.claims;
  const { email } = token;

  const params = {
    TableName: process.env.TODOS_TABLE_NAME,
    Key: { id, email }
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Todo not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Unable to get todo" })
    };
  }
};

module.exports = { getTodo };

"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateTodo = async (event, context) => {
  const id = event.pathParameters.id;
  const { text } = JSON.parse(event.body);
  const token = event.requestContext.authorizer.jwt.claims;
  const { email } = token;

  const params = {
    TableName: process.env.TODOS_TABLE_NAME,
    Key: { id, email },
    UpdateExpression: "SET #text = :text, updatedAt = :updatedAt",
    ExpressionAttributeNames: { "#text": "text" },
    ExpressionAttributeValues: {
      ":text": text,
      ":updatedAt": Date.now()
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Unable to update todo" })
    };
  }
};

module.exports = { updateTodo };

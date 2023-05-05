"use strict";
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

const cognito = new AWS.CognitoIdentityServiceProvider();

const signup = async (event, context) => {
  const { name, email, password } = JSON.parse(event.body);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const params = {
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    Password: hashedPassword,
    Username: email,
    UserAttributes: [
      { Name: "name", Value: name },
      { Name: "email", Value: email }
    ]
  };

  try {
    await cognito.signUp(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User created successfully" })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Unable to create user" })
    };
  }
};

module.exports = { signup };

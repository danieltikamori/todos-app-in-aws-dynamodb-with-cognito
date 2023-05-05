"use strict";
const AWS = require("aws-sdk");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cognito = new AWS.CognitoIdentityServiceProvider();

const login = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  // Validate input
  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and password are required" })
    };
  }

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  };

  try {
    const result = await cognito.initiateAuth(params).promise();
    const accessToken = result.AuthenticationResult.AccessToken;
    const refreshToken = result.AuthenticationResult.RefreshToken;

    const decodedAccessToken = jwt.decode(accessToken);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User logged in successfully",
        accessToken,
        refreshToken,
        expiresIn: decodedAccessToken.exp - Math.floor(Date.now() / 1000)
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid credentials" })
    };
  }
};

module.exports = { login };

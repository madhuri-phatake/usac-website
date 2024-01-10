AWS.config.region = 'ap-south-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-south-1:57d18bff-3246-4503-be50-4f5539c73861',
});

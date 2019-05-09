AWS.config.update({
	accessKeyId: "AKIATNRLE65RYB4BXKZV",
	secretAccessKey: "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"
});

var s3 = new AWS.S3();

var apigClient = apigClientFactory.newClient();
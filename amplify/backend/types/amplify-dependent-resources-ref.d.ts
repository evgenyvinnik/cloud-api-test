export type AmplifyDependentResourcesAttributes = {
    "function": {
        "cloudapiecho": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "cloudapiwebhook": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "webhook": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}
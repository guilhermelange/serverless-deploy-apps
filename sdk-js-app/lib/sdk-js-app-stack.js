const { Stack, Duration } = require('aws-cdk-lib');
const lamdbaNodeJS = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const cwlogs = require("aws-cdk-lib/aws-logs");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");

class SdkJsAppStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */

  constructor(scope, id, props) {
    super(scope, id, props);
    

    const sampleDdb = new dynamodb.Table(this, "SdkSampleTable", {
      tableName: "SdkSampleTable",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    });

    const environmentData = {
        SAMPLE_TABLE: sampleDdb.tableName
    }

    const sampleListHandler = new lamdbaNodeJS.NodejsFunction(this, "SampleListFunction", {
        functionName: "SampleListFunction",
        entry: "src/handlers/get-all-items.js",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.seconds(2),
        bundling: {
            minify: false,
            sourceMap: false
        },
        environment: environmentData
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_135_0
    })

    const sampleFindHandler = new lamdbaNodeJS.NodejsFunction(this, "SampleFindFunction", {
        functionName: "SampleFindFunction",
        entry: "src/handlers/get-by-id.js",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.seconds(2),
        bundling: {
            minify: false,
            sourceMap: false
        },
        environment: environmentData
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_135_0
    })

    const sampleCreateHandler = new lamdbaNodeJS.NodejsFunction(this, "SampleCreateFunction", {
        functionName: "SampleCreateFunction",
        entry: "src/handlers/put-item.js",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.seconds(2),
        bundling: {
            minify: false,
            sourceMap: false
        },
        environment: environmentData
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_135_0
    })

    sampleDdb.grantFullAccess(sampleListHandler);
    sampleDdb.grantFullAccess(sampleFindHandler);
    sampleDdb.grantFullAccess(sampleCreateHandler);

    const logGroup = new cwlogs.LogGroup(this, "SdkApiLogs");
    const api = new apigateway.RestApi(this, "cdk-api", {
        restApiName: "cdk-api",
        deployOptions: {
            accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
            accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                httpMethod: true,
                ip: true,
                protocol: true,
                requestTime: true,
                resourcePath: true,
                responseLength: true,
                status: true,
                caller: true,
                user: true
            })
        }
    })
    
    // const sampleResource = api.root.addResource("sample");
    const sampleIdResource = api.root.addResource("{id}");

    const sampleListIntegration = new apigateway.LambdaIntegration(sampleListHandler);
    const sampleFindIntegration = new apigateway.LambdaIntegration(sampleFindHandler);
    const sampleCreateIntegration = new apigateway.LambdaIntegration(sampleCreateHandler);

    api.root.addMethod("GET", sampleListIntegration)
    api.root.addMethod("POST", sampleCreateIntegration)
    sampleIdResource.addMethod("GET", sampleFindIntegration)
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SdkJsAppQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { SdkJsAppStack }

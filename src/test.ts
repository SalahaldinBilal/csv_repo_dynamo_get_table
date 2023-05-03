import type { APIGatewayEvent } from 'aws-lambda'
import { handler } from './index'

const test = async () => {
  const testData: APIGatewayEvent = {
    body: null,
    isBase64Encoded: false,
    headers: {},
    httpMethod: "POST",
    multiValueHeaders: {},
    path: "",
    queryStringParameters: null,
    pathParameters: {
      name: "dynamo%20test.csv"
    },
    stageVariables: null,
    resource: "",
    requestContext: {} as any,
    multiValueQueryStringParameters: null
  }

  const response = await handler(testData, undefined as any, undefined as any);
  console.log(response)
  process.exit(1)
}

test();
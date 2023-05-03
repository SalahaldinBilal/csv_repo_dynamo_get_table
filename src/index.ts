import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as dotenv from 'dotenv'
import { response, getDynamoTableItems, s3NameToDynamoName } from './helpers';
dotenv.config();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const csvFileToDownload: string | undefined = event.pathParameters?.name;

    if (!csvFileToDownload?.length) return response(400, "Empty or non existent file name")

    return response(200, JSON.stringify(await getDynamoTableItems(s3NameToDynamoName(decodeURIComponent(csvFileToDownload)))));
  } catch (error) {
    return response(500, `Unexpected Error Happened: ${error}`);
  }
};
import * as dotenv from 'dotenv'
import type { CsvFileData } from "./types";
import { AttributeValue, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
dotenv.config();

const dynamoClient = new DynamoDBClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

export function s3NameToDynamoName(name: string) {
  return `salah_csv_repo_${name.replace(/[^a-zA-Z0-9_.-]/gm, "_")}`;
}

export async function getDynamoTableItems(tableName: string) {
  const params = new ScanCommand({
    TableName: tableName,
  });

  const scanResults: Array<Record<string, AttributeValue>> = [];

  do {
    const items = await dynamoClient.send(params);
    items.Items?.forEach((item) => scanResults.push(item));
    params.input.ExclusiveStartKey = items.LastEvaluatedKey!;
  } while (typeof params.input.ExclusiveStartKey !== "undefined");

  return scanResults.map(item => {
    delete item["id"];

    for (const [key, value] of Object.entries(item))
      item[key] = value.S! as any

    return item;
  });
}

export function response(statusCode: number, body: any, extraHeaders: { [key: string]: string } = {}) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders
    },
    body
  }
}
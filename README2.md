# project44/Celonis integration (Version 2)

## Purpose
The purpose of this reference implementation is to show how one might intgrate project44 with Celonis by pushing information from Movement, the project44 High Velocity Platform, to Celonis Process Mining Platform. This reference implementation is written using [nodejs](https://nodejs.org/en). This solution uses data push from project44 to create a set of tables in Celonis that include shipment and shipment order information. 

The difference between this version and [Version 1](./README.md) is that it sends a modified version of the JSON payload sent from project44 and places it in an AWS S3 Bucket. Celonis will then pick up the file and process. This requires that a mapping is performed 

## Schema mapping
The schema is generated using the Celonis the Configure Data Ingestion portion of the Celonis application. Use this [JSON document](./readme/sample.json) as a template.

| Variable | Description |
| ----------- | ----------- | 
| AWS_ACCESS_KEY_ID | Access key provide by Celonis when instance is created |
| AWS_SECRET_ACCESS_KEY | Secret provide by Celonis when instance is created |
| AWS_REGION | AWS region of the S3 bucket |


## Webhook methodHeaders Parameters
| x-celonis-connection-id | Connection ID provided by Celonis |
| x-celonis-url-region | Celonis region, part of the URL |
| x-celonis-aws-region | AWS Region for S3 Bucket |
| x-celonis-access-secret | Secret provide by Celonis when instance is created |
| x-celonis-bucket-id | S3 Bucket Name provided by Celonis |
| x-celonis-app | Name of Celonis App provided by Celonis |
| x-celonis-access-key | Access key provide by Celonis when instance is created |
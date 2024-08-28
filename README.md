# project44/Celonis integration (Version 1)

## Purpose
The purpose of this reference implementation is to show how one might intgrate project44 with Celonis by pushing information from Movement, the project44 High Velocity Platform, to Celonis Process Mining Platform. This reference implementation is written using [nodejs](https://nodejs.org/en). This solution uses data push from project44 to create a set of tables in Celonis that include shipment and shipment order information.

**Note:** This version tends to have duplicate keys. We have worked with Celonis on a new method of sending data in JSON format as a parquet file. The file is uploaded to an AWS S3 bucket and Celonis processes the file. There is an extensive setup process on the Celonis side. More details to be provided in the Version 2 README.md.

## Schema mapping
All Tables contain the unique project44 shipment id. Description of the Unified API Push Payload can be found in the [project44 Developer Portal Get Full Tracking History](https://developers.project44.com/api-reference/p44-api-reference/operation/getShipmentTrackingHistory/).

| Unified API Push Section | Celonis Table | Description |
| ----------- | ----------- | ----------- |
| events | shipment_events | Table containing shipment events such as LOAD, DELIVERY, GATE_IN_FULL, etc.  |
| events.dateTime | shipment_event_details | Table containing detailed information about events including source of event, sequencing, etc. |
| positions | shipment_positions | Table containing tracking latitude and longitude entries. Position data is only available for Ocean, Full Truckload, Rail, and Air shipments |
| shipment.attributes | shipment_attributes | Table containing known custom attributes |
| shipment.events | shipment_events | Table containing shipment events such as LOAD, DELIVERY, GATE_IN_FULL, etc.  |
| shipment.identifiers | shipment_identifiers | Table containing known shipment identifiers such as BOL, Container No., Waybill, etc. |
| shipment.relatedShipments | shipment_related_shipments | Table containing shipments that are associated with a parent shipment. This is common when there is a master bill of lading with one or more containers, as an example.|
| shipment.routeSegments.routeInfo | shipment_route_segments | Table containing routing information such as origin and destination. This information can also contain multi-stop route segments such as orgin to trans-shipment port to destination to final delivery. |
| shipment.routeSegments.stops | shipment_stops | Table containing all stop information for a shipment |
| states | shipment_states | Table containing shipment state information such as SCHEDULED, IN_TRANSIT, COMPLETED, etc. |

In Addition, the sync process can be configured to query for known orders and order items associated with a shipment and push to Celonis as part of the webhook processing. Set the environment variables `PROJECT44_INCLUDE_ORDERS` and `PROJECT44_INCLUDE_ORDER_ITEMS` = `true`. The webhook uses [Order Visiblity Search](https://developers.project44.com/api-reference/p44-api-reference/operation/searchOrders/) and [Order Visiblity Item Search](https://developers.project44.com/api-reference/p44-api-reference/operation/searchItems/) to collect the associated order and order item information associated with a shipment.

| Order API Pull Section | Celonis Table | Description |
| ----------- | ----------- | ----------- |
| order | shipment_orders | Table containing orders associated with a shipment |
| item | shipment_orders | Table containing order items associated with a shipment |

## Environment Variables

| Variable | Description |
| ----------- | ----------- | 
| PORT | Server port. If deployed to GCP, Heroku, AWS, or some other hosting service, then this value will be set automatically. The default is 3000 for local deployments if a port is not specified |
| ENV | Flag denoting if this is a production or development deployment. Default is `development` |
| P44_API_SERVER | project44 base URL. Default is `https://na12.api.project44.com`. May also use `https://eu12.api.project44.com` |
| CELONIS_API_SERVER | Base server URL for connecting to Celonis. Contact Celonis for what this value may be. Ex: `https://logistics-apps.us-1.celonis.cloud/` |
| CELONIS_API_KEY | Celonis API Key. Contact Celonis for more information. |
| CELONIS_POOL_ID | Celonis API Key. Contact Celonis for more information. |
| PROJECT44_CLIENT_ID | Client ID used to execute project44 API calls. For more information on creating a Client ID and Secret visit the [project44 Developer Portal - Create Client Application](https://developers.project44.com/api-reference/authentication/create-a-client-application/) section. This client id should have the necessary roles provisioned depending on modes that have been enabled. These roles may by `Air Visibility`, `Ocean Visibility API`, `Order Visiblity API`, `Parcel Visibility API`, `Truckload Visibility API`, `V4+ Ltl Tracking API` |
| PROJECT44_CLIENT_SECRET | Client Secret used to execute project44 API calls (see previous comment). |
| PROJECT44_INCLUDE_ORDERS | Flag to let the webhook know if it should pull order information. Default is false. |
| PROJECT44_INCLUDE_ORDER_ITEMS | Flag to let the webhook know if it should pull order item information. Default is false. |
| CRON_SCHEDULE | Configures a cron job to batch process sending jobs to Celonis. The default is to run every 2 minutes - '*/2 * * * *'. It is not recommended that this run less frequent. |



## Integration Steps - Overview
1. Download, build and test locallly.
2. Create OAuth2 credentials on project44.
3. Create and configure a webhook on the project44 platform that will push shipment updates the deployed integration.
4. Deploy to cloud platform of choice, such as Google Cloud Platform, Amazon Web Services, or Heroku.
5. Contact project44 [support](mailto:support@project44.com) to enable the webhook in your tenant.

## STEP 1 - Download, Build and Test Locally
To get started you will need to have [Node.js](https://nodejs.org/) installed. For more information on installing nodejs visit [How to install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).

Once Node.js is install, clone the project44/Celonis integration project repository from the project44 GitHub repository [celonis-project44-app](https://github.com/project44/celonis-project44-app).

```
git clone https://github.com/project44/celonis-project44-app
```
**Note:** for more information on installing GitHub locally visit the [Install Git](https://github.com/git-guides/install-git) page.

Once you have cloned the repository, you will need to install the necessary [npm](https://www.npmjs.com/) packages. You can do this by executing the following command in the `celonis-project44-app` directory.

```
npm install
```

This will add a directory called `node_modules` and allow you to run the server locally for testing. For example you could execute the following:

```
ENVIRONMENT=development PORT=3001 CELONIS_POOL_ID=[YOUR POOL ID] CELONIS_API_SERVER=https://project44-partner-sandbox.us-1.celonis.cloud CELONIS_API_KEY=[YOUR API KEY] PROJECT44_CLIENT_ID=[YOUR CLIENT ID] PROJECT44_CLIENT_SECRET=[YOUR CLIENT SECRET] node server.js 
```

## STEP 2 - Create OAuth Credentials
The most up to date information for creating a client id and secret can be found in the project44 [Guide to Autentication](https://developers.project44.com/api-reference/authentication/), part of the project44 [Developer Portal](https://developers.project44.com/). The APIs for creating Client Applications can be found [here](https://developers.project44.com/api-reference/p44-api-reference/tag/OAuth-2.0:-Client-Applications/).

Once you have created the OAuth crendentials you will need to assign the appropriate roles. Note, you may need your project44 admin to add the roles to the newly create account. The roles you will need to add are are specfic to the modes supported by your tenant, but they may include the following:
- Default Legacy Roles
- Ocean Visiblity API (optional)
- Parcel Visiblity API (optional)
- Rail Visiblity API (optional)
- Truckload Visiblity API (optional)
- v4+Ltl Tracking API (optional)

If configuring to support order visiblity then you will also need
- Order Visiblity API

## STEP 3 - Deploy to Cloud Platform of Choice
Now you are ready to deploy the application to your cloud platform of choice or on internal servers. Make sure you include the environment variables listed above. Retain the URL information as you will need it in the next step.

## STEP 4 - Create and Configure Webhook
Once you have created and configured your oAuth account you can create the webhook. You may create the webhook using any account that has the authority to create a webhook. For information on creating a webhook please review the [project44 Guide to Registering Client Webhooks](https://developers.project44.com/api-reference/p44-api-reference/tag/Webhook/). The URL will be the base URL of the location plus `/v1/api/webhook/from/project44` or (`[Base URL]/v1/api/webhook/from/project44`). Remember the name of the webhook to send to project44 support in the next step.

## STEP 5 - Contact project44 to Enable Webhook
Final step to enable the webhook is to contact support@project44.com to enable the webhook and provide the webhook name.

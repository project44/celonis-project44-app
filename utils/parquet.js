const parquet = require('parquetjs-lite');

const { schema: parquetSchema } = require('parquetjs');

const fs = require('fs');
const path = require('path');
const {logger} = require('./logger.js');
const dayjs = require('dayjs');


async function writeJsonParquetFile(payload) {
  var formattedDate = dayjs().format('YYYYMMDDHHmmssSSS');
  var firstRecord = payload[0];
  
   var schema = new parquet.ParquetSchema({
    events: {
        repeated: true.valueOf,
        optional: true,
        fields: {
          dateTime: { type: 'UTF8' , optional: true },
          dateTimes: {
            repeated: true,
            optional: true,
            fields: {
              type: { type: 'UTF8', optional: true  },
              dateTime: { type: 'UTF8' , optional: true },
              endDateTime: { type: 'UTF8', optional: true },
              lastModifiedDateTime: { type: 'UTF8' , optional: true },
              source: { type: 'UTF8' , optional: true },
              sourceIdentifiers: {
                repeated: true,
                optional: true,
                fields: {
                  type: { type: 'UTF8' , optional: true },
                  value: { type: 'UTF8' , optional: true }
                }
              },
              selected: { type: 'BOOLEAN' , optional: true },
              sequence: { type: 'INT32' , optional: true }
            }
          },
          description: { type: 'UTF8' , optional: true },
          estimateDateTime: { type: 'UTF8' , optional: true },
          estimateLastCalculatedDateTime: { type: 'UTF8' , optional: true },
          plannedDateTime: { type: 'UTF8' , optional: true },
          plannedEndDateTime: { type: 'UTF8' , optional: true },
          receivedDateTime: { type: 'UTF8' , optional: true },
          routeSegmentId: { type: 'UTF8' , optional: true },
          stopId: { type: 'UTF8' , optional: true },
          type: { type: 'UTF8' , optional: true }
        }
    },
    positions: {
      repeated: true,
      optional: true,
      fields: {
        dateTime: { type: 'UTF8' , optional: true },
        latitude: { type: 'DOUBLE' , optional: true },
        longitude: { type: 'DOUBLE' , optional: true },
        receivedDateTime: { type: 'UTF8' , optional: true },
        routeSegmentId: { type: 'UTF8' , optional: true }
      }
    },
    sharingContext: {
      repeated: false,
      optional: true,
      fields: {
        dataOriginators: {
          repeated: true,
          optional: true,
          fields: {
            tenantUuid: { type: 'UTF8' , optional: true },
            tenantName: { type: 'UTF8' , optional: true },
            tenantId: { type: 'INT32' , optional: true }
          }
        },
        recipients: {
          repeated: true,
          optional: true,
          fields: {
            tenantUuid: { type: 'UTF8' , optional: true },
            tenantName: { type: 'UTF8' , optional: true },
            tenantId: { type: 'INT32' , optional: true }
          }
        }
      }
    },
    shipment: { 
      repeated: false,
      optional: true,
      fields: {
        accessGroups: {
          repeated: true,
          optional: true,
          fields: {
            id: { type: 'UTF8' , optional: true }
          }
        },
        attributes: {
          repeated: true,
          optional: true,
          fields: {
            name: { type: 'UTF8' , optional: true },
            value: { type: 'UTF8' , optional: true }
          }
        },
        createdDateTime: { type: 'UTF8' , optional: true },
        id: { type: 'UTF8' , optional: true },
        identifiers: {
          repeated: true,
          optional: true,
          fields: {
            type: { type: 'UTF8' , optional: true },
            value: { type: 'UTF8' , optional: true }
          }
        },
        lastModifiedDateTime: { type: 'UTF8' , optional: true },
        relatedShipments: {
          repeated: true,
          optional: true,
          fields: {
            accessGroups: {
              repeated: true,
              optional: true,
              fields: {
                id: { type: 'UTF8' , optional: true }
              }
            },
            attributes: {
              repeated: true,
              optional: true,
              fields: {
                name: { type: 'UTF8' , optional: true },
                value: { type: 'UTF8' , optional: true }
              }
            },
            createdDateTime: { type: 'UTF8' , optional: true },
            id: { type: 'UTF8' , optional: true },
            identifiers: {
              repeated: true,
              optional: true,
              fields: {
                type: { type: 'UTF8' , optional: true },
                value: { type: 'UTF8' , optional: true }
              }
            },
            lastModifiedDateTime: { type: 'UTF8' , optional: true },
            shipmentShareLink: { type: 'UTF8' , optional: true }
          }
        },
        routeInfo: {
          repeated: false,
          optional: true,
          fields: {
            routeSegments: {
              repeated: true,
              optional: true,
              fields: {
                emissions: {
                  repeated: false,
                  optional: true,
                  fields: {
                    co2EmissionIntensity: {
                      repeated: false,
                      optional: true,
                      fields: {
                        value: { type: 'DOUBLE' , optional: true },
                        unit: { type: 'UTF8' , optional: true }
                      }
                    },
                    distance: {
                      repeated: false,
                      optional: true,
                      fields: {
                        value: { type: 'DOUBLE' , optional: true },
                        unit: { type: 'UTF8' , optional: true }
                      }
                    },
                    totalCO2Emissions: {
                      repeated: false,
                      optional: true,
                      fields: {
                        value: { type: 'DOUBLE' , optional: true },
                        unit: { type: 'UTF8' , optional: true }
                      }
                    }
                  }
                },
                fromStopId: { type: 'UTF8' , optional: true },
                id: { type: 'UTF8' , optional: true },
                identifiers: { 
                  repeated: true,
                  optional: true,
                  fields: {
                    type: { type: 'UTF8' , optional: true },
                    value: { type: 'UTF8' , optional: true }
                  }
                },
                toStopId: { type: 'UTF8' , optional: true },
                transportationMode: { type: 'UTF8' , optional: true } 
              }
            },
            stops: {
              repeated: true,
              optional: true,
              fields: {
                id: { type: 'UTF8' , optional: true },
                type: { type: 'UTF8' , optional: true }, 
                location: {
                  repeated: false,
                  optional: true,
                  fields: {
                    id: { type: 'UTF8' , optional: true },
                    name: { type: 'UTF8' , optional: true },
                    identifiers: {
                      repeated: true,
                      optional: true,
                      fields: {
                        type: { type: 'UTF8' , optional: true },
                        value: { type: 'UTF8' , optional: true }
                      }
                    },
                    address: {
                      repeated: false,
                      optional: true,
                      fields: {
                        postalCode: { type: 'UTF8' , optional: true },
                        city: { type: 'UTF8' , optional: true },
                        state: { type: 'UTF8' , optional: true },
                        country: { type: 'UTF8' , optional: true },
                        addressLine1: { type: 'UTF8' , optional: true },
                        addressLine2: { type: 'UTF8' , optional: true },
                        addressLine3: { type: 'UTF8' , optional: true }
                      }
                    },
                    coordinates: { 
                      repeated: false,
                      optional: true,
                      fields: {
                        latitude: { type: 'DOUBLE' , optional: true },
                        longitude: { type: 'DOUBLE' , optional: true }
                      }
                    },
                    timeZone: { type: 'UTF8' , optional: true }
                  }
                }
              }
            }
          }
        },
        shipmentShareLink: { type: 'UTF8' , optional: true }
      }
    },
    states: {
      repeated: true,
      optional: true,
      fields: {
        endDateTime: { type: 'UTF8', optional: true }, // Can be null
        routeSegmentId: { type: 'UTF8' , optional: true },
        startDateTime: { type: 'UTF8' , optional: true },
        stopId: { type: 'UTF8' , optional: true },
        type: { type: 'UTF8' , optional: true }
      }
    },
    orders: {
      repeated: true,
      optional: true,
      fields: {
        additionalOrderIdentifiers: {
          repeated: true,
          optional: true,
          fields: {
            type: { type: 'UTF8' , optional: true },
            value: { type: 'UTF8' , optional: true }
          }
        },
        attributes: {
          repeated: true,
          optional: true,
          fields: {
            name: { type: 'UTF8' , optional: true },
            value: { type: 'UTF8' , optional: true }
          }
        },
        derivedOrderHealth: {
          repeated: false,
          optional: true,
          fields: {
            arrivalStatus: {
              repeated: false,
              optional: true,
              fields: {
                code: { type: 'UTF8' , optional: true },
                duration: {
                  repeated: false,
                  optional: true,
                  fields: {
                    unit: { type: 'UTF8' , optional: true },
                    amount: { type: 'DOUBLE' , optional: true } 
                  }
                }
              }
            },
            estimatedTimeOfArrival: { type: 'UTF8' , optional: true }
          }
        },
        freightTerms: {
          repeated: false,
          optional: true,
          fields: {
            freightOwnershipType: { type: 'UTF8' , optional: true },
            transportationPaymentType: { type: 'UTF8' , optional: true }
          }
        },
        id: { type: 'UTF8' , optional: true },
        launchDateTime: { type: 'UTF8' , optional: true },
        orderIdentifier: { type: 'UTF8' , optional: true },
        orderIdentifierAuthority: { type: 'UTF8' , optional: true },
        orderSubmissionDateTime: { type: 'UTF8' , optional: true },
        orderTags: { 
          repeated: true, 
          optional: true,
          fields: {
            description: { type: 'UTF8' , optional: true },
            type: { type: 'UTF8' , optional: true },
            value: { type: 'UTF8' , optional: true }
          }
        }, 
        orderType: { type: 'UTF8' , optional: true },
        originalDeliveryDateTimeWindow: {
          repeated: false,
          optional: true,
          fields: {
            startDateTime: { type: 'UTF8' , optional: true },
            endDateTime: { type: 'UTF8' , optional: true }
          }
        },
        statusCode: { type: 'UTF8' , optional: true },
        statusCodeDateTime: { type: 'UTF8' , optional: true },
        subject: { type: 'UTF8' , optional: true },
        supplierReadyDateTimeWindow: {
          repeated: false,
          optional: true, 
          fields: {
            startDateTime: { type: 'UTF8' , optional: true },
            endDateTime: { type: 'UTF8' , optional: true }
          }
        },
        totalCost: { 
          repeated: false,
          optional: true,
          fields: {
            currency: { type: 'UTF8' , optional: true },
            amount: { type: 'DOUBLE' , optional: true }
          }
        },
        totalRetailValue: {
          repeated: false,
          optional: true,
          fields: {
            currency: { type: 'UTF8' , optional: true },
            amount: { type: 'DOUBLE' , optional: true }
          }
        },
        locations: {
          repeated: true,
          optional: true,
          fields: {
            address: {
              repeated: false,
              optional: true,
              fields: {
                postalCode: { type: 'UTF8' , optional: true },
                city: { type: 'UTF8' , optional: true },
                state: { type: 'UTF8' , optional: true },
                country: { type: 'UTF8' , optional: true },
                addressLine1: { type: 'UTF8' , optional: true },
                addressLine2: { type: 'UTF8' , optional: true },
                addressLine3: { type: 'UTF8' , optional: true }
              }
            },
            id: { type: 'UTF8' , optional: true },
            name: { type: 'UTF8' , optional: true },
            suppliedId: { type: 'UTF8' , optional: true },
            type: { type: 'UTF8' , optional: true },
            contacts: {
              repeated: true,
              optional: true,
              fields: {
                companyName: { type: 'UTF8' , optional: true },
                contactName: { type: 'UTF8' , optional: true },
                contactType: { type: 'UTF8' , optional: true },
                email: { type: 'UTF8' , optional: true },
                phoneNumber: { type: 'UTF8' , optional: true },
                id: { type: 'UTF8' , optional: true }
              }
            }
          }
        },
        orderItems: {
          repeated: true,
          optional: true,
          fields: {
            consumeByDateTime: { type: 'UTF8' , optional: true },
            description: { type: 'UTF8' , optional: true },
            id: { type: 'UTF8' , optional: true },
            inventoryDimensionalWeight: {
              repeated: false,
              optional: true,
              fields: {
                cubicDimension: {
                  repeated: false,
                  optional: true, 
                  fields: {
                    length: { type: 'DOUBLE' , optional: true },
                    width: { type: 'DOUBLE' , optional: true },
                    height: { type: 'DOUBLE' , optional: true }
                  }
                },
                lengthUnit: { type: 'UTF8' , optional: true },
                packageType: { type: 'UTF8' , optional: true },
                quantity: { type: 'INT32' , optional: true },
                weight: {
                  repeated: false,
                  optional: true,
                  fields: {
                    weight: { type: 'DOUBLE' , optional: true },
                    weightUnit: { type: 'UTF8' , optional: true }
                  }
                }
              }
            },
            inventoryIdentifiers: {
              repeated: true,
              optional: true,
              fields: {
                description: { type: 'UTF8' , optional: true },
                type: { type: 'UTF8' , optional: true },
                value: { type: 'UTF8' , optional: true }
              }
            },
            lineItemHazmatDetail: {
              repeated: false,
              optional: true,
              fields: {
                hazardClass: { type: 'UTF8' , optional: true }
              }
            },
            manufacturedDateTime: { type: 'UTF8' , optional: true },
            packagedDateTime: { type: 'UTF8' , optional: true },
            perUnitCost: {
              repeated: false,
              optional: true,
              fields: {
                currency: { type: 'UTF8' , optional: true },
                amount: { type: 'DOUBLE' , optional: true }
              }
            },
            perUnitRetailValue: {
              repeated: false,
              optional: true,
              fields: {
                currency: { type: 'UTF8' , optional: true },
                amount: { type: 'DOUBLE' , optional: true }
              }
            },
            perishable: { type: 'BOOLEAN' , optional: true },
            promotionalDateTimeWindow: {
              repeated: false,
              optional: true,
              fields: {
                startDateTime: { type: 'UTF8', optional: true }, // Can be missing
                endDateTime: { type: 'UTF8', optional: true }  // Can be missing
              }
            },
            sellByDateTime: { type: 'UTF8' , optional: true },
            serialNumber: { type: 'UTF8' , optional: true },
            stockKeepingUnit: { type: 'UTF8' , optional: true },
            taxable: { type: 'BOOLEAN' , optional: true },
            universalProductCode: { type: 'UTF8' , optional: true }
          }
        }
      }
    }
  
  });

  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles`);
  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles/json`);
  const filename = `${path.resolve(__dirname)}/../parquetFiles/json/${firstRecord.shipment.id}_${formattedDate}.parquet`;

  logger.info(`Creating File ${filename}.`);

  try {
    var writer = await parquet.ParquetWriter.openFile(schema, filename);

    for(const record of payload) {
      await writer.appendRow(record);
    }
    await writer.close();
    logger.info(`File ${filename} Created.`);
    return filename;      
  } catch (error) {
    logger.error(error);
    return filename;    
  }
}

/**
 * Writes data to a Parquet file.
 * @param {Array} data - The data to be written to the Parquet file.
 * @param {string} shipmentId - The shipment ID.
 * @param {string} section - The section of the Parquet file.
 * @param {object} schema - The schema of the Parquet file.
 * @returns {string} - The filename of the created Parquet file.
 */
async function writeParquetFile(data, section, schema, shipmentId) {

  var formattedDate = dayjs().format('YYYYMMDDHHmmssSSS');

  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles`);
  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles/${section}`);
  
  const filename = `${path.resolve(__dirname)}/../parquetFiles/${section}/${shipmentId}_${formattedDate}.parquet`;
  
  logger.info(`Creating File ${filename}.`);
  
  try {
    if(data && data.length > 0) {
      const writer = await parquet.ParquetWriter.openFile(schema, filename, {useDataPageV2: false});
      for (let i = 0; i < data.length; i++) {
        // logger.info(JSON.stringify(data[i]));
        await writer.appendRow(data[i]);
      }
      await writer.close();
      logger.info(`File ${filename} Created.`);
  
      return filename;
    } else {
      logger.info(`No Data. File ${filename} Was Not Created.`);
      return filename;
    }
      
  } catch (error) {
    logger.error(error);
    return filename;    
  }
}

/**
 * Deletes a Parquet file.
 * @param {string} filename - The name of the file to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully deleted.
 */
async function deleteParquetFile(filename) {
  await fs.unlink(filename, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info(`File ${filename} Removed.`);
  });
}

/**
 * Checks if a directory exists and creates it if it doesn't.
 * @param {string} directory - The directory path to check/create.
 * @returns {Promise<void>} - A promise that resolves when the directory is checked/created.
 */
async function checkDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

module.exports = {
  writeParquetFile,
  writeJsonParquetFile,
  deleteParquetFile,
};


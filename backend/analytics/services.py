from bson import json_util
from bson.objectid import ObjectId
from response import make_json_response
from database import db
# from documentdb import db

positionsCollection = db.positions
priceCollection = db.price

def get_fund_aggregate(aggregateKey, fundId, startDate, endDate):
    if aggregateKey == "instrumentName":
        pipeline = [
            {
                "$match": {
                    "fundId" : int(fundId),
                    "reportedDate": {"$gte": startDate, "$lte": endDate}
                }
            },
            {
                "$group": {
                    "_id": "$" + aggregateKey,
                    "totalMarketValue": {
                        "$sum": "$marketValue"
                    }
                }
            }
        ]
    else:
        pipeline = [
            {
                "$match": {
                    "fundId" : int(fundId),
                    "reportedDate": {"$gte": startDate, "$lte": endDate}
                }
            },
            {
                "$lookup": {
                    "from": "instruments",
                    "localField": "instrumentId",
                    "foreignField": "_id",
                    "as": "instrument_data"
                }
            },
            {
                "$unwind": "$instrument_data"
            },
            {
                "$group": {
                    "_id": "$instrument_data." + aggregateKey,
                    "totalMarketValue": {
                        "$sum": "$marketValue"
                    }
                }
            }
        ]
    result = list(db.positions.aggregate(pipeline))
    return make_json_response(result, 200)

def get_country_aggregate():
    pipeline = [
        {
            "$lookup": {
                "from": "instruments",
                "localField": "instrumentId",
                "foreignField": "_id",
                "as": "instrument_data"
            }
        },
        {
            "$unwind": "$instrument_data"
        },
        {
            "$group": {
                "_id": "$instrument_data.country",
                "totalMarketValue": {
                    "$sum": "$marketValue"
                }
            }
        }
    ]
    result = list(db.positions.aggregate(pipeline))
    return make_json_response(result, 200)

def get_funds_performance():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "fund": "$fund",
                    "reportedDate": "$reportedDate" ,
                },
                "totalMarketValue": {
                    "$sum": "$marketValue"
                }
            }
        }
    ]
    result = list(db.positions.aggregate(pipeline))
    return make_json_response(result, 200)

def get_latest_instrument_price(document, upperBoundDate):
    pipeline = [
        {
            "$match": {
                "$and": [
                    {
                        "$or": [
                            { 
                                "isinCode": document["isinCode"] if "isinCode" in document else document["symbol"]
                            },
                            {
                                "symbol": document["symbol"] if "symbol" in document else document["isinCode"]
                            }
                        ]
                    },
                    {
                        "reportedDate": {"$lt": upperBoundDate}
                    }
                ]
            }
        },
        {
            "$sort": {
                "date": -1  
            }
        },
        {
            "$limit": 1
        }
    ]

    result = list(priceCollection.aggregate(pipeline))
    try:
        return result[0]["unitPrice"]
    except:
        print(document)

def get_total_market_value(lowerDate, upperDate):
    pipeline = [
        {
            "$match": {
                "reportedDate": {"$gte": lowerDate, "$lte": upperDate}
            }
        },
        {
            "$group": {
                "_id": "$fundId",
                "totalMarketValue": {"$sum": "$marketValue"}
            }
        }
    ]

    result = list(positionsCollection.aggregate(pipeline))
    return make_json_response(result, 200)

def get_total_investment_returns_funds(lowerDate, upperDate):
    pipeline = [
        {
            "$match": {
                "reportedDate": {
                    "$gt": lowerDate,
                    "$lte": upperDate
                }
            }
        },
        {
            "$project": {
                "fundId": 1,
                "marketValue": 1,
                "year": {"$year": "$reportedDate"},
                "month": {"$month": "$reportedDate"}
            }
        },
        {
            "$group": {
                "_id": {
                    "fundId": "$fundId",
                    "year": "$year",
                    "month": "$month"
                },
                "firstDayMarketValue": {"$first": "$marketValue"},
                "lastDayMarketValue": {"$last": "$marketValue"}
            }
        },
        {
            "$addFields": {
                "investmentReturn": {
                    "$divide": [
                        {"$subtract": ["$lastDayMarketValue", "$firstDayMarketValue"]},
                        "$firstDayMarketValue"
                    ]
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "fundId": "$_id.fundId",
                "year": "$_id.year",
                "month": "$_id.month",
                "investmentReturn": 1
            }
        }
    ]

    returns = list(positionsCollection.aggregate(pipeline))

    # old_market_values = list(positionsCollection.aggregate(pipeline))

    # pipeline = [
    #     {
    #         "$match": {
    #             "reportedDate": {"$gt": lowerDate, "$lte": upperDate}
    #         }
    #     },
    #     {
    #         "$sort": {
    #             "reportedDate": -1
    #         }
    #     },
    #     {
    #         "$group": {
    #             "_id": "$fundId",
    #             "latestReportedDate": {"$first": "$reportedDate"},
    #             "marketValue": {"$first": "$marketValue"}
    #         }
    #     },
    #     {
    #         "$sort": {
    #             "_id": 1  # Sort by fundId in ascending order
    #         }
    #     },
    # ]
    # latest_market_values = list(positionsCollection.aggregate(pipeline))

    # returns = {}

    # for oldFund in old_market_values:
    #     for newFund in latest_market_values:
    #         if oldFund["_id"] == newFund["_id"]:
    #             returns[oldFund["_id"]] = newFund["marketValue"]/oldFund["marketValue"] - 1

    return make_json_response(json_util.dumps(returns), 200)

def get_total_investment_returns_instruments(lowerDate, upperDate):
    pipeline = [
        {
            "$match": {
                "reportedDate": {
                    "$gt": lowerDate,
                    "$lte": upperDate
                }
            }
        },
        {
            "$project": {
                "instrumentId": 1,
                "marketValue": 1,
                "realisedProfitLoss": 1,
                "year": {"$year": "$reportedDate"},
                "month": {"$month": "$reportedDate"}
            }
        },
        {
            "$group": {
                "_id": {
                    "instrumentId": "$instrumentId",
                    "year": "$year",
                    "month": "$month"
                },
                "firstDayMarketValue": {"$first": "$marketValue"},
                "lastDayMarketValue": {"$last": "$marketValue"},
                "realisedProfitLoss": {"$sum": "$realisedProfitLoss"}
            }
        },
        {
            "$addFields": {
                "investmentReturn": {
                    "$subtract": [
                        {
                            "$divide": [
                                {"$add": ["$lastDayMarketValue", "$realisedProfitLoss"]},
                                "$firstDayMarketValue"
                            ]
                        },
                        1
                    ]
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "fundId": "$_id.fundId",
                "year": "$_id.year",
                "month": "$_id.month",
                "investmentReturn": 1
            }
        }
    ]
    returns = list(positionsCollection.aggregate(pipeline))
    # pipeline = [
    #     {
    #         "$match": {
    #             "reportedDate": {"$gt": lowerDate, "$lte": upperDate}
    #         }
    #     },
    #     {
    #         "$sort": {
    #             "reportedDate": 1
    #         }
    #     },
    #     {
    #         "$group": {
    #             "_id": "$instrumentId",
    #             # "_id": "$securityName",
    #             "marketValue": {"$first": "$marketValue"}
    #         }
    #     },
    # ]

    # old_market_values = list(positionsCollection.aggregate(pipeline))
    # pipeline = [
    #     {
    #         "$match": {
    #             "reportedDate": {"$gt": lowerDate, "$lte": upperDate}
    #         }
    #     },
    #     {
    #         "$sort": {
    #             "reportedDate": -1
    #         }
    #     },
    #     {
    #         "$group": {
    #             "_id": "$instrumentId",
    #             # "_id": "$securityName",
    #             "marketValue": {"$first": "$marketValue"},
    #             "realisedProfitLoss": {"$first": "$realisedProfitLoss"}
    #         }
    #     },
    # ]
    # latest_market_values = list(positionsCollection.aggregate(pipeline))
    # returns = {}

    # for oldFund in old_market_values:
    #     for newFund in latest_market_values:
    #         if oldFund["_id"] == newFund["_id"]:
    #             returns[oldFund["_id"]] = (newFund["marketValue"] + newFund["realisedProfitLoss"])/oldFund["marketValue"] - 1

    return make_json_response(json_util.dumps(returns), 200)

def get_top_N():
    pipeline = [
        {
            "$sort": {
                "reportedDate": 1
            }
        },
        {
            "$group": {
                "_id": "$fund",
                "marketValue": {"$first": "$marketValue"}
            }
        },
    ]

    old_market_values = list(positionsCollection.aggregate(pipeline))
    pipeline = [
        {
            "$sort": {
                "reportedDate": -1
            }
        },
        {
            "$group": {
                "_id": "$fund",
                "marketValue": {"$first": "$marketValue"},
            }
        },
    ]
    latest_market_values = list(positionsCollection.aggregate(pipeline))
    returns = {}

    for oldFund in old_market_values:
        for newFund in latest_market_values:
            if oldFund["_id"] == newFund["_id"]:
                returns[oldFund["_id"]] = (newFund["marketValue"]/oldFund["marketValue"] - 1) * 100

    topN = dict(sorted(returns.items(), key=lambda item: item[1], reverse=True))

    return make_json_response(json_util.dumps(topN), 200)

def get_all(collection):
    cursor = collection.find()
    return make_json_response(json_util.dumps(cursor), 200)

def get_by_id(id, collection):
    cursor = collection.find_one({"_id": ObjectId(id)})
    return make_json_response(json_util.dumps(cursor), 200)

def get_by_instrument(instrument, collection):
    cursor = collection.find_one({"instrumentId": instrument})
    return make_json_response(json_util.dumps(cursor), 200)

def get_by_country(country, collection):
    cursor = collection.find_one({"country": country})
    return make_json_response(json_util.dumps(cursor), 200)

def get_by_sector(sector, collection):
    cursor = collection.find_one({"sector": sector})
    return make_json_response(json_util.dumps(cursor), 200)

def get_by_fund(fund, collection):
    cursor = collection.find_one({"fundId": fund})
    return make_json_response(json_util.dumps(cursor), 200)

# TODO: Datetime treatment?
def get_by_date(date, collection):
    cursor = collection.find_one({"date": date})
    return make_json_response(json_util.dumps(cursor), 200)

# TODO: Datetime treatment?
def get_by_date_range(start_date, end_date, collection):
    cursor = collection.find({"start_date": start_date, "end_date": end_date})
    return make_json_response(json_util.dumps(cursor), 200)

def get_top_N_funds(frequency, date, N, collection):
    cursor = collection.find({"date": date})
    cursor = collection.find(
        {
            "date": date
        }
    ).sort("investment_return", -1).limit(N)
    return make_json_response(json_util.dumps(cursor), 200)

def delete_all(collection):
    try:
        result = collection.delete_many({})
        deleted_count = result.deleted_count
        return make_json_response(f"Deleted {deleted_count} documents successfully", 200)
    except Exception as e:
        return make_json_response(str(e), 500)

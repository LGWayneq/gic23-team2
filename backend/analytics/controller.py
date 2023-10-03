from .services import *
from flask import Blueprint, request
from response import unsupported_method

analytics_blueprint = Blueprint("analytics", __name__)

@analytics_blueprint.route("/<aggregateKey>/<fundId>/<startDate>/<endDate>", methods=['GET'])
def getAggregate(aggregateKey, fundId, startDate, endDate):
    if request.method == "GET":
        return get_fund_aggregate(aggregateKey, fundId, startDate, endDate)
    else:
        return unsupported_method()
    
@analytics_blueprint.route("/country", methods=['GET'])
def getCountryAggregate():
    if request.method == "GET":
        return get_country_aggregate()
    else:
        return unsupported_method()

@analytics_blueprint.route("/performance", methods=['GET'])
def getPerformance():
    if request.method == "GET":
        return get_funds_performance()
    else:
        return unsupported_method()

@analytics_blueprint.route("/market/<lowerDate>/<upperDate>", methods=['GET'])
def getTotalMarketValue(lowerDate, upperDate):
    if request.method == "GET":
        return get_total_market_value(lowerDate, upperDate)
    else:
        return unsupported_method()
    
@analytics_blueprint.route("/returns/funds/<lowerDate>/<upperDate>", methods=['GET'])
def getMonthlyReturnsFunds(lowerDate, upperDate):
    if request.method == "GET":
        return get_total_investment_returns_funds(lowerDate, upperDate)
    else:
        return unsupported_method()
    
@analytics_blueprint.route("/returns/instruments/<lowerDate>/<upperDate>", methods=['GET'])
def getMonthlyReturnsInstruments(lowerDate, upperDate):
    if request.method == "GET":
        return get_total_investment_returns_instruments(lowerDate, upperDate)
    else:
        return unsupported_method()
    
@analytics_blueprint.route("/returns/topN", methods=['GET'])
def getTopN():
    if request.method == "GET":
        return get_top_N()
    else:
        return unsupported_method()
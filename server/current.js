// auth.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();
const axios = require("axios");

const { inspect } = require('util')

/**
 * Routes Definitions
 */

const CURRENT_RMS_API_URL = 'https://api.current-rms.com/api/v1';


function isAuthenticated(req, res, next) {

    //if (req.user.authenticated)
    if ( req.session != null && 
         req.session.passport != null && 
         req.session.passport.user != null )
        return next();
  
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}


function getAccessToken( req ) {
    return req.session.passport.user.accessToken;
}


async function GetResource( url, accessToken ) {

    let headers = {
        headers: { 
            'X-SUBDOMAIN': 'twofoxesstyling', 
            'Authorization': 'Bearer '+ accessToken 
        }
    };

    let res = await axios.get( url, headers );

    return res.data;
}

getOpportunityItems = async (accessToken, opportunity_id) => {
    let url = CURRENT_RMS_API_URL + '/opportunities/' 
        + opportunity_id + '/opportunity_items';

    let { opportunity_items } = await GetResource( url, accessToken );
    return opportunity_items;
}

getOpportunityPage = async (accessToken, page, per_page, filter) => {
    let url = CURRENT_RMS_API_URL + '/opportunities'
      + '?page=' + page + "&per_page=" + per_page 
      + "&filter=" + filter;

    let { opportunities } = await GetResource(url, accessToken);
    return opportunities;
}

getAllOpportunities = async (accessToken, filter) => {
    let page = 1;
    let opportunities = [];
    while (true) {
        // Lets get all the remaining opportunities.
        let result = await getOpportunityPage( accessToken, page, 50, filter );
        if ( !result || !result.length ) {
            break;
        }

        // Push all the listed opportunities into our return list.
        for ( r in result ) {
            opportunities.push( result[r] );
        }

        page = page + 1;
    }
    
    return opportunities;
}

router.get( 
    "/current/opportunities",
    isAuthenticated,
    async (req, res, next) => {      
        try {  
            console.log( 'Fetching Opportunities' );
            let opportunities = await getAllOpportunities( getAccessToken(req), 'live' );
            
            console.log('Sending Opportunities');
            res.setHeader('Content-Type', 'application/json');
            res.send( JSON.stringify(opportunities) );
        }
        catch (error) {
            console.log( "error!" );
            next(error);
        }
    }
);

router.get( 
    "/current/services",
    isAuthenticated,
    async (req, res, next) => {      
        try {      
            let services = [];

            const MAX_SERVICES = 8;

            let page = 1;
            while (services.length < MAX_SERVICES) {
                
                //@todo: Filter the opportunities based upon date?                
                console.log( 'Fetching Opportunities' );
                let opportunities = await getOpportunityPage( getAccessToken(req), page, 25, 'live' );
                if ( !opportunities || !opportunities.length ) {
                    break;
                }

                console.log( 'Fetching Opportunity Items' );
                for ( i in opportunities ) {
                    let items = await getOpportunityItems( getAccessToken(req), opportunities[i].id );
                    
                    // Filter items list for services
                    let service_items = items.filter( 
                        (item) => { return (item.item_type == 'Service'); });

                    // Add any services_items to the services list.
                    services = services.concat( service_items ); 

                    if (services.length >= MAX_SERVICES) {
                        break;
                    }
                }

                page = page + 1;
            }

            console.log( services );

            // send services
            console.log('Sending services');
            res.setHeader('Content-Type', 'application/json');
            res.send( JSON.stringify(services) );
        }
        catch (error) {
            console.log( "error!" );
            next(error);
        }
    }
);

/**
 * Module Exports
 */

module.exports = router;
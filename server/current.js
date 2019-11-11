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


async function getOpportunityItems(opportunity_id, accessToken) {

    let OPPORTUNITIES_ITEMS_URL = '/opportunities/' + opportunity_id + '/opportunity_items';

    let res = await axios.get( CURRENT_RMS_API_URL + OPPORTUNITIES_ITEMS_URL, { 
        headers: { 
            'X-SUBDOMAIN': 'twofoxesstyling', 
            'Authorization': 'Bearer '+ accessToken 
        }});

    let { opportunity_items }  = res.data;
    return opportunity_items;
}

getOpportunityPage = async (accessToken, page, per_page, filter) => {
    const OPPORTUNITIES_URL = '/opportunities';

    let res = await axios.get( 
            CURRENT_RMS_API_URL + OPPORTUNITIES_URL + '?page=' + page + "&per_page=" + per_page + "&filter=" + filter, 
            { 
                headers: { 
                    'X-SUBDOMAIN': 'twofoxesstyling', 
                    'Authorization': 'Bearer '+ accessToken 
                }   
            });

    let { opportunities }  = res.data;
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
                    console.log( "getting items for opportuntity; " + opportunities[i].id + " " + opportunities[i].subject );

                    let items = await getOpportunityItems( opportunities[i].id, getAccessToken(req) );
                    
                    // Walk the list of items in search of services
                    for ( j in items ) {    
                        if ( items[j].item_type == 'Service' ) {
                            console.log( "We have " + services.length + " Services" );
                            
                            let item = items[j];
                            item.opportunity_name = opportunities[i].subject;

                            services.push( item ); 
                        }

                        if (services.length >= MAX_SERVICES) {
                            break;
                        }
                    }

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
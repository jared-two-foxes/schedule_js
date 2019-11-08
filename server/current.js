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


function isAuthenticated(req) {
    return ( req.session != null && 
        req.session.passport != null && 
        req.session.passport.user != null );
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

getOpportunities = async (accessToken) => {
    const OPPORTUNITIES_URL = '/opportunities';

    let res = await axios.get( CURRENT_RMS_API_URL + OPPORTUNITIES_URL, { 
            headers: { 
                'X-SUBDOMAIN': 'twofoxesstyling', 
                'Authorization': 'Bearer '+ accessToken 
            }});

    let { opportunities }  = res.data;
    return opportunities;
}

router.get( 
    "/current/opportunities",
    async (req, res, next) => {      
        try {  
            if ( isAuthenticated(req) ) {
                
                const accessToken = req.session.passport.user.accessToken;

                let opportunities = await getOpportunities( accessToken );
                
                console.log( 'fetching items' );

                for ( i in opportunities ) {
                    let items = await getOpportunityItems( i, accessToken );
                    
                    // prep services list
                    opportunities[i].services = [];

                    // Walk the items in search of services?
                    for ( j in items ) {
                        console.log( items[j].item_type );
                        if ( items[j].item_type == "Service" ) {
                            opportunities[i].services.push( items[j] ); 
                        }
                    }

                    console.log( opportunities[i].services );
                }

                res.setHeader('Content-Type', 'application/json');
                res.send( JSON.stringify(opportunities) );
            }
            else {
                res.end();
            }
        }
        catch (error) {
            next(error);
        }
    }
);

/**
 * Module Exports
 */

module.exports = router;
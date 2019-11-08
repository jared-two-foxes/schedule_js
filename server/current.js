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

    const OPPORTUNITIES_ITEMS_URL = '/opportunities/${opportunity_id}/opportunity_items';

    let res = await axios.get( CURRENT_RMS_API_URL + OPPORTUNITIES_ITEMS_URL, { 
        headers: { 
            'X-SUBDOMAIN': 'twofoxesstyling', 
            'Authorization': 'Bearer '+ accessToken 
        }});

    let { data }  = res;
    return data;
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

                let result = await getOpportunities( accessToken );
                
                // for ( op in result ) {
                //     let items = await getOpportunityItems( op["id"], accessToken );
                //     console.log( items );
                // }

                res.setHeader('Content-Type', 'application/json');
                res.send( JSON.stringify(result) );
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
// auth.js

/**
 * Required External Modules
 */

const axios = require("axios");
require('datejs');



/**
 * Current-RMS REST Wrappers
 */


const CURRENT_RMS_API_URL = 'https://api.current-rms.com/api/v1';


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


async function getOpportunityItems(accessToken, opportunity_id) {
    let url = CURRENT_RMS_API_URL + '/opportunities/' 
        + opportunity_id + '/opportunity_items';

    let { opportunity_items } = await GetResource( url, accessToken );
    return opportunity_items;
}

async function getOpportunityById(accessToken, id) {
    let url = CURRENT_RMS_API_URL + '/opportunities/'
    + id;

    let { opportunity } = await GetResource(url, accessToken);

    return opportunity;
}

async function getOpportunityPage(accessToken, page, per_page, filter) {
    let url = CURRENT_RMS_API_URL + '/opportunities'
      + '?page=' + page + "&per_page=" + per_page 
      + "&filter=" + filter;

    let { opportunities } = await GetResource(url, accessToken);
    return opportunities;
}

async function getAllOpportunities(accessToken, filter) {
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

async function updateOpportunity(accessToken, id, body) {
    let url = CURRENT_RMS_API_URL + '/opportunities/'
      + id;

    let headers = {
        headers: { 
            'X-SUBDOMAIN': 'twofoxesstyling', 
            'Authorization': 'Bearer '+ accessToken,
            'Content-Type': 'application/json'
        }
    };

    let res = await axios.put( url, body, headers );

    console.log( res );

    return res;
}


/**
 * Module Exports
 */

module.exports = { 
    getOpportunityItems,
    getOpportunityPage,
    getAllOpportunities,
    getOpportunityById,
    updateOpportunity
};
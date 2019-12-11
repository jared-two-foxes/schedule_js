// tasks.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();

const current_api = require("./current_api");


/**
 * Authentication
 */

function isAuthenticated(req, res, next) {

    // Apparently this should be set and we can check that 
    // rather than directly accessing the passport link?

    //console.log( req.user.authenticated );

    if ( req.session != null && 
         req.session.passport != null && 
         req.session.passport.user != null ) {
        return next();
    }
  
    //@todo:  If a user hasnt been logged in redirect them somewhere...? 
    res.redirect('/');
}

function getAccessToken( req ) {
    return req.session.passport.user.accessToken;
}


/**
 * Routes
 */

router.get( 
    "/tasks",
    isAuthenticated,
    async (req, res, next) => {      
        const MAX_SERVICES = 8;
            
        let services = [];

        // Lets filter all the opportunities by the current date, add if the start
        // or end date is within the next 2 weeks?
        const startDate = !req.query.startDate ? Date.today() : new Date(parseInt(req.query.startDate));
        const endDate = !req.query.endDate ? Date.today().add({days: 7}) : new Date(parseInt(req.query.endDate));
        
        let debugMsg = `Colating Services between ${startDate} & ${endDate}`
        console.log(debugMsg);

        try {      
            let page = 1;
            while (services.length < MAX_SERVICES) {
                
                //@todo: Filter the opportunities based upon date?                
                let opportunities = await current_api.getOpportunityPage( getAccessToken(req), page, 25, 'live' );
                if ( !opportunities || !opportunities.length ) {
                    break;
                }
                
                for ( i in opportunities ) {
                    var o = opportunities[i];
                    var starts_at = new Date( o.starts_at );

                    if ( !starts_at.between( startDate, endDate ) ) {
                        continue;
                    }

                    const items = await current_api.getOpportunityItems( getAccessToken(req), o.id );
                    
                    // Filter items list for services
                    const service_items = items.filter( 
                        (item) => { return (item.item_type == 'Service'); });

                    // Need to add the opportunity name to the struct thats sent down.
                    const service_items_with_opportunity_details = service_items.map( s => ({ ...s, opportunity_subject: o.subject}))
                    
                    // Add any services_items to the services list.
                    services = services.concat( service_items_with_opportunity_details ); 

                    //@todo: Add Pagination?
                    // Break if we have enough services. 
                    if (services.length >= MAX_SERVICES) {
                        break;
                    }
                }

                page = page + 1;
            }

            // send services
            console.log('Sending services');
            res.setHeader('Content-Type', 'application/json');
            res.send( JSON.stringify(services) );
            console.log('Services sent!');
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
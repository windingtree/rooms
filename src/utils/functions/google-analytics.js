import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';
import {ApiCache} from "../api_cache";
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-Y6E0HKDFXC'

ReactGA.initialize(GA_TRACKING_ID, {
    debug: true,
    titleCase: false
});


export const gaGenericError = (error, type) => {
    ReactGA.event({
        category: 'generic_error',
        action: type,
        value: error
    });
}

export const gaUserEvent = (action) => {
    ReactGA.event({
        category: 'user',
        action: action,
        value: 1
    });
}

//report page view and add context variables (e.g. profileId)
export const GoogleAnalytics = () => {
    const apiCache = ApiCache.getInstance()
    const location = useLocation();
    ReactGA.pageview(location.pathname);
    if(apiCache)
    {
        const profile = apiCache.getProfile();
        if (profile && profile.id) {
            ReactGA.set({profileId:profile.id});
        }
    }
    return null;
}

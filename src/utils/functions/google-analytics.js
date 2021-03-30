import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';
import {ApiCache} from "../api_cache";
const GA_TRACKING_ID = 'G-42GYVFWQES'

//google analytics will fail to initialize if run in a test runner (jest), hence it has to be disabled in this case
const isTestMode = process.NODE_ENV === 'test'

ReactGA.initialize(GA_TRACKING_ID, {
    debug: false,
    titleCase: false,
    testMode: isTestMode
});


export const gaGenericError = (error, type) => {
    if(isTestMode)
        return;
    ReactGA.event({
        category: 'generic_error',
        action: type,
        value: error
    });
}

export const gaUserEvent = (action) => {
    if(isTestMode)
        return;

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
    if(isTestMode)
        return;

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

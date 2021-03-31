import {useLocation} from 'react-router-dom';
import {ApiCache} from "../api_cache";

//google analytics will fail to initialize if run in a test runner (jest), hence it has to be disabled in this case
const isTestMode = process.NODE_ENV === 'test'

const _set = (args = {}) => {
    try{
        window.gtag('set',args);
    }catch(err){
        console.log('gtag set failed', err)
    }
}

const _event = (event_name, args = {}) => {
    try{
        window.gtag('event',event_name, args);
    }catch(err){
        console.log('gtag event failed', err)
    }
}

const _pageView = (page_location, page_path, page_title) => {
    _event('page_view',{
        page_location: page_location,
        page_path: page_path,
        page_title: page_title
    })
}

const _exception = (description, fatal = false) => {
    _event('exception',{
        description: description,
        fatal: fatal
    })
}

export const gaGenericError = (errorMessage, type, fatal=false) => {
    _exception(errorMessage,fatal);
}

export const gaUserEvent = (eventName) => {
    _event(eventName, {'event_category':'user'});
}

//report page view and add context variables (e.g. profileId)
export const PageView = ({title}) => {
    const apiCache = ApiCache.getInstance()
    const location = useLocation();
    if(isTestMode)
        return null;

    _pageView(window.location.href, location.pathname,title?title:'undefined');
    if(apiCache)
    {
        const profile = apiCache.getProfile();
        if (profile && profile.id) {
            _set({profileId:profile.id});
        }
    }
    return null;
}

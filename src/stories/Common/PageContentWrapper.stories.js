import React from 'react';


import {PageContentWrapper} from '../../components/base/Common/PageContentWrapper';

export default {
    title: 'Common/PageContentWrapper',
    component: PageContentWrapper
};
const SomeComponent = () => {
    return (
        <div style={{border:'1px solid black'}}> Some dummy component </div>
    )
}

export const WithoutPageTitle = () => {
    return (<PageContentWrapper>
        <SomeComponent/>
        <SomeComponent/>
        <SomeComponent/>
        <SomeComponent/>
    </PageContentWrapper>);
}


export const WithPageTitle = () => {
    return (<PageContentWrapper title={"Page title"}>
        <SomeComponent/>
        <SomeComponent/>
        <SomeComponent/>
        <SomeComponent/>
    </PageContentWrapper>);
}



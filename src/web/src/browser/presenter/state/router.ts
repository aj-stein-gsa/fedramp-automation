import { match } from 'path-to-regexp';

export type RouteTypes = {
  Home: { type: 'Home' };
  Validator: { type: 'Validator' };
  Assertion: {
    type: 'Assertion';
    assertionId: string;
  };
  Developers: {
    type: 'Developers';
  };
  UsageTracking: {
    type: 'UsageTracking';
  };
};

export type Route = RouteTypes[keyof RouteTypes];
export type RouteType = Route['type'];
export namespace Routes {
  export const home: RouteTypes['Home'] = {
    type: 'Home',
  };
  export const validator: RouteTypes['Validator'] = {
    type: 'Validator',
  };
  export const assertion = (options: {
    assertionId: string;
  }): RouteTypes['Assertion'] => {
    return {
      type: 'Assertion',
      assertionId: options.assertionId,
    };
  };
  export const developers: RouteTypes['Developers'] = {
    type: 'Developers',
  };
  export const usageTracking: RouteTypes['UsageTracking'] = {
    type: 'UsageTracking',
  };
  export type NotFound = { type: 'NotFound' };
  export const notFound: NotFound = { type: 'NotFound' };
}

const RouteUrl: Record<Route['type'], (route?: any) => string> = {
  Home: () => '#/',
  Validator: () => '#/validator',
  Assertion: (route: RouteTypes['Assertion']) =>
    `#/assertions/${route.assertionId}`,
  Developers: () => '#/developers',
  UsageTracking: () => '#/usage-tracking',
};

export const getUrl = (route: Route): string => {
  return RouteUrl[route.type](route);
};

const matchRoute = <L extends Route>(
  urlPattern: string,
  createRoute: (params?: any) => L,
) => {
  const matcher = match(urlPattern);
  return (url: string) => {
    const match = matcher(url);
    if (match) {
      return createRoute(match.params);
    }
  };
};

const RouteMatch: Record<Route['type'], (url: string) => Route | undefined> = {
  Home: matchRoute('#/', () => Routes.home),
  Validator: matchRoute('#/validator', () => Routes.validator),
  Assertion: matchRoute('#/assertions/:assertionId', Routes.assertion),
  Developers: matchRoute('#/developers', () => Routes.developers),
  UsageTracking: matchRoute('#/usage-tracking', () => Routes.usageTracking),
};

export const getRoute = (url: string): Route | Routes.NotFound => {
  for (const routeType of Object.keys(RouteMatch)) {
    const route = RouteMatch[routeType as Route['type']](url);
    if (route) {
      return route;
    }
  }
  return Routes.notFound;
};

type Breadcrumb = {
  text: string;
  linkUrl: string | false;
};
export const breadcrumbs: Record<
  Route['type'] & string,
  (route: any) => Breadcrumb[]
> = {
  Home: (route: Route) => {
    return [
      {
        text: 'Home',
        linkUrl: route.type !== 'Home' && getUrl(Routes.home),
      },
    ];
  },
  Validator: (route: Route) => {
    return [
      ...breadcrumbs.Home(route),
      {
        text: 'Validator',
        linkUrl: route.type !== 'Validator' && getUrl(Routes.home),
      },
    ];
  },
  Assertion: (route: RouteTypes['Assertion']) => {
    return [
      ...breadcrumbs.Home(route),
      {
        text: 'Assertion',
        linkUrl:
          route.type !== 'Assertion' &&
          getUrl(Routes.assertion({ assertionId: route.assertionId })),
      },
    ];
  },
  Developers: (route: RouteTypes['Developers']) => {
    return [
      ...breadcrumbs.Home(route),
      {
        text: 'Developer documentation',
        linkUrl: route.type !== 'Developers' && getUrl(Routes.developers),
      },
    ];
  },
  UsageTracking: (route: RouteTypes['UsageTracking']) => {
    return [
      ...breadcrumbs.Home(route),
      {
        text: 'Usage tracking',
        linkUrl: route.type !== 'UsageTracking' && getUrl(Routes.usageTracking),
      },
    ];
  },
};

export type Location = {
  listen: (listener: (url: string) => void) => void;
  replace: (url: string) => void;
};

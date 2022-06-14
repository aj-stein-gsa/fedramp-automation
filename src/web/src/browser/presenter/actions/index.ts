export * as assertionDocumentation from './assertion-documentation';
export * as documentViewer from './document-viewer';
export * as metrics from './metrics';
export * as schematron from './schematron';
export * as validator from './validator';

import type { PresenterConfig } from '..';
import * as router from '../state/router';

export const onInitializeOvermind = async ({
  actions,
  effects,
}: PresenterConfig) => {
  actions.setCurrentRoute(effects.location.getCurrent());
  effects.location.listen((url: string) => {
    actions.setCurrentRoute(url);
  });
  actions.schematron.initialize();
  actions.assertionDocumentation.initialize();
  await actions.metrics.initialize();
};

export const setCurrentRoute = (
  { effects, state }: PresenterConfig,
  url: string,
) => {
  const route = router.getRoute(url);
  if (route.type !== 'NotFound') {
    state.router.send('ROUTE_CHANGED', { route });
  }
  effects.location.replace(router.getUrl(state.router.currentRoute));
};

export const getAssetUrl = ({ state }: PresenterConfig, assetPath: string) => {
  return `${state.baseUrl}${assetPath}`;
};

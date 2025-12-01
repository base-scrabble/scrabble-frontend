import { devices as playwrightDevices } from '@playwright/test';

const deviceMatrix = {
  desktop: { viewport: { width: 1440, height: 900 } },
  iphone12: playwrightDevices['iPhone 12'],
  pixel7: playwrightDevices['Pixel 7'],
  galaxyS9: playwrightDevices['Galaxy S9+'],
};

export default deviceMatrix;

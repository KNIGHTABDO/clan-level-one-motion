import {Config} from '@remotion/cli/config';
Config.setEntryPoint('./src/index.tsx');
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(1);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('swangle');
Config.setTimeoutInMilliseconds(120000);
Config.setChromiumOptions({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

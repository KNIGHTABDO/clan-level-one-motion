import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.tsx');
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(2);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('swangle');
Config.setTimeoutInMilliseconds(120000);

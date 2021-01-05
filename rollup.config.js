import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;
const isDist = argv['dist'];
const plugins = composePlugins(isDist);

export default {
    input: 'dist/test.ts',
    output: {
        file: 'dist/stepper2.min.js',
        format: 'umd',
        name: 'Stepper'
    },
    plugins
};

function composePlugins(isDist) {
    const def = [typescript()];
    let plugins = [...def];

    if (isDist) plugins = [...plugins, terser({ output: { comments: false } })];

    return plugins;
}
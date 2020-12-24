const loadConfigFile = require('rollup/dist/loadConfigFile');
const path = require('path');
const rollup = require('rollup');

// load the config file next to the current script;
// the provided config object has the same effect as passing "--format es"
// on the command line and will override the format of all outputs
loadConfigFile(path.resolve(__dirname, 'rollup.config.js'), {}).then(
    async ({ options, warnings }) => {
        // "warnings" wraps the default `onwarn` handler passed by the CLI.
        // This prints all warnings up to this point:
        console.log(`We currently have ${warnings.count} warnings`);

        // This prints all deferred warnings
        warnings.flush();

        // options is an array of "inputOptions" objects with an additional "output"
        // property that contains an array of "outputOptions".
        // The following will generate all outputs for all inputs, and write them to disk the same
        // way the CLI does it:

        for (const optionsObj of options) {
            const bundle = await rollup.rollup(optionsObj);
            await Promise.all(optionsObj.output.map(bundle.write));
        }

        // You can also pass this directly to "rollup.watch"
        // watch(options);
    }
);

function watch(options) {
    const watcher = rollup.watch(options);

    watcher.on('event', event => {
        // event.code can be one of:
        //   START        — the watcher is (re)starting
        //   BUNDLE_START — building an individual bundle
        //                  * event.input will be the input options object if present
        //                  * event.outputFiles cantains an array of the "file" or
        //                    "dir" option values of the generated outputs
        //   BUNDLE_END   — finished building a bundle
        //                  * event.input will be the input options object if present
        //                  * event.outputFiles cantains an array of the "file" or
        //                    "dir" option values of the generated outputs
        //                  * event.duration is the build duration in milliseconds
        //                  * event.result contains the bundle object that can be
        //                    used to generate additional outputs by calling
        //                    bundle.generate or bundle.write. This is especially
        //                    important when the watch.skipWrite option is used.
        //                  You should call "event.result.close()" once you are done
        //                  generating outputs, or if you do not generate outputs.
        //                  This will allow plugins to clean up resources via the
        //                  "closeBundle" hook.
        //   END          — finished building all bundles
        //   ERROR        — encountered an error while bundling
        //                  * event.error contains the error that was thrown
    });

    // This will make sure that bundles are properly closed after each run
    watcher.on('event', ({ code, result }) => {
        if (code === 'BUNDLE_END') {
            result.close();
        }
    });
}
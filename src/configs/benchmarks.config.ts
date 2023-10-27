import Configs from "types/configs";


/**
 * Benchmarks configuration.
 */
const BENCHMARKS_CONFIG: Configs.IsBenchmarksConfig = {
    // Total number of reports to display
    nbReports: 5,

    // Number of seconds to wait between each report (> 1)
    reportInterval: 1,

    // Generator ghost executions to warm up the engine
    generatorGhostExecutionIterations: 1024
};


export default BENCHMARKS_CONFIG;
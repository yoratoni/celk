import Configs from "types/configs";


/**
 * Benchmarks configuration.
 */
const BENCHMARKS_CONFIG: Configs.IsBenchmarksConfig = {
    // Total number of reports to display
    nbReports: 2,

    // Number of seconds to wait between each report (> 1)
    reportInterval: 1,

    // Generator ghost executions to warm up the engine
    generatorGhostExecutionIterations: 8192
};


export default BENCHMARKS_CONFIG;
#!/usr/bin/env Rscript

# Usage:
#
#     plot.r data.csv
#
# Output will be placed in SVG files.

library(ggplot2)

args <- commandArgs(trailingOnly = TRUE)

data <- read.table(args[1], header = TRUE, sep = ",")

jitterBoxPlot <- function(data, operation, titleText) {
    print(paste(operation, "---------------------------------------------------------------------------"))

    operationData <- subset(data, data$Operation == operation)

    operationData$Implementation.and.Browser <- factor(
        operationData$Implementation.and.Browser,
        levels = c(
            "JavaScript.Chrome.Canary",
            "WebAssembly.Chrome.Canary",
            "JavaScript.Firefox.Nightly",
            "WebAssembly.Firefox.Nightly"
        )
    )

    chromeJs <- subset(operationData,
                       operationData$Implementation.and.Browser == "JavaScript.Chrome.Canary")$Time
    print(paste("mean: scala.js: Chrome+JS =", mean(chromeJs)))
    print(paste("cv: scala.js: Chrome+JS =", sd(chromeJs) / mean(chromeJs)))

    chromeWasm <- subset(operationData,
                         operationData$Implementation.and.Browser == "WebAssembly.Chrome.Canary")$Time
    print(paste("mean: scala.js: Chrome+Wasm =", mean(chromeWasm)))
    print(paste("cv: scala.js: Chrome+Wasm =", sd(chromeWasm) / mean(chromeWasm)))

    firefoxJs <- subset(operationData,
                        operationData$Implementation.and.Browser == "JavaScript.Firefox.Nightly")$Time
    print(paste("mean: scala.js: Firefox+JS =", mean(firefoxJs)))
    print(paste("cv: scala.js: Firefox+JS =", sd(firefoxJs) / mean(firefoxJs)))

    firefoxWasm <- subset(operationData,
                          operationData$Implementation.and.Browser == "WebAssembly.Firefox.Nightly")$Time
    print(paste("mean: scala.js: Firefox+Wasm =", mean(firefoxWasm)))
    print(paste("cv: scala.js: Firefox+Wasm =", sd(firefoxWasm) / mean(firefoxWasm)))

    print(paste("normalized: Chrome =", mean(chromeWasm) / mean(chromeJs)))
    print(paste("normalized: Firefox =", mean(firefoxWasm) / mean(firefoxJs)))

    thePlot <- ggplot(operationData,
                      aes(x = operationData$Implementation.and.Browser,
                          y = operationData$Time,
                          color = operationData$Implementation.and.Browser,
                          pch = operationData$Implementation.and.Browser)) +
        geom_boxplot(outlier.shape = NA) +
        geom_jitter(position = position_jitter(width = 0.1)) +
        scale_y_continuous(limits = quantile(operationData$Time, c(NA, 0.99))) +
        expand_limits(y = 0) +
        theme(legend.position = "none",
              axis.text.x = element_text(angle = 45, hjust = 1),
              axis.title.x = element_blank()) +
        ggtitle(titleText) +
        labs(y = "Time (ms)",
             subtitle = "Scala.JS Source Map (Mappings String Size = 14,964,446)")

    ## print(thePlot)
    svgFile <- paste(operation, ".scalajs.svg", sep="")
    ggsave(plot = thePlot,
           file = svgFile,
           device = "svg")
}

largeData <- subset(data, Mappings.Size==14964446)

jitterBoxPlot(largeData, "set.first.breakpoint", "Set First Breakpoint")
jitterBoxPlot(largeData, "subsequent.setting.breakpoints", "Subsquent Setting Breakpoints")

jitterBoxPlot(largeData, "first.pause.at.exception", "First Pause at Exception")
jitterBoxPlot(largeData, "subsequent.pausing.at.exceptions", "Subsequent Pausing at Exceptions")

jitterBoxPlot(largeData, "parse.and.iterate", "Parse and Iterate Each Mapping")
jitterBoxPlot(largeData, "iterate.already.parsed", "Already Parsed, Iterate Each Mapping")

meanPlot <- function(data, operation, titleText) {
    operationData <- subset(data, data$Operation == operation)

    operationData$Implementation.and.Browser <- factor(
        operationData$Implementation.and.Browser,
        levels = c(
            "JavaScript.Chrome.Canary",
            "WebAssembly.Chrome.Canary",
            "JavaScript.Firefox.Nightly",
            "WebAssembly.Firefox.Nightly"
        )
    )

    thePlot <- ggplot(operationData,
                      aes(x = operationData$Mappings.Size,
                          y = operationData$Time,
                          color = operationData$Implementation.and.Browser,
                          pch = operationData$Implementation.and.Browser)) +
        stat_summary(fun.y = mean, geom = "line") +
        stat_summary(fun.y = mean, geom = "point") +
        geom_point() +
        theme(legend.position = "bottom",
              legend.direction="vertical",
              legend.title = element_blank()) +
        scale_y_continuous(limits = quantile(operationData$Time, c(NA, 0.99))) +
        ## scale_x_log10() +
        ## scale_y_log10() +
        expand_limits(y = 0) +
        ggtitle(titleText) +
        labs(x = "Mappings String Size",
             y = "Time (ms)",
             subtitle = "Mean")

    ## print(thePlot)
    svgFile <- paste(operation, ".mean.svg", sep="")
    ggsave(plot = thePlot,
           file = svgFile,
           device = "svg")
}

meanPlot(data, "set.first.breakpoint", "Set First Breakpoint")
meanPlot(data, "subsequent.setting.breakpoints", "Subsequent Setting Breakpoints")
meanPlot(data, "first.pause.at.exception", "First Pause at Exception")
meanPlot(data, "subsequent.pausing.at.exceptions", "Subsequent Pausing at Exceptions")
meanPlot(data, "parse.and.iterate", "Parse and Iterate Each Mapping")
meanPlot(data, "iterate.already.parsed", "Already Parsed, Iterate Each Mapping")

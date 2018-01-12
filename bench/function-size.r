#!/usr/bin/env Rscript

# Usage:
#
#     ./function-size.r function-size.csv
#
# Output will be placed in SVG files.

library(ggplot2)

args <- commandArgs(trailingOnly = TRUE)

data <- read.table(args[1], header = TRUE, sep = ",")

thePlot <- ggplot(data,
                  aes(x = reorder(Function, -Size),
                      y = data$Size,
                      fill = data$Function)) +
    geom_bar(stat="identity") +
    theme(legend.position = "none",
          axis.text.x = element_text(angle = 67.5, hjust = 1)) +
    ggtitle("WebAssembly Code Size by Function") +
    labs(y = "Code Size (bytes)",
         x = "Function")

ggsave(plot = thePlot,
       file = "function-size.svg",
       device = "svg")

crateData <- aggregate(. ~ Crate, data = data, sum)
print(crateData)

thePlot <- ggplot(crateData,
                  aes(x = reorder(crateData$Crate, -crateData$Size),
                      y = crateData$Size,
                      fill = crateData$Crate)) +
    geom_bar(stat="identity") +
    theme(legend.position = "none",
          axis.text.x = element_text(angle = 45, hjust = 1)) +
    ggtitle("WebAssembly Code Size by Crate") +
    labs(y = "Code Size (bytes)",
         x = "Crate")

ggsave(plot = thePlot,
       file = "crate-size.svg",
       device = "svg")

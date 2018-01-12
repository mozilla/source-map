#!/usr/bin/env Rscript

# Usage:
#
#     size.r size.csv

# Output will be placed in size.svg

library(ggplot2)
library(reshape2)

args <- commandArgs(trailingOnly = TRUE)

data <- read.table(args[1], header = TRUE, sep = ",")
data <- melt(data, id.var = "Build")

data$Build <- factor(
    data$Build,
    levels = c(
        "JavaScript",
        "JavaScript (gzip)",
        "WebAssembly",
        "WebAssembly (gc)",
        "WebAssembly (gc + snip)",
        "WebAssembly (gc + snip + opt)",
        "WebAssembly (gc + snip + opt + gzip)"
    )
)

thePlot <- ggplot(data,
                  aes(x = data$Build,
                      y = data$value,
                      fill = variable)) +
    geom_bar(stat = "identity") +
    theme(legend.position = "bottom",
          legend.direction="vertical",
          legend.title = element_blank(),
          axis.text.x = element_text(angle = 45, hjust = 1)) +
    ggtitle("Code Size by Implementation and Build") +
    labs(x = "Implementation and Build",
         y = "Code Size (bytes)") +
    scale_fill_discrete(labels = c("JavaScript Size", "WebAssembly Size"))

svgFile <- "size.svg"
ggsave(plot = thePlot,
       file = svgFile,
       device = "svg")

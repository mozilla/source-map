#!/usr/bin/env Rscript

# Usage:
#
#     ./section-size.r section-sizes.csv
#
# Output will be placed in SVG files.

library(ggplot2)

args <- commandArgs(trailingOnly = TRUE)

data <- read.table(args[1], header = TRUE, sep = ",")

thePlot <- ggplot(data,
                  aes(x = reorder(Section, -Size),
                      y = data$Size,
                      fill = data$Section)) +
    geom_bar(stat="identity") +
    theme(legend.position = "none",
          axis.text.x = element_text(angle = 67.5, hjust = 1)) +
    ggtitle("WebAssembly Size by Section") +
    labs(y = "Size (bytes)",
         x = "Section")

ggsave(plot = thePlot,
       file = "section-sizes.svg",
       device = "svg")

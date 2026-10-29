---
title: "EPA SWMM (Storm Water Management Model)"
tagline: "Open-source model for simulating urban runoff and drainage systems"
category: flood
tags: [stormwater, drainage, modelling, green-infrastructure]
license: Open-Source
language: "C"
homepage: "https://www.epa.gov/water-research/storm-water-management-model-swmm"
github: "https://github.com/USEPA/Stormwater-Management-Model"
difficulty: advanced
lastUpdated: "2023"
featured: false
dataInputs: ["Catchment areas and land use", "Rainfall time series", "Drainage network (pipes, channels, storage)", "Soil and infiltration parameters"]
outputs: ["Runoff quantity and quality", "Flow, depth and flooding in the drainage network", "Pollutant loads", "Green infrastructure performance"]
published: "2026-10-29"
---

## Overview

SWMM is the U.S. Environmental Protection Agency's model for simulating runoff in stormwater, combined sewer, sanitary sewer and other drainage systems. It is free and open source, and can be run for single storms or long-term periods.

## Key features

- Routes flow through pipes, channels, storage units, pumps, weirs and orifices
- Hydraulic routing using kinematic or full dynamic wave methods
- Hydrologic processes including infiltration, evaporation, snowmelt and groundwater interflow
- Pollutant buildup, wash-off and treatment
- Explicit modelling of eight green infrastructure (LID) practices, such as bioretention cells, permeable pavement and green roofs

The current version listed by EPA is SWMM 5.2.4 (August 2023). The SWMM climate adjustment add-in is no longer maintained as of March 2025.

## Who it's for

Engineers, planners and stormwater managers designing flood control, combined sewer overflow control and best management practices. It requires hydraulic modelling experience.

## Getting started

Download the Windows installers, manuals and source code from the [EPA SWMM page](https://www.epa.gov/water-research/storm-water-management-model-swmm), or the [GitHub repository](https://github.com/USEPA/Stormwater-Management-Model).

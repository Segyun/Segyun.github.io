---
title: "SceneSsok"
description: "An AI-powered prop cataloging solution for screenplay breakdown."
pubDate: 2025-08-25
order: 5
githubUrl: "https://github.com/MoJoLEG/MoJoLEG"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

### Structured Network Architecture and Swift Concurrency Integration

To ensure type-safe request construction and response decoding, we abstracted the network layer with Alamofire. Adopting the Router pattern enabled centralized, declarative management of API endpoints and parameters. By bridging Alamofire with Swift Concurrency's `async/await`, we prevented main-thread blocking and established a clean, maintainable asynchronous data-fetching flow.

### Chunked Scenario Parsing and TaskGroup Parallelism: 90% Latency Reduction (5 min → 30 sec)

Full screenplays frequently exceed the token context window limits of large language models. To resolve this bottleneck, we designed a preprocessing pipeline that parses scene headers and divides lengthy scripts into modular scene chunks.

Initially, sequential requests for each chunk took up to 5 minutes for feature-length scripts, severely degrading user experience. By refactoring the analysis pipeline with Swift Concurrency's `TaskGroup`, scene chunks were evaluated in parallel, slashing total processing time from 5 minutes down to 30 seconds—a 90% latency reduction.

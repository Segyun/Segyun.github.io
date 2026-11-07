---
title: "Leaf"
description: "Privacy-focused on-device AI voice notes and transcription."
pubDate: 2026-10-01
order: 3
demoUrl: "https://leaf.lemnlabs.com"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

### Privacy-Preserving On-Device Speech-to-Text Pipeline

Voice data contains sensitive personal information. Leaf establishes a local transcription pipeline powered by on-device models like WhisperKit, converting speech to text entirely on the Apple Neural Engine and GPU without sending audio to external servers. This architecture ensures absolute data privacy and enables seamless transcription even in offline environments.

### Streaming Audio Buffer Management and Memory Optimization

Retaining continuous audio buffers in memory during long meetings or lectures can lead to out-of-memory (OOM) crashes. To overcome this constraint, Leaf streams audio in discrete buffer chunks, processes them asynchronously via Swift Concurrency, and releases intermediate buffers progressively to keep the memory footprint stable.

### Automated Structured Markdown Notes

Beyond raw transcription, Leaf formats speech segments with timestamps and speaker distinctions into structured, clean Markdown notes. Real-time transcription results are rendered smoothly with SwiftUI to provide an intuitive, responsive user experience.

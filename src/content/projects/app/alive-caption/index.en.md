---
title: "Alive Caption"
description: "A real-time audio analysis and caption generation app built upon the Caption with Intention© design system."
pubDate: 2026-04-27
order: 4
githubUrl: "https://github.com/Segyun/Alive-Caption"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

```mermaid
graph LR
  CaptureSessionManager["**CaptureSessionManager**
  Real-time audio & video buffer streaming"]
  FileBufferStreamer["**FileBufferStreamer**
  Audio buffer generation from files"]
  CaptionAnalyzer["**CaptionAnalyzer**
  Caption generation from audio buffer"]
  CaptureBufferRecorder["**CaptureBufferRecorder**
  Record audio/video buffers to file"]
  SpeechTranscriber["**SpeechTranscriber**
  Convert audio buffers to text"]
  SpeechIntonationAnalyzer["**SpeechIntonationAnalyzer**
  Extract pitch & volume information"]

  subgraph producer["**Producer**"]
    CaptureSessionManager
    FileBufferStreamer
  end

  subgraph consumer["**Consumer**"]
    CaptionAnalyzer
    CaptureBufferRecorder
  end

  subgraph processor["**Processor**"]
    SpeechTranscriber
    SpeechIntonationAnalyzer
  end

  producer --"**CMSampleBuffer**
  Audio & video sample buffer"--> consumer

  CaptionAnalyzer --"**CMSampleBuffer**
  Audio sample buffer"--> processor
```

### Adopting Swift Concurrency to Resolve Data Race Issues in Asynchronous Workflows

To prevent bottlenecks while processing real-time buffer streams from microphone input, operations must run asynchronously. We leveraged `AsyncStream` to asynchronously produce audio buffer chunks, allowing the processing pipeline to subscribe and consume them concurrently. Furthermore, to prevent potential Data Race issues when caching analyzed caption results, the cache store was implemented as a Swift `Actor` to guarantee serialized, thread-safe access to internal properties.

### Unifying Audio Buffer Pipelines from AVAudioEngine to AVCaptureSession

Initially, microphone-only recording utilized `AVAudioEngine` with tap-installed `AVAudioPCMBuffer` analysis, whereas combined camera-microphone recording used `AVCaptureSession` with `CMSampleBuffer`. This dual-pipeline architecture raised the risk of inconsistent analysis results for identical sound sources. To eliminate discrepancies, the architecture was unified to process all real-time audio streams through `AVCaptureSession` and `CMSampleBuffer`.

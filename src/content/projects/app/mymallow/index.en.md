---
title: "MyMallow"
description: "A living emotion diary iOS app with interactive 3D companions."
pubDate: 2026-01-17
order: 1
demoUrl: "https://apps.apple.com/app/id6749623599"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

### Autonomous AI Companions using RealityKit and GameplayKit

We leveraged RealityKit to render USDZ 3D models natively within the app, paired with GameplayKit State Machines to drive natural, autonomous character behavior. The state machine evaluates dynamic environmental rules—such as character coordinates, orientation, and campfire distance—to make context-aware decisions. An Entity-Component-System (ECS) architecture was adopted to achieve strong separation of concerns and high-performance game-loop updates.

### Custom SerialTaskExecutor for Safe Scene State Serialization

To eliminate UI freezes on the main thread, RealityKit Scene mutations (such as entity spawning and appearance changes) run asynchronously. However, if state modifications arrived before the character finished initializing, state loss and race conditions occurred.

To address this, we developed a custom `SerialTaskExecutor`. While traditional serial `DispatchQueue`s handle synchronous tasks well, they do not preserve async sequence boundaries or cooperative cancellation within Swift Concurrency's `async/await` ecosystem. By combining Swift `Actor` and chained `Task` references, we guaranteed strict sequential execution of asynchronous scene commands.

```swift
// Serial Task Executor for asynchronous serialization
actor SerialTaskExecutor {
  private(set) var lastTask: Task<Void, Never>?

  func add(_ operation: @escaping () async -> Void) {
    let previousTask = lastTask
    let newTask = Task {
      _ = await previousTask?.result
      await operation()
    }
    lastTask = newTask
  }
}

...

@Observable
final class EmotionLandSceneCoordinator {
  private let serialTaskExecutor: SerialTaskExecutor

  ...

  func changeSkybox(skyboxState: SkyboxState) {
    addTask { ... }
  }

  private func addTask(_ operation: @escaping () async -> Void) {
    Task {
      await self.serialTaskExecutor.add(operation)
    }
  }
}
```

### Feature-First Clean Architecture for Scalable Codebases

Traditional Clean Architecture divides codebases by technical layers (Presentation, Domain, Data). In contrast, Feature-First architecture collocates UI, business logic, and models around discrete functional features. This structure drastically reduces file traversal overhead, decouples cross-feature dependencies, and isolates the blast radius of new feature additions.

---

> [!NOTE]
> For a deeper dive into MyMallow's architectural refactoring and multi-display adaptation, check out the [SwiftUI iPhone Duo blog post](/en/blog/swiftui-iphone-duo).

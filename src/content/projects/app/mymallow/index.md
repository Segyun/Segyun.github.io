---
title: "MyMallow"
description: "살아움직이는 감정 일기 앱"
pubDate: 2026-01-17
order: 1
demoUrl: "https://apps.apple.com/app/id6749623599"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

### RealityKit과 GameplayKit을 통한 자율적 AI 캐릭터 구현

RealityKit을 사용하여 3D 모델(USDZ)을 앱 내부에서 보여주는 기능을 구현하였고, 자연스러운 캐릭터의 움직임을 위해 GameplayKit의 State Machine 기반으로 자율적 AI를 적용하였습니다. State Machine은 캐릭터의 위치, 방향, 모닥불의 위치 등의 상태를 기반으로 규칙을 적용하여 동작하도록 설계하였습니다. 또한 관심사 분리 및 통합적 업데이트를 위해 ECS(Entity-Component-System) 아키텍처를 바탕으로 성능 향상 및 코드 품질을 높이도록 구현하였습니다.

### 내부 로직 직렬화를 위한 Task 기반 SerialTaskExecutor 구현

메인 스레드 프리징(UI 멈춤) 현상을 방지하기 위해 캐릭터 생성 및 상태 변경 등 RealityKit Scene 제어를 비동기로 처리하도록 구현하였습니다. 그러나 캐릭터가 완전히 생성되기 전에 상태 변경 요청이 유입될 경우 변경 상태가 유실되거나 덮어씌워지는 레이스 컨디션 문제가 발생했습니다.

이러한 문제를 해결하기 위해 내부 Scene 제어 요청을 순차적으로 비동기 처리할 수 있는 `SerialTaskExecutor`를 구현하였습니다. 기존의 직렬 `DispatchQueue`는 동기 작업 직렬화에는 적합하지만 Swift Concurrency의 `async/await` 비동기 컨텍스트 순서 보장이나 협력적 취소(Cooperative Cancellation)와 호환되지 않는 한계가 있어, Swift `Actor`와 `Task` 체이닝 방식을 활용하여 안전하게 직렬화하도록 설계하였습니다.

```swift
// 작업 직렬화를 위한 Serial Task Executor 구현
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

### 프로젝트 구조 개선을 위한 Feature-First Clean Architecture 도입

일반적인 Clean Architecture의 경우 Presentation, Domain, Data 등 레이어를 기준으로 폴더를 분리합니다. 반면 Feature-First 구조는 기능(Feature) 단위로 비즈니스 로직과 화면, 데이터 모델을 함께 응집시켜 관리합니다. 이를 통해 파일 탐색 비용을 줄이고 모듈 간 결합도를 낮추며, 신규 기능 추가 시 기존 코드베이스에 미치는 영향 범위를 안전하게 격리할 수 있었습니다.

---

> [!NOTE]
> MyMallow의 아키텍처 리팩토링 및 듀얼 디스플레이 대응 과정에 대한 상세한 기록은 [SwiftUI iPhone Duo 블로그 글](/blog/swiftui-iphone-duo)에서 확인하실 수 있습니다.

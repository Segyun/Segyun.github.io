---
title: "TransitionableFullScreenCover"
description: "SwiftUI `.fullScreenCover`에 커스텀 트랜지션 애니메이션을 적용할 수 있도록 확장한 라이브러리"
pubDate: 2025-12-26
githubUrl: "https://github.com/Segyun/TransitionableFullScreenCover"
---

기본 SwiftUI에서는 제약이 있던 `.fullScreenCover` 표출 방식에 커스텀 `AnyTransition` 파라미터를 추가하여 등장 및 퇴장 애니메이션을 자유롭게 제어합니다.

슬라이드, 스케일, 페이드 등 다양한 전환 효과와 스프링 애니메이션 타이밍을 조합하여 앱의 콘셉트에 맞는 모달 인터랙션을 구현할 수 있습니다.

기존 표준 `fullScreenCover`의 문법 구조를 그대로 계승하여 코드베이스 변경을 최소화하면서 직관적으로 도입할 수 있습니다.

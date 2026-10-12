---
title: "OverKeyboard"
description: "iOS 시스템 키보드 상위 레이어에 커스텀 SwiftUI 뷰를 오버레이로 띄울 수 있는 라이브러리"
pubDate: 2026-03-07
githubUrl: "https://github.com/Segyun/OverKeyboard"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

iOS 시스템 키보드가 위치한 별도의 윈도우 계층 구조를 모니터링하여, 키보드 바로 위에 플로팅 액션 바나 자동완성 툴바를 배치할 수 있도록 지원합니다.

키보드의 표시·숨김 라이프사이클 이벤트와 애니메이션을 정밀하게 추적하여 화면 떨림 없는 자연스러운 전환을 보장합니다.

투명 영역에는 스마트 터치 패스스루(Touch Pass-Through)가 적용되어 하단 키보드 입력 및 배경 뷰 조작을 방해하지 않고 매끄럽게 동작합니다.

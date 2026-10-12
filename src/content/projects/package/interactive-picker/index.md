---
title: "InteractivePicker"
description: "iOS 제어 센터 스타일의 드래그 인터랙션과 반응형 애니메이션을 지원하는 SwiftUI 피커 컴포넌트"
pubDate: 2026-03-07
githubUrl: "https://github.com/Segyun/InteractivePicker"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

iOS 제어 센터의 페이지 셀렉터처럼 드래그 제스처와 터치 위치에 실시간으로 반응하여 항목을 선택할 수 있는 인터랙티브 피커입니다.

수평(Horizontal) 및 수직(Vertical) 레이아웃 축을 모두 지원하며, 손가락과의 거리에 따라 부드럽게 크기와 위치가 변화하는 시각적 피드백을 제공합니다.

`InteractivePickerStyle` 프로토콜을 구현하여 스케일, 회전, 투명도 등 고유한 애니메이션 인터랙션을 손쉽게 커스텀 정의할 수 있습니다.

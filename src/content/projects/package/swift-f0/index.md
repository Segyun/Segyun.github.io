---
title: "SwiftF0"
description: "ONNX 모델을 활용해 오디오에서 기본 주파수(F0)를 추정하고 음표로 변환하는 Swift 음정 분석 라이브러리"
pubDate: 2025-11-01
githubUrl: "https://github.com/Segyun/SwiftF0"
---

ONNX 머신러닝 런타임 모델을 기반으로 오디오 파일이나 실시간 버퍼에서 기본 주파수(F0, Pitch)를 정밀하게 추정합니다.

`SwiftF0Detector`로 감지한 주파수 결과를 `NoteConverter`를 통해 연속 구간별 음표(Note) 단위 데이터 배열로 자동 변환합니다.

iOS 및 Swift 기반 환경에서 음성 분석, 보컬 트레이닝, 음정 시각화 애플리케이션에 손쉽게 탑재할 수 있도록 설계되었습니다.
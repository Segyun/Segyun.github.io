---
title: "SoundFontPlayer"
description: "AVAudioUnitSampler를 활용하여 SoundFont(.sf2) 음원을 로드하고 건반을 연주하는 오디오 샘플 프로젝트"
pubDate: 2026-03-04
githubUrl: "https://github.com/Segyun/SoundFontPlayer"
thumbnail: "./thumbnail.png"
---

![[thumbnail.png]]

Apple의 AVFAudio 프레임워크 내 `AVAudioUnitSampler`를 사용하여 사운드폰트(.sf2) 파일을 로드하고 연주하는 iOS 샘플 프로젝트입니다.

SwiftUI 기반의 피아노 건반 인터페이스와 실시간 오디오 엔진을 연동하여 지연 없는 직관적인 터치 연주를 지원합니다.

사운드폰트 뱅크 및 프리셋 로딩, 오디오 노드 라우팅 등 Core Audio와 AVFoundation을 활용한 가상 악기 구현 파이프라인을 다룹니다.

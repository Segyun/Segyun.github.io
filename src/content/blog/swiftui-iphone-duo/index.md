---
title: "SwiftUI iPhone Duo 대응기"
description: "SwiftUI에서 iPhone Duo를 대응한 경험을 공유합니다."
pubDate: 2026-11-04
draft: false
thumbnail: "./thumbnail.png"
---

iPhone Duo가 출시된 지 어느덧 2주 가량 지났습니다. 새로운 세로형 툴바 등 달라진 폼팩터에 맞춰 기존 iOS에서는 볼 수 없었던 새로운 레이아웃 및 UI가 공개되어 이를 대응하기 위한 여러 API 및 리소스가 공개되었습니다. iPhone Duo에 대응하기 위해 알아보고 코드로 구현해본 경험을 공유합니다.

# iPhone Duo 레이아웃 둘러보기

iPhone Duo는 기존의 Dynamic Island을 가진 iPhone과 달리 카메라 위치 및 Safe Area의 위치가 크게 달라졌습니다. 또한 새롭게 도입된 Reserved Region을 통해 실제 UI 요소 및 카메라 등이 가리는 영역을 확인할 수 있습니다.

## 외부 화면

![[iphone-duo-outer.png]]

외부 화면의 경우 카메라 위치를 기준으로 세로로 Safe Area(파란색 영역)가 적용된 것을 확인할 수 있습니다. 또한 카메라 및 Status Bar는 Reserved Region(보라색 영역)으로 표시됩니다.

## 내부 화면

![[iphone-duo-inner.png]]

내부 화면의 경우 오른쪽 상단 Status Bar를 기준으로 가로 및 세로로 Safe Area가 적용된 것을 확인할 수 있습니다. 외부 화면과 마찬가지로 Status Bar는 Reserved Region으로 표시됩니다. 이외에도 주황색 영역은 Layout Margin, 접히는 가운데 영역은 Reserved Region으로 나타납니다.

![[updated-maps-apps.png]]

최근 업데이트된 Google 지도 및 네이버 지도 앱 화면입니다. 두 화면에서 확인할 수 있듯이 Safe Area를 잘 활용해야 더 나은 사용자 경험을 제공할 수 있습니다.

# SwiftUI에서 iPhone Duo 대응하기

![[native-toolbar.png]]

툴바 및 탭바 등 iOS 네이티브 컴포넌트를 사용하여 iOS 27.1 SDK로 빌드하면 자동으로 적절하게 배치됩니다. 하지만 네이티브 컴포넌트는 수정할 수 있는 부분이 한정되어 있기 때문에 임의로 뷰를 배치하여 구현합니다.

![[mymallow-outdated.png]]

지난 프로젝트를 iPhone Duo에 대응을 준비하기 위해 코드 변경 없이 iOS 27.1 SDK로 빌드했을 때, 기본적으로 Safe Area를 피해 배치되어 사용하는데 문제는 없지만 넓은 화면을 잘 활용하지 못하고 있습니다. 이를 단순히 `.ignoresSafeArea()`로 확장하면 넓게 사용할 수 있지만 가려지는 문제가 발생할 수 있습니다.

![[mymallow-updated.png]]

iOS 27.1 SDK부터는 `GeometryProxy`를 통해 Reserved Region에 접근할 수 있는 API를 제공합니다. 이를 통해 Reserved Region이 차지하는 공간과 배치하려는 공간을 얼마나 가리는지 계산하여 배치하는데 활용할 수 있습니다.

1. 우선 시스템에서 제공하는 Safe Area Inset 값을 확인하기 위해 `GeometryReader`를 사용합니다.
2. 내부에는 Reserved Region에 대한 정보를 가져오기 위해 `GeometryReader`에 `.ignoresSafeArea()`를 붙여서 사용합니다. (Safe Area를 무시하지 않으면 `GeometryProxy`에서 Reserved Region에 대한 정보를 가져올 수 없습니다.)
3. 전체 뷰 프레임을 기준으로 Reserved Region의 프레임과 비교하여 가리는 영역이 존재하는지 확인합니다.
4. Reserved Region을 기준으로 나머지 공간을 사용할 수 있다면 Safe Area를 무시하도록 합니다.

다음은 상단 툴바를 구현하는데 사용한 핵심 코드입니다.

```swift
...

  func body(content: Content) -> some View {
    GeometryReader { proxy in
      let insets = proxy.safeAreaInsets

      GeometryReader { proxy in
        // Reserved Region에 대한 정보 가져오기
        let regions = proxy.reservedRegions(kind: .occlusion)

        // 전체 뷰 프레임
        let frame = proxy.frame(in: .local)

        // 상단 후행에 가리는 영역 탐색
        let topTrailingRegion = regions.first { region in
          region.frame.minY == 0 && region.frame.maxX == frame.maxX
        }

        // 영역에 대해 상단 Inset 계산
        let topPadding = topPadding(
          for: topTrailingRegion,
          in: frame,
          with: insets.top
        )

        content // 실제 표시할 콘텐츠 뷰
          // 기존 Safe Area Inset 유지
          .safeAreaPadding(.leading, insets.leading)
          .safeAreaPadding(.trailing, insets.trailing)
          .safeAreaPadding(.bottom, insets.bottom)
          .safeAreaInset(edge: .top) {
            toolbar // 상단 툴바 뷰
              .safeAreaPadding(.top, topPadding) // 계산된 상단 Inset 적용
              .ignoresSafeArea()
              .background {
                if showBackground {
                  toolbarBackground
                }
              }
          }
      }
      .ignoresSafeArea(.container)
    }
  }

  /// 상단 후행 영역이 가리는지에 따라 기존 Safe Area Inset을 패딩으로 사용하거나 0으로 만듦
  private func topPadding(
    for topTrailingRegion: ReservedRegion?,
    in frame: CGRect,
    with topInset: CGFloat
  ) -> CGFloat {
    if let topTrailingRegion,
      topTrailingRegion.frame.width < frame.width / 4
    {
      return 0
    } else {
      return topInset
    }
  }

...
```

# 마무리

현재 적용한 방법은 임시로 해결할 수 있는 방법 중 하나이며, 앞으로 새로운 형태의 UI가 요구된다면 적절하게 대응되는 방법은 아닙니다. 가급적이면 네이티브 컴포넌트를 사용하여 구현하고 필요 시 최소한으로 적용하는 것이 바람직해 보입니다. 이외에도 Size Class, 모서리 곡률, 힌지 접힘으로 인한 영역 등을 고려해야 합니다.  또한 자동으로 Reserved Region을 피해서 배치되는 `AvoidingRegionVStack`과 같은 레이아웃 등 이러한 UI를 쉽게 개발할 수 있는 API가 필요해 보입니다.

# 참고 문서

관련 API 및 디자인 가이드는 다음 링크를 통해 확인할 수 있습니다.

- [Designing for iPhone Duo | Apple Developer Document](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo)
- [Get Ready for IPhone Duo | Apple Developer Document](https://developer.apple.com/iphone-duo/)

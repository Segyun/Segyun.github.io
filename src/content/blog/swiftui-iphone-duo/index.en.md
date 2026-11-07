---
title: "Adapting to iPhone Duo with SwiftUI"
description: "Sharing our experience adapting SwiftUI interfaces for the unique form factor and Safe Area of iPhone Duo."
pubDate: 2026-11-04
draft: false
thumbnail: "./thumbnail.png"
---

It has been about two weeks since the launch of iPhone Duo. Alongside its unique hardware characteristics—such as new vertical toolbars and a foldable dual-display form factor—iOS introduced novel layout paradigms, Safe Area behaviors, and dedicated developer APIs. In this article, I share my experience researching and writing SwiftUI code to adapt interfaces for the iPhone Duo.

# Exploring the iPhone Duo Layout

Unlike previous iPhones featuring the Dynamic Island, the camera placement and Safe Area layout on iPhone Duo have shifted dramatically. Additionally, the newly introduced Reserved Region concept enables developers to inspect areas physically occluded by camera hardware, hinges, and system status elements.

## Cover Display

![[iphone-duo-outer.png]]

On the outer cover screen, the vertical Safe Area (blue region) is calculated relative to the camera cutout. The camera and Status Bar are identified as Reserved Regions (purple region).

## Main Display

![[iphone-duo-inner.png]]

On the unfolded inner display, horizontal and vertical Safe Areas are applied based on the top-right Status Bar. Similar to the cover display, the Status Bar is treated as a Reserved Region. Furthermore, orange zones indicate Layout Margins, and the central folding hinge area is recognized as a Reserved Region.

![[updated-maps-apps.png]]

Above are screens from recently updated Google Maps and Naver Maps applications. As shown, thoughtfully leveraging the expanded Safe Area is essential to providing a polished, immersive user experience.

# Adapting to iPhone Duo in SwiftUI

![[native-toolbar.png]]

When building with the iOS 27.1 SDK using native controls like standard toolbars and tab bars, components reposition themselves automatically to sensible default locations. However, because native components offer limited visual customization, many apps require custom view positioning and manual layout orchestration.

![[mymallow-outdated.png]]

When building an existing project on the iOS 27.1 SDK without code modifications, views naturally conform to the Safe Area. While functionally intact, the app underutilizes the generous screen real estate. Simply adding `.ignoresSafeArea()` stretches content across the full display, but risks UI elements being occluded by camera notches or bezels.

![[mymallow-updated.png]]

Starting with the iOS 27.1 SDK, `GeometryProxy` exposes an API to inspect Reserved Regions directly. This allows us to calculate how much overlap exists between the reserved region and our custom view layout:

1. First, query system-provided Safe Area insets using an outer `GeometryReader`.
2. Inside, use a nested `GeometryReader` with `.ignoresSafeArea()` to retrieve `ReservedRegion` data (without ignoring safe area bounds, `GeometryProxy` cannot inspect occluded regions beyond the safe margins).
3. Compare the view's frame against the reserved region bounding boxes to detect occlusion.
4. If available space outside the reserved region accommodates the view safely, bypass the default Safe Area.

Here is the core implementation used to construct the adaptive top toolbar:

```swift
...

  func body(content: Content) -> some View {
    GeometryReader { proxy in
      let insets = proxy.safeAreaInsets

      GeometryReader { proxy in
        // Retrieve occlusion reserved regions
        let regions = proxy.reservedRegions(kind: .occlusion)

        // View frame in local coordinates
        let frame = proxy.frame(in: .local)

        // Find occlusion region along the top-trailing edge
        let topTrailingRegion = regions.first { region in
          region.frame.minY == 0 && region.frame.maxX == frame.maxX
        }

        // Calculate top inset padding
        let topPadding = topPadding(
          for: topTrailingRegion,
          in: frame,
          with: insets.top
        )

        content // Main content view
          // Retain default safe area insets for content
          .safeAreaPadding(.leading, insets.leading)
          .safeAreaPadding(.trailing, insets.trailing)
          .safeAreaPadding(.bottom, insets.bottom)
          .safeAreaInset(edge: .top) {
            toolbar // Custom top toolbar view
              .safeAreaPadding(.top, topPadding) // Apply calculated top inset
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

  /// Conditionally applies top safe area inset or zeros it based on top-trailing occlusion
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

# Wrapping Up

The approach demonstrated here provides a practical workaround for custom interface elements, but manual coordinate arithmetic may become brittle as new form factors evolve. Relying on standard native controls wherever feasible and restricting custom geometry calculations to essential scenarios remains the recommended strategy. Additionally, developers should account for Size Classes, corner curvature radii, and hinge occlusion boundaries. High-level layout primitives (such as an `AvoidingRegionVStack`) would be a welcome addition to the SwiftUI ecosystem for foldable development.

# References

For more details on APIs and design guidelines, consult the official documentation:

- [Designing for iPhone Duo | Apple Developer Document](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo)
- [Get Ready for iPhone Duo | Apple Developer Document](https://developer.apple.com/iphone-duo/)

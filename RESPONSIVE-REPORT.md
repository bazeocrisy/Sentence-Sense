# BUILD 1.4.0 — RESPONSIVE REPORT

9 viewports x 3 screens = 27 samples. Chrome emulation only (L-02): no physical device was used.

A **false bottom** is a page that does NOT scroll while a required control sits below the fold, i.e. unreachable. A page that scrolls normally is not a false bottom.

| Viewport | Screen | H-overflow | Scrolls | Below fold | False bottom | Text <12px | Banner |
|---|---|---|---|---|---|---|---|
| phone-375 (375x667) | home | 0px | yes | 4 | no | 0 | stacked |
| phone-375 (375x667) | skill | 0px | no | 0 | no | 0 | — |
| phone-375 (375x667) | practice | 0px | no | 0 | no | 0 | — |
| phone-390 (390x844) | home | 0px | yes | 3 | no | 0 | stacked |
| phone-390 (390x844) | skill | 0px | no | 0 | no | 0 | — |
| phone-390 (390x844) | practice | 0px | no | 0 | no | 0 | — |
| phone-430 (430x932) | home | 0px | yes | 3 | no | 0 | stacked |
| phone-430 (430x932) | skill | 0px | no | 0 | no | 0 | — |
| phone-430 (430x932) | practice | 0px | no | 0 | no | 0 | — |
| tablet-820 (820x1180) | home | 0px | no | 0 | no | 0 | overlay + scrim |
| tablet-820 (820x1180) | skill | 0px | no | 0 | no | 0 | — |
| tablet-820 (820x1180) | practice | 0px | no | 0 | no | 0 | — |
| laptop-1024 (1024x768) | home | 0px | yes | 2 | no | 0 | overlay + scrim |
| laptop-1024 (1024x768) | skill | 0px | no | 0 | no | 0 | — |
| laptop-1024 (1024x768) | practice | 0px | no | 0 | no | 0 | — |
| laptop-1280 (1280x720) | home | 0px | yes | 0 | no | 0 | overlay + scrim |
| laptop-1280 (1280x720) | skill | 0px | no | 0 | no | 0 | — |
| laptop-1280 (1280x720) | practice | 0px | no | 0 | no | 0 | — |
| laptop-1366 (1366x768) | home | 0px | yes | 0 | no | 0 | overlay + scrim |
| laptop-1366 (1366x768) | skill | 0px | no | 0 | no | 0 | — |
| laptop-1366 (1366x768) | practice | 0px | no | 0 | no | 0 | — |
| desktop-1440 (1440x900) | home | 0px | no | 0 | no | 0 | overlay + scrim |
| desktop-1440 (1440x900) | skill | 0px | no | 0 | no | 0 | — |
| desktop-1440 (1440x900) | practice | 0px | no | 0 | no | 0 | — |
| desktop-1920 (1920x1080) | home | 0px | no | 0 | no | 0 | overlay + scrim |
| desktop-1920 (1920x1080) | skill | 0px | no | 0 | no | 0 | — |
| desktop-1920 (1920x1080) | practice | 0px | no | 0 | no | 0 | — |

## Totals

- horizontal overflow: **0** of 27
- false bottoms: **0** of 27
- samples with text under 12px: **0** of 27
- banner headline illegible over the photo: **0**

## The banner, two layouts

Both children sit in the right half of the 2048x768 photograph, so one layout could not serve both screens.

| Width | Layout | Why |
|---|---|---|
| < 620px | photo band ABOVE the text | an 8:3 banner at 358px wide is only 134px tall; overlaying type leaves the children tiny and the text cramped |
| >= 620px | photo fills the banner, text overlays behind a scrim | matches the approved reference |

## Skill grid columns

| Width | Columns |
|---|---|
| 390 (phone) | 1 |
| 820 (tablet) | 2 |
| 1440 (desktop) | 4 |

Same cards, same content, every size. No separate mobile interface.

## Tap targets

Every visible control measured at least 44px tall (check 9.10); the stylesheet floor is 48px.

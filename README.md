# gametest — Pong

A browser-based, first-to-seven Pong game against the computer, built with plain HTML, CSS, JavaScript, and Canvas graphics.

## Prerequisites

- A modern desktop browser with JavaScript enabled and HTML Canvas support.
- A keyboard for paddle movement; touch and mouse paddle controls are not implemented.
- VS Code if you want to inspect or edit the project locally.

There are no package dependencies, required extensions, external services, credentials, or backend components. Node.js is not required.

## Open and run locally in VS Code

1. Download or clone this repository to your computer and extract it if necessary.
2. In VS Code, choose **File → Open Folder** and select the `gametest` folder containing `index.html`, `styles.css`, `pong.js`, and this README—not its parent folder.
3. Open that folder in your operating system's file manager, then open `index.html` in a browser. Keep the three application files together so the relative stylesheet and script links resolve.
4. Select **Start game**. After editing a file in VS Code, save it and reload the browser to load your changes.

**Terminal working directory:** the repository root, `gametest/`, if you open an integrated terminal. No terminal commands are needed for setup or launch. Inspection found no package manifest, build configuration, development-server command, or automated test configuration; do not assume `npm install`, `npm start`, or `npm test` are supported.

The HTML loads CSS and a deferred classic JavaScript file directly. No local server or VS Code debugger configuration is required. This launch method is based on source inspection; runtime behavior has not been verified by the assistant.

## Controls and rules

- You control the left paddle; the computer controls the right paddle.
- With the court focused, hold **W / S** or **Up / Down** to move.
- Press **Space** with the court focused to pause or resume.
- **Start game** begins a match and focuses the court.
- **Restart** resets both scores and paddle positions and begins a new match.
- Leaving court focus, switching windows, or hiding the browser tab triggers automatic pause. Returning does not automatically resume; use Space on the focused court or the Resume button.
- Send the ball past the opposing paddle to score. Each point is followed by a short serve delay. First to 7 wins.
- Scores are in memory only; reloading resets the game.

### Known validation concern

The Pause button's click handler toggles the game state, while the court's blur handler also pauses play. In browsers where clicking the button first moves focus away from the court, that sequence may pause and immediately resume the game. This is a source-level concern, not a reproduced test result. Use Space on the focused court to pause, and include the button interaction in manual validation before deployment.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Canvas, scoreboard, status, controls, and instructions |
| `styles.css` | Responsive dark arcade layout and keyboard focus styling |
| `pong.js` | Rendering, paddle input, computer opponent, physics, scoring, and game state |
| `README.md` | Local setup and validation guidance |

## Testing and expected results

No automated tests or test commands exist. The assistant has reviewed source but has not executed the game or completed the checks below. Expected results are acceptance criteria, not reports of passing tests.

Perform these checks locally using the files opened from VS Code and a browser:

| Check | Expected result |
| --- | --- |
| Initial load | Styled court with a ready overlay, scores at 0, Start enabled, and Pause/Restart disabled. Browser developer tools show no missing local assets or JavaScript errors. |
| Start | Court gains focus, the ready overlay disappears, and the ball begins moving after a short delay. |
| Movement | W/S and arrow keys move only the left paddle, which stays within the court. Releasing a key stops movement; arrow keys do not scroll while the court is focused. |
| Collisions | The ball rebounds from top/bottom walls and paddles. Paddle hit position changes rebound angle; the computer moves its own paddle. |
| Scoring | A ball exiting left awards the computer one point; exiting right awards you one point. A new serve starts after a brief delay. |
| Keyboard pause | Space freezes gameplay and shows Paused. A second press resumes without resetting scores. |
| Automatic pause | Switching tabs/windows or moving focus off the court pauses play. Returning leaves it paused; resuming does not leave movement keys stuck. |
| Pause/Resume button | One activation should leave play paused; Resume should continue. Check specifically for the focus interaction described above and record any failure. |
| Match end | At 7 points, movement stops and the winner and final score appear. Pause is disabled and Restart remains available. |
| Restart | During play, pause, or after a match, Restart resets scores to 0 and starts a fresh match with centered paddles. |
| Layout and focus | Resize to desktop and narrow phone-sized widths; the court remains proportional and controls remain readable. Tab navigation shows a visible focus outline. A keyboard is still required to play. |
| JavaScript disabled | Reload with JavaScript disabled and confirm the explanatory message appears; re-enable it afterward. |

Record the browser/version, checks performed, and any failures. Resolve failures and repeat relevant checks before deployment.

All checks above are local; no Exchange environment or other external service is required. Hosting/deployment is not configured or validated by this project.

## Merge history

<!-- bumblebee-pr-1 -->
### Merged change: Add Pong page structure and controls

Merged pull request #1: https://github.com/perentorio/gametest/pull/1

Files in the approved proposal:
- index.html

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-3 -->
### Merged change: Add responsive arcade styling for Pong

Merged pull request #3: https://github.com/perentorio/gametest/pull/3

Files in the approved proposal:
- styles.css

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-5 -->
### Merged change: Implement playable Canvas Pong

Merged pull request #5: https://github.com/perentorio/gametest/pull/5

Files in the approved proposal:
- pong.js

Bumblebee has not run automated tests or verified runtime behavior for this change.

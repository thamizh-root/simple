# Internal: The Pathfinding Map

This document explains how React "finds" which components to update among thousands by using bitmasks as a navigation trail.

---

## 1. The 3-Step Lifecycle

### Step 1: The "Bubble Up" (Marking the Trail)
When a component calls `setState`, React doesn't just mark that component. It marks the entire path to the Root.
1.  **The Target:** Sets its own `fiber.lanes |= priority`.
2.  **The Ancestors:** Every parent up to the root sets `fiber.childLanes |= priority`.

**Result:** A "trail of breadcrumbs" (bits) exists from the Root directly to the updated component. All other branches remain at `0`.

### Step 2: The Decision (`x & -x` at the Root)
Before rendering, React looks at the `root.pendingLanes` to decide the "Mission."
- If `pendingLanes = 17` (Sync + Default).
- `17 & -17 = 1`.
- **Mission:** "Only follow the trail for **Lane 1**."

### Step 3: Surgical Searching (The Bailout)
React scans down the tree. At every component, it asks: **"Does this branch contain my current mission?"**

```javascript
if ((fiber.childLanes & missionLane) === 0 && (fiber.lanes & missionLane) === 0) {
    // BAILOUT: Skip this component and ALL its children instantly.
}
```

---

## 2. Real-World Scenario (10 Components)

### The Setup
- **App (Root)**
    - **Sidebar (C1, C2, C3)** -> No updates.
    - **MainView**
        - **Profile (C4)** -> Update (Lane 16)
        - **Settings (C5)** -> Update (Lane 16)
    - **Footer**
        - **LiveChat (C6)** -> **Urgent Click! (Lane 1)**

### Phase 1: The Sync Mission (Lane 1)
React starts at the Root.
1.  **Check Sidebar:** `childLanes (0) & 1 === 0`. **Skip 3 components.**
2.  **Check MainView:** `childLanes (16) & 1 === 0`. **Skip 2 components.**
3.  **Check Footer:** `childLanes (1) & 1 === 1`. **Enter.**
4.  **Find C6:** `lanes (1) & 1 === 1`. **Render C6.**

**Result:** Only **1 component** was visited and rendered. The user's click was handled in microseconds.

### Phase 2: The Default Mission (Lane 16)
React looks at the Root again. Only Lane 16 is left.
1.  **Check Sidebar:** `0 & 16 === 0`. **Skip.**
2.  **Check MainView:** `16 & 16 === 16`. **Enter.**
3.  **Render C4 and C5.**

---

## 3. Why Bitmasks are the "Hero"
- **Sets of Work:** A single check `(childLanes & mission)` can look for 31 different priorities at once.
- **Speed:** This check is a single CPU instruction.
- **Memory:** Instead of storing complex "To-Do" lists, React just stores one number per component.

---

## Summary Mental Model
- **`lanes`**: "I have work to do."
- **`childLanes`**: "Someone inside my folder has work to do."
- **`pendingLanes`**: "The Master To-Do List."
- **Render Phase**: A high-speed chase following a specific bit down the tree while ignoring every "dark" branch.

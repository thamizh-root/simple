# React Internals Explorer ⚛️

A deep-dive repository dedicated to deconstructing the React source code (v18.3.1). This project uses a minimal browser-based environment to inspect the Fiber tree, Hook linked lists, and the Reconciler's scheduling logic.

## 📂 Project Structure

- `index.html` / `index.js`: A live "sandbox" to inspect React's `__reactFiber$` nodes in the browser console.
- `assests/`: Local development builds of `react` and `react-dom` (v18.3.1) for direct source code auditing.
- `Vault/`: A structured Obsidian vault containing detailed research notes on the React lifecycle.

## 🗺️ Study Roadmap

This project follows a 4-week architectural deep dive:

### Week 01: Root Scheduling + Render
Focuses on the path from `setState` to the Work Loop.
- **Key Functions:** `dispatchSetState`, `scheduleUpdateOnFiber`, `ensureRootIsScheduled`, `workLoopSync`.
- **Goal:** Understand how React assigns priority (Lanes) and schedules work.

### Week 02: Fiber Traversal (Begin/Complete)
- **Concepts:** `performUnitOfWork`, `beginWork` (Reconciliation), and `completeWork` (Effect Bubbling).

### Week 03: Reconciliation & Hooks
- **Concepts:** Diffing algorithms (keys/types) and the internal `memoizedState` linked list for Hooks.

### Week 04: Commit & DOM
- **Concepts:** `commitRoot`, mutation effects, and how the virtual tree is flushed to the actual DOM.

## 🛠️ How to use
1. Open `index.html` in a browser.
2. Open DevTools (F12) and check the Console.
3. The `InternalsDay01` component will log the active **Component Fiber** and its **Hook State** directly to the console.

## 📝 Research Notes
The detailed technical breakdowns are stored in the `Vault/` directory. For the best experience, open the `Vault` folder in [Obsidian](https://obsidian.md/).

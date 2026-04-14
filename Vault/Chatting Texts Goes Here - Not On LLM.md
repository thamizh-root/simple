
| File                     | Core Modules                                        | Focus                                             |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------- |
| react.development.js     | Reconciler (workLoop*, Fiber ops, hooks dispatcher) | Pure logic: tree building, diffing, state updates |
| react-dom.development.js | Renderer (DOM host config, commit phases)           | Browser-specific: DOM mutations, host components  |

| Week | Topics                           | Tasks (2-3 hrs/day)                                                                                                                                   |
| ---- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Root Scheduling + Render         | Days 1-2: dispatchSetState → ensureRootIsScheduled. <br>Days 3-4: perform_WorkOnRoot → workLoop. <br>Days 5-7: Lanes merging, compare sync/concurrent |
| 2    | Fiber Traversal + Begin/Complete | Days 8-10: performUnitOfWork → beginWork/updateFunctionComponent. <br>Days 11-14: reconcileChildren → completeWork flags bubbling.                    |
| 3    | Reconciliation + Hooks/Queues    | Days 15-18: reconcileChildFibers paths (single/array/keys/types). <br>Days 19-21: processUpdateQueue + hook lists in render                           |
| 4    | Commit & DOM                     | Days 22-25: commitRoot → commit_Effects. <br>Days 26-28: DOM ops (createInstance etc). <br>Days 29-30: Trace full flow + mini-reconciler.             |

Week 01 - root scheduling + render pipeline first
- `dispatchSetState` / update trigger (or root render entry)
- `scheduleUpdateOnFiber`
- `markUpdateLaneFromFiberToRoot`
- `ensureRootIsScheduled`
- `performSyncWorkOnRoot` / `performConcurrentWorkOnRoot`
- `renderRootSync` / `renderRootConcurrent`
- `workLoopSync` / `workLoopConcurrent`

Week 02 - fiber traversal + begin/complete
- `performUnitOfWork`
- `beginWork`
- `updateFunctionComponent`
- `reconcileChildren`
- `completeUnitOfWork`
- `completeWork`

Week 03 - reconciliation + hooks + update queues
- `reconcileChildFibers`
- `mountChildFibers`
- single child / array child paths
- key matching
- type matching
- `useState` hook list structure
- hook update queue
- `processUpdateQueue`
- render-phase state calculation

Week 04 - Commit & DOM
- `commitRoot`
- `commitBeforeMutationEffects`
- `commitMutationEffects`
- `commitLayoutEffects`
- `flushPassiveEffects`
- host config helpers
- DOM ops:
    - create instance
    - append child
    - commit update
    - remove child
    - text updates



---



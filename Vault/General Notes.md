
```
 <script src="./assests/react.development.js"></script>
 <script src="./assests/react-dom.development.js"></script>
 <script src="./index.js"></script>
```


**The Alternative - Double Buffering**: Aha! Moment: React keeps two versions of your component at all times. One is what is currently on the screen (Current), and one is what it is currently calculating (Work-in-Progress).


**The Flags - The To-Do List:** Inside the componentFiber, look for a property called flags (or effectTag in older sub-versions). If it is 0, it means "Nothing to do."
If you just updated the state, you might see a number there. This number is a bitmask that tells React: "Hey, when you finish the math, you need to go to the actual browser DOM and change the text."


**The "MemoizedProps" vs "PendingProps"**: Look at these two fields in the Fiber:
memoizedProps: The data used during the last render.
pendingProps: The data coming in for the next render.


**Locate the Work Loop in your File:** This is the "heartbeat." You will see a while loop that keeps calling performUnitOfWork. This is where React uses those child, sibling, and return pointers you found earlier. It’s a literal loop that walks the tree like a person walking through a maze.

Triggers for WorkLoopSync
1. Initial Mount
2. Context Changes
3. Prop Changes from a Parent

This demystifies the *child -> sibling -> return* immediately. While moving, it is running your code and calculating the difference between what is on the screen and what should be on the screen. It's essentially a giant "Difference Engine."

The flow is scheduler --> workloop (render phase) --> workloop (commit phase)

```
1. trigger update
   - initial mount
   - setState
   - parent prop change
   - context change
1. scheduler assigns lane (priority)
   - decides when render work should run
   - render can be paused in concurrent mode
1. render phase (interruptible)
   - build work-in-progress tree
   - beginWork:
       - run component function / process host fiber
       - get next children
       - compare old fiber vs new elements
       - reconcile by type + key + props
       - reuse / create / delete fibers
       - set flags
   - completeWork:
       - finalize host work
       - prepare DOM update payload
       - bubble flags into subtreeFlags
   - traversal uses child -> sibling -> return
4. commit phase (not interruptible)
   - commitRoot
   - apply DOM mutations
   - run layout effects
   - schedule passive effects

important:
- lanes = priority (when to render)
- flags = effect type (what to do in commit)
```
  
### render side
- `scheduleUpdateOnFiber`
- `ensureRootIsScheduled`
- `performConcurrentWorkOnRoot` / `performSyncWorkOnRoot`
- `renderRootConcurrent` / `renderRootSync`
- `workLoopConcurrent` / `workLoopSync`
- `performUnitOfWork`
- `beginWork`
- `completeUnitOfWork`
- `completeWork`
- `reconcileChildFibers`
### commit side
- `commitRoot`
- `commitBeforeMutationEffects`
- `commitMutationEffects`
- `commitLayoutEffects`
- `flushPassiveEffects`


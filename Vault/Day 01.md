
Week 01 - root scheduling + render pipeline first
- `dispatchSetState` / update trigger (or root render entry)
- `scheduleUpdateOnFiber`
- `markUpdateLaneFromFiberToRoot`
- `ensureRootIsScheduled`
- `performSyncWorkOnRoot` / `performConcurrentWorkOnRoot`
- `renderRootSync` / `renderRootConcurrent`
- `workLoopSync` / `workLoopConcurrent`



goal: how does a state update travel from `setState` to entering the render work loop?

button click → create update → mark lanes → schedule → pick priority → render → work loop → commit

button click
-> dispatchSetState (create update + lane)
-> scheduleUpdateOnFiber (find root)
-> markUpdateLaneFromFiberToRoot (bubble lane to root)
-> ensureRootIsScheduled (decide sync vs concurrent)
-> performSyncWorkOnRoot / performConcurrentWorkOnRoot (start render diff calculation phase)
-> renderRootSync / renderRootConcurrent (setup render)
-> workLoopSync / workLoopConcurrent (iterate fibers)


you should be able to answer these 5 questions by end of day:
1. **who starts the update?**  
    `root.render` on mount, `dispatchSetState` on click
2. **where does React attach priority?**  
    lane assignment before scheduling
3. **how does React find the root from a component fiber?**  
    `markUpdateLaneFromFiberToRoot`
4. **who decides sync vs concurrent entry?**  
    `ensureRootIsScheduled`
5. **where does actual render loop begin?**  
    `renderRootSync/renderRootConcurrent -> workLoop*`


Q01: shall we focus on week 01 now and today is day 01
give me a workflow to understand 
list of places i should add console.log to understand the workflow
give me an example to simple workflow, then another example to real file 


we are still in day 01..
no console added to this guy 
function dispatchSetState(fiber, queue, action) {
## `dispatchSetState` does this:

> **it takes your `setState` call, converts it into an update object, attaches priority (lane), optionally computes next state early, and then schedules React to re-render starting from the root.**

setState = write state + schedule re-render

setState
-> create update object
-> assign lane (priority)
-> try eager state calculation (optimization)
-> enqueue update into hook queue
-> find root
-> schedule update on root

## what comes in
- `fiber` → the component where `useState` lives
- `queue` → the hook’s update queue
- `action` → what you passed to `setState`



lanes = when to render
flags = what to do in commit

dispatchSetState
-> scheduleUpdateOnFiber
-> ensureRootIsScheduled
-> performSyncWorkOnRoot
-> renderRootSync
-> workLoopSync

dispatchSetState
  -> assigns LANE ✅
render phase (beginWork / completeWork)
  -> assigns FLAGS ✅
commit phase
  -> executes FLAGS


---


Q: what does you mean by "schedules the render" -- it means priority, right? so lane is technically a priority?

A: lane = determines how urgently React should start the render phase (calculation)
flags = instructions for commit phase

render phase = calculation (NOT visible)
commit phase = visible update


---


Q: i understand, lane is determined based on event / context, what is happening on next method i mean on scheduleUpdateOnFiber...

with use of this lane, is it finding root? what does finding root here means?

what is root is identified and scheduled?

lane is already found and attached to the element? what is happening here?

### mental model (VERY IMPORTANT)

#### before scheduleUpdateOnFiber
fiber.lanes = lane  
root.pendingLanes = 0 ❌
👉 scheduler doesn't know anything yet

#### after scheduleUpdateOnFiber
fiber.lanes = lane  
root.pendingLanes = lane ✅


---


Q. if there is 20 elements
if there is any change in 10th element
what i know before is
react re-renders below 10 elements
what internally hapenning is it is updating updating lanes only upwards?
how it is affecting re-render on downwards?

it does not matter where the change happened. 
root has to informed and she will check all the elements irrespectively.
it SKIPS most of them using lanes + bailout
only changed component and it's descendent will be calculated diff and commited.

1. change happens at fiber10
2. lanes propagate UP to root
3. root schedules work
4. render starts from root (DOWN)
5. beginWork decides:
   - skip (bailout) OR
   - process (diff)

Root
 ├── 1
 ├── 2
 ├── ...
 ├── 10 (updated)
 │    ├── 11
 │    ├── 12

change anywhere →
lane goes UP →
root schedules →
render starts from root →
only paths with that lane are explored →
others are skipped →
only affected subtree is diffed and committed


---

Q: dispatchSetState is invoked as soon as there is change , what is next?

dispatchSetState → "i have work"
scheduleUpdateOnFiber → "boss (root), here is the work"
ensureRootIsScheduled → "decide when to do it"

dispatchSetState:
```
input: user action
process: create update + lane
output: fiber.lanes updated
next: scheduleUpdateOnFiber

```

scheduleUpdateOnFiber:
```
input:
- root
- fiber
- lane
- eventTime

process:
1. markRootUpdated → root.pendingLanes |= lane
2. handle render-phase / interleaved cases
3. ensureRootIsScheduled → schedule work

output:
- root now has pending work
- scheduler notified

next:
→ performSyncWorkOnRoot OR performConcurrentWorkOnRoot
```


ensureRootIsScheduled:

```
input:
- root (with root.pendingLanes already set)
- eventTime

process:

1. get next lanes to work on
   → nextLanes = getNextLanes(root, currentRenderLanes)

   (picks highest priority lane from root.pendingLanes)

2. if no lanes
   → cancel existing callback (if any)
   → exit (nothing to do)

3. determine priority
   → newPriority = lanesToEventPriority(nextLanes)

4. compare with existing scheduled task
   → if same priority → reuse existing callback (do nothing)
   → if different → cancel old callback

5. decide execution type
   → if SyncLane
        → schedule sync work (microtask / immediate)
   → else
        → schedule concurrent work using scheduler
           scheduleCallback(priority, performConcurrentWorkOnRoot)

6. store callback info on root
   → root.callbackNode = new callback
   → root.callbackPriority = newPriority

output:
- root now has a scheduled callback (task)
- scheduler knows when/how to execute it

next:
→ performSyncWorkOnRoot OR performConcurrentWorkOnRoot
```



   1. The Fiber (The Data): Look at ReactFiber.new.js. Understand that everything is a "Fiber" object with a
      child, sibling, and return.
   2. The Work Loop (The Engine): Look at ReactFiberWorkLoop.new.js. This is the while loop that processes those
      Fibers.
   3. BeginWork (The Decision): Look at ReactFiberBeginWork.new.js. This is where React decides if a component
      needs an update.
   4. CompleteWork (The Output): Look at ReactFiberCompleteWork.new.js. This is where React finally creates the
      actual DOM elements.
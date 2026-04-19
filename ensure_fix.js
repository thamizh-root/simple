  function ensureRootIsScheduled(root, currentTime) {
    var existingCallbackNode = root.callbackNode; // Check if any lanes are being starved by other work. If so, mark them as
    // expired so we know to work on those next.

    markStarvedLanesAsExpired(root, currentTime); // Determine the next lanes to work on, and their priority.

    var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
    console.log(`[3] ensureRootIsScheduled | Next Lanes: ${window.logLane(nextLanes)}`);

    if (nextLanes === NoLanes) {
      // Special case: There's nothing to work on.
      if (existingCallbackNode !== null) {
        cancelCallback$1(existingCallbackNode);
      }

      root.callbackNode = null;
      root.callbackPriority = NoLane;
      return;
    } // We use the highest priority lane to represent the priority of the callback.


    var newCallbackPriority = getHighestPriorityLane(nextLanes); // Check if there's an existing task. We may be able to reuse it.

    var existingCallbackPriority = root.callbackPriority;

    if (existingCallbackPriority === newCallbackPriority && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(ReactCurrentActQueue$1.current !== null && existingCallbackNode !== fakeActCallbackNode)) {
      {
        console.log(`[3.1] Reusing existing callback at priority: ${window.logLane(existingCallbackPriority)}`);
      }
      return;
    }

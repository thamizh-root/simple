# Internal: React Lanes & The Bitmask System

This document explains why React uses "Lanes" (bits) instead of simple numbers (1, 2, 3...) for priority.

---

## 1. Why Legacy Mode always returns `1`?
In Legacy Mode (`ReactDOM.render`), React does not support **Concurrent** features (interruptible rendering). 
- **SyncLane (1)** is the highest priority.
- By forcing every update to be `1`, React ensures every change is calculated and flushed to the DOM **immediately and synchronously**.

---

## 2. The 4 Main "Buckets" of Priority
React maps dozens of browser events into these 4 internal categories:

| Category | Priority (Lane) | Example Events | User Expectation |
| :--- | :--- | :--- | :--- |
| **Discrete** | `SyncLane (1)` | `click`, `keydown`, `focus` | Immediate feedback (< 16ms) |
| **Continuous** | `InputContinuous (4)` | `mousemove`, `wheel`, `touchmove` | Smooth motion (no lag) |
| **Default** | `DefaultLane (16)` | `setTimeout`, `fetch`, `message` | "As soon as possible" |
| **Transition** | `TransitionLanes (64+)` | `startTransition(() => ...)` | Background work (can wait) |

---

## 3. The Bitmask System (The "31-Lane Highway")

### The Problem with Simple Numbers
If React used a list like `[1, 2, 3]`, it could only track **one priority at a time**. It wouldn't know how to handle "I have a Sync update AND a Transition update pending" without a complex array.

### The Solution: Bitmasks
React uses a **32-bit integer** (though JS bitwise math handles 31 bits effectively). Think of it as **31 individual on/off switches** inside a single number.

#### The "Highway" Analogy
Imagine a highway with 31 lanes.
- **Lane 0 (Bit 1):** The Emergency Lane (Ambulances only).
- **Lane 1 (Bit 2):** The HOV Lane.
- **Lanes 6-21 (Bits 64+):** The Truck Lanes (Slow, heavy work).

**Why is this powerful?**
1. **Speed:** Bitwise math is the fastest thing a CPU can do.
2. **Combination:** You can combine work. If you have a Sync update (1) and a Continuous update (4), the `pendingLanes` becomes `5` (`1 | 4`). 
   - `00000101` (Binary for 5) tells React: *"Lanes 0 and 2 have cars in them!"*
3. **Filtering:** React can say: *"Show me only the high-priority work"* by using an `AND (&)` mask.
   - `pendingLanes & 0b11` → Filters out everything except the fastest lanes.

### Bitwise Cheat Sheet
- **`|` (OR):** Adds a lane to the list. (`current | new`)
- **`&` (AND):** Checks if a specific lane has work. (`pending & lane`)
- **`~` (NOT):** Removes a lane from the list.

---

## 4. The Priority "Radar Gun" (`x & -x`)

React uses a famous low-level computer science trick to instantly find the most important task in its `pendingLanes` list.

### The Problem
If `pendingLanes = 21` (Binary `10101`), it means React has work in:
- **Sync (1)**
- **Continuous (4)**
- **Default (16)**

React needs to pick the **smallest bit** (the highest priority) immediately.

### The Solution: `x & -x`
Using **Two's Complement** math, this operation isolates only the right-most `1` bit in a single CPU cycle.
- **`21 & -21`** results in **`1`**.
- **`20 & -20`** results in **`4`**.

**Why?** Because in modern processors, bitwise math is the fastest way to make a decision. React never has to "loop" through a list of tasks; it just performs a mathematical filter.

---

## 5. Batching & The "Chef" Analogy

Why does clicking "Default (16)" multiple times not change the lane number?

### The Mental Model: Chef & Order Tickets
1.  **The Lane (The Bell):** This is a single physical bell in the kitchen. When you pull the handle, the bell rings.
2.  **The Update Queue (The Tickets):** These are the individual pieces of paper with "Cook a Burger" written on them.

**The Workflow:**
- **Update 1:** You write a ticket and ring the bell (**Bit 16 is now ON**).
- **Update 2:** You write another ticket. You try to ring the bell, but the handle is already pulled down.
- **Update 3:** Same thing. 

**The Result:**
The Chef (React) hears the bell **once**. He walks over, sees **3 tickets** on the counter, and processes them all in one single go.
- He flips the burgers.
- He puts them on the buns.
- He sends out **one single plate** (One Render).

**The Benefit:** This is how React "batches" state updates. It doesn't matter if you call `setState` 100 times; if they are in the same lane, the "Bell" only needs to ring once.

---

## 6. Transitions: Why do they have 16 slots?

Unlike Sync or Default (which only have 1 bit each), **Transitions** have a "Multi-Story Garage" (Bits 6-21).

### The Reasoning
Standard updates (Sync/Default) are like **Emergency Alarms**—you only need one. But Transitions are like **Long-Running Projects**.
- If you have two different transitions (e.g., filtering a list and generating a chart), React needs to be able to track them separately.
- By giving them different bits, React can **Interleave** them (work on A for 5ms, then B for 5ms) or **Cancel** one without affecting the other.

---

## Updated Summary Mental Model
- **Lanes** are **ID Cards** for updates.
- **Bitmasks** are a **To-Do List** inside a single number.
- **`x & -x`** is the **Foreman** who finds the most urgent job instantly.
- **Batching** is the **Kitchen Bell** that prevents the Chef from working until all the tickets are on the counter.
- **Transitions** are **Parallel Projects** that need their own space to breathe.


The "Shortcut" Rule
In bitmasking, checking (Number & 1) is a common way to ask: "Is the first bit active?"

Even numbers (like 16) always have a 0 at the end in binary. So, Even & 1 will always be 0.

Odd numbers (like 17) always have a 1 at the end in binary. So, Odd & 1 will always be 1.
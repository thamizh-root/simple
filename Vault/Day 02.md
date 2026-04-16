

nice… day 02 🔥  
today we go one level deeper into the pipeline you already started.

yesterday you saw:  
**dispatch → schedule → root scheduling**

today you will see:  
👉 **how render phase actually starts and runs (the work loop)**

---

# 🧠 day 02 plan (20 mins)

## ⏱️ 0–5 min → quick recap (very important)

say this in your own words:

- dispatchSetState → creates update + lane
    
- scheduleUpdateOnFiber → finds root
    
- ensureRootIsScheduled → decides sync / concurrent
    

👉 goal:  
you should feel: _"ok, work is scheduled… but not yet executed"_

---

## ⏱️ 5–15 min → main topic (core learning)

# 🚀 today focus:

## 👉 `performSyncWorkOnRoot` / `performConcurrentWorkOnRoot`

this is where:

> **react actually starts doing the work**

### simple flow:

```
ensureRootIsScheduled
        ↓
performSyncWorkOnRoot (or concurrent)
        ↓
renderRootSync / renderRootConcurrent
        ↓
workLoopSync / workLoopConcurrent
        ↓
performUnitOfWork
        ↓
beginWork → completeWork
```

---

## 🧩 understand like this (very important mental model)

### 1. performSyncWorkOnRoot

👉 entry point of render phase

- takes root
    
- prepares stack
    
- calls renderRootSync
    

👉 think:

> "ok now i will process all fibers"

---

### 2. renderRootSync

- sets workInProgress root
    
- initializes render
    
- calls:
    

```
workLoopSync()
```

---

### 3. workLoopSync

this is the **engine**

```
while (workInProgress !== null) {
   performUnitOfWork(workInProgress)
}
```

👉 think:

> "keep processing fibers one by one"

---

### 4. performUnitOfWork

this is **one fiber step**

```
beginWork(current, workInProgress)
```

then:

- if child exists → go down
    
- else → completeWork
    

---

### 5. beginWork (🔥 very important)

👉 **this is where reconciliation happens**

- compare old fiber vs new props
    
- decide:
    
    - update?
        
    - bailout?
        
    - create child fibers?
        

👉 sets:

- **lanes check happens here**
    
- decides if work needed
    

---

### 6. completeWork

👉 runs when coming back up

- create DOM nodes
    
- prepare effects
    

👉 sets:

- **flags (Placement, Update, etc)**
    

---

# 🧠 key answers (your question yesterday)

### ❓ where lane is checked?

👉 inside **beginWork**

---

### ❓ where flags are set?

👉 inside **completeWork**

---

### ❓ where begin/complete start/end?

```
performUnitOfWork
   ↓
beginWork (down phase)
   ↓
...children...
   ↓
completeWork (up phase)
```

👉 tree traversal:

- down → beginWork
    
- up → completeWork
    

---

# ⏱️ 15–20 min → speak practice (your main goal)

talk like you're explaining to junior:

👉 try this:

```
after scheduling, react starts render phase

performSyncWorkOnRoot is entry point

then react runs workLoop

workLoop picks one fiber at a time

each fiber goes through beginWork and completeWork

beginWork decides what to do

completeWork prepares DOM and sets flags
```

---

# 🎯 today outcome

after day 02 you should clearly know:

✅ where render starts  
✅ what workLoop is  
✅ how fiber traversal works  
✅ where lanes & flags live

---

# tomorrow (day 03 🔥)

we go deeper into:  
👉 **beginWork internals (reconciliation, bailout, child creation)**

---

if you want, i can also:  
👉 map exact lines from your `react-dom.development.js` to this flow (super powerful for you)
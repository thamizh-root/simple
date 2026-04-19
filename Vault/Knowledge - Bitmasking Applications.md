# Knowledge: Bitmasking Applications

Bitmasking is a technique used to store multiple pieces of information (flags or small values) in a single integer variable.

---

## 1. Core Principles
- **Binary as Switches:** Each bit in a 32-bit integer acts as an independent ON/OFF switch.
- **Power of 2 Rule:** Values must be powers of 2 (1, 2, 4, 8...) to prevent overlap.
- **Sets vs. Counters:** A bitmask represents a **Set** of states. Adding the same bit twice (`x | 1 | 1`) does not change the value.

---

## 2. Beyond Booleans: Bit-Packing
You can divide a single 32-bit integer into "zones" to store more than just true/false.

### Example: Hex Color Packing (ARGB)
- **Bits 0-7:** Red (0-255)
- **Bits 8-15:** Green (0-255)
- **Bits 16-23:** Blue (0-255)
- **Bits 24-31:** Alpha (0-255)
**Usage:** `(color >> 8) & 255` extracts only the Green value.

---

## 3. Real-World Use Cases

### A. Video Games (Collision Layers)
- **The Concept:** Bullet layer has mask `5` (Player + Wall).
- **The Check:** `if (hitObject.layer & bullet.mask)`
- **Benefit:** Bullets can pass through water/foliage but hit solid objects with a single CPU instruction.

### B. File Permissions (Linux/macOS)
- **The Concept:** Read (4), Write (2), Execute (1).
- **The Value:** `7` means full access (`111`).
- **Benefit:** Represent all 8 combinations of access in one tiny number.

### C. E-commerce Filtering (Amazon/Flipkart)
- **The Concept:** Attributes like `isPrime`, `isDiscounted`, `freeShipping`.
- **The Value:** Product A = `10` (Discounted + Electronics).
- **Benefit:** Millions of products can be filtered using one bitwise `&` check instead of complex database queries.

### D. IoT & Microcontrollers
- **The Concept:** One "Register" controls multiple physical pins on a chip.
- **Benefit:** Turn on a motor, an LED, and a heater simultaneously with one electrical signal.

---

## 4. Why use Bitmasking?

| Feature | Bitmask | Objects/Arrays |
| :--- | :--- | :--- |
| **Speed** | **Instant** (1 CPU cycle) | Slow (Loops/Sorting) |
| **Memory** | **Tiny** (4 bytes) | Large (Strings/Keys) |
| **Transmission** | **Instant** (One number) | Slow (JSON parsing) |
| **Storage** | **1 Column** | Multiple columns/tables |

---

## Summary Mental Model
Bitmasking is **"The Language of the Machine."** It turns **Logic** into **Arithmetic**. Whenever you need to handle thousands of items with high speed and low memory (like React's 31 Lanes), bitmasking is the primary tool.

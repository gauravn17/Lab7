
### 1) Where would you fit your automated tests in your Recipe project development pipeline?

**Answer:**  
**Within a GitHub Action that runs whenever code is pushed.**  
This ensures that tests automatically run every time code is pushed to the repo. It helps catch bugs early, avoids broken code in production, and saves time by providing immediate feedback.

---

### 2) Would you use an end-to-end test to check if a function is returning the correct output?

**Answer:**  
**No.**  
End-to-end (E2E) tests simulate real user interactions and workflows. Checking a function’s return value is best handled by **unit tests**, which are simpler, faster, and more targeted.

---

### 3) What is the difference between navigation and snapshot mode?

**Answer:**  
- **Navigation Mode** runs a full page load from scratch and measures performance, accessibility, and load times as the user would experience them.  
- **Snapshot Mode** analyzes the page in its current visual state without reloading it, which is useful for catching layout or accessibility issues but not performance-related ones.

---

### 4) Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.

**Answer:**  
1. **Optimize images** by compressing them to reduce load time.  
2. **Minimize unused JavaScript** to make the site load and interact faster.  
3. **Add descriptive alt text** for all images to improve accessibility for screen readers.






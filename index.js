const { useState, useTransition, useMemo } = React;

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  // 1. Sync Update (Discrete Event - Lane 1)
  const handleSyncClick = () => {
    console.log("%c >>> Triggering SYNC update (Click) <<<", "color: #f472b6; font-weight: bold;");
    setCount(c => c + 1);
  };

  // 2. Default Update (setTimeout - Lane 16)
  const handleDefaultUpdate = () => {
    console.log("%c >>> Triggering DEFAULT update (setTimeout) <<<", "color: #818cf8; font-weight: bold;");
    setTimeout(() => {
      setCount(c => c + 1);
    }, 100);
  };

  // 3. Transition Update (startTransition - Lane 64+)
  const handleTextChange = (e) => {
    const val = e.target.value;
    
    // Urgent update (Sync)
    setText(val);

    // Non-urgent update (Transition)
    startTransition(() => {
      console.log("%c >>> Triggering TRANSITION update <<<", "color: #38bdf8; font-weight: bold;");
      // Simulate heavy work
      const newItems = Array.from({ length: 5000 }, (_, i) => `${val} - ${i}`);
      setItems(newItems);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh" }}>
      <h1>React Lanes Explorer</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button 
          onClick={handleSyncClick}
          style={{ padding: "10px", background: "#f472b6", border: "none", borderRadius: "5px", color: "white", cursor: "pointer" }}
        >
          Sync Update (Counter: {count})
        </button>

        <button 
          onClick={handleDefaultUpdate}
          style={{ padding: "10px", background: "#818cf8", border: "none", borderRadius: "5px", color: "white", cursor: "pointer" }}
        >
          Default Update (Delayed)
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Transition Test (Heavy List)</h3>
        <input 
          type="text" 
          value={text} 
          onChange={handleTextChange} 
          placeholder="Type to filter..."
          style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
        />
        {isPending && <span style={{ marginLeft: "10px", color: "#38bdf8" }}>Rendering...</span>}
      </div>

      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #334155", padding: "10px", borderRadius: "5px" }}>
        {items.length === 0 ? "Type something to generate items..." : items.slice(0, 50).map((item, i) => (
          <div key={i} style={{ padding: "2px 0", fontSize: "12px", color: "#94a3b8" }}>{item}</div>
        ))}
        {items.length > 50 && <div>... and {items.length - 50} more items</div>}
      </div>

      <div style={{ marginTop: "40px", padding: "20px", background: "#1e293b", borderRadius: "10px", border: "1px solid #334155" }}>
        <h4>Instruction:</h4>
        <ol style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
          <li>Open your Browser Console (F12).</li>
          <li>Click <b>Sync Update</b>: Notice <code>Lane: Sync (1)</code> in logs.</li>
          <li>Click <b>Default Update</b>: Notice <code>Lane: Default (16)</code> after 100ms.</li>
          <li>Type in the box: Notice two renders. One <code>Sync</code> for the box, and one <code>Transition</code> for the list.</li>
        </ol>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

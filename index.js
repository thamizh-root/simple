// const { useState, useRef, useEffect } = React;

// function InternalsDemo() {
//   const [count, setCount] = useState(42); // Our target state
//   const divRef = useRef(null);

//   useEffect(() => {
//     if (divRef.current) {
//       // 1. Get the Fiber node for this specific <div>
//       const hostFiber = divRef.current[Object.keys(divRef.current).find(key => key.startsWith('__reactFiber$'))];
      
//       // 2. The parent of the <div> is the InternalsDemo component Fiber
//       const componentFiber = hostFiber.return;

//       console.log("Found Component Fiber:", componentFiber);
      
//       // 3. THIS is where your hook state lives
//       console.log("Hook State (memoizedState):", componentFiber.memoizedState);
      
//       // If you have multiple hooks, they are a linked list!
//       // componentFiber.memoizedState.next would be the second hook.
//     }
//   }, []);

//   return React.createElement('div', { ref: divRef }, [
//     React.createElement('h1', null, `Count: ${count}`),
//     React.createElement('button', { onClick: () => setCount(c => c + 1) }, 'Update')
//   ]);
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(React.createElement(InternalsDemo));



const { useState, useRef, useEffect } = React;

function InternalsDay01() {
  const [count, setCount] = useState(42);
  const boxRef = useRef(null);

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;

    const fiberKey = Object.keys(node).find(
      (key) => key.startsWith('__reactFiber$')
    );

    if (!fiberKey) {
      console.warn('React Fiber key not found. This only works in React DOM dev builds.');
      return;
    }

    const hostFiber = node[fiberKey];
    const componentFiber = hostFiber.return;

    if (!componentFiber) {
      console.warn('Component Fiber not found.');
      return;
    }

    const firstHook = componentFiber.memoizedState;
    const secondHook = firstHook?.next;

    console.group('React Internals Demo');
    console.log('Component Fiber:', componentFiber);

    console.log('First hook node:', firstHook);
    console.log('First hook current value:', firstHook?.memoizedState); // useState => 42

    console.log('Second hook node:', secondHook);
    console.log('Second hook current value:', secondHook?.memoizedState); // useRef => { current: ... }

    console.log(
      'Explanation:',
      'Hooks are stored as a linked list on componentFiber.memoizedState'
    );
    console.groupEnd();
  }, []);

  return React.createElement(
    'div',
    { ref: boxRef, style: { fontFamily: 'sans-serif', padding: '16px' } },
    [
      React.createElement('h2', { key: 'title' }, 'Day 01: Fiber + Hooks'),
      React.createElement('p', { key: 'count' }, `Count: ${count}`),
      React.createElement(
        'button',
        { key: 'btn', onClick: () => setCount((c) => c + 1) },
        'Increment'
      )
    ]
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(InternalsDay01));
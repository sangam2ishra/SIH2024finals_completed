import React, { useState } from 'react';

function App() {
  // Define a state for the input value
  const [inputValue, setInputValue] = useState('Initial Value');

  // Function to update the input value when the button is clicked
  const handleButtonClick = () => {
    setInputValue('New Value');
  };

  return (
    <div>
      <h1>Change Input Box Value</h1>
      {/* Input element controlled by state */}
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
      />
      <br />
      {/* Button to change the value */}
      <button onClick={handleButtonClick}>Change Value</button>
    </div>
  );
}

export default App;

import React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import TableBlock from './components/TableBlock';
import { useState } from 'react';

function Mainpage() {
  const [selectedDict, setSelectedDict] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);

  return (
    <div className="App">
      <Header
        selectedDict = {selectedDict}
        setSelectedDict = {setSelectedDict}
        setFilterEnabled={setFilterEnabled}
        />
      <TableBlock
        selectedDict = {selectedDict}
        filterEnabled={filterEnabled}
        />
      <Footer/>
    </div>
  );
}

export default Mainpage;
import React, { Component } from 'react';
import './App.css';
import FileUpload from './components/FileUpload'

class App extends Component {
  render() {
    return (
      <div className="App">
        <section className=" " >  
          <FileUpload />
        </section>
      </div>
    );
  }
}

export default App;

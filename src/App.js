import React from 'react';
import './App.css';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import { Row, Col } from 'antd';

function App() {
  return (
    <div className="App">
      <Row type="flex" align="middle" justify="center">
        <Col span={12}>
          <h1>React-Redux Notes app</h1>
          <NoteForm />
          <hr />
          <NotesList />
        </Col>
      </Row>
    </div>
  )
}

export default App;

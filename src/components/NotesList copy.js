import React from 'react'
import { connect } from 'react-redux'
import { removeNote, showActive, showInActive } from '../redux/actions/actions';
import { Button, Row, Col, Tag, Icon } from 'antd';
import './NoteForm_List.css';

class NotesList extends React.Component {
/*   constructor(props) {
    super(props)
  } */

  render() {
    let visibility = this.props.visibility;
    let notes = this.props.notes.filter(note => note.status === visibility);
    if(notes.length > 0) {
      return (
        <>
          <h2>Notes</h2>
          <Row type="flex" justify="center">
            <Col span={9}>
              <Button type="primary" onClick={ () => this.props.showActive()} className="form-btn" >
                Show Active Notes
              </Button>
            </Col>
            <Col span={2}></Col>
            <Col span={9}>
              <Button type="danger" onClick={ () => this.props.showInActive()} className="form-btn" >
                Show Inactive Notes
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
            <Col>
              <ul>
                {notes.map((note, index) => (
                  <li key={note.id} style={{ backgroundColor: index % 2 == 0 ? "#f7f7f7" : "white" }}>
                    <Row>
                      <Col span={4}>
                        <Tag color={note.tag === "general" ? "geekblue" : note.tag === "important" ? "orange" : "" }>{ note.tag }</Tag>
                      </Col>
                      <Col span={16}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>  
                        <hr />    
                        <span>Due: {note.dueDate[0]} - {note.dueDate[1]}</span>
                        <br />
                        <span className="txt-date">created: {note.createdDate}</span>
                      </Col>
                      <Col span={4} style={{ textAlign: 'right', height: '100%' }}>
                        <Button className="remove-btn" type="danger" icon="close" shape="circle" size="small" 
                          onClick={() => this.props.removeNote(note.id)}
                        />
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </>
      )
    } else {
      return (
        <>
          <h2>Notes</h2>
          <Row type="flex" justify="center">
            <Col span={9}>
              <Button type="primary" onClick={ () => this.props.showActive()} className="form-btn" >
                Show Active Notes
              </Button>
            </Col>
            <Col span={2}></Col>
            <Col span={9}>
              <Button type="danger" onClick={ () => this.props.showInActive()} className="form-btn" >
                Show Inactive Notes
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }} type="flex" justify="center">
            <span id="empty-notice"><Icon type="file-exclamation" /> Empty Note</span>
          </Row>
        </>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    visibility: state.visibility
  }
}

const mapDispatchToProps = {
  removeNote: removeNote,
  showActive: showActive,
  showInActive: showInActive
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesList)
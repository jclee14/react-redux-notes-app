import React from 'react'
import { connect } from 'react-redux'
import { showActive, showInActive, showFilterTag } from '../redux/actions/actions';
import { Button, Row, Col, Input, Select, Icon } from 'antd';
import './NoteForm_List.css';
import NotesItem from './NotesItem';
import { STATUS_ACTIVE, STATUS_INACTIVE, TAG_ALL } from '../redux/actions/actions'; 

const ButtonGroup = Button.Group;
const InputGroup = Input.Group;
const { Option } = Select;

class NotesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      searchType: 'title',
    };
  }

  handleSearchInput = (event) => {
    this.setState({ searchInput: event.target.value.toLowerCase() });
  }

  handleSearchType = (value) => {
    this.setState({ searchType: value});
  }

  render() {
    let visibility = this.props.visibility;
    let tagFilter = this.props.tagFilter;
    const propsTags = this.props.tags;

    return (
      <>
          <h2>Notes</h2>
          <Row type="flex" justify="center">
            <Col span={9}>
              <Button type={visibility === STATUS_ACTIVE ? "primary" : "dashed"} onClick={ () => this.props.showActive() } className="form-btn" >
                Active Notes
              </Button>
            </Col>
            <Col span={2}></Col>
            <Col span={9}>
              <Button type={visibility === STATUS_INACTIVE ? "danger" : "dashed"} onClick={ () => this.props.showInActive() } className="form-btn" >
                Inactive Notes
              </Button>
            </Col>
          </Row>
          <br />
          <Row type="flex" justify="center">
            <Col>
              <ButtonGroup className="tag-btn-group" style={{ witdh: "100%" }}>
                <Button type={tagFilter === TAG_ALL ? "primary" : "dashed"} onClick={ () => this.props.showFilterTag(TAG_ALL)} >
                  All Tags
                </Button>
                {
                  propsTags.map((tagItem) => (
                    <Button type={tagFilter === tagItem.tagName ? "primary" : "dashed"} onClick={ () => this.props.showFilterTag(tagItem.tagName) } >
                      { tagItem.tagName[4] + tagItem.tagName.substring(5,tagItem.tagName.length).toLowerCase() }
                    </Button>
                  ))
                }
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Row  type="flex" justify="center">
            <Col span={20}>
              <InputGroup compact>
                <Input
                  style={{ width: "70%" }}
                  onChange={ this.handleSearchInput }
                  placeholder="Search your note here"
                />
                <Select
                  defaultValue="title"
                  style={{ width: "30%"}}
                  onChange={ this.handleSearchType }
                >
                  <Option value="title"><Icon type="search" /> Title </Option>
                  <Option value="content"><Icon type="search" /> Content </Option>
                </Select>
              </InputGroup>
            </Col>
          </Row>
          <NotesItem searchInput={ this.state.searchInput } searchType={ this.state.searchType } />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    visibility: state.visibility,
    tagFilter: state.tagFilter,
    tags: state.tags,
  }
}

const mapDispatchToProps = {
  showActive: showActive,
  showInActive: showInActive,
  showFilterTag: showFilterTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesList)
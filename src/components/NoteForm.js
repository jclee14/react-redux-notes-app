import React from 'react';
import { connect } from 'react-redux';
import { addNote, increaseId, addTag, removeTag, addColorBack, removeColor, changeDeletedTag } from '../redux/actions/actions';
import './NoteForm_List.css';
import { Form, Button, Input, Icon, Select, DatePicker, Modal, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

class NoteForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      content: '',
      tag: '',
      addTagModalVisible: false,
      removeTagModalVisible: false,
      newTagInput: '',
      newTagColor: undefined,
      removedTagSelect: undefined,
    }
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  };

  handleSelectChange = (value) => {
    this.setState({ tag: value });
  };

  showEditModal = (isAddTag) => {
    if(isAddTag) {
      this.setState({
        addTagModalVisible: true,
      });
    } else {
      this.setState({
        removeTagModalVisible: true,
      });
    }
  };

  handleNewTagInput = (event) => {
    this.setState({
      newTagInput: event.target.value
    })
  }

  handleSelectTagColor = (value) => {
    this.setState({
      newTagColor: value
    })
  }

  handleSelectRemoveTag = (value) => {
    this.setState({ removedTagSelect: value });
  }

  handleAddTag = () => {
    this.handleModalCancel();
    
    const newTagInput = this.state.newTagInput;
    let newTagColor = this.state.newTagColor;
    const { addTag, removeColor } = this.props;

    if(newTagInput) {
      confirm({
        title: 'Do you want to create this tag?',
        icon: <ExclamationCircleOutlined />,
        content: 'tag: ' + newTagInput,
        centered: true,
        onOk() {
          if(!newTagColor) {
            newTagColor = 'none';
          }
          const newTagName = 'TAG_' + newTagInput.toUpperCase();
          addTag(newTagName, newTagColor);
          removeColor(newTagColor);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      Modal.error({
        title: 'Error:',
        content: 'Please Enter Tag Name to Create',
        centered: true,
      });
    }

    this.setState(prevState => ({
      ...prevState,
      newTagInput: '',
      newTagColor: undefined,
    }));
  };

  handleRemoveTag = () => {
    this.handleModalCancel();

    const removeTagSelect = this.state.removedTagSelect;
    const tags = this.props.tags;
    const { changeDeletedTag, removeTag, addColorBack } = this.props;
    if(removeTagSelect) {
      confirm({
        title: 'Do you want to delete this tag?',
        icon: <ExclamationCircleOutlined />,
        content: 'tag: ' + removeTagSelect,
        centered: true,
        onOk() {
          const removeTagName = 'TAG_' + removeTagSelect.toUpperCase();
          changeDeletedTag(removeTagName);
          removeTag(removeTagName);
          addColorBack(
            tags.filter((tagData) => {
              return tagData.tagName === removeTagName;
            })[0].tagColor
          )
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      Modal.error({
        title: 'Error:',
        content: 'Please Select Tag  to Delete',
        centered: true,
      });
    }
    this.setState({ removedTagSelect: undefined });
  };

  handleModalCancel = () => {
    this.setState(prevState => ({
      ...prevState,
      addTagModalVisible: false,
      removeTagModalVisible: false,
      newTagInput: '',
      newTagColor: undefined,
      removedTagSelect: undefined,
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let title = this.state.title;
        let content = this.state.content;
        //let tag = this.state.tag.toUpperCase();
        const formalTag = this.state.tag.map(tag => 'TAG_' + tag.toUpperCase());

        let localStr = JSON.parse(localStorage.getItem('persist:root'));
        let id = localStr.nextID;

        let timestamp = Date.now();
        let createdDate = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).format(timestamp);

        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
          ...fieldsValue,
          'range-time-picker': [
            rangeTimeValue[0].format('DD/MM/YYYY, HH:mm'),
            rangeTimeValue[1].format('DD/MM/YYYY, HH:mm'),
          ]
        };

        const dueDate = values['range-time-picker'];
        
        this.props.addNote(id, title, content, dueDate, formalTag, createdDate);
        this.props.increaseId();
    
        this.setState({ title: '', content: '' });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const propsTags = this.props.tags;
    const tagColors = this.props.tagColors;
    const tagItems = propsTags.map((tag) => {
      return tag.tagName.substring(4,tag.tagName.length).toLowerCase();
    })
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Title" className="form-input">
            {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input your title!' }],
                onChange: this.handleTitleChange,
            })(
                <Input
                  prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Title" allowClear
                />,
            )}
          </Form.Item>

  {/*         Title: <br />
          <input type="text" name="title" onChange={this.handleTitleChange} value={this.state.title} />
          <br /> */}

          <Form.Item label="Content" className="form-input">
            {getFieldDecorator('content', {
                rules: [{ required: true, message: 'Please input your note content!' }],
                onChange: this.handleContentChange,
            })(
                <TextArea rows={5} allowClear />,
            )}
          </Form.Item>

  {/*         <textarea
            name="content"
            cols="30"
            rows="5"
            onChange={this.handleContentChange}
            value={this.state.content}
          />
          <br /> */}

          <Form.Item label="Due date" className="form-input">
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker style={{ width: "100%"}} showTime={{ format: "HH:mm" }} format="DD/MM/YYYY, HH:mm" />,
            )}
          </Form.Item>

          <Form.Item label="Tag">
            {getFieldDecorator('tag', {
              rules: [{ required: true, message: 'Please select your tag!' }],
            })(
              <Select
                mode="multiple"
                placeholder="Select / Edit Tags"
                onChange={this.handleSelectChange}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{ padding: '4px 8px', cursor: 'pointer' }}
                      onMouseDown={e => e.preventDefault()}
                      onClick={ () => this.showEditModal(true) }
                    >
                      <Icon type="plus" /> Add Tags
                    </div>
                    <div
                      style={{ padding: '4px 8px', cursor: 'pointer' }}
                      onMouseDown={e => e.preventDefault()}
                      onClick={ () => this.showEditModal(false) }
                    >
                      <Icon type="edit" /> Remove Tags
                    </div>
                  </div>
                )}
              >
                {tagItems.map((tag) => (
                  <Option key={tag}>{tag}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>

  {/*         <Form.Item label="Tag">
            {getFieldDecorator('tag', {
              rules: [{ required: true, message: 'Please select your tag!' }],
            })(
              <Select
                placeholder="Select your note tag here"
                onChange={this.handleSelectChange}
              >
                <Option value="TAG_GENERAL">general</Option>
                <Option value="TAG_IMPORTANT">important</Option>
                <Option value="TAG_OTHER">other</Option>
              </Select>,
            )}
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="form-btn">
              Add Note
            </Button>
          </Form.Item>
        </Form>

        <Modal
            title="Create Tag Editor"
            centered
            visible={this.state.addTagModalVisible}
  /*           onOk={this.handleModalOk} */
            onCancel={this.handleModalCancel}
            footer={[
              <Button type="danger" onClick={ this.handleModalCancel }>
                Cancel
              </Button>,
              <Button type="primary" onClick={ this.handleAddTag }>
                Create
              </Button>
            ]}
        >
            <Input
              onChange={ this.handleNewTagInput }
              placeholder="Enter New Tag Here"
              value={ this.state.newTagInput }
            />
            <Select
              placeholder="Select color for new tag"
              onChange={ this.handleSelectTagColor }
              style={{ width: "100%", marginTop: "10px" }}
              value={ this.state.newTagColor }
            >
              {tagColors.map((color) => (
                <Option key={color}>{color}</Option>
              ))}
            </Select>
        </Modal>
        <Modal
            title="Remove Tag Editor"
            centered
            visible={this.state.removeTagModalVisible}
  /*           onOk={this.handleModalOk} */
            onCancel={this.handleModalCancel}
            footer={[
              <Button type="danger" onClick={this.handleModalCancel}>
                Cancel
              </Button>,
              <Button type="primary" onClick={this.handleRemoveTag}>
                Remove
              </Button>
            ]}
        >
            <Select
                placeholder="Select tag to remove here"
                onChange={this.handleSelectRemoveTag}
                style={{ width: "100%" }}
                value={ this.state.removedTagSelect }
                >
                {tagItems.map((item,index) => (
                  <Option key={item} disabled={index < 3 ? true : false}>{item}</Option>
                ))}
            </Select>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
    tagColors: state.tagColors,
  }
};

const mapDispatchToProps = {
  addNote: addNote,
  increaseId: increaseId,
  addTag: addTag,
  removeTag: removeTag,
  addColorBack: addColorBack,
  removeColor: removeColor,
  changeDeletedTag: changeDeletedTag,
};

const WrappedNoteForm = Form.create()(NoteForm)

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNoteForm);
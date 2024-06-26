import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal, Form, Input, Select, Card, Row, Col } from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  PlusOutlined,DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { DownOutlined} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const { Option } = Select;

const { Header, Sider, Content } = Layout;
const api = "https://express-4b9y.onrender.com"
function Severity({sev}){
  if(sev === 'high'){
    return <p style={{color:"red"}}>HIGH</p>
  }
  else if(sev === "medium"){
    return <p style={{color:"gold"}}>MEDIUM</p>
  }
  else{
    return <p style={{color:"green"}}>LOW</p>
  }
}

function App() {

  const [collapsed, setCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [notes, setNotes] = useState([]);
  const [rel,setR] = useState("high")
  const [currentNote, setCurrentNote] = useState(null);
  const [srt,serSrt] = useState('all');
  const items= [
    {
      key: '1',
      label: (
        <p onClick={() => serSrt("high")}>
          High
        </p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={() => serSrt("medium")}>
          Medium
        </p>
      )
    },
    {
      key: '3',
      label: (
        <p onClick={() => serSrt("low")}>
          low
        </p>
      ),
    },
    {
      key: '4',
      label: <p  onClick={() => serSrt("all")}>
      All
    </p>
    },
  ];
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${api}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleAddNote = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields(); 
    setCurrentNote(null); 
  };

  const onFinish = async (values) => {
    try {
      if (currentNote) {
        await axios.put(`${api}/notes/${currentNote._id}`, values);
      } else {
        await axios.post(`${api}/notes`, values);
      }
      fetchNotes();
      setModalVisible(false);
      form.resetFields();
      setCurrentNote(null);
    } catch (error) {
      console.error('Error adding/editing note:', error);
    }
  };


  const setRele = () =>{
    setR('high')
  }
  const setNrele = () =>{
    setR('low')
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  const handleEdit = (note) => {
    setCurrentNote(note); // Set the current note being edited
    form.setFieldsValue(note); // Set modal form fields with the current note's values
    setModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        onCollapse={toggleCollapsed}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 ,zIndex:"999"}}
        align='top'
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 16px' }}>
          <div>
            <h2 style={{ color: 'white', margin: 0 }}>Options</h2>
          </div>
          {!collapsed && (
            <Button
              type="text"
              onClick={toggleCollapsed}
              style={{ color: 'white' }}
            >
              <CloseOutlined />
            </Button>
          )}
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PlusOutlined />} onClick={handleAddNote}>Add Note</Menu.Item>
          <Menu.Item key="2" icon={<MenuOutlined />} onClick={setRele}>Relevant Notes</Menu.Item>
          <Menu.Item key="3" icon={<MenuOutlined />} onClick={setNrele} >Not Relevant</Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "green", boxShadow: "0px 0px 10px green",position:"fixed",zIndex:"99",width:"100vw" }}>
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{ color: 'white' }}
          >
            {collapsed ? <MenuOutlined /> : <></>}
          </Button>
          <span style={{ color: 'white', margin: 0,fontSize:"200%" }}>NishNotes</span>
        </Header>
        <Content style={{ margin: '16px',marginTop:"80px" }}>
        <Row style={{margin:"10px"}} gutter={[16, 16]}>
        <Dropdown  menu={{ items }}>
          <Space>
            {srt}
            <DownOutlined />
          </Space>
        </Dropdown>
        </Row>
          <Row gutter={[16, 16]}>
          {notes
  .filter(note => { return note.relevance === rel && (note.severity === 'high' && (srt === 'all' || srt === 'high'))})
  .map(note => (
    <Col key={note._id} xs={24} sm={12} md={8} lg={6}>
      <Card
        title={note.title}
        style={{ minHeight: '150px',boxShadow:"0 0 10px lightgray"}}
        actions={[
          <DeleteOutlined key="delete" onClick={() => handleDelete(note._id)} />,
          <EditOutlined key="edit" onClick={() => handleEdit(note)} />,
        ]}
      >
        <Severity sev={note.severity}/>
        
        <br></br>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{note.description}</pre>      </Card>
    </Col>
  ))}
      {notes
  .filter(note => { return note.relevance === rel && (note.severity === 'medium' && (srt === 'all' || srt === 'medium'))})
  .map(note => (
    <Col key={note._id} xs={24} sm={12} md={8} lg={6}>
      <Card
        title={note.title}
        style={{ minHeight: '150px',boxShadow:"0 0 10px lightgray"}}
        actions={[
          <DeleteOutlined key="delete" onClick={() => handleDelete(note._id)} />,
          <EditOutlined key="edit" onClick={() => handleEdit(note)} />,
        ]}
      >
        <Severity sev={note.severity}/>
        
        <br></br>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{note.description}</pre>      </Card>
    </Col>
  ))}
        {notes
  .filter(note => { return note.relevance === rel && (note.severity === 'low' && (srt === 'all' || srt === 'low'))})
  .map(note => (
    <Col key={note._id} xs={24} sm={12} md={8} lg={6}>
      <Card
        title={note.title}
        style={{ minHeight: '150px',boxShadow:"0 0 10px lightgray"}}
        actions={[
          <DeleteOutlined key="delete" onClick={() => handleDelete(note._id)} />,
          <EditOutlined key="edit" onClick={() => handleEdit(note)} />,
        ]}
      >
        <Severity sev={note.severity}/>
        
        <br></br>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{note.description}</pre>      </Card>
    </Col>
  ))}

          </Row>
        </Content>
      </Layout>
      <Modal
        title={currentNote ? "Edit Note" : "Add Note"}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {/* Note form */}
        <Form
          form={form}
          name="addEditNoteForm"
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="relevance"
            label="Relevance"
            rules={[{ required: true, message: 'Please select the relevance!' }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select the severity!' }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentNote ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: "999",
          height: "40px",
          width: "40px",
          backgroundColor: "green",
          boxShadow: "0px 0px 10px green",
          borderRadius: "100px",
          border: "none",
          color: "white",
          fontSize: "200%",
          padding: "0",
        }}
        onClick={handleAddNote}
      >
        <PlusOutlined />
      </Button>
    </Layout>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Modal, Form, Input, Select, Card, Row, Col } from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  PlusOutlined,DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const { Header, Sider, Content } = Layout;
const api = "http://65.0.210.65:80"
function Severity({sev}){
  if(sev == 'high'){
    return <p style={{color:"red"}}>HIGH</p>
  }
  else if(sev == "medium"){
    return <p style={{color:"yellow"}}>MEDIUM</p>
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
  };

  const onFinish = async (values) => {
    try {
      await axios.post(`${api}/notes`, values);
      fetchNotes();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding note:', error);
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
  const handleEdit = () => {}

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
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "green", boxShadow: "0px 0px 10px green" }}>
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{ color: 'white' }}
          >
            {collapsed ? <MenuOutlined /> : <></>}
          </Button>
          <span style={{ color: 'white', margin: 0 }}>NishNotesNOTES ANYWHERE</span>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Row gutter={[16, 16]}>
          {notes
  .filter(note => note.relevance === rel)
  .map(note => (
    <Col key={note._id} xs={24} sm={12} md={8} lg={6}>
      <Card
        title={note.title}
        style={{ minHeight: '150px' }}
        actions={[
          <DeleteOutlined key="delete" onClick={() => handleDelete(note._id)} />,
          <EditOutlined key="edit" onClick={() => handleEdit(note)} />,
        ]}
      >
        <Severity sev={note.severity}/>
        <p>{note.description}</p>
      </Card>
    </Col>
  ))}

          </Row>
        </Content>
      </Layout>
      <Modal
        title="Add Note"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="addNoteForm"
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
              Add
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

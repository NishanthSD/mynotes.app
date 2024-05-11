import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Modal, Form, Input, Select } from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleAddNote = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
    alert(JSON.stringify(values))
    setModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        onCollapse={toggleCollapsed}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
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
          <Menu.Item key="2" icon={<MenuOutlined />}>Relevant Notes</Menu.Item>
          <Menu.Item key="3" icon={<MenuOutlined />}>Not Relevant</Menu.Item>
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
          <span style={{color:"white",fontSize:"200%"}}>NishNotes</span>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>{}</div>
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
            <Input.TextArea/>
          </Form.Item>
          <Form.Item
            name="Relavance"
            label="Relavance"
            rules={[{ required: true, message: 'Please input the Relevance!' }]}
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

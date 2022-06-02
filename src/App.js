import {
  Tree,
  Modal,
  Button,
  Typography,
  Checkbox,
  Input,
  Popconfirm,
  Form,
  Tooltip,
  notification,
  Layout,
  Empty,
} from "antd";
import "./App.css";
import { useContext, useState } from "react";
import { DeleteFilled, GithubFilled, PlusOutlined } from "@ant-design/icons";
import { DataContext } from "./Context";
import { Content, Header } from "antd/lib/layout/layout";
import Card from "antd/lib/card/Card";

function App() {
  const { reArrangedServiceBlock, dispatch } = useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [form] = Form.useForm();

  const handleOk = (id) =>
    new Promise((resolve) => {
      setConfirmLoading(true);
      setTimeout(() => {
        resolve(null);
        dispatch({ type: "DEL_SERVICE_BLOCK", id: id });
        setConfirmLoading(false);
        setSelectedBlock([]);
        notification.success({
          message: "Successlly Deleted",
          placement: "topRight",
          duration: 1.5,
        });
      }, 1000);
    });

  const handleCancelDel = () => {
    console.log("Clicked cancel button");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAdd = (values) => {
    setConfirmLoading(true);
    const newData = {
      ServiceHeaderBlockId: Date.now(),
      ServiceHeaderBlockTitle: values.ServiceHeaderBlockTitle,
      IsServiceBlock: values.IsServiceBlock,
      NodeLevel: selectedBlock?.NodeLevel + 1 || 0,
      IsActive: true,
      NodeText:
        `${selectedBlock?.NodeText}${selectedBlock?.children?.length + 1}/` ||
        "/",
    };
    console.log(newData, "new");
    setTimeout(() => {
      dispatch({ type: "ADD_SERVICE_BLOCK", payload: newData });
      setIsModalVisible(false);
      setConfirmLoading(false);
      form.resetFields();
      notification.success({
        message: "Successlly Added",
        placement: "topRight",
        duration: 1.5,
      });
    }, 800);
  };

  const onSelect = (selectedKeys, info) => {
    // console.log(selectedKeys, info, "new");
    setSelectedBlock(info);
  };

  return (
    <Layout>
      <Header
        style={{
          background: "inherit",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 15px",
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Service Block List
        </Typography.Title>
        <Button
          type="text"
          icon={<GithubFilled />}
          shape="circle"
          href="https://github.com/prashantgmr/dynamic-multilevel-list"
          target="__blank"
        />
      </Header>
      <Content style={{ padding: "10px 20px" }}>
        <Card bodyStyle={{ padding: "20px 10px" }}>
          {reArrangedServiceBlock?.length ? (
            <Tree
              titleRender={(nodeData) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: ".75em",
                  }}
                >
                  <Typography.Title level={5}>
                    {nodeData.ServiceHeaderBlockTitle}
                  </Typography.Title>
                  {nodeData.IsServiceBlock ? null : (
                    <Tooltip placement="topRight" title="Add New Service Block">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size={"small"}
                        onClick={showModal}
                        shape="circle"
                      />
                    </Tooltip>
                  )}
                  <Popconfirm
                    id={`del-${nodeData.ServiceHeaderBlockId}`}
                    title="Are you Sure"
                    onConfirm={() => handleOk(nodeData.NodeText)}
                    okButtonProps={{
                      loading: confirmLoading,
                      danger: true,
                    }}
                    onCancel={handleCancelDel}
                    okText="Delete"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteFilled />}
                      size={"small"}
                      shape="circle"
                      // onClick={() => showPopconfirm(nodeData.ServiceHeaderBlockId)}
                    />
                  </Popconfirm>
                </div>
              )}
              onClick={onSelect}
              fieldNames={{ key: "ServiceHeaderBlockId" }}
              treeData={reArrangedServiceBlock}
            />
          ) : (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={<span>No Data. Please click below to add!!</span>}
            >
              <Button icon={<PlusOutlined />} onClick={showModal}>
                Add Service Header Block
              </Button>{" "}
            </Empty>
          )}
        </Card>
        <Modal
          title={`Add New Service Block`}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          okText="Save"
          okButtonProps={{
            loading: confirmLoading,
          }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAdd(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              ServiceHeaderBlockTitle: "",
              IsServiceBlock: false,
            }}
            autoComplete="off"
          >
            <Typography.Text>
              Parent Node : {selectedBlock?.ServiceHeaderBlockTitle || "None"}
            </Typography.Text>
            <br />
            <br />
            <Form.Item
              name="ServiceHeaderBlockTitle"
              rules={[
                {
                  required: true,
                  message: "Please input Service Block Title",
                },
              ]}
            >
              <Input allowClear placeholder="Enter Service Block Title" />
            </Form.Item>
            <Form.Item name="IsServiceBlock" valuePropName="checked">
              <Checkbox>Is Service Block</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default App;

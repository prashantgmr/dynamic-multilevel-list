import {
  Tree,
  Modal,
  Button,
  Typography,
  Checkbox,
  Input,
  Popconfirm,
} from "antd";
import "./App.css";
import { useContext, useState } from "react";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { DataContext } from "./Context";

function App() {
  const { reArrangedServiceBlock, dispatch } = useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [formData, setFormData] = useState({
    ServiceHeaderBlockTitle: "",
    IsServiceBlock: false,
  });
  const handleOk = (id) => {
    setConfirmLoading(true);
    setTimeout(() => {
      dispatch({ type: "DEL_SERVICE_BLOCK", id: id });
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancelDel = () => {
    console.log("Clicked cancel button");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    const newData = {
      ...formData,
      ServiceHeaderBlockId: Math.random(),
      NodeLevel: selectedBlock?.NodeLevel + 1,
      IsActive: true,
      NodeText: `${selectedBlock?.NodeText}${
        selectedBlock?.children?.length + 1
      }/`,
    };
    setTimeout(() => {
      dispatch({ type: "ADD_SERVICE_BLOCK", payload: newData });
      setIsModalVisible(false);
      setConfirmLoading(false);
      setFormData(
        {
          ServiceHeaderBlockTitle: "",
          IsServiceBlock: false,
        },
        2000
      );
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      ServiceHeaderBlockTitle: "",
      IsServiceBlock: false,
    });
  };

  const onSelect = (selectedKeys, info) => {
    console.log(selectedKeys, info, "new");
    setSelectedBlock(info);
  };

  return (
    <div className="App">
      <Tree
        // defaultExpandAll
        // treeExpandedKeys={['0-0-0', '0-0-1']}
        // selectable={false}
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
              <>
                {" "}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size={"small"}
                  onClick={showModal}
                />
              </>
            )}
            <Popconfirm
              id={`del-${nodeData.ServiceHeaderBlockId}`}
              title="Are you Sure"
              onConfirm={() => handleOk(nodeData.NodeText)}
              okButtonProps={{
                loading: confirmLoading,
              }}
              onCancel={handleCancelDel}
              okText="Delete"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteFilled />}
                size={"small"}
                // onClick={() => showPopconfirm(nodeData.ServiceHeaderBlockId)}
              />
            </Popconfirm>
          </div>
        )}
        onClick={onSelect}
        showLine
        fieldNames={{ key: "ServiceHeaderBlockId", children: "children" }}
        treeData={reArrangedServiceBlock}
      />
      <Modal
        title={`Add New Service Block for parent ${selectedBlock?.ServiceHeaderBlockTitle}`}
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Submit"
      >
        <Input
          value={formData.ServiceHeaderBlockTitle}
          onChange={(e) =>
            setFormData({
              ...formData,
              ServiceHeaderBlockTitle: e.target.value,
            })
          }
          placeholder="Enter Block Title"
        />
        <br />
        <br />
        <Checkbox
          checked={formData.IsServiceBlock}
          onChange={(e) =>
            setFormData({ ...formData, IsServiceBlock: e.target.checked })
          }
        >
          Is Service Block
        </Checkbox>
      </Modal>
    </div>
  );
}

export default App;

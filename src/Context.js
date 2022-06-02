import React, { createContext, useEffect, useReducer } from "react";
import serviceData from "./data.json";
export const DataContext = createContext();

const initialState = {
  serviceBlock: serviceData,
  reArrangedServiceBlock: [],
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case "REARRANGE_SERVICE_BLOCK":
      return { ...state, reArrangedServiceBlock: action.payload };
    case "ADD_SERVICE_BLOCK":
      return {
        ...state,
        serviceBlock: [...state.serviceBlock, action.payload],
      };
    case "DEL_SERVICE_BLOCK":
      return {
        ...state,
        serviceBlock: state.serviceBlock.filter(
          (service) =>
            service.NodeText.slice(0, action.id?.length) !== action.id
        ),
      };
    default:
      return state;
  }
};

export function DataProvider(props) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  function orgGreenTree(data, parentId = null) {
    return data?.reduce((r, e) => {
      let obj = Object.assign({}, e);
      if (parentId === e.parent_id) {
        let children = orgGreenTree(data, e.NodeText);
        if (children.length) obj.children = children;
        r.push(obj);
      }
      return r;
    }, []);
  }
  const connectParent = (data) => {
    return data?.map((r) => {
      if (r.NodeLevel === 0) {
        r.parent_id = null;
      } else {
        r.parent_id = r.NodeText?.slice(0, r.NodeText?.length - 2);
      }
      return r;
    });
  };
  useEffect(() => {
    console.log(state.serviceBlock, "redeo");
    const serviceBlockListwithparentId = connectParent(state.serviceBlock);
    const treeData = orgGreenTree(serviceBlockListwithparentId);
    dispatch({ type: "REARRANGE_SERVICE_BLOCK", payload: treeData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.serviceBlock]);
  return (
    <DataContext.Provider
      value={{
        reArrangedServiceBlock: state.reArrangedServiceBlock,
        serviceBlock: state.serviceBlock,
        dispatch,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}

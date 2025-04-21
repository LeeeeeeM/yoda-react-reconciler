// @ts-nocheck
import ReactReconciler from "react-reconciler";
import "./polyfill";

export const HOST_TAG = {
  NODE: "NODE",
  TEXT: "TEXT",
};

// 您的宿主环境 API 实现
const hostEnvironment = {
  // 必须实现的 DOM 操作方法
  createNode: (type) => {
    if (type !== HOST_TAG.NODE) {
      console.warn(`暂时不支持${type}类型，使用${HOST_TAG.NODE}替代`);
    }
    return createNode();
  },

  createTextNode: (text) => {
    return createTextNode(text);
  },

  setTextContent: (node, text) => {
    // 您的文本设置逻辑
    setTextContent(node, text);
  },

  addEventListener: (node, eventName, callback) => {
    // 您的事件监听逻辑
    addEventListener(node, eventName, callback);
  },

  removeEventListener: (node, eventName, callback) => {
    // 您的事件移除逻辑
    removeEventListener(node, eventName, callback);
  },

  appendChild: (parent, child) => {
    // 您的节点追加逻辑
    appendChild(parent, child);
  },

  insertBefore: (parent, child, beforeChild) => {
    // 您的插入逻辑
    insertBefore(parent, child, beforeChild);
  },

  removeChild: (parent, child) => {
    // 您的移除逻辑
    removeChild(parent, child);
  },

  setAttribute: (node, key, value) => {
    setAttribute(node, key, value);
  },

  // 可选实现的其它方法
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
};

// React 调和器配置
const hostConfig = {
  now: Date.now,
  supportsMutation: true,
  isPrimaryRenderer: false,

  // 节点创建
  createInstance: (type, props) => {
    const node = hostEnvironment.createNode(type);
    Object.keys(props).forEach((key) => {
      if (key === "children") return;
      if (key.startsWith("on") && typeof props[key] === "function") {
        const eventType = key.substring(2).toLowerCase();
        hostEnvironment.addEventListener(node, eventType, props[key]);
      } else if (key === "style") {
        Object.entries(props[key]).forEach(([styleKey, value]) => {
          hostEnvironment.setAttribute(node, styleKey, value as string);
        });
      }
    });
    return node;
  },

  appendInitialChild: (parent, child) => {
    hostEnvironment.appendChild(parent, child); // 复用已有的 appendChild 逻辑
  },

  // 添加容器级操作方法
  appendChildToContainer: (container, child) => {
    return hostEnvironment.appendChild(container, child);
  },

  // 确保容器是有效的 DOM 节点
  createContainer: (container) => {
    return container;
  },

  removeChildFromContainer: (container, child) => {
    return hostEnvironment.removeChild(container, child);
  },

  // 节点操作
  appendChild: hostEnvironment.appendChild,
  insertBefore: hostEnvironment.insertBefore,
  removeChild: hostEnvironment.removeChild,

  prepareUpdate: (node, type, oldProps, newProps) => {
    const updates = [];
    const allKeys = new Set([
      ...Object.keys(oldProps),
      ...Object.keys(newProps),
    ]);

    allKeys.forEach((key) => {
      if (key === "children" || oldProps[key] === newProps[key]) return;

      if (key.startsWith("on") && typeof newProps[key] === "function") {
        const eventType = key.substring(2).toLowerCase();
        updates.push({
          type: "event",
          eventType,
          oldHandler: oldProps[key],
          newHandler: newProps[key],
        });
      } else if (key === "style") {
        const oldStyle = oldProps[key] || {};
        const newStyle = newProps[key] || {};
        const changedStyles = Object.keys(newStyle).filter(
          (styleKey) => oldStyle[styleKey] !== newStyle[styleKey]
        );
        if (changedStyles.length > 0) {
          updates.push({ type: "style", changedStyles, newStyle });
        }
      }
    });

    return updates.length > 0 ? updates : null;
  },

  commitUpdate: (node, updatePayload) => {
    if (!updatePayload) return;
    updatePayload.forEach((update) => {
      if (update.type === "event") {
        if (update.oldHandler) {
          hostEnvironment.removeEventListener(
            node,
            update.eventType,
            update.oldHandler
          );
        }
        hostEnvironment.addEventListener(
          node,
          update.eventType,
          update.newHandler
        );
      } else if (update.type === "style") {
        update.changedStyles.forEach((k: string) => {
          hostEnvironment.setAttribute(node, k, update.newStyle[k]);
        });
      }
    });
  },

  // 关闭不需要的功能
  shouldSetTextContent: () => false,
  createTextInstance: (text) => {
    return hostEnvironment.createTextNode(text);
  },
  commitTextUpdate: (textInstance, oldText, newText) => {
    if (oldText === newText) return;
    hostEnvironment.setTextContent(textInstance, newText);
  },
  supportsConcurrent: false,

  // 定时器系统
  scheduleTimeout: hostEnvironment.setTimeout,
  cancelTimeout: hostEnvironment.clearTimeout,

  // 空实现不需要的功能
  getRootHostContext: () => ({}),
  getChildHostContext: () => ({}),
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  finalizeInitialChildren: () => false,
  clearContainer: () => false,
};

const reconciler = ReactReconciler(hostConfig);

// 导出 React 18 风格的 createRoot
export const createRoot = () => {
  const root = reconciler.createContainer(document, false, false);
  return {
    render: (children) => reconciler.updateContainer(children, root, null),
    unmount: () => reconciler.updateContainer(null, root, null),
  };
};

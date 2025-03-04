const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

function BinaryTreeNode(data) {
  let _data = data;
  let _left = null;
  let _right = null;

  const getData = () => _data;
  const setData = (newData) => (_data = newData);

  const getLeft = () => _left;
  const setLeft = (newLeft) => (_left = newLeft);

  const getRight = () => _right;
  const setRight = (newRight) => (_right = newRight);

  return {
    getData,
    setData,
    getLeft,
    setLeft,
    getRight,
    setRight,
  };
}

function BinarySearchTree() {
  let _root = null;

  function init(arr) {
    if (arr.length === 0) return null;
    if (arr.length === 1) return BinaryTreeNode(arr[0]);

    let mid = Math.floor(arr.length / 2);
    let root = BinaryTreeNode(arr[mid]);

    const left = arr.slice(0, mid);
    const right = arr.slice(mid + 1);

    let leftTree = init(left);
    let rightTree = init(right);
    root.setRight(rightTree);
    root.setLeft(leftTree);
    _root = root;
    return root;
  }

  function buildTree(arr) {
    const uniqueArray = arr
      .sort((a, b) => a - b)
      .filter((item, index) => arr.indexOf(item) === index);

    return init(uniqueArray);
  }

  function getRoot() {
    return _root;
  }

  const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.getRight() !== null) {
      prettyPrint(
        node.getRight(),
        `${prefix}${isLeft ? "│   " : "    "}`,
        false,
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.getData()}`);
    if (node.getLeft() !== null) {
      prettyPrint(node.getLeft(), `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  function insert(value, node = _root) {
    if (node === null) return BinaryTreeNode(value);
    if (value === node.getData()) return node;

    if (value > node.getData()) node.setRight(insert(value, node.getRight()));
    else if (value < node.getData())
      node.setLeft(insert(value, node.getLeft()));

    return node;
  }

  function deleteItem(value, node = _root) {
    if (!_root) return null;

    // Scenario: tree node, with two leaf
    if (
      value === node.getData() &&
      node.getRight() !== null &&
      node.getLeft() !== null
    ) {
      let inOrderSuccessor = findMinimum(node.getRight());
      node.setData(inOrderSuccessor.getData());
      node.setRight(deleteItem(inOrderSuccessor.getData(), node.getRight()));
      return node;
    }
    // Scenario: tree node, with one leaf
    if (value === node.getData() && (node.getRight() || node.getLeft())) {
      const nextNode = node.getRight() ? node.getRight() : node.getLeft();
      if (node === _root) _root = nextNode;
      return nextNode;
    }
    // Scenario: tree node, with no leaf
    if (value === node.getData() && !(node.getRight() || node.getLeft())) {
      if (node === _root) _root = null;
      return null;
    }

    if (value > node.getData() && node.getRight() !== null) {
      node.setRight(deleteItem(value, node.getRight()));
      return node;
    } else if (value < node.getData() && node.getLeft() !== null) {
      node.setLeft(deleteItem(value, node.getLeft()));
      return node;
    }
    _root = node;
    return node;
  }

  function findMinimum(node) {
    if (node.getLeft() === null) return node;
    return findMinimum(node.getLeft());
  }

  function find(value, node = _root) {
    if (!_root) return null;
    if (value === node.getData()) return node;

    if (value > node.getData() && node.getRight() !== null) {
      return find(value, node.getRight());
    } else if (value < node.getData() && node.getLeft() !== null) {
      return find(value, node.getLeft());
    }
    return null;
  }

  function levelOrder(callback) {
    if (!_root) return null;
    const queue = [_root];
    const result = [];
    while (queue.length > 0) {
      let currentNode = queue.shift();
      if (callback) {
        callback(currentNode);
      } else result.push(currentNode.getData());

      if (currentNode.getLeft()) queue.push(currentNode.getLeft());
      if (currentNode.getRight()) queue.push(currentNode.getRight());
    }

    return callback ? undefined : result;
  }

  function inOrder(callback, node = _root) {
    const result = [];

    if (!_root) return null;
    if (!node) return [];

    if (node.getLeft()) {
      let leftValues = inOrder(callback, node.getLeft());
      if (!callback) result.push(...leftValues);
    }

    if (callback) {
      callback(node);
    } else result.push(node.getData());

    if (node.getRight()) {
      let rightValues = inOrder(callback, node.getRight());
      if (!callback) result.push(...rightValues);
    }

    return result;
  }

  function preOrder(callback, node = _root) {
    const result = [];

    if (!_root) return null;
    if (!node) return [];

    if (callback) {
      callback(node);
    } else result.push(node.getData());

    if (node.getLeft()) {
      let leftValues = preOrder(callback, node.getLeft());
      if (!callback) result.push(...leftValues);
    }

    if (node.getRight()) {
      let rightValues = preOrder(callback, node.getRight());
      if (!callback) result.push(...rightValues);
    }
    return result;
  }

  function postOrder(callback, node = _root) {
    const result = [];
    if (!_root) return null;
    if (!node) return [];

    if (node.getLeft()) {
      let leftValues = postOrder(callback, node.getLeft());
      if (!callback) result.push(...leftValues);
    }

    if (node.getRight()) {
      let rightValues = postOrder(callback, node.getRight());
      if (!callback) result.push(...rightValues);
    }

    if (callback) {
      callback(node);
    } else {
      result.push(node.getData());
    }
    return result;
  }

  function height(node) {
    if (!_root) return null;
    if (!node) return -1;

    let leftHeight = height(node.getLeft());
    let rightHeight = height(node.getRight());

    return 1 + Math.max(leftHeight, rightHeight);
  }

  function depth(node, start = _root) {
    let depthCalc = 0;

    if (!_root) return null;
    if (!start) return -1;
    if (!node) return null;
    if (node === start) return 0;

    if (node.getData() > start.getData()) {
      depthCalc = 1 + depth(node, start.getRight());
    }

    if (node.getData() < start.getData()) {
      depthCalc = 1 + depth(node, start.getLeft());
    }

    return depthCalc;
  }

  function isBalanced(node = _root) {
    if (!_root) return null;
    if (!node) return true;

    let leftHeight = height(node.getLeft());
    let rightHeight = height(node.getRight());

    if (Math.abs(leftHeight - rightHeight) > 1) return false;

    return isBalanced(node.getLeft()) && isBalanced(node.getRight());
  }

  function rebalance() {
    if (!_root) return null;
    let arr = inOrder();
    return buildTree(arr);
  }

  return {
    buildTree,
    getRoot,
    prettyPrint,
    insert,
    deleteItem,
    find,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
}

export { arr, BinaryTreeNode, BinarySearchTree };

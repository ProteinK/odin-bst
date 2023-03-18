const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}

const deleteRec = (root, data) => {
  if (root === null) return root;

  if (data < root.data) {
    root.left = deleteRec(root.left, data);
  } else if (data > root.data) {
    root.right = deleteRec(root.right, data);
  } else {
    if (root.left === null) {
      return root.right;
    } else if (root.right === null) {
      return root.left;
    }

    // get inorder successor (smallest in right subtree)
    root.data = minValue(root.right);

    // delete inorder successor
    root.right = deleteRec(root.right, root.data);
  }

  return root;
};

const preorderRec = (root, arr, fn) => {
  if (root === null) return;

  // visit node
  if (fn === undefined) {
    arr.push(root.data);
  } else {
    arr.push(fn(root));
  }

  preorderRec(root.left, arr, fn);
  preorderRec(root.right, arr, fn);

  return arr;
};

const inorderRec = (root, arr, fn) => {
  if (root === null) return;

  inorderRec(root.left, arr, fn);

  // visit node
  if (fn === undefined) {
    arr.push(root.data);
  } else {
    arr.push(fn(root));
  }

  inorderRec(root.right, arr, fn);

  return arr;
};

const postorderRec = (root, arr, fn) => {
  if (root === null) return;

  postorderRec(root.left, arr, fn);
  postorderRec(root.right, arr, fn);

  // visit node
  if (fn === undefined) {
    arr.push(root.data);
  } else {
    arr.push(fn(root));
  }

  return arr;
};

const minValue = (root) => {
  let minv = root.data;
  while (root.left !== null) {
    minv = root.left.data;
    root = root.left;
  }
  return minv;
};

const height = (node) => {
  if (node === null) return 0;

  let counters = [];

  const heightRec = (node, counter) => {
    if (node.left === null && node.right === null) {
      counters.push(counter);
      return;
    }

    if (node.left !== null) {
      heightRec(node.left, counter + 1);
    }

    if (node.right !== null) {
      heightRec(node.right, counter + 1);
    }

  }

  heightRec(node, 0);
  return Math.max(...counters);
}

const depth = (node, root) => {
  let path = 0;

  const depthRec = (node, root, counter) => {
    if (node.data < root.data) {
      counter = depthRec(node, root.left, counter + 1);
    } else if (node.data > root.data) {
      counter = depthRec(node, root.right, counter + 1);
    }

    return counter;
  }
  path = depthRec(node, root, 0);

  return path;
};

class Node {
  constructor(d) {
    this.data = d;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    // remove duplicates
    arr = new Set(arr);
    arr = [...arr];
    // sort
    arr.sort((a, b) => a - b);
    this.root = this.buildTree(arr, 0, arr.length - 1);
  }

  buildTree(arr, start, end) {
    if (start > end) return null;

    let mid = parseInt((start + end) / 2);
    let root = new Node(arr[mid]);
    root.left = this.buildTree(arr, start, mid - 1);
    root.right = this.buildTree(arr, mid + 1, end);

    return root;
  }

  insert(data, root = this.root) {
    if (root !== null && root.data === data) throw new Error("value already exists");

    if (root === null) {
      root = new Node(data);
      return root;
    }

    if (data < root.data) {
      root.left = this.insert(data, root.left);
    } else if (data > root.data) {
      root.right = this.insert(data, root.right);
    }

    return root;
  }

  delete(data) {
    this.root = deleteRec(this.root, data);
  }

  find(target, root = this.root) {
    if (root === null) {
      return null;
    }

    if (target < root.data) {
      root = this.find(target, root.left);
    } else if (target > root.data) {
      root = this.find(target, root.right);
    }

    return root;
  }

  levelOrder(fn = undefined) {
    if (this.root === null) throw new Error("empty tree");
    let result = [];
    let queue = [this.root];

    while (queue.length !== 0) {
      let root = queue.shift();
      if (fn === undefined) {
        result.push(root.data);
      } else {
        result.push(fn(root));
      }
      if (root.left !== null) queue.push(root.left);
      if (root.right !== null) queue.push(root.right);
    }

    return result;
  }

  preorder(fn = undefined) {
    return preorderRec(this.root, [], fn);
  }

  inorder(fn = undefined) {
    return inorderRec(this.root, [], fn);
  }

  postorder(fn = undefined) {
    return postorderRec(this.root, [], fn);
  }

  isBalanced() {
    let results = this.levelOrder((node) => {
      return Math.abs(height(node.left) - height(node.right)) < 2;
    });

    return !results.includes(false);
  }

  rebalance() {
    let values = this.inorder();
    this.root = this.buildTree(values, 0, values.length - 1);
  }
}

const tree = new Tree([1, 1, 5, 3, 4, 6, 2, 7, 7, 8]);
prettyPrint(tree.root);
console.log(tree.isBalanced());
tree.insert(9);
tree.insert(15);
tree.insert(13);
prettyPrint(tree.root);
tree.delete(15);
prettyPrint(tree.root);
tree.delete(6);
prettyPrint(tree.root);
tree.insert(6);
prettyPrint(tree.root);
console.log(tree.find(8));
console.log(tree.find(3));
console.log(tree.find(100));

console.log("breadth-first");
prettyPrint(tree.root);
console.log(tree.levelOrder());
console.log(tree.levelOrder((node) => "n: " + node.data));

console.log("preorder");
prettyPrint(tree.root);
console.log(tree.preorder());
console.log(tree.preorder((node) => "n: " + node.data));

console.log("inorder")
prettyPrint(tree.root);
console.log(tree.inorder());
console.log(tree.inorder((node) => "n: " + node.data));

console.log("postorder")
prettyPrint(tree.root);
console.log(tree.postorder());
console.log(tree.postorder((node) => "n: " + node.data));

prettyPrint(tree.root);
console.log("height of root: ", height(tree.root));
console.log("height of 2: ", height(tree.find(2)));

console.log("depth of root: ", depth(tree.root, tree.root));
console.log("depth of 1: ", depth(tree.find(1), tree.root));
console.log("depth of 13: ", depth(tree.find(13), tree.root));

prettyPrint(tree.root);
console.log(tree.isBalanced());
tree.rebalance();
prettyPrint(tree.root);
console.log(tree.isBalanced());

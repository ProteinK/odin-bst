const { Tree } = require('./tree.js');

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandArray = (n, min, max) => {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(randomInt(min, max));
  }
  return result;
};

let arr = generateRandArray(20, 1, 100);
let tree = new Tree(arr);
prettyPrint(tree.root);
console.log("Is balanced: ", tree.isBalanced());
console.log("levelorder: ", tree.levelOrder());
console.log("preorder: ", tree.preorder());
console.log("inorder: ", tree.inorder());
console.log("postorder: ", tree.postorder());

console.log("Adding elements");
for (let i = 0; i < 10; i++) {
  try {
    tree.insert(randomInt(100, 200));
  } catch (e) {
    // just skip
  }
}

console.log("is balanced: ", tree.isBalanced());
prettyPrint(tree.root);
console.log("Rebalancing");
tree.rebalance();
console.log("is balanced: ", tree.isBalanced());
prettyPrint(tree.root);
console.log("levelorder: ", tree.levelOrder());
console.log("preorder: ", tree.preorder());
console.log("inorder: ", tree.inorder());
console.log("postorder: ", tree.postorder());

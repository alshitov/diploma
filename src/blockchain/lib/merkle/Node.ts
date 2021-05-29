export class MerkleNode {
  private readonly selfHash: string
  private leftChild: MerkleNode | undefined
  private rightChild: MerkleNode | undefined
  private parent: MerkleNode | undefined

  constructor (
    selfHash: string,
    leftChild?: MerkleNode,
    rightChild?: MerkleNode,
    parent?: MerkleNode
  ) {
    this.selfHash = selfHash
    this.leftChild = leftChild
    this.rightChild = rightChild
    this.parent = parent
  }

  setLeftChild (node: MerkleNode): void {
    this.leftChild = node
  }

  setrightChild (node: MerkleNode): void {
    this.rightChild = node
  }

  setParent (node: MerkleNode): void {
    this.parent = node
  }

  getHash = (): string => this.selfHash
  getLeftChild = (): MerkleNode | undefined => this.leftChild
  getRightChild = (): MerkleNode | undefined => this.rightChild
  getParent = (): MerkleNode | undefined => this.parent
}

import { useState } from 'react';
import './OfficeTree.css';

export default function OfficeTree({ offices, onRefresh, onEdit }) {

  // Organize offices into a tree structure
  const buildTree = (nodes, parentId = null) => {
    return nodes
      .filter(node => (node.parent?._id || node.parent) === parentId)
      .map(node => ({
        ...node,
        children: buildTree(nodes, node._id)
      }));
  };

  const tree = buildTree(offices);

  const renderNode = (node) => (
    <div key={node._id} className="tree-node-wrapper">
      <div className={`tree-node-item tier-${node.tier.toLowerCase()}`}>
        <div className="node-icon">
          {node.tier === 'Head' ? '🏛️' : node.tier === 'Regional' ? '🗺️' : node.tier === 'Zonal' ? '🛡️' : '📍'}
        </div>
        <div className="node-info">
          <span className="node-name">{node.name}</span>
          <span className="node-tier">{node.tier}</span>
        </div>
        <div className="node-actions">
          <button className="btn-icon" onClick={() => onEdit(node)}>✏️</button>
        </div>

      </div>
      {node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map(child => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="office-tree">
      {tree.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No offices defined. Start by adding a Head Office.</p>
      ) : (
        tree.map(rootNode => renderNode(rootNode))
      )}
    </div>
  );
}

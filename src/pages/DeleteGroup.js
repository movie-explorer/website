import React from 'react';

export default function DeleteGroup({ group, onRemoveGroup }) {
    const handleRemoveGroup = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this group?');
        if (confirmDelete && onRemoveGroup) {
            onRemoveGroup(group.id); 
        }
    };

    return (
        <button onClick={handleRemoveGroup} className="button remove">
            Delete Group
        </button>
    );
}

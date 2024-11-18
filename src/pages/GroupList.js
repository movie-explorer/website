import React from 'react';

export default function GroupList({ groups, onSelectGroup, onRemoveGroup }) {
    const handleRemoveGroup = (groupId, event) => {
        event.stopPropagation(); 
        onRemoveGroup(groupId); 
    };

    return (
        <div className="group-content">
            <h2>Your Groups</h2>
            <ul className="group-list">
                {groups.map((group, index) => (
                    <li key={group.id} onClick={() => onSelectGroup(group)}>
                        {group.name}
                        <button
                            onClick={(event) => handleRemoveGroup(group.id, event)} 
                            className="button remove"
                        >
                            Delete Group
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

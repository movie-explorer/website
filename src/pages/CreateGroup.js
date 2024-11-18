import React, {useState} from 'react';

export default function CreateGroup({ onCreateGroup }) {
    const [groupName, setGroupName] = useState('');

    const handleSubmit = () => {
        if (groupName.trim() !== '') {
            onCreateGroup(groupName);
            setGroupName('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
            />
            <button className="button" onClick={handleSubmit}>
                Create New Group
            </button>
        </div>
    );
}
